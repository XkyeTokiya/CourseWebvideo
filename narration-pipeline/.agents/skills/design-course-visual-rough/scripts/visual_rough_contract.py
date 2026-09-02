"""Standard-library parser and validator for Courseplay visual rough v1/v2/v3."""

from __future__ import annotations

import math
import re
import copy
from dataclasses import dataclass, field
from typing import Any


SCHEMA_VERSION = "courseplay-visual-rough/v1"
SCHEMA_VERSION_V1 = SCHEMA_VERSION
SCHEMA_VERSION_V2 = "courseplay-visual-rough/v2"
SCHEMA_VERSION_V3 = "courseplay-visual-rough/v3"
MEDIA_TYPES = {"photorealistic_ai", "textbook_original"}
REQUIRED_FRONTMATTER = {
    "schema_version",
    "document_kind",
    "episode_id",
    "source_a_page",
    "source_a_page_sha256",
    "status",
    "image_required_page_fraction",
    "logic_diagram_page_limit",
}
PAGE_LABELS = {
    "内容角色": "content_role",
    "页面配方": "recipe_id",
    "论点标题": "claim_headline",
    "辅助句": "supporting_line",
    "媒体需求": "media_requirement",
    "媒体作用": "media_purpose",
    "教材证据": "textbook_evidence",
    "逻辑图": "logic_diagram",
    "逻辑图理由": "logic_reason",
}


@dataclass
class RoughPage:
    a_id: str
    title: str
    fields: dict[str, str] = field(default_factory=dict)
    semantic_ids: list[str] = field(default_factory=list)
    visible_relation_ids: list[str] = field(default_factory=list)
    relation_ids: list[str] = field(default_factory=list)
    content_group_count: int = 0


@dataclass
class ParsedRough:
    frontmatter: dict[str, str]
    pages: list[RoughPage]
    failures: list[str]


@dataclass
class RoughV2Page:
    a_id: str
    title: str
    fields: dict[str, str] = field(default_factory=dict)
    group_ids: list[str] = field(default_factory=list)
    slot_bindings: list[tuple[str, str]] = field(default_factory=list)
    relation_ids: list[str] = field(default_factory=list)
    relation_carrier_ids: list[str] = field(default_factory=list)
    slot_text: str = ""


@dataclass
class ParsedRoughV2:
    frontmatter: dict[str, str]
    pages: list[RoughV2Page]
    failures: list[str]


def _plain(value: str) -> str:
    value = value.strip()
    if value.startswith("`") and value.endswith("`") and len(value) >= 2:
        return value[1:-1].strip()
    return value


def parse_visual_rough(text: str) -> ParsedRough:
    if re.search(r"(?m)^schema_version:\s*courseplay-visual-rough/v(?:2|3)\s*$", text):
        return parse_visual_rough_v2(text)  # type: ignore[return-value]
    failures: list[str] = []
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    frontmatter: dict[str, str] = {}
    body = normalized
    if not normalized.startswith("---\n"):
        failures.append("FRONTMATTER_REQUIRED")
    else:
        end = normalized.find("\n---\n", 4)
        if end < 0:
            failures.append("FRONTMATTER_UNTERMINATED")
        else:
            raw_frontmatter = normalized[4:end]
            body = normalized[end + 5 :]
            for number, line in enumerate(raw_frontmatter.splitlines(), 1):
                if not line.strip() or ":" not in line:
                    failures.append(f"FRONTMATTER_LINE_INVALID:{number}")
                    continue
                key, value = line.split(":", 1)
                key = key.strip()
                if key in frontmatter:
                    failures.append(f"FRONTMATTER_DUPLICATE:{key}")
                frontmatter[key] = value.strip()

    page_matches = list(re.finditer(r"(?m)^## (A\d{3})｜([^\n]+)\s*$", body))
    pages: list[RoughPage] = []
    for index, match in enumerate(page_matches):
        start = match.end()
        end = page_matches[index + 1].start() if index + 1 < len(page_matches) else len(body)
        section = body[start:end]
        page = RoughPage(a_id=match.group(1), title=match.group(2).strip())
        for label, key in PAGE_LABELS.items():
            label_matches = re.findall(
                rf"(?m)^- \*\*{re.escape(label)}\*\*：(.+?)\s*$", section
            )
            if len(label_matches) != 1:
                failures.append(f"PAGE_FIELD_COUNT_INVALID:{page.a_id}:{label}")
            elif not _plain(label_matches[0]):
                failures.append(f"PAGE_FIELD_EMPTY:{page.a_id}:{label}")
            else:
                page.fields[key] = _plain(label_matches[0])

        page.semantic_ids.extend(
            re.findall(r"\[(V\d{3})\]", page.fields.get("claim_headline", ""))
        )

        content_match = re.search(
            r"(?ms)^### 上屏内容组\s*\n(.*?)(?=^### 页面骨架\s*$)", section
        )
        if not content_match:
            failures.append(f"CONTENT_GROUP_SECTION_REQUIRED:{page.a_id}")
        else:
            content_lines = re.findall(r"(?m)^\d+\.\s+(.+?)\s*$", content_match.group(1))
            page.content_group_count = len(content_lines)
            for content_index, content_line in enumerate(content_lines, 1):
                semantic_ids = re.findall(r"\[(V\d{3})\]", content_line)
                relation_ids = re.findall(r"\[(R\d{3})\]", content_line)
                if not semantic_ids and not relation_ids:
                    failures.append(
                        f"CONTENT_GROUP_SOURCE_REQUIRED:{page.a_id}:{content_index}"
                    )
                page.semantic_ids.extend(semantic_ids)
                page.visible_relation_ids.extend(relation_ids)

        relation_match = re.search(
            r"(?ms)^### 关系保真\s*\n(.*?)(?=^## |\Z)", section
        )
        if not relation_match:
            failures.append(f"RELATION_SECTION_REQUIRED:{page.a_id}")
        else:
            page.relation_ids = re.findall(r"\[(R\d{3})\]", relation_match.group(1))
        if not re.search(r"(?m)^### 页面骨架\s*$", section):
            failures.append(f"PAGE_SKELETON_REQUIRED:{page.a_id}")
        pages.append(page)
    if not pages:
        failures.append("ROUGH_PAGES_REQUIRED")
    return ParsedRough(frontmatter=frontmatter, pages=pages, failures=failures)


