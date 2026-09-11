#!/usr/bin/env python3
"""Instantiate the CourseWebvideo production pipeline as Kanban task cards.

Kanban has no pipeline/template concept, so "reusing the flow" means re-instantiating
it from a tracked definition. The single source of truth is
`scripts/coursewebvideo-pipeline.json`; this script only renders its prompt templates
for one episode and drives the public `kanban task` CLI.

Safety: this script never starts a card (`task start` is never called) and never
writes anything inside the repository — it only talks to the Kanban runtime.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT_DEFAULT = Path(__file__).resolve().parent.parent
PIPELINE_FILE = Path(__file__).resolve().parent / "coursewebvideo-pipeline.json"
TASK_PACKAGE_GLOB = "narration-pipeline/episodes/*/{episode}-*-task-package.md"
TMP_DIR_TEMPLATE = ".tmp/narration-pipeline/kanban/{episode}"


def find_kanban(explicit: str | None) -> str:
    if explicit:
        return explicit
    found = shutil.which("kanban")
    if found:
        return found
    for candidate in (Path.home() / ".local" / "bin" / "kanban", Path.home() / ".cline" / "kanban" / "bin" / "kanban"):
        if candidate.exists():
            return str(candidate)
    sys.exit("error: 找不到 kanban CLI。请先运行 `cline kanban`（首次会自动安装），或用 --kanban-bin 指定路径。")


def run_kanban(binary: str, args: list[str]) -> dict:
    proc = subprocess.run(
        [binary, "task", *args],
        capture_output=True,
        text=True,
        check=False,
    )
    stdout = proc.stdout.strip()
    if not stdout:
        sys.exit(
            f"error: kanban 无输出（exit={proc.returncode}）。"
            f"运行时服务可能未运行 —— 请先在仓库根执行 `cline kanban`。\nstderr: {proc.stderr.strip()[:400]}"
        )
    try:
        payload = json.loads(stdout)
    except json.JSONDecodeError:
        sys.exit(f"error: kanban 输出不是 JSON：\n{stdout[:600]}")
    if payload.get("ok") is False:
        sys.exit(f"error: kanban 返回失败：{json.dumps(payload, ensure_ascii=False)[:600]}")
    return payload


def load_pipeline() -> dict:
    if not PIPELINE_FILE.exists():
        sys.exit(f"error: 缺少流程定义 {PIPELINE_FILE}")
    return json.loads(PIPELINE_FILE.read_text(encoding="utf-8"))


def normalize_episode(value: str) -> str:
    """Accept `37`, `ep37`, `episode-37`, `episode-37` → canonical `episode-37`."""
    raw = str(value).strip()
    stripped = re.sub(r"^(?:episode|ep)[-_ ]*", "", raw, flags=re.IGNORECASE)
    if stripped.isdigit():
        return f"episode-{int(stripped):02d}"
    return raw


def resolve_episode_context(repo_root: Path, episode: str, task_package: str | None) -> tuple[str, str]:
    """Return (task_package_repo_relative_path, episode_title)."""
    episode = normalize_episode(episode)
    if task_package:
        package = Path(task_package)
        if not package.is_absolute():
            package = repo_root / task_package
    else:
        matches = sorted(repo_root.glob(TASK_PACKAGE_GLOB.format(episode=episode)))
        if not matches:
            sys.exit(f"error: 找不到 {episode} 的冻结任务包（glob: {TASK_PACKAGE_GLOB.format(episode=episode)}）")
        if len(matches) > 1:
            sys.exit(f"error: {episode} 匹配到多个任务包，请用 --task-package 指定：{[m.name for m in matches]}")
        package = matches[0]
    if not package.exists():
        sys.exit(f"error: 冻结任务包不存在：{package}")
    text = package.read_text(encoding="utf-8")
    match = re.search(r"^#\s*第\s*(\d+)\s*集《([^》]+)》", text, re.MULTILINE)
    title = match.group(2).strip() if match else episode
    return str(package.relative_to(repo_root)), title


def stage_marker(episode: str, key: str) -> str:
    return f"[{episode}-{key}]"


def render_prompt(template: str, values: dict[str, str]) -> str:
    rendered = template
    for name, value in values.items():
        rendered = rendered.replace("{{" + name + "}}", value)
    unresolved = sorted(set(re.findall(r"\{\{(\w+)\}\}", rendered)))
    if unresolved:
        sys.exit(f"error: prompt 里有未解析的占位符 {unresolved}")
    return rendered


def build_plan(pipeline: dict, episode: str, title: str, task_package: str, repo_root: Path) -> list[dict]:
    """Render every stage's prompt for one episode, in pipeline order."""
    common_template = pipeline.get("commonConstraints", "")
    protected_branch = str(pipeline.get("delivery", {}).get("protectedBranch", "main"))
    plan: list[dict] = []
    for stage in pipeline["stages"]:
        values = {
            "episodeId": episode,
            "key": stage["key"],
            "name": stage["name"],
            "title": title,
            "taskPackage": task_package,
            "tmpDir": TMP_DIR_TEMPLATE.format(episode=episode),
            "repoRoot": str(repo_root),
            "protectedBranch": protected_branch,
        }
        prompt = render_prompt(stage["prompt"], values)
        if common_template:
            prompt = f"{prompt}\n\n{render_prompt(common_template, values)}"
        plan.append(
            {
                "key": stage["key"],
                "name": stage["name"],
                "zone": stage["zone"],
                "gate": stage["gate"],
                "card_title": f"{episode}-{stage['key']} {stage['name']}",
                "prompt": prompt,
                "marker": stage_marker(episode, stage["key"]),
            }
        )
    return plan


