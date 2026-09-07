#!/usr/bin/env python3
"""Create and verify deterministic archives for explicitly retired repo files."""

from __future__ import annotations

import argparse
import hashlib
import json
import stat
import subprocess
import tempfile
import zipfile
from pathlib import Path, PurePosixPath


FIXED_TIMESTAMP = (1980, 1, 1, 0, 0, 0)
FORBIDDEN_NAMES = {".env", ".env.local", ".env.production", "credentials", "credential", "token"}
FORBIDDEN_PARTS = {"node_modules", "__pycache__", ".cache", ".tmp"}
FORBIDDEN_SUFFIXES = {
    ".mp3", ".wav", ".m4a", ".aac", ".flac", ".mp4", ".mov", ".webm",
    ".avi", ".mkv", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf",
}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def tracked_files(root: Path, scopes: list[str]) -> list[str]:
    command = ["git", "ls-files", "--", *scopes]
    result = subprocess.run(command, cwd=root, check=True, capture_output=True, text=True)
    files = sorted({line.strip() for line in result.stdout.splitlines() if line.strip()})
    if not files:
        raise SystemExit("archive scope resolved to zero tracked files")
    return files


def assert_safe(relative_path: str) -> None:
    path = PurePosixPath(relative_path)
    lowered = {part.lower() for part in path.parts}
    if path.is_absolute() or ".." in path.parts:
        raise SystemExit(f"unsafe archive path: {relative_path}")
    if lowered & FORBIDDEN_PARTS:
        raise SystemExit(f"cache/temp content refused: {relative_path}")
    if path.name.lower() in FORBIDDEN_NAMES or "credential" in path.name.lower():
        raise SystemExit(f"credential-like content refused: {relative_path}")
    if path.suffix.lower() in FORBIDDEN_SUFFIXES:
        raise SystemExit(f"media content refused: {relative_path}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--zip", dest="zip_path", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--git-ref", help="Archive immutable tracked blobs from this Git ref.")
    parser.add_argument("scope", nargs="+")
    args = parser.parse_args()
    root = args.root.resolve()
    files = tracked_files(root, args.scope)
    records = []
    payloads: dict[str, bytes] = {}
    for relative_path in files:
        assert_safe(relative_path)
        source = root / relative_path
        if args.git_ref:
            payload = subprocess.run(
                ["git", "show", f"{args.git_ref}:{relative_path}"], cwd=root, check=True, capture_output=True
            ).stdout
        else:
            if source.is_symlink() or not source.is_file():
                raise SystemExit(f"regular tracked file required: {relative_path}")
            payload = source.read_bytes()
        payloads[relative_path] = payload
        records.append({"path": relative_path, "bytes": len(payload), "sha256": digest(payload)})

    args.zip_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for relative_path in files:
            info = zipfile.ZipInfo(relative_path, FIXED_TIMESTAMP)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.create_system = 3
            archive.writestr(info, payloads[relative_path], compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

    zip_bytes = args.zip_path.read_bytes()
    manifest = {
        "schema_version": "retired-production-flow-archive/v1",
        "archive": args.zip_path.name,
        "determinism": {"timestamp": "1980-01-01T00:00:00Z", "mode": "0644", "compression": "deflate-9"},
        "file_count": len(records),
        "files": records,
        "zip_sha256": digest(zip_bytes),
    }
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    with tempfile.TemporaryDirectory(prefix="retired-flow-verify-") as temp_name:
        temp = Path(temp_name)
        with zipfile.ZipFile(args.zip_path) as archive:
            names = archive.namelist()
            if names != files or set(names) != {item["path"] for item in records}:
                raise SystemExit("archive entry set does not match manifest/source set")
            archive.extractall(temp)
        for record in records:
            restored = (temp / record["path"]).read_bytes()
            if len(restored) != record["bytes"] or digest(restored) != record["sha256"]:
                raise SystemExit(f"restored hash mismatch: {record['path']}")
    print(f"PASS {args.zip_path}: {len(files)} files, {manifest['zip_sha256']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