def _parse_frontmatter(text: str) -> tuple[dict[str, str], str, list[str]]:
    failures: list[str] = []
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    frontmatter: dict[str, str] = {}
    body = normalized
    if not normalized.startswith("---\n"):
        failures.append("FRONTMATTER_REQUIRED")
        return frontmatter, body, failures
    end = normalized.find("\n---\n", 4)
    if end < 0:
        failures.append("FRONTMATTER_UNTERMINATED")
        return frontmatter, body, failures
    raw_frontmatter = normalized[4:end]
    body = normalized[end + 5 :]
    for number, line in enumerate(raw_frontmatter.splitlines(), 1):
        if not line.strip() or ":" not in line:
            failures.append(f"FRONTMATTER_LINE_INVALID:{number}")
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        if key in frontmatter:
            failures.append(f"FRONTMATTER_DUPLICATE:{key}")
        frontmatter[key] = value.strip()
    return frontmatter, body, failures


def parse_visual_rough_v2(text: str) -> ParsedRoughV2:
    """Parse the v2 ID/slot format without treating screen copy as rough content."""
    frontmatter, body, failures = _parse_frontmatter(text)
    page_matches = list(re.finditer(r"(?m)^## (A\d{3})[｜|]([^\n]+)\s*$", body))
    pages: list[RoughV2Page] = []
    for index, match in enumerate(page_matches):
        start = match.end()
        end = page_matches[index + 1].start() if index + 1 < len(page_matches) else len(body)
        section = body[start:end]
        page = RoughV2Page(a_id=match.group(1), title=match.group(2).strip())
        for label, key in PAGE_LABELS.items():
            values = re.findall(rf"(?m)^- \*\*{re.escape(label)}\*\*：(.+?)\s*$", section)
            if len(values) != 1:
                failures.append(f"PAGE_FIELD_COUNT_INVALID:{page.a_id}:{label}")
            elif not _plain(values[0]):
                failures.append(f"PAGE_FIELD_EMPTY:{page.a_id}:{label}")
            else:
                page.fields[key] = _plain(values[0])

        content_match = re.search(r"(?ms)^### 上屏内容组\s*\n(.*?)(?=^### 页面骨架\s*$)", section)
        if not content_match:
            failures.append(f"CONTENT_GROUP_SECTION_REQUIRED:{page.a_id}")
        else:
            content_lines = re.findall(r"(?m)^\d+\.\s+(.+?)\s*$", content_match.group(1))
            if not content_lines:
                failures.append(f"CONTENT_GROUP_REQUIRED:{page.a_id}")
            for content_index, content_line in enumerate(content_lines, 1):
                group_ids = re.findall(r"(?<![A-Za-z0-9])(G\d{3})(?!\d)", content_line)
                if len(group_ids) != 1:
                    failures.append(f"CONTENT_GROUP_ID_INVALID:{page.a_id}:{content_index}")
                else:
                    page.group_ids.append(group_ids[0])
                if re.search(r"(?<![A-Za-z0-9])C\d{3}(?!\d)", content_line):
                    failures.append(f"SILENT_CONSTRAINT_VISIBLE_SLOT:{page.a_id}:{content_index}")

        skeleton_match = re.search(r"(?ms)^### 页面骨架\s*\n(.*?)(?=^### 关系保真\s*$)", section)
        if not skeleton_match:
            failures.append(f"PAGE_SKELETON_REQUIRED:{page.a_id}")
        else:
            page.slot_text = skeleton_match.group(1)
            if re.search(r"(?<![A-Za-z0-9])C\d{3}(?!\d)", page.slot_text):
                failures.append(f"SILENT_CONSTRAINT_VISIBLE_SLOT:{page.a_id}:skeleton")
            for slot, source_id in re.findall(
                r"(?m)^-\s+`?([A-Za-z0-9_-]+)`?\s*<-\s*`?((?:S|G|M)\d{3}|none)`?\s*$",
                page.slot_text,
            ):
                page.slot_bindings.append((slot, source_id))
            binding_lines = [line for line in page.slot_text.splitlines() if line.strip().startswith("-")]
            if len(page.slot_bindings) != len(binding_lines):
                failures.append(f"SLOT_BINDING_INVALID:{page.a_id}")

        relation_match = re.search(r"(?ms)^### 关系保真\s*\n(.*?)(?=^## |\Z)", section)
        if not relation_match:
            failures.append(f"RELATION_SECTION_REQUIRED:{page.a_id}")
        else:
            relation_body = relation_match.group(1)
            page.relation_ids = re.findall(r"\[(R\d{3})\]", relation_body)
            page.relation_carrier_ids = re.findall(r"(?m)^-\s+`?\[(R\d{3})\]`?：\s*\S+", relation_body)
            for relation_id in page.relation_ids:
                if relation_id not in page.relation_carrier_ids:
                    failures.append(f"RELATION_CARRIER_REQUIRED:{page.a_id}:{relation_id}")
        pages.append(page)
    if not pages:
        failures.append("ROUGH_PAGES_REQUIRED")
    return ParsedRoughV2(frontmatter=frontmatter, pages=pages, failures=failures)