def episode_cards(binary: str, repo_root: Path, episode: str) -> list[dict]:
    """Return this episode's cards as {key, id, column, first_line} (pipeline-agnostic)."""
    payload = run_kanban(binary, ["list", "--project-path", str(repo_root)])
    pattern = re.compile(r"\[" + re.escape(episode) + r"-(\d{2})\]")
    cards: list[dict] = []
    for task in payload.get("tasks", []):
        prompt = task.get("prompt") or ""
        match = pattern.search(prompt)
        if not match:
            continue
        first_line = prompt.strip().splitlines()[0] if prompt.strip() else ""
        cards.append(
            {
                "key": match.group(1),
                "id": task["id"],
                "column": task.get("column"),
                "first_line": first_line,
            }
        )
    cards.sort(key=lambda card: card["key"])
    return cards


def cmd_seed(binary: str, repo_root: Path, args: argparse.Namespace, pipeline: dict) -> int:
    episode = args.episode
    task_package, title = resolve_episode_context(repo_root, episode, args.task_package)
    plan = build_plan(pipeline, episode, title, task_package, repo_root)

    if args.only:
        wanted = [key.strip() for key in args.only.split(",") if key.strip()]
        known = {stage["key"] for stage in plan}
        unknown = [key for key in wanted if key not in known]
        if unknown:
            sys.exit(f"error: --only 里有未知阶段 {unknown}；可选 {sorted(known)}")
        plan = [stage for stage in plan if stage["key"] in wanted]

    existing = {card["key"]: card["id"] for card in episode_cards(binary, repo_root, episode)}
    pending = [stage for stage in plan if stage["key"] not in existing]
    order = list(reversed(pending)) if args.order == "reverse" else list(pending)

    print(f"episode      : {episode}  《{title}》")
    print(f"task package : {task_package}")
    print(f"tmp dir      : {TMP_DIR_TEMPLATE.format(episode=episode)}")
    print(f"stages       : {len(plan)}  (已有 {len(existing)}，待建 {len(pending)})")
    print(f"create order : {args.order}")
    for stage in order:
        gate = f"  gate={stage['gate']}" if stage["gate"] else ""
        print(f"  + {stage['card_title']}{gate}")
    print("links (later waits on earlier):")
    keys = [stage["key"] for stage in plan]
    for index in range(1, len(keys)):
        print(f"  {keys[index]} -> waits on {keys[index - 1]}")
    if args.dry_run:
        print("\n[dry-run] 未写入看板。")
        return 0

    ids = dict(existing)
    for stage in order:
        payload = run_kanban(
            binary,
            [
                "create",
                "--project-path", str(repo_root),
                "--title", stage["card_title"],
                "--prompt", stage["prompt"],
                "--base-ref", args.base_ref,
                "--agent-id", args.agent_id,
                "--cline-provider", args.cline_provider,
                "--cline-model", args.cline_model,
                "--cline-reasoning-effort", args.cline_reasoning_effort,
                # 交付策略：只保留 PR 路径；自动交付始终关闭
                "--auto-review-mode", args.auto_review_mode,
            ],
        )
        ids[stage["key"]] = payload["task"]["id"]
        print(f"  created {stage['key']} -> {payload['task']['id']}")

    linked = 0
    for index in range(1, len(keys)):
        later, earlier = keys[index], keys[index - 1]
        if later in ids and earlier in ids:
            run_kanban(
                binary,
                [
                    "link",
                    "--project-path", str(repo_root),
                    "--task-id", ids[later],
                    "--linked-task-id", ids[earlier],
                ],
            )
            linked += 1
    print(f"\n完成：新建 {len(order)} 张卡，建立 {linked} 条依赖。卡片全部落在 backlog，未被 start。")
    return 0


