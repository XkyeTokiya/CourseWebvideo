"""Load and validate human-maintained Courseplay page-recipe Markdown files."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any


RECIPE_SCHEMA_VERSION = "courseplay-page-recipe/v1"
REGISTRY_SCHEMA_VERSION = "courseplay-page-recipe-registry/v2"
RECIPE_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
RECIPE_STATUSES = ("experimental", "active", "restricted", "deprecated", "blocked")
MEDIA_MODES = ("required", "forbidden")
FRONTMATTER_FIELDS = (
    "schema_version",
    "recipe_id",
    "status",
    "content_group_min",
    "content_group_max",
    "media_mode",
    "is_logic_diagram",
    "slot_contract",
    "downstream_layouts",
    "definition_sha256",
)
BODY_HEADINGS = ("用途", "正例", "反例")
DIAGRAM_LAYOUTS = {"flow-diagram", "arch-diagram", "mindmap"}


def _split_frontmatter(text: str) -> tuple[dict[str, str], str, list[str]]:
    failures: list[str] = []
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    if not normalized.startswith("---\n"):
        return {}, normalized, ["RECIPE_FRONTMATTER_REQUIRED"]
    end = normalized.find("\n---\n", 4)
    if end < 0:
        return {}, normalized, ["RECIPE_FRONTMATTER_UNTERMINATED"]
    frontmatter: dict[str, str] = {}
    for number, line in enumerate(normalized[4:end].splitlines(), 1):
        if not line.strip() or ":" not in line:
            failures.append(f"RECIPE_FRONTMATTER_LINE_INVALID:{number}")
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        if key in frontmatter:
            failures.append(f"RECIPE_FRONTMATTER_DUPLICATE:{key}")
        frontmatter[key] = value.strip()
    return frontmatter, normalized[end + 5 :], failures


def _parse_sections(body: str) -> tuple[dict[str, str], list[str]]:
    failures: list[str] = []
    all_headings = re.findall(r"(?m)^# ([^\n]+?)\s*$", body)
    matches = list(re.finditer(r"(?m)^# (用途|正例|反例)\s*$", body))
    sections: dict[str, str] = {}
    for index, match in enumerate(matches):
        name = match.group(1)
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        value = body[match.end() : end].strip()
        if name in sections:
            failures.append(f"RECIPE_SECTION_DUPLICATE:{name}")
        sections[name] = value
    for heading in BODY_HEADINGS:
        if not sections.get(heading):
            failures.append(f"RECIPE_SECTION_REQUIRED:{heading}")
    if all_headings != list(BODY_HEADINGS) or set(sections) != set(BODY_HEADINGS):
        failures.append("RECIPE_SECTION_SET_INVALID")
    return sections, failures


def _parse_list(value: str, field_name: str, failures: list[str]) -> list[str]:
    values = [item.strip() for item in value.split("|")]
    if (
        not value
        or any(not item for item in values)
        or any(not RECIPE_ID_PATTERN.fullmatch(item) for item in values)
        or len(values) != len(set(values))
    ):
        failures.append(f"RECIPE_LIST_INVALID:{field_name}")
    return values


def definition_payload(recipe: dict[str, Any]) -> dict[str, Any]:
    return {
        key: recipe[key]
        for key in (
            "schema_version",
            "recipe_id",
            "content_group_min",
            "content_group_max",
            "media_mode",
            "is_logic_diagram",
            "slot_contract",
            "downstream_layouts",
            "purpose",
            "positive_example",
            "negative_example",
        )
    }


def compute_definition_sha256(recipe: dict[str, Any]) -> str:
    canonical = json.dumps(
        definition_payload(recipe), ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()


def parse_recipe_markdown(path: Path) -> tuple[dict[str, Any], list[str]]:
    failures: list[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        return {}, [f"RECIPE_READ_FAILED:{path.name}:{exc}"]
    frontmatter, body, frontmatter_failures = _split_frontmatter(text)
    failures.extend(frontmatter_failures)
    unknown = set(frontmatter) - set(FRONTMATTER_FIELDS)
    missing = set(FRONTMATTER_FIELDS) - set(frontmatter)
    for field_name in sorted(unknown):
        failures.append(f"RECIPE_FIELD_UNKNOWN:{field_name}")
    for field_name in sorted(missing):
        failures.append(f"RECIPE_FIELD_REQUIRED:{field_name}")
    sections, section_failures = _parse_sections(body)
    failures.extend(section_failures)

    recipe_id = frontmatter.get("recipe_id", "")
    if not RECIPE_ID_PATTERN.fullmatch(recipe_id):
        failures.append("RECIPE_ID_INVALID")
    if path.stem != recipe_id:
        failures.append(f"RECIPE_FILENAME_ID_MISMATCH:{path.stem}:{recipe_id}")
    if frontmatter.get("schema_version") != RECIPE_SCHEMA_VERSION:
        failures.append("RECIPE_SCHEMA_VERSION_INVALID")
    status = frontmatter.get("status", "")
    if status not in RECIPE_STATUSES:
        failures.append("RECIPE_STATUS_INVALID")
    media_mode = frontmatter.get("media_mode", "")
    if media_mode not in MEDIA_MODES:
        failures.append("RECIPE_MEDIA_MODE_INVALID")
    raw_logic = frontmatter.get("is_logic_diagram", "")
    if raw_logic not in {"true", "false"}:
        failures.append("RECIPE_LOGIC_FLAG_INVALID")
    is_logic = raw_logic == "true"
    try:
        minimum = int(frontmatter.get("content_group_min", ""))
        maximum = int(frontmatter.get("content_group_max", ""))
    except ValueError:
        minimum = maximum = 0
        failures.append("CONTENT_GROUP_RANGE_INVALID")
    if minimum < 1 or maximum < minimum:
        failures.append("CONTENT_GROUP_RANGE_INVALID")
    slot_contract = _parse_list(frontmatter.get("slot_contract", ""), "slot_contract", failures)
    downstream_layouts = _parse_list(
        frontmatter.get("downstream_layouts", ""), "downstream_layouts", failures
    )
    if is_logic and status == "active":
        failures.append("LOGIC_RECIPE_STATUS_INVALID")
    if not is_logic and status == "restricted":
        failures.append("RESTRICTED_NON_LOGIC_RECIPE_INVALID")
    if recipe_id == "logic-diagram" and status != "blocked":
        failures.append("BROAD_LOGIC_RECIPE_BLOCKED")
    if not is_logic and DIAGRAM_LAYOUTS.intersection(downstream_layouts):
        failures.append("NON_LOGIC_DIAGRAM_LAYOUT_FORBIDDEN")

    recipe: dict[str, Any] = {
        "schema_version": frontmatter.get("schema_version", ""),
        "recipe_id": recipe_id,
        "status": status,
        "content_group_min": minimum,
        "content_group_max": maximum,
        "media_mode": media_mode,
        "is_logic_diagram": is_logic,
        "slot_contract": slot_contract,
        "downstream_layouts": downstream_layouts,
        "definition_sha256": frontmatter.get("definition_sha256", ""),
        "purpose": sections.get("用途", ""),
        "positive_example": sections.get("正例", ""),
        "negative_example": sections.get("反例", ""),
        "source_file": path.name,
    }
    if not failures:
        expected_hash = compute_definition_sha256(recipe)
        supplied_hash = recipe["definition_sha256"]
        if status == "experimental":
            if supplied_hash not in {"pending", expected_hash}:
                failures.append(f"RECIPE_DEFINITION_HASH_INVALID:{recipe_id}")
        elif supplied_hash != expected_hash:
            failures.append(f"RECIPE_DEFINITION_HASH_DRIFT:{recipe_id}")
    return recipe, sorted(set(failures))


def canonical_registry_sha256(registry: dict[str, Any]) -> str:
    canonical = json.dumps(
        registry, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()


def load_recipe_directory(
    recipes_dir: Path,
) -> tuple[dict[str, Any], list[str], str]:
    failures: list[str] = []
    recipes: list[dict[str, Any]] = []
    seen: set[str] = set()
    if not recipes_dir.is_dir():
        registry = {"schema_version": REGISTRY_SCHEMA_VERSION, "recipes": []}
        return registry, ["RECIPE_DIRECTORY_REQUIRED"], canonical_registry_sha256(registry)
    for path in sorted(recipes_dir.glob("*.md"), key=lambda item: item.name):
        recipe, recipe_failures = parse_recipe_markdown(path)
        failures.extend(f"{failure}:{path.name}" for failure in recipe_failures)
        recipe_id = recipe.get("recipe_id")
        if recipe_id in seen:
            failures.append(f"RECIPE_ID_DUPLICATE:{recipe_id}")
        elif isinstance(recipe_id, str):
            seen.add(recipe_id)
        recipes.append(recipe)
    recipes.sort(key=lambda item: item.get("recipe_id", ""))
    registry = {"schema_version": REGISTRY_SCHEMA_VERSION, "recipes": recipes}
    return registry, sorted(set(failures)), canonical_registry_sha256(registry)


def render_recipe_markdown(recipe: dict[str, Any]) -> str:
    def joined(field_name: str) -> str:
        return " | ".join(recipe[field_name])

    return f"""---
schema_version: {RECIPE_SCHEMA_VERSION}
recipe_id: {recipe['recipe_id']}
status: {recipe['status']}
content_group_min: {recipe['content_group_min']}
content_group_max: {recipe['content_group_max']}
media_mode: {recipe['media_mode']}
is_logic_diagram: {'true' if recipe['is_logic_diagram'] else 'false'}
slot_contract: {joined('slot_contract')}
downstream_layouts: {joined('downstream_layouts')}
definition_sha256: {recipe['definition_sha256']}
---

# 用途

{recipe['purpose']}

# 正例

{recipe['positive_example']}

# 反例

{recipe['negative_example']}
"""