def _parse_media(value: str) -> tuple[str | None, str | None]:
    value = value.replace("`", "").strip()
    if value == "none":
        return None, None
    match = re.fullmatch(r"(M\d{3})\s*/\s*([a-z_]+)", value)
    if not match:
        return "invalid", "invalid"
    return match.group(1), match.group(2)


def _screen_items(source_page: dict[str, Any]) -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]], list[str]]:
    screen = source_page.get("screen") if isinstance(source_page, dict) else {}
    screen = screen if isinstance(screen, dict) else {}
    title = screen.get("title")
    items: dict[str, dict[str, Any]] = {}
    groups: dict[str, dict[str, Any]] = {}
    title_id = []
    if isinstance(title, dict) and isinstance(title.get("screen_item_id"), str):
        items[title["screen_item_id"]] = title
        title_id.append(title["screen_item_id"])
    for group in screen.get("groups", []) if isinstance(screen.get("groups"), list) else []:
        if not isinstance(group, dict):
            continue
        group_id = group.get("group_id")
        if isinstance(group_id, str):
            groups[group_id] = group
        for item in group.get("items", []) if isinstance(group.get("items"), list) else []:
            if isinstance(item, dict) and isinstance(item.get("screen_item_id"), str):
                items[item["screen_item_id"]] = item
    return items, groups, title_id


