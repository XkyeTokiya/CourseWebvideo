#!/usr/bin/env python3
"""Verify a retired-flow archive against its external manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

FORBIDDEN_PARTS = {"node_modules", "__pycache__", ".cache", ".tmp"}
FORBIDDEN_SUFFIXES = {".mp3", ".wav", ".m4a", ".aac", ".flac", ".mp4", ".mov", ".webm", ".avi", ".mkv", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf"}


def digest(data: bytes) -> str: return hashlib.sha256(data).hexdigest()


def verify(zip_path: Path, manifest_path: Path) -> None:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")); records = manifest["files"]
    expected = [record["path"] for record in records]
    if manifest["zip_sha256"] != digest(zip_path.read_bytes()): raise ValueError("ZIP_HASH_MISMATCH")
    if manifest["file_count"] != len(records) or len(expected) != len(set(expected)): raise ValueError("MANIFEST_SET_INVALID")
    for name in expected:
        item = PurePosixPath(name); lowered = {part.lower() for part in item.parts}
        if item.is_absolute() or ".." in item.parts or lowered & FORBIDDEN_PARTS or item.suffix.lower() in FORBIDDEN_SUFFIXES or item.name.lower().startswith(".env") or "credential" in item.name.lower(): raise ValueError(f"FORBIDDEN_ARCHIVE_ENTRY:{name}")
    with tempfile.TemporaryDirectory(prefix="retired-archive-audit-") as temp_name, zipfile.ZipFile(zip_path) as archive:
        if archive.namelist() != expected: raise ValueError("ZIP_ENTRY_SET_MISMATCH")
        archive.extractall(temp_name)
        for record in records:
            data = (Path(temp_name) / record["path"]).read_bytes()
            if len(data) != record["bytes"] or digest(data) != record["sha256"]: raise ValueError(f"FILE_HASH_MISMATCH:{record['path']}")


def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--zip", type=Path, required=True); parser.add_argument("--manifest", type=Path, required=True); args = parser.parse_args()
    verify(args.zip, args.manifest); print(f"PASS {args.zip}"); return 0


if __name__ == "__main__": raise SystemExit(main())