def cmd_remove(binary: str, repo_root: Path, args: argparse.Namespace) -> int:
    cards = episode_cards(binary, repo_root, args.episode)
    if args.only:
        wanted = {key.strip() for key in args.only.split(",") if key.strip()}
        cards = [card for card in cards if card["key"] in wanted]
    if not cards:
        print(f"{args.episode}: 看板上没有该集的卡。")
        return 0
    for card in cards:
        print(f"  - delete {card['key']} {card['id']}  {card['first_line']}")
    if args.dry_run:
        print("\n[dry-run] 未删除。")
        return 0
    for card in cards:
        run_kanban(binary, ["delete", "--task-id", card["id"], "--project-path", str(repo_root)])
    print(f"\n完成：删除 {len(cards)} 张卡。")
    return 0


def cmd_status(binary: str, repo_root: Path, args: argparse.Namespace) -> int:
    payload = run_kanban(binary, ["list", "--project-path", str(repo_root)])
    groups: dict[str, list[dict]] = {}
    for task in payload.get("tasks", []):
        prompt = task.get("prompt") or ""
        match = re.search(r"\[([A-Za-z0-9._-]+)-(\d{2})\]", prompt)
        episode = match.group(1) if match else "(untagged)"
        key = match.group(2) if match else "??"
        first_line = prompt.strip().splitlines()[0] if prompt.strip() else ""
        groups.setdefault(episode, []).append(
            {"key": key, "id": task["id"], "column": task.get("column"), "first_line": first_line}
        )

    print(f"workspace: {repo_root}")
    print(f"cards: {payload.get('count', 0)}   dependencies: {len(payload.get('dependencies', []))}")
    if not groups:
        print("(看板为空)")
        return 0
    for episode in sorted(groups):
        cards = sorted(groups[episode], key=lambda card: card["key"])
        print(f"\n{episode}  ({len(cards)} cards)")
        for card in cards:
            print(f"  [{card['column']:>11}] {card['id']}  {card['first_line']}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="把 CourseWebvideo 生产流程实例化为 Kanban 卡片（流程定义见 coursewebvideo-pipeline.json）。",
    )
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT_DEFAULT, help=f"仓库根（默认 {REPO_ROOT_DEFAULT}）")
    parser.add_argument("--kanban-bin", help="kanban CLI 路径（默认自动探测）")
    sub = parser.add_subparsers(dest="command", required=True)

    seed = sub.add_parser("seed", help="按流程定义为一集创建卡片并串依赖")
    seed.add_argument("--episode", required=True, help="必需：集号或集 id，如 37 / ep37 / episode-37（没有默认值）")
    seed.add_argument("--task-package", help="冻结任务包路径（默认按 episode 自动查找）")
    seed.add_argument("--only", help="只处理这些阶段序号，逗号分隔，如 01,02")
    seed.add_argument("--order", choices=["reverse", "forward"], default="reverse",
                      help="创建顺序（默认 reverse：末段先建，列自上而下读作 01→N）")
    seed.add_argument("--dry-run", action="store_true", help="只打印计划，不写看板")
    seed.add_argument("--base-ref", default=None)
    seed.add_argument("--agent-id", default=None)
    seed.add_argument("--cline-provider", default=None)
    seed.add_argument("--cline-model", default=None)
    seed.add_argument("--cline-reasoning-effort", default=None)
    seed.add_argument("--auto-review-mode", choices=["commit", "pr"], default=None,
                      help="交付模式，默认取流程定义 defaults.autoReviewMode（pr）。自动交付本身始终关闭")

    remove = sub.add_parser("remove", help="删除某一集的卡片")
    remove.add_argument("--episode", required=True, help="必需：集号或集 id（没有默认值）")
    remove.add_argument("--only", help="只删除这些阶段序号，逗号分隔")
    remove.add_argument("--dry-run", action="store_true")

    sub.add_parser("status", help="按集列出看板卡片与所在列")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    repo_root = args.repo_root.resolve()
    if not repo_root.is_dir():
        sys.exit(f"error: --repo-root 不是目录：{repo_root}")
    binary = find_kanban(args.kanban_bin)

    if args.command == "status":
        return cmd_status(binary, repo_root, args)

    pipeline = load_pipeline()
    defaults = pipeline.get("defaults", {})
    if args.command == "seed":
        for field, key in (
            ("base_ref", "baseRef"),
            ("agent_id", "agentId"),
            ("cline_provider", "clineProvider"),
            ("cline_model", "clineModel"),
            ("cline_reasoning_effort", "clineReasoningEffort"),
            ("auto_review_mode", "autoReviewMode"),
        ):
            if getattr(args, field) is None:
                setattr(args, field, defaults.get(key))

    # 目标集没有默认值：必须由 --episode 显式给出（argparse 已强制 required）。
    args.episode = normalize_episode(args.episode)

    if args.command == "remove":
        return cmd_remove(binary, repo_root, args)
    return cmd_seed(binary, repo_root, args, pipeline)


if __name__ == "__main__":
    raise SystemExit(main())