def validate_visual_rough_v2(
    *,
    source_payload: dict[str, Any],
    source_sha256: str,
    rough_text: str,
    registry: dict[str, Any],
) -> dict[str, Any]:
    """Validate v2 recipe/slot bindings while keeping screen copy upstream."""
    parsed = parse_visual_rough_v2(rough_text)
    failures = list(parsed.failures)
    forbidden_patterns = {
        "fallback": r"(?i)fallback",
        "prompt": r"(?i)(image[_ -]?prompt|提示词)",
        "coordinates": r"(?i)(坐标|\bx\s*=|\by\s*=)",
        "asset_path": r"(?i)(file://|[A-Za-z]:\\|/assets/)",
        "redraw": r"(?i)(source-based redraw|source-based synthesis)",
    }
    for name, pattern in forbidden_patterns.items():
        if re.search(pattern, rough_text):
            failures.append(f"FORBIDDEN_VISUAL_DETAIL:{name}")

    frontmatter = parsed.frontmatter
    for key in sorted(REQUIRED_FRONTMATTER - set(frontmatter)):
        failures.append(f"FRONTMATTER_FIELD_REQUIRED:{key}")
    for key in sorted(set(frontmatter) - REQUIRED_FRONTMATTER):
        failures.append(f"FRONTMATTER_FIELD_UNKNOWN:{key}")
    if frontmatter.get("schema_version") != SCHEMA_VERSION_V2:
        failures.append("ROUGH_SCHEMA_VERSION_INVALID")
    if frontmatter.get("document_kind") not in {"candidate", "production"}:
        failures.append("ROUGH_DOCUMENT_KIND_INVALID")
    if source_payload.get("schema_version") != "courseplay-a-page/v5":
        failures.append("SOURCE_SCHEMA_VERSION_INVALID")
    if frontmatter.get("episode_id") != source_payload.get("episode_id"):
        failures.append("SOURCE_EPISODE_MISMATCH")
    if frontmatter.get("source_a_page_sha256", "").lower() != source_sha256.lower():
        failures.append("SOURCE_HASH_MISMATCH")
    if frontmatter.get("status") not in {"draft", "approved"}:
        failures.append("ROUGH_STATUS_INVALID")
    if frontmatter.get("image_required_page_fraction") != "1/3":
        failures.append("IMAGE_FRACTION_INVALID")
    if frontmatter.get("logic_diagram_page_limit") != "2":
        failures.append("LOGIC_DIAGRAM_LIMIT_INVALID")

    recipes = {
        item.get("recipe_id"): item
        for item in registry.get("recipes", [])
        if isinstance(item, dict) and isinstance(item.get("recipe_id"), str)
    }
    source_pages = source_payload.get("pages", [])
    expected_a_ids = [page.get("a_id") for page in source_pages if isinstance(page, dict)]
    actual_a_ids = [page.a_id for page in parsed.pages]
    if actual_a_ids != expected_a_ids:
        failures.append("ROUGH_A_SEQUENCE_INVALID")
    source_by_a = {page.get("a_id"): page for page in source_pages if isinstance(page, dict)}
    evidence_ids = {
        item.get("evidence_id")
        for item in source_payload.get("evidence_catalog", [])
        if isinstance(item, dict)
    }
    known_group_ids: set[str] = set()
    known_screen_ids: set[str] = set()
    media_ids: list[str] = []
    ai_count = 0
    textbook_count = 0
    logic_count = 0
    recipe_ids: list[str] = []

    for page in parsed.pages:
        source_page = source_by_a.get(page.a_id, {})
        source_items, source_groups, title_ids = _screen_items(source_page)
        expected_item_ids = set(source_items)
        expected_group_ids = list(source_groups)
        if page.fields.get("claim_headline") not in title_ids:
            failures.append(f"TITLE_SLOT_INVALID:{page.a_id}")
        if page.fields.get("supporting_line") not in {"none", *expected_item_ids}:
            failures.append(f"AUXILIARY_SLOT_INVALID:{page.a_id}")
        if page.group_ids != expected_group_ids:
            failures.append(f"CONTENT_GROUP_BINDING_INVALID:{page.a_id}")
        for group_id in page.group_ids:
            if group_id in known_group_ids:
                failures.append(f"CONTENT_GROUP_ID_DUPLICATE:{group_id}")
            known_group_ids.add(group_id)
            if group_id not in source_groups:
                failures.append(f"CONTENT_GROUP_UNKNOWN:{page.a_id}:{group_id}")
        media_slot_id, _ = _parse_media(page.fields.get("media_requirement", ""))
        expected_slot_ids = set(title_ids) | set(expected_group_ids)
        if media_slot_id is not None:
            expected_slot_ids.add(media_slot_id)
        actual_slot_ids = {source_id for _, source_id in page.slot_bindings if source_id != "none"}
        for source_id in sorted(expected_slot_ids - actual_slot_ids):
            failures.append(f"SLOT_BINDING_MISSING:{page.a_id}:{source_id}")
        for source_id in sorted(actual_slot_ids - expected_slot_ids):
            failures.append(f"SLOT_BINDING_UNKNOWN:{page.a_id}:{source_id}")
        for source_id in actual_slot_ids:
            if source_id.startswith("S") and source_id not in expected_item_ids:
                failures.append(f"SCREEN_ITEM_UNKNOWN:{page.a_id}:{source_id}")
        for screen_id, item in source_items.items():
            known_screen_ids.add(screen_id)
            source_text = item.get("source_text")
            if isinstance(source_text, str) and source_text and source_text in rough_text:
                failures.append(f"SOURCE_TEXT_DUPLICATED:{page.a_id}:{screen_id}")
            refs = item.get("evidence_refs")
            if not isinstance(refs, list) or not refs:
                failures.append(f"SCREEN_EVIDENCE_REFS_INVALID:{page.a_id}:{screen_id}")
            elif any(ref not in evidence_ids for ref in refs):
                failures.append(f"SCREEN_EVIDENCE_UNKNOWN:{page.a_id}:{screen_id}")
        if re.search(r"(?<![A-Za-z0-9])C\d{3}(?!\d)", page.slot_text):
            failures.append(f"SILENT_CONSTRAINT_VISIBLE_SLOT:{page.a_id}:skeleton")

        expected_relation_ids = {
            item.get("relation_id")
            for item in source_page.get("protected_relations", [])
            if isinstance(item, dict)
        }
        actual_relation_ids = set(page.relation_ids)
        for relation_id in sorted(actual_relation_ids - expected_relation_ids):
            failures.append(f"RELATION_UNKNOWN:{page.a_id}:{relation_id}")
        for relation_id in sorted(expected_relation_ids - actual_relation_ids):
            failures.append(f"RELATION_MISSING:{page.a_id}:{relation_id}")
        for relation_id in sorted(expected_relation_ids - set(page.relation_carrier_ids)):
            failures.append(f"RELATION_CARRIER_REQUIRED:{page.a_id}:{relation_id}")

        recipe_id = page.fields.get("recipe_id", "")
        recipe_ids.append(recipe_id)
        recipe = recipes.get(recipe_id)
        if recipe is None:
            failures.append(f"RECIPE_UNKNOWN:{page.a_id}:{recipe_id}")
            recipe = {}
        status = recipe.get("status")
        rough_status = frontmatter.get("status")
        if status == "blocked":
            failures.append(f"RECIPE_STATUS_FORBIDDEN:{page.a_id}:{status}")
        if status == "deprecated" and rough_status != "approved":
            failures.append(f"DEPRECATED_RECIPE_IN_NEW_DRAFT:{page.a_id}")
        if status == "experimental" and rough_status == "approved":
            failures.append(f"EXPERIMENTAL_RECIPE_IN_APPROVED:{page.a_id}")
        if status == "restricted" and not recipe.get("is_logic_diagram"):
            failures.append(f"RESTRICTED_RECIPE_INVALID:{page.a_id}")
        minimum = recipe.get("content_group_min")
        maximum = recipe.get("content_group_max")
        group_count = len(page.group_ids)
        if isinstance(minimum, int) and isinstance(maximum, int):
            # v2 groups may be containers: card-led recipes count their bound
            # items when a single group carries several learner-facing cards.
            item_count = sum(
                len(source_groups[group_id].get("items", []))
                for group_id in page.group_ids
                if isinstance(source_groups.get(group_id), dict)
            )
            effective_count = item_count if group_count == 1 or recipe_id.startswith("evidence-cards-") else group_count
            if not minimum <= effective_count <= maximum:
                failures.append(f"CONTENT_GROUP_COUNT_INVALID:{page.a_id}:{effective_count}:{minimum}-{maximum}")

        media_id, media_type = _parse_media(page.fields.get("media_requirement", ""))
        has_media = media_id not in {None, "invalid"}
        if media_id == "invalid" or media_type not in MEDIA_TYPES | {None}:
            failures.append(f"MEDIA_REQUIREMENT_INVALID:{page.a_id}")
        elif has_media:
            media_ids.append(media_id)  # type: ignore[arg-type]
            if media_type == "photorealistic_ai":
                ai_count += 1
                if page.fields.get("textbook_evidence") != "none":
                    failures.append(f"AI_EVIDENCE_FORBIDDEN:{page.a_id}")
            elif media_type == "textbook_original":
                textbook_count += 1
                evidence = page.fields.get("textbook_evidence")
                if evidence not in evidence_ids:
                    failures.append(f"TEXTBOOK_EVIDENCE_UNKNOWN:{page.a_id}:{evidence}")
        if recipe.get("media_mode") == "required" and not has_media:
            failures.append(f"RECIPE_MEDIA_REQUIRED:{page.a_id}")
        if recipe.get("media_mode") == "forbidden" and has_media:
            failures.append(f"RECIPE_MEDIA_FORBIDDEN:{page.a_id}")

        logic_value = page.fields.get("logic_diagram")
        if logic_value not in {"yes", "no"}:
            failures.append(f"LOGIC_DIAGRAM_VALUE_INVALID:{page.a_id}")
        if logic_value == "yes":
            logic_count += 1
            if not recipe.get("is_logic_diagram") or status != "restricted":
                failures.append(f"LOGIC_RECIPE_REQUIRED:{page.a_id}")
            if page.fields.get("logic_reason") in {None, "", "none"}:
                failures.append(f"LOGIC_REASON_REQUIRED:{page.a_id}")
            elif not re.search(r"分支|汇聚|非线性", page.fields.get("logic_reason", "")):
                failures.append(f"LOGIC_REASON_TOPOLOGY_INSUFFICIENT:{page.a_id}")
        elif recipe.get("is_logic_diagram"):
            failures.append(f"LOGIC_FLAG_REQUIRED:{page.a_id}")
        elif page.fields.get("logic_reason") not in {None, "", "none"}:
            failures.append(f"LOGIC_REASON_WITHOUT_DIAGRAM:{page.a_id}")

    page_count = len(expected_a_ids)
    required_images = math.ceil(page_count / 3)
    if len(media_ids) != required_images:
        failures.append(f"IMAGE_PAGE_COUNT_INVALID:{len(media_ids)}:{required_images}")
    expected_media_ids = [f"M{number:03d}" for number in range(1, required_images + 1)]
    if media_ids != expected_media_ids:
        failures.append("MEDIA_ID_SEQUENCE_INVALID")
    if len(set(media_ids)) != len(media_ids):
        failures.append("MEDIA_REUSE_FORBIDDEN")
    if ai_count <= required_images / 2:
        failures.append(f"AI_MAJORITY_REQUIRED:{ai_count}:{required_images}")
    if logic_count > 2:
        failures.append(f"LOGIC_DIAGRAM_LIMIT_EXCEEDED:{logic_count}:2")
    if len(recipe_ids) >= 10 and len(set(recipe_ids)) < 4:
        failures.append(f"RECIPE_DIVERSITY_INSUFFICIENT:{len(set(recipe_ids))}:4")
    for previous, current, page in zip(recipe_ids, recipe_ids[1:], parsed.pages[1:]):
        if previous == current:
            failures.append(f"ADJACENT_RECIPE_REPEAT:{page.a_id}:{current}")

    return {
        "episode_id": source_payload.get("episode_id"),
        "validation_profile": "visual-rough-v2",
        "schema_version": frontmatter.get("schema_version"),
        "status": frontmatter.get("status"),
        "a_pages": {"count": len(parsed.pages)},
        "screen_source": {
            "bound_item_count": len(known_screen_ids),
            "bound_group_count": len(known_group_ids),
            "source_text_copied": any(f.startswith("SOURCE_TEXT_DUPLICATED:") for f in failures),
        },
        "image_allocation": {
            "required_page_count": required_images,
            "assigned_page_count": len(media_ids),
            "media_requirement_count": len(media_ids),
            "photorealistic_ai_count": ai_count,
            "textbook_original_count": textbook_count,
            "reuse_allowed": False,
        },
        "logic_diagrams": {"page_limit": 2, "assigned_page_count": logic_count},
        "recipe_usage": {"distinct_count": len(set(recipe_ids)), "manual_registry": True},
        "failures": sorted(set(failures)),
    }


