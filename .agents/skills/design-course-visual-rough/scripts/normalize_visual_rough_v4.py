"""Normalize v4 source hash plus global U/M numbering without changing A-page G."""

from __future__ import annotations

import argparse
import hashlib
import re
from pathlib import Path


def normalize(text: str, *, a_page_name: str, a_page_bytes: bytes) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"(?m)^schema_version:.*$", "schema_version: courseplay-visual-rough/v4", text, count=1)
    text = re.sub(r"(?m)^source_a_page:.*$", f"source_a_page: {a_page_name}", text, count=1)
    text = re.sub(r"(?m)^source_a_page_sha256:.*$", f"source_a_page_sha256: {hashlib.sha256(a_page_bytes).hexdigest()}", text, count=1)
    unit_ids = re.findall(r"(?m)^\d+\.\s+`?(U\d{3})\s*<-", text)
    unit_map = {old: f"U{index:03d}" for index, old in enumerate(dict.fromkeys(unit_ids), 1)}
    media_ids = re.findall(r"(?m)^\s*-\s+\*\*媒体需求\*\*\s*[：:]\s*`?(M\d{3})", text)
    media_map = {old: f"M{index:03d}" for index, old in enumerate(dict.fromkeys(media_ids), 1)}
    replacements = {**unit_map, **media_map}
    text = re.sub(r"(?<![A-Za-z0-9])(?:U|M)\d{3}(?!\d)", lambda match: replacements.get(match.group(0), match.group(0)), text)
    counter = 0
    def number(match: re.Match[str]) -> str:
        nonlocal counter; counter += 1; return f"{counter}. {match.group(1)}"
    return re.sub(r"(?m)^\d+\.\s+(`?U\d{3}\s*<-.*)$", number, text)


def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--a-page", type=Path, required=True); parser.add_argument("--input", type=Path, required=True); parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args(); args.output.write_text(normalize(args.input.read_text(encoding="utf-8"), a_page_name=args.a_page.name, a_page_bytes=args.a_page.read_bytes()), encoding="utf-8"); return 0


if __name__ == "__main__": raise SystemExit(main())
