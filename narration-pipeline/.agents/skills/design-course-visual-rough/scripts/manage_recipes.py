"""Manage human-maintained Courseplay page-recipe Markdown files."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

from recipe_library import (
    RECIPE_ID_PATTERN,
    RECIPE_STATUSES,
    compute_definition_sha256,
    load_recipe_directory,
    parse_recipe_markdown,
    render_recipe_markdown,
)

TEMPLATE_PATH = Path(__file__).resolve().parents[1] / "templates" / "page-recipe-template.md"


def _recipe_path(recipes_dir: Path, recipe_id: str) -> Path:
    if not RECIPE_ID_PATTERN.fullmatch(recipe_id):
        raise ValueError("RECIPE_ID_INVALID")
    return recipes_dir / f"{recipe_id}.md"


def _read_valid_recipe(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise ValueError("RECIPE_NOT_FOUND")
    recipe, failures = parse_recipe_markdown(path)
    if failures:
        raise ValueError(failures[0])
    return recipe


def _write_recipe(path: Path, recipe: dict[str, Any]) -> None:
    temporary = path.with_suffix(".md.tmp")
    temporary.write_text(render_recipe_markdown(recipe), encoding="utf-8")
    temporary.replace(path)


def _usage_root(recipes_dir: Path) -> Path:
    for ancestor in recipes_dir.resolve().parents:
        if ancestor.name == ".agents":
            return ancestor.parent
    return recipes_dir.resolve().parent


def _is_referenced(recipes_dir: Path, recipe_id: str) -> bool:
    root = _usage_root(recipes_dir)
    recipe_root = recipes_dir.resolve()
    pattern = re.compile(
        rf"(?m)^- \*\*页面配方\*\*：`{re.escape(recipe_id)}`\s*$"
    )
    for path in root.rglob("*.md"):
        try:
            if recipe_root in path.resolve().parents:
                continue
            if pattern.search(path.read_text(encoding="utf-8")):
                return True
        except (OSError, UnicodeError):
            continue
    return False


def _new_recipe(args: argparse.Namespace) -> int:
    path = _recipe_path(args.recipes_dir, args.recipe_id)
    if path.exists():
        raise ValueError("RECIPE_ID_DUPLICATE")
    args.recipes_dir.mkdir(parents=True, exist_ok=True)
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    path.write_text(template.replace("<recipe-id>", args.recipe_id), encoding="utf-8")
    print(f"CREATED {path} status=experimental")
    return 0


def _set_status(args: argparse.Namespace) -> int:
    path = _recipe_path(args.recipes_dir, args.recipe_id)
    recipe = _read_valid_recipe(path)
    current = recipe["status"]
    allowed = {
        "experimental": {"active", "restricted", "deprecated", "blocked"},
        "active": {"deprecated", "blocked"},
        "restricted": {"deprecated", "blocked"},
        "deprecated": {"blocked"},
        "blocked": set(),
    }
    if args.status == current:
        print(f"STATUS {args.recipe_id}={args.status}")
        return 0
    if args.status not in allowed[current]:
        raise ValueError(f"RECIPE_STATUS_TRANSITION_INVALID:{current}:{args.status}")
    if args.status == "active" and recipe["is_logic_diagram"]:
        raise ValueError("LOGIC_RECIPE_REQUIRES_RESTRICTED")
    if args.status == "restricted" and not recipe["is_logic_diagram"]:
        raise ValueError("RESTRICTED_REQUIRES_LOGIC_RECIPE")
    recipe["status"] = args.status
    if args.status in {"active", "restricted"}:
        recipe["definition_sha256"] = compute_definition_sha256(recipe)
    elif recipe["definition_sha256"] == "pending":
        recipe["definition_sha256"] = compute_definition_sha256(recipe)
    _write_recipe(path, recipe)
    print(f"STATUS {args.recipe_id}={args.status}")
    return 0


def _remove_recipe(args: argparse.Namespace) -> int:
    path = _recipe_path(args.recipes_dir, args.recipe_id)
    recipe = _read_valid_recipe(path)
    if recipe.get("status") != "experimental":
        raise ValueError("RECIPE_REMOVE_REQUIRES_EXPERIMENTAL")
    if recipe.get("definition_sha256") != "pending":
        raise ValueError("RECIPE_REMOVE_REQUIRES_NEVER_ACTIVATED")
    if _is_referenced(args.recipes_dir, args.recipe_id):
        raise ValueError("RECIPE_REMOVE_REFERENCED")
    path.unlink()
    print(f"REMOVED {args.recipe_id}")
    return 0


def _clone_recipe(args: argparse.Namespace) -> int:
    source = _read_valid_recipe(_recipe_path(args.recipes_dir, args.recipe_id))
    destination = _recipe_path(args.recipes_dir, args.new_recipe_id)
    if destination.exists():
        raise ValueError("RECIPE_ID_DUPLICATE")
    source["recipe_id"] = args.new_recipe_id
    source["status"] = "experimental"
    source["definition_sha256"] = "pending"
    _write_recipe(destination, source)
    print(f"CLONED {args.recipe_id}->{args.new_recipe_id} status=experimental")
    return 0


def _validate_registry_command(args: argparse.Namespace) -> int:
    payload, failures, digest = load_recipe_directory(args.recipes_dir)
    if failures:
        for failure in failures:
            print(f"FAIL {failure}", file=sys.stderr)
        return 1
    print(f"PASS recipes={len(payload['recipes'])} sha256={digest}")
    return 0


def _list_recipes(args: argparse.Namespace) -> int:
    payload, failures, _ = load_recipe_directory(args.recipes_dir)
    if failures:
        raise ValueError(failures[0])
    for recipe in payload["recipes"]:
        print(
            f"{recipe['recipe_id']}\t{recipe['status']}\t"
            f"groups={recipe['content_group_min']}-{recipe['content_group_max']}\t"
            f"media={recipe['media_mode']}\tlogic={str(recipe['is_logic_diagram']).lower()}"
        )
    return 0


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Manage Courseplay page recipes.")
    parser.add_argument("--recipes-dir", type=Path, required=True)
    subparsers = parser.add_subparsers(dest="command", required=True)
    new_parser = subparsers.add_parser("new", help="Scaffold an experimental recipe.")
    new_parser.add_argument("--recipe-id", required=True)
    new_parser.set_defaults(handler=_new_recipe)
    status_parser = subparsers.add_parser(
        "set-status", help="Activate, restrict, deprecate, or block a recipe."
    )
    status_parser.add_argument("--recipe-id", required=True)
    status_parser.add_argument("--status", choices=RECIPE_STATUSES, required=True)
    status_parser.set_defaults(handler=_set_status)
    remove_parser = subparsers.add_parser(
        "remove", help="Remove an experimental recipe that was never activated."
    )
    remove_parser.add_argument("--recipe-id", required=True)
    remove_parser.set_defaults(handler=_remove_recipe)
    clone_parser = subparsers.add_parser(
        "clone", help="Clone any valid recipe into a new experimental recipe."
    )
    clone_parser.add_argument("--recipe-id", required=True)
    clone_parser.add_argument("--new-recipe-id", required=True)
    clone_parser.set_defaults(handler=_clone_recipe)
    validate_parser = subparsers.add_parser("validate", help="Validate the registry.")
    validate_parser.set_defaults(handler=_validate_registry_command)
    list_parser = subparsers.add_parser("list", help="List recipe IDs and lifecycle states.")
    list_parser.set_defaults(handler=_list_recipes)
    return parser


def main() -> int:
    parser = _build_parser()
    args = parser.parse_args()
    try:
        return args.handler(args)
    except (OSError, UnicodeError, ValueError) as exc:
        print(f"FAIL {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