def validate_visual_rough_v3(
    *,
    source_payload: dict[str, Any],
    source_sha256: str,
    rough_text: str,
    registry: dict[str, Any],
) -> dict[str, Any]:
    """Validate v3 guidance bindings without changing the frozen v2 contract.

    v3 retains v2 media, recipe, relation-carrier and page checks. A-page v6
    guidance is projected into the frozen v5 source shape solely for reuse of
    those checks. The title S remains the page judgment direction, but no longer
    has to occupy a separate visible skeleton slot.
    """
    v3_failures: list[str] = []
    if source_payload.get("schema_version") != "courseplay-a-page/v6":
        v3_failures.append("SOURCE_SCHEMA_VERSION_INVALID")
    projected = copy.deepcopy(source_payload)
    projected["schema_version"] = "courseplay-a-page/v5"
    title_ids: set[str] = set()
    guidance_item_count = 0
    guidance_group_count = 0
    for page_index, page in enumerate(source_payload.get("pages", []) if isinstance(source_payload.get("pages"), list) else []):
        if not isinstance(page, dict):
            continue
        projected_page = projected["pages"][page_index]
        screen = page.get("screen") if isinstance(page.get("screen"), dict) else {}
        projected_screen = projected_page.get("screen") if isinstance(projected_page, dict) and isinstance(projected_page.get("screen"), dict) else {}
        title = screen.get("title")
        projected_title = projected_screen.get("title")
        if isinstance(title, dict) and isinstance(title.get("screen_item_id"), str):
            title_ids.add(title["screen_item_id"])
        item_pairs: list[tuple[Any, Any]] = [(title, projected_title)]
        groups = screen.get("groups") if isinstance(screen.get("groups"), list) else []
        projected_groups = projected_screen.get("groups") if isinstance(projected_screen.get("groups"), list) else []
        guidance_group_count += len(groups)
        for group_index, group in enumerate(groups):
            if not isinstance(group, dict) or group_index >= len(projected_groups) or not isinstance(projected_groups[group_index], dict):
                continue
            items = group.get("items") if isinstance(group.get("items"), list) else []
            projected_items = projected_groups[group_index].get("items") if isinstance(projected_groups[group_index].get("items"), list) else []
            for item_index, item in enumerate(items):
                projected_item = projected_items[item_index] if item_index < len(projected_items) else None
                item_pairs.append((item, projected_item))
        for item, projected_item in item_pairs:
            if not isinstance(item, dict) or not isinstance(projected_item, dict):
                continue
            guidance_item_count += 1
            projected_item.pop("guidance_text", None)
            projected_item.pop("usage_policy", None)
            projected_item["source_text"] = item.get("guidance_text")
            projected_item["edit_policy"] = "exact" if item.get("usage_policy") == "exact" else "adaptable"

    projected_rough = re.sub(
        r"(?m)^(schema_version:\s*)courseplay-visual-rough/v3(\s*)$",
        r"\1courseplay-visual-rough/v2\2",
        rough_text,
        count=1,
    )
    report = validate_visual_rough_v2(
        source_payload=projected,
        source_sha256=source_sha256,
        rough_text=projected_rough,
        registry=registry,
    )
    failures = [
        failure
        for failure in report["failures"]
        if not any(failure.endswith(f":{title_id}") for title_id in title_ids)
        or not failure.startswith("SLOT_BINDING_MISSING:")
    ]
    parsed_v3 = parse_visual_rough(rough_text)
    for page in parsed_v3.pages:
        seen_relation_carriers: set[str] = set()
        for relation_id in page.relation_carrier_ids:
            if relation_id in seen_relation_carriers:
                failures.append(
                    f"RELATION_CARRIER_DUPLICATE:{page.a_id}:{relation_id}"
                )
            seen_relation_carriers.add(relation_id)
    source_copy_failure = any(failure.startswith("SOURCE_TEXT_DUPLICATED:") for failure in failures)
    report.update(
        {
            "validation_profile": "visual-rough-v3",
            "schema_version": SCHEMA_VERSION_V3,
            "screen_guidance": {
                "item_count": guidance_item_count,
                "group_count": guidance_group_count,
                "guidance_text_copied": source_copy_failure,
                "groups_considered_in_rough_only": True,
            },
            "failures": sorted(set(failures + v3_failures)),
        }
    )
    report.pop("screen_source", None)
    return report


