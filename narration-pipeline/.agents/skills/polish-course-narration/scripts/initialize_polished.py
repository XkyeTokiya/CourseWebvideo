import argparse
import json
import shutil
from pathlib import Path

from narration_core import discover_episode_paths, sha256_path


def snapshot_inputs(pairs):
    inputs = []
    for pair in pairs:
        repo_root = pair.task_package.parents[2]
        for path in (pair.task_package, pair.original_narration):
            inputs.append(
                {
                    "path": path.relative_to(repo_root).as_posix(),
                    "sha256": sha256_path(path),
                }
            )
    return sorted(inputs, key=lambda item: item["path"])


def initialize(repo_root: Path, snapshot_path: Path, expected_count: int = 51, resume: bool = False) -> dict:
    repo_root = Path(repo_root)
    snapshot_path = Path(snapshot_path)
    if not snapshot_path.is_absolute():
        snapshot_path = repo_root / snapshot_path
    pairs = discover_episode_paths(repo_root, expected_count)
    output_root = repo_root / "outputs" / "narration-scripts-polished"
    if output_root.exists() and not resume:
        raise ValueError("polished output already exists")
    copied = 0
    for pair in pairs:
        target = pair.polished_narration
        if target.exists():
            if target.read_bytes() != pair.original_narration.read_bytes():
                raise ValueError(f"existing copy is not byte-identical: {target}")
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(pair.original_narration, target)
        copied += 1
    inputs = snapshot_inputs(pairs)
    snapshot_path.parent.mkdir(parents=True, exist_ok=True)
    snapshot_path.write_text(
        json.dumps({"schema_version": 1, "inputs": inputs}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return {"copied": copied, "total": len(pairs)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--snapshot", type=Path, required=True)
    parser.add_argument("--resume", action="store_true")
    args = parser.parse_args()
    result = initialize(args.repo_root, args.snapshot, resume=args.resume)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
