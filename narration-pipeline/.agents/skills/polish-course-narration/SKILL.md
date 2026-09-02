---
name: polish-course-narration
description: Use when polishing course narration in the separate outputs/narration-scripts-polished directory while keeping task-package and original narration inputs immutable.
---

# Polish Course Narration

## Workflow

1. Read the content contract, the current task package, the original narration, and the polished copy completely.
2. Initialize the 51-file polished directory only when it does not exist; use `--resume` only for an interrupted byte-identical initialization.
3. Work on exactly one polished episode file.
4. Edit only its N-segment body and preserve all task-package facts and visual anchors.
5. Run `validate_narration.py --episode XX`.
6. Read the complete polished episode aloud and check it against the task package.
7. Commit only that polished episode. Use `git diff` to resume interrupted work.

## Canonical commands

Run these commands from the repository root:

```powershell
python '.agents\skills\polish-course-narration\scripts\initialize_polished.py' --repo-root . --snapshot work\narration-polish-v1\baseline-sha256.json
python '.agents\skills\polish-course-narration\scripts\validate_narration.py' --repo-root . --snapshot work\narration-polish-v1\baseline-sha256.json --episode XX
python '.agents\skills\polish-course-narration\scripts\validate_narration.py' --repo-root . --snapshot work\narration-polish-v1\baseline-sha256.json --all
```

Add `--resume` to the initializer only when a byte-identical initialization was interrupted.

## Stop rules

Stop and report when an input hash changes, task-package facts conflict with the original, N mapping is ambiguous, or validation fails. Never repair frozen inputs in this workflow.
