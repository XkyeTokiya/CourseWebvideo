from __future__ import annotations

import argparse
import shutil
import tempfile
from pathlib import Path


FORMAL_NAMES = (
    "approved-spoken-text.txt",
    "{episode}-a-page.json",
    "{episode}-a-page-validation.json",
    "{episode}-visual-rough.md",
    "{episode}-visual-rough-validation.json",
)


def publish(source_dir: Path, player_root: Path, episode: str, dry_run: bool = False) -> list[Path]:
    if not episode.startswith("episode-"):
        raise ValueError("episode must use the episode-XX form")
    source_dir = source_dir.resolve()
    player_root = player_root.resolve()
    target_dir = player_root / "episodes" / episode / "inputs"
    if not source_dir.is_dir():
        raise FileNotFoundError(f"source directory not found: {source_dir}")
    if not (player_root / "episodes" / episode / "project.json").is_file():
        raise FileNotFoundError(f"player episode project.json not found: {episode}")

    names = [name.format(episode=episode) for name in FORMAL_NAMES]
    files = [source_dir / name for name in names if (source_dir / name).is_file()]
    if not files:
        raise FileNotFoundError(f"no formal handoff files found in {source_dir}")
    if dry_run:
        return files

    target_dir.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=f".{episode}-inputs-", dir=target_dir.parent) as staging_name:
        staging = Path(staging_name)
        for source in files:
            shutil.copy2(source, staging / source.name)
        for staged in staging.iterdir():
            staged.replace(target_dir / staged.name)
    return [target_dir / source.name for source in files]


def main() -> int:
    parser = argparse.ArgumentParser(description="Publish approved Courseplay handoff files into player inputs.")
    parser.add_argument("--episode", required=True)
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--player-root", type=Path, default=Path("..") / "player")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    paths = publish(args.source_dir, args.player_root, args.episode, args.dry_run)
    for path in paths:
        print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())