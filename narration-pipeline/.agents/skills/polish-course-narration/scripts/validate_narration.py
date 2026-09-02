import argparse
import json
import re
import sys
from pathlib import Path

from narration_core import EpisodePaths, discover_episode_paths, numeric_tokens, parse_narration, sha256_path


FORBIDDEN_META_TERMS = (
    "教材",
    "本任务包",
    "脚本设计",
    "后续制作",
    "PPT 制作",
    "PPT制作",
    "审核通过",
)
N_HEADER_RE = re.compile(r"(?m)^\[(N\d{3})\]\r?$")


def validate_episode(pair: EpisodePaths) -> tuple[str, ...]:
    original = parse_narration(pair.original_narration.read_text(encoding="utf-8"))
    polished_text = pair.polished_narration.read_text(encoding="utf-8")
    polished_ids = tuple(match.group(1) for match in N_HEADER_RE.finditer(polished_text))
    if original.ids != polished_ids:
        return ("N_SEQUENCE",)

    polished = parse_narration(polished_text)
    findings = []
    if original.prefix != polished.prefix or original.suffix != polished.suffix:
        findings.append("OUTSIDE_N_CHANGED")
    for segment_id in original.ids:
        polished_segment = polished.segments[segment_id]
        if not polished_segment.strip():
            findings.append(f"EMPTY_SEGMENT:{segment_id}")
        if numeric_tokens(original.segments[segment_id]) != numeric_tokens(polished_segment):
            findings.append(f"NUMBERS_CHANGED:{segment_id}")
    polished_n_body = "".join(polished.segments.values())
    for term in FORBIDDEN_META_TERMS:
        if term in polished_n_body:
            findings.append(f"FORBIDDEN_META_TERM:{term}")
    return tuple(findings)


def validate_inputs(repo_root: Path, snapshot_path: Path) -> tuple[str, ...]:
    repo_root = Path(repo_root)
    snapshot = json.loads(Path(snapshot_path).read_text(encoding="utf-8"))
    for item in snapshot["inputs"]:
        path = repo_root / item["path"]
        if not path.is_file() or sha256_path(path) != item["sha256"]:
            return ("INPUT_CHANGED",)
    return ()


def validate_batch(repo_root: Path, snapshot_path: Path, expected_count: int = 51) -> tuple[str, ...]:
    repo_root = Path(repo_root)
    findings = list(validate_inputs(repo_root, snapshot_path))
    if findings:
        return tuple(findings)
    pairs = discover_episode_paths(repo_root, expected_count=expected_count)
    polished_root = repo_root / "outputs" / "narration-scripts-polished"
    expected_paths = tuple(
        sorted(pair.polished_narration.relative_to(polished_root).as_posix() for pair in pairs)
    )
    actual_paths = tuple(
        sorted(path.relative_to(polished_root).as_posix() for path in polished_root.rglob("*.md"))
        if polished_root.exists()
        else ()
    )
    if actual_paths != expected_paths:
        findings.append("POLISHED_PATH_SET")
    for pair in pairs:
        if pair.polished_narration.is_file():
            findings.extend(validate_episode(pair))
    return tuple(findings)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--snapshot", type=Path, required=True)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--episode", type=int)
    mode.add_argument("--all", action="store_true")
    args = parser.parse_args()

    repo_root = args.repo_root
    snapshot_path = args.snapshot if args.snapshot.is_absolute() else repo_root / args.snapshot
    input_findings = validate_inputs(repo_root, snapshot_path)
    if input_findings:
        print("\n".join(input_findings))
        return 1
    if args.all:
        findings = validate_batch(repo_root, snapshot_path)
    else:
        pairs = discover_episode_paths(repo_root)
        matching_pairs = [pair for pair in pairs if pair.episode == args.episode]
        if not matching_pairs:
            parser.error(f"unknown episode: {args.episode}")
        findings = validate_episode(matching_pairs[0])

    if findings:
        print("\n".join(findings))
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
