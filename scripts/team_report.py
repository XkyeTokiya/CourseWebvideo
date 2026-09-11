#!/usr/bin/env python3
"""Report Cline Agent Team board state and token usage from local CLI state.

Reads two SQLite stores owned by the Cline CLI (read-only, never writes):
  * <data-dir>/db/teams.db  - team board (team_tasks), runs (team_runs), events
  * <data-dir>/db/sessions.db - session metadata, incl. the logical team_name

The teams.db key is the *session id* of the lead run, while `--team-name` only
sets the logical name recorded in sessions.db; this script joins the two so the
board is shown under the name you passed to `--team-name`.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path

DEFAULT_DATA_DIR = Path.home() / ".cline" / "data"

STATUS_ORDER = [
    "awaiting-approval",
    "in_progress",
    "blocked",
    "pending",
    "todo",
    "completed",
    "cancelled",
]


def connect(path: Path) -> sqlite3.Connection:
    if not path.exists():
        sys.exit(f"error: {path} not found (has the Cline CLI ever run?)")
    conn = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    return conn


def logical_names(sessions_db: Path) -> dict[str, str]:
    """Map teams.db key (lead session id) -> `--team-name` logical name."""
    conn = connect(sessions_db)
    try:
        rows = conn.execute(
            "SELECT session_id, team_name FROM sessions WHERE team_name IS NOT NULL"
        ).fetchall()
    finally:
        conn.close()
    names: dict[str, str] = {}
    for row in rows:
        sid = row["session_id"].split("__")[0]
        names.setdefault(sid, row["team_name"])
    return names


def show_board(conn: sqlite3.Connection, names: dict[str, str]) -> None:
    teams = [
        r[0]
        for r in conn.execute(
            "SELECT DISTINCT team_name FROM team_tasks ORDER BY team_name"
        )
    ]
    if not teams:
        print("(no team board entries)")
        return
    for team in teams:
        label = names.get(team, "?")
        print(f"\n=== team {label}  [key {team}] ===")
        tasks = conn.execute(
            "SELECT task_id, status, assignee, substr(title, 1, 56) AS title,"
            " updated_at FROM team_tasks WHERE team_name = ? ORDER BY task_id",
            (team,),
        ).fetchall()
        counts: dict[str, int] = {}
        for t in tasks:
            counts[t["status"]] = counts.get(t["status"], 0) + 1
        summary = "  ".join(
            f"{s}={counts[s]}" for s in STATUS_ORDER if s in counts
        )
        print(f"    {summary}")
        width = max(len(t["task_id"]) for t in tasks)
        for t in tasks:
            assignee = t["assignee"] or "-"
            print(
                f"    {t['task_id']:<{width}}  {t['status']:<16} {assignee:<18} {t['title']}"
            )
        runs = conn.execute(
            "SELECT run_id, agent_id, status, started_at, ended_at FROM team_runs"
            " WHERE team_name = ? ORDER BY started_at",
            (team,),
        ).fetchall()
        for r in runs:
            print(
                f"      run {r['run_id']} agent={r['agent_id']} {r['status']}"
                f" {r['started_at']} -> {r['ended_at']}"
            )


def session_rows(sessions_db: Path) -> list[sqlite3.Row]:
    """Every CLI session, newest last. `team_name` is the `--team-name` value."""
    conn = connect(sessions_db)
    try:
        return conn.execute(
            "SELECT session_id, agent_id, team_name, provider, model, status,"
            " started_at, messages_path FROM sessions ORDER BY started_at"
        ).fetchall()
    finally:
        conn.close()


def messages_usage(path: str) -> dict[str, int]:
    """Sum per-turn `metrics` recorded on assistant messages of one session."""
    total = {"turns": 0, "input": 0, "cacheRead": 0, "output": 0, "cacheWrite": 0}
    file = Path(path)
    if not path or not file.exists():
        return total
    try:
        data = json.loads(file.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return total
    for message in data.get("messages", []):
        metrics = message.get("metrics")
        if not metrics:
            continue
        total["turns"] += 1
        total["input"] += metrics.get("inputTokens", 0)
        total["cacheRead"] += metrics.get("cacheReadTokens", 0)
        total["output"] += metrics.get("outputTokens", 0)
        total["cacheWrite"] += metrics.get("cacheWriteTokens", 0)
    return total


def print_usage_table(title: str, buckets: list[tuple[str, dict[str, int]]]) -> None:
    if not buckets:
        return
    print(f"\n--- token usage: {title} ---")
    print(
        f"{'agent':<30} {'turns':>5} {'input':>10} {'cacheRead':>10}"
        f" {'output':>8} {'cacheWrite':>10}"
    )
    sums = {"turns": 0, "input": 0, "cacheRead": 0, "output": 0, "cacheWrite": 0}
    for agent, bucket in buckets:
        for key in sums:
            sums[key] += bucket[key]
        print(
            f"{agent[:29]:<30} {bucket['turns']:>5} {bucket['input']:>10,}"
            f" {bucket['cacheRead']:>10,} {bucket['output']:>8,}"
            f" {bucket['cacheWrite']:>10,}"
        )
    print(
        f"{'TOTAL':<30} {sums['turns']:>5} {sums['input']:>10,}"
        f" {sums['cacheRead']:>10,} {sums['output']:>8,}"
        f" {sums['cacheWrite']:>10,}"
    )


def team_usage(rows: list[sqlite3.Row], team_key: str) -> list[tuple[str, dict[str, int]]]:
    """Usage of every agent belonging to one team (lead / subagents / teammates)."""
    buckets: list[tuple[str, dict[str, int]]] = []
    for row in rows:
        sid = row["session_id"]
        if sid != team_key and not sid.startswith(f"{team_key}__"):
            continue
        if "__teamtask__" in sid:
            who = f"teammate:{row['agent_id'] or '?'}"
        elif row["agent_id"]:
            who = f"subagent:{row['agent_id']}"
        else:
            who = "lead (this session)"
        buckets.append((who, messages_usage(row["messages_path"])))
    buckets.sort(key=lambda item: item[0])
    counts: dict[str, int] = {}
    for label, _ in buckets:
        counts[label] = counts.get(label, 0) + 1
    seen: dict[str, int] = {}
    labelled: list[tuple[str, dict[str, int]]] = []
    for label, usage in buckets:
        if counts[label] > 1:  # same agent re-spawned for another run
            seen[label] = seen.get(label, 0) + 1
            label = f"{label} #{seen[label]}"
        labelled.append((label, usage))
    return labelled


def show_sessions(rows: list[sqlite3.Row], limit: int) -> None:
    print(f"\n=== recent sessions (last {limit}) ===")
    for row in rows[-limit:]:
        team = row["team_name"] or "-"
        usage = messages_usage(row["messages_path"])
        print(
            f"    {row['started_at'][:19]}  {row['provider']}:{row['model']:<16}"
            f" team={team:<12} {row['status']:<10}"
            f" turns={usage['turns']:<3} in={usage['input']:>8,}"
            f" cache={usage['cacheRead']:>8,} out={usage['output']:>7,}"
        )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=DEFAULT_DATA_DIR,
        help=f"Cline data dir (default: {DEFAULT_DATA_DIR})",
    )
    parser.add_argument("--team", help="only show this teams.db key")
    parser.add_argument("--usage-only", action="store_true")
    parser.add_argument("--board-only", action="store_true")
    parser.add_argument(
        "--sessions", action="store_true", help="also list recent sessions"
    )
    parser.add_argument(
        "--limit", type=int, default=10, help="sessions to list with --sessions"
    )
    args = parser.parse_args()

    db_dir = args.data_dir / "db"
    rows = session_rows(db_dir / "sessions.db")
    names = logical_names(db_dir / "sessions.db")
    conn = connect(db_dir / "teams.db")
    try:
        if not args.usage_only:
            show_board(conn, names)
        if not args.board_only:
            team_keys = [
                r[0]
                for r in conn.execute(
                    "SELECT DISTINCT team_name FROM team_tasks ORDER BY team_name"
                )
            ]
            if args.team:
                team_keys = [k for k in team_keys if k == args.team]
            for key in team_keys:
                print_usage_table(names.get(key, key), team_usage(rows, key))
    finally:
        conn.close()
    if args.sessions:
        show_sessions(rows, args.limit)

    print(
        "\nsources: board+runs <- teams.db | usage <- db/sessions/*/*.messages.json"
        "\nnotes: --team-name only labels the team; the board key is the lead session"
        " id,\n       so a new run with the same --team-name starts an EMPTY board."
        "\n       `cline history` lists sessions with model/status/cost."
    )


if __name__ == "__main__":
    main()