def validate_visual_rough(
    *,
    source_payload: dict[str, Any],
    source_sha256: str,
    rough_text: str,
    registry: dict[str, Any],
) -> dict[str, Any]:
    frontmatter, _, _ = _parse_frontmatter(rough_text)
    if frontmatter.get("schema_version") == SCHEMA_VERSION_V3:
        return validate_visual_rough_v3(
            source_payload=source_payload,
            source_sha256=source_sha256,
            rough_text=rough_text,
            registry=registry,
        )
    if frontmatter.get("schema_version") == SCHEMA_VERSION_V2:
        return validate_visual_rough_v2(
            source_payload=source_payload,
            source_sha256=source_sha256,
            rough_text=rough_text,
            registry=registry,
        )
    parsed = parse_visual_rough(rough_text)
    failures = list(parsed.failures)
    forbidden_patterns = {
        "fallback": r"(?i)fallback",
        "prompt": r"(?i)(image[_ -]?prompt|提示词)",
        "coordinates": r"(?i)(坐标|\bx\s*=|\by\s*=)",
        "asset_path": r"(?i)(file://|[A-Za-z]:\\|/assets/)",
        "redraw": r"(?i)(source-based redraw|source-based synthesis)",
    }
    for name, pattern in forbidden_patterns.items():
        if re.search(pattern, rough_text):
            failures.append(f"FORBIDDEN_VISUAL_DETAIL:{name}")
    frontmatter = parsed.frontmatter
    for key in sorted(REQUIRED_FRONTMATTER - set(frontmatter)):
        failures.append(f"FRONTMATTER_FIELD_REQUIRED:{key}")
    for key in sorted(set(frontmatter) - REQUIRED_FRONTMATTER):
        failures.append(f"FRONTMATTER_FIELD_UNKNOWN:{key}")
    if frontmatter.get("schema_version") != SCHEMA_VERSION:
        failures.append("ROUGH_SCHEMA_VERSION_INVALID")
    if frontmatter.get("document_kind") != "production":
        failures.append("ROUGH_DOCUMENT_KIND_INVALID")
    if source_payload.get("schema_version") != "courseplay-a-page/v4":
        failures.append("SOURCE_SCHEMA_VERSION_INVALID")
    if frontmatter.get("episode_id") != source_payload.get("episode_id"):
        failures.append("SOURCE_EPISODE_MISMATCH")
    if frontmatter.get("source_a_page_sha256", "").lower() != source_sha256.lower():
        failures.append("SOURCE_HASH_MISMATCH")
    if frontmatter.get("status") not in {"draft", "approved"}:
        failures.append("ROUGH_STATUS_INVALID")
    if frontmatter.get("image_required_page_fraction") != "1/3":
        failures.append("IMAGE_FRACTION_INVALID")
    if frontmatter.get("logic_diagram_page_limit") != "2":
        failures.append("LOGIC_DIAGRAM_LIMIT_INVALID")

    recipes = {
        item.get("recipe_id"): item
        for item in registry.get("recipes", [])
        if isinstance(item, dict) and isinstance(item.get("recipe_id"), str)
    }
    source_pages = source_payload.get("pages", [])
    expected_a_ids = [page.get("a_id") for page in source_pages if isinstance(page, dict)]
    actual_a_ids = [page.a_id for page in parsed.pages]
    if actual_a_ids != expected_a_ids:
        failures.append("ROUGH_A_SEQUENCE_INVALID")
    source_by_a = {
        page.get("a_id"): page for page in source_pages if isinstance(page, dict)
    }
    evidence_ids = {
        item.get("evidence_id")
        for item in source_payload.get("evidence_catalog", [])
        if isinstance(item, dict)
    }

    media_ids: list[str] = []
    ai_count = 0
    textbook_count = 0
    logic_count = 0
    recipe_ids: list[str] = []
    for page in parsed.pages:
        source_page = source_by_a.get(page.a_id, {})
        expected_v = {
            item.get("semantic_item_id")
            for item in source_page.get("must_visible", [])
            if isinstance(item, dict)
        }
        actual_v = set(page.semantic_ids)
        for semantic_id in sorted(actual_v - expected_v):
            failures.append(f"SEMANTIC_ITEM_UNKNOWN:{page.a_id}:{semantic_id}")
        for semantic_id in sorted(expected_v - actual_v):
            failures.append(f"SEMANTIC_ITEM_MISSING:{page.a_id}:{semantic_id}")
        expected_r = {
            item.get("relation_id")
            for item in source_page.get("protected_relations", [])
            if isinstance(item, dict)
        }
        actual_r = set(page.relation_ids)
        for relation_id in sorted(actual_r - expected_r):
            failures.append(f"RELATION_UNKNOWN:{page.a_id}:{relation_id}")
        for relation_id in sorted(expected_r - actual_r):
            failures.append(f"RELATION_MISSING:{page.a_id}:{relation_id}")
        for relation_id in sorted(set(page.visible_relation_ids) - expected_r):
            failures.append(
                f"VISIBLE_RELATION_UNKNOWN:{page.a_id}:{relation_id}"
            )

        recipe_id = page.fields.get("recipe_id", "")
        recipe_ids.append(recipe_id)
        recipe = recipes.get(recipe_id)
        if recipe is None:
            failures.append(f"RECIPE_UNKNOWN:{page.a_id}:{recipe_id}")
            recipe = {}
        status = recipe.get("status")
        rough_status = frontmatter.get("status")
        if status == "blocked":
            failures.append(f"RECIPE_STATUS_FORBIDDEN:{page.a_id}:{status}")
        if status == "deprecated" and rough_status != "approved":
            failures.append(f"DEPRECATED_RECIPE_IN_NEW_DRAFT:{page.a_id}")
        if status == "experimental" and rough_status == "approved":
            failures.append(f"EXPERIMENTAL_RECIPE_IN_APPROVED:{page.a_id}")
        if status == "restricted" and not recipe.get("is_logic_diagram"):
            failures.append(f"RESTRICTED_RECIPE_INVALID:{page.a_id}")
        minimum = recipe.get("content_group_min")
        maximum = recipe.get("content_group_max")
        if isinstance(minimum, int) and isinstance(maximum, int):
            if not minimum <= page.content_group_count <= maximum:
                failures.append(
                    f"CONTENT_GROUP_COUNT_INVALID:{page.a_id}:{page.content_group_count}:{minimum}-{maximum}"
                )

        media_id, media_type = _parse_media(page.fields.get("media_requirement", ""))
        has_media = media_id not in {None, "invalid"}
        if media_id == "invalid" or media_type not in MEDIA_TYPES | {None}:
            failures.append(f"MEDIA_REQUIREMENT_INVALID:{page.a_id}")
        elif has_media:
            media_ids.append(media_id)  # type: ignore[arg-type]
            if media_type == "photorealistic_ai":
                ai_count += 1
                if page.fields.get("textbook_evidence") != "none":
                    failures.append(f"AI_EVIDENCE_FORBIDDEN:{page.a_id}")
            elif media_type == "textbook_original":
                textbook_count += 1
                evidence = page.fields.get("textbook_evidence")
                if evidence not in evidence_ids:
                    failures.append(f"TEXTBOOK_EVIDENCE_UNKNOWN:{page.a_id}:{evidence}")
        if recipe.get("media_mode") == "required" and not has_media:
            failures.append(f"RECIPE_MEDIA_REQUIRED:{page.a_id}")
        if recipe.get("media_mode") == "forbidden" and has_media:
            failures.append(f"RECIPE_MEDIA_FORBIDDEN:{page.a_id}")

        logic_value = page.fields.get("logic_diagram")
        if logic_value not in {"yes", "no"}:
            failures.append(f"LOGIC_DIAGRAM_VALUE_INVALID:{page.a_id}")
        if logic_value == "yes":
            logic_count += 1
            if not recipe.get("is_logic_diagram") or status != "restricted":
                failures.append(f"LOGIC_RECIPE_REQUIRED:{page.a_id}")
            if page.fields.get("logic_reason") in {None, "", "none"}:
                failures.append(f"LOGIC_REASON_REQUIRED:{page.a_id}")
            elif not re.search(r"分支|汇聚|非线性", page.fields.get("logic_reason", "")):
                failures.append(f"LOGIC_REASON_TOPOLOGY_INSUFFICIENT:{page.a_id}")
        else:
            if recipe.get("is_logic_diagram"):
                failures.append(f"LOGIC_FLAG_REQUIRED:{page.a_id}")
            if page.fields.get("logic_reason") not in {None, "", "none"}:
                failures.append(f"LOGIC_REASON_WITHOUT_DIAGRAM:{page.a_id}")

    page_count = len(expected_a_ids)
    required_images = math.ceil(page_count / 3)
    if len(media_ids) != required_images:
        failures.append(f"IMAGE_PAGE_COUNT_INVALID:{len(media_ids)}:{required_images}")
    expected_media_ids = [f"M{number:03d}" for number in range(1, required_images + 1)]
    if media_ids != expected_media_ids:
        failures.append("MEDIA_ID_SEQUENCE_INVALID")
    if len(set(media_ids)) != len(media_ids):
        failures.append("MEDIA_REUSE_FORBIDDEN")
    if ai_count <= required_images / 2:
        failures.append(f"AI_MAJORITY_REQUIRED:{ai_count}:{required_images}")
    if logic_count > 2:
        failures.append(f"LOGIC_DIAGRAM_LIMIT_EXCEEDED:{logic_count}:2")
    if len(recipe_ids) >= 10 and len(set(recipe_ids)) < 4:
        failures.append(f"RECIPE_DIVERSITY_INSUFFICIENT:{len(set(recipe_ids))}:4")
    for previous, current, page in zip(recipe_ids, recipe_ids[1:], parsed.pages[1:]):
        if previous == current:
            failures.append(f"ADJACENT_RECIPE_REPEAT:{page.a_id}:{current}")

    return {
        "episode_id": source_payload.get("episode_id"),
        "validation_profile": "visual-rough-v1",
        "schema_version": frontmatter.get("schema_version"),
        "status": frontmatter.get("status"),
        "a_pages": {"count": len(parsed.pages)},
        "image_allocation": {
            "required_page_count": required_images,
            "assigned_page_count": len(media_ids),
            "media_requirement_count": len(media_ids),
            "photorealistic_ai_count": ai_count,
            "textbook_original_count": textbook_count,
            "reuse_allowed": False,
        },
        "logic_diagrams": {
            "page_limit": 2,
            "assigned_page_count": logic_count,
        },
        "recipe_usage": {
            "distinct_count": len(set(recipe_ids)),
            "manual_registry": True,
        },
        "failures": sorted(set(failures)),
    }
