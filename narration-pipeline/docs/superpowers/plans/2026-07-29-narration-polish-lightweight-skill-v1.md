# Narration Polish Lightweight Skill V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abandoned transaction-heavy narration workflow with a small project-local Skill that copies 51 read-only originals into a separate directory, edits one polished file at a time, and runs deterministic structural checks.

**Architecture:** Keep the existing parsing/hash helper, add one initializer and one validator, and use Git as the recovery/history mechanism. Store only a simple SHA-256 snapshot of immutable inputs; do not build a state machine, manifest chain, lock protocol, reviewer identity system, or crash-recovery subsystem.

**Tech Stack:** Python 3.13 standard library, `unittest`, UTF-8 Markdown, JSON, SHA-256, Git, project-local Codex Skill metadata.

## Global Constraints

- The content contract is `docs/superpowers/specs/2026-07-28-narration-script-full-polish-design.md`.
- The execution contract is `docs/superpowers/specs/2026-07-29-narration-polish-lightweight-skill-v1-design.md`.
- Never modify any file under `episodes/` or `outputs/narration-scripts/`.
- Write narration content only under `outputs/narration-scripts-polished/`.
- Keep the five-module structure, counts `13, 7, 12, 10, 9`, and episode sequence 01–51.
- Use only Python standard library and `python -m unittest`.
- Use Git commits and `git diff` for history and interruption recovery.
- Preserve unrelated staged and unstaged repository changes; every commit uses explicit paths.
- Do not implement state machines, manifests, locks, transaction logs, reviewer identities, retry counters, or automatic rollback.
- Never execute either obsolete plan: `2026-07-29-narration-script-full-polish.md` or `2026-07-29-narration-polish-execution-skill.md`.

## File Map

- Modify: `.agents/skills/polish-course-narration/SKILL.md`
- Modify: `.agents/skills/polish-course-narration/agents/openai.yaml`
- Keep: `.agents/skills/polish-course-narration/scripts/narration_core.py`
- Create: `.agents/skills/polish-course-narration/scripts/initialize_polished.py`
- Create: `.agents/skills/polish-course-narration/scripts/validate_narration.py`
- Keep/modify: `.agents/skills/polish-course-narration/tests/test_narration_core.py`
- Create: `.agents/skills/polish-course-narration/tests/test_initialize_polished.py`
- Create: `.agents/skills/polish-course-narration/tests/test_validate_narration.py`
- Delete: `.agents/skills/polish-course-narration/scripts/atomic_io.py`
- Delete: `.agents/skills/polish-course-narration/scripts/init_batch.py`
- Delete: `.agents/skills/polish-course-narration/tests/test_atomic_io.py`
- Delete: `.agents/skills/polish-course-narration/tests/test_init_batch.py`
- Create at runtime: `work/narration-polish-v1/baseline-sha256.json`
- Create at runtime: `outputs/narration-scripts-polished/**/*.md`

---

### Task 1: Remove the abandoned execution machinery and rewrite the Skill contract

**Files:**
- Modify: `.agents/skills/polish-course-narration/SKILL.md`
- Modify: `.agents/skills/polish-course-narration/agents/openai.yaml`
- Delete: `.agents/skills/polish-course-narration/scripts/atomic_io.py`
- Delete: `.agents/skills/polish-course-narration/scripts/init_batch.py`
- Delete: `.agents/skills/polish-course-narration/tests/test_atomic_io.py`
- Delete: `.agents/skills/polish-course-narration/tests/test_init_batch.py`

**Interfaces:**
- Consumes: the lightweight V1 design and existing `narration_core.py`.
- Produces: a discoverable Skill with one direct per-episode workflow and no state-machine language.

- [ ] **Step 1: Record the exact abandoned-file scope**

```powershell
git status --short -- '.agents/skills/polish-course-narration'
git diff -- '.agents/skills/polish-course-narration/scripts/init_batch.py' '.agents/skills/polish-course-narration/tests/test_init_batch.py'
```

Expected: only the interrupted Task 5 files have uncommitted Skill changes. Do not reset the repository or touch files outside the Skill.

- [ ] **Step 2: Delete only the four transaction-heavy files**

Use `apply_patch` file deletions for the four exact paths above. Git history retains the abandoned implementation; do not create a backup file.

- [ ] **Step 3: Replace `SKILL.md` with the lightweight contract**

The new body must contain this exact workflow:

```markdown
## Workflow

1. Read the content contract, the current task package, the original narration, and the polished copy completely.
2. Initialize the 51-file polished directory only when it does not exist; use `--resume` only for an interrupted byte-identical initialization.
3. Work on exactly one polished episode file.
4. Edit only its N-segment body and preserve all task-package facts and visual anchors.
5. Run `validate_narration.py --episode XX`.
6. Read the complete polished episode aloud and check it against the task package.
7. Commit only that polished episode. Use `git diff` to resume interrupted work.

## Stop rules

Stop and report when an input hash changes, task-package facts conflict with the original, N mapping is ambiguous, or validation fails. Never repair frozen inputs in this workflow.
```

Frontmatter description starts with `Use when` and names the course narration, separate polished directory, and immutable task-package/original inputs.

- [ ] **Step 4: Regenerate and validate metadata**

```powershell
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\generate_openai_yaml.py' '.agents\skills\polish-course-narration' `
  --interface 'display_name=Course Narration Polisher' `
  --interface 'short_description=在独立目录逐集润色并校验课程口播' `
  --interface 'default_prompt=Use $polish-course-narration to polish one episode in the separate narration output directory.'
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\polish-course-narration'
```

Expected: `Skill is valid!`; no `run-state`, `SEMANTIC_PASS`, `transaction`, `manifest`, `lock`, or `reviewer_id` remains in the Skill directory.

- [ ] **Step 5: Commit the simplification only**

```powershell
git add -- .agents/skills/polish-course-narration
git commit --only -m "refactor: simplify narration polish skill" -- .agents/skills/polish-course-narration
```

---

### Task 2: Implement safe one-time copying and the input hash snapshot

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/initialize_polished.py`
- Create: `.agents/skills/polish-course-narration/tests/test_initialize_polished.py`

**Interfaces:**
- Consumes: `discover_episode_paths(repo_root, expected_count)` and `sha256_path(path)` from `narration_core.py`.
- Produces: `initialize(repo_root: Path, snapshot_path: Path, expected_count: int = 51, resume: bool = False) -> dict`.

- [ ] **Step 1: Write failing initialization tests**

```python
def test_initializes_complete_byte_identical_tree(self):
    result = initialize(self.repo, self.snapshot, expected_count=2)
    self.assertEqual(result["copied"], 2)
    self.assertEqual(self.original(1).read_bytes(), self.polished(1).read_bytes())
    self.assertEqual(len(json.loads(self.snapshot.read_text(encoding="utf-8"))["inputs"]), 4)

def test_refuses_existing_output_without_resume(self):
    self.polished(1).parent.mkdir(parents=True)
    self.polished(1).write_text("existing", encoding="utf-8")
    with self.assertRaisesRegex(ValueError, "already exists"):
        initialize(self.repo, self.snapshot, expected_count=2)

def test_resume_only_fills_missing_byte_identical_files(self):
    initialize(self.repo, self.snapshot, expected_count=2)
    self.polished(2).unlink()
    result = initialize(self.repo, self.snapshot, expected_count=2, resume=True)
    self.assertEqual(result["copied"], 1)

def test_resume_refuses_changed_existing_copy(self):
    initialize(self.repo, self.snapshot, expected_count=2)
    self.polished(1).write_text("edited", encoding="utf-8")
    with self.assertRaisesRegex(ValueError, "not byte-identical"):
        initialize(self.repo, self.snapshot, expected_count=2, resume=True)
```

- [ ] **Step 2: Run RED**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_initialize_polished.py' -v
```

Expected: import failure because `initialize_polished.py` does not exist.

- [ ] **Step 3: Implement only copy, resume, and snapshot behavior**

Implementation rules:

```python
def initialize(repo_root, snapshot_path, expected_count=51, resume=False):
    pairs = discover_episode_paths(Path(repo_root), expected_count)
    output_root = Path(repo_root) / "outputs" / "narration-scripts-polished"
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
    snapshot_path.write_text(json.dumps({"schema_version": 1, "inputs": inputs}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"copied": copied, "total": len(pairs)}
```

`snapshot_inputs` records sorted task-package and original-narration entries with only `path` and `sha256`. Do not add approvals, state, timestamps, locks, temp trees, or recovery records.

- [ ] **Step 4: Add CLI and run GREEN**

```powershell
python '.agents\skills\polish-course-narration\scripts\initialize_polished.py' --repo-root '.' --snapshot 'work\narration-polish-v1\baseline-sha256.json'
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_initialize_polished.py' -v
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
```

The CLI also accepts `--resume`; no overwrite or force option exists.

- [ ] **Step 5: Commit**

```powershell
git add -- .agents/skills/polish-course-narration/scripts/initialize_polished.py .agents/skills/polish-course-narration/tests/test_initialize_polished.py
git commit --only -m "feat: initialize polished narration copies" -- .agents/skills/polish-course-narration/scripts/initialize_polished.py .agents/skills/polish-course-narration/tests/test_initialize_polished.py
```

---

### Task 3: Implement one deterministic validator for episode and batch modes

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/validate_narration.py`
- Create: `.agents/skills/polish-course-narration/tests/test_validate_narration.py`

**Interfaces:**
- Consumes: `parse_narration`, `numeric_tokens`, `discover_episode_paths`, `sha256_path`, and `baseline-sha256.json`.
- Produces: `validate_episode(pair: EpisodePaths) -> tuple[str, ...]`, `validate_inputs(repo_root: Path, snapshot_path: Path) -> tuple[str, ...]`, and `validate_batch(...) -> tuple[str, ...]`.

- [ ] **Step 1: Write failing validation tests**

```python
def test_episode_passes_for_identical_copy(self):
    self.assertEqual(validate_episode(self.pair), ())

def test_episode_rejects_changed_n_sequence(self):
    self.polished.write_text(self.polished.read_text(encoding="utf-8").replace("[N002]", "[N003]"), encoding="utf-8")
    self.assertIn("N_SEQUENCE", validate_episode(self.pair))

def test_episode_rejects_prefix_suffix_and_number_changes(self):
    text = self.polished.read_text(encoding="utf-8").replace("2021", "2022")
    self.polished.write_text("changed\n" + text, encoding="utf-8")
    findings = validate_episode(self.pair)
    self.assertIn("OUTSIDE_N_CHANGED", findings)
    self.assertIn("NUMBERS_CHANGED:N001", findings)

def test_inputs_reject_changed_task_package(self):
    self.task.write_text(self.task.read_text(encoding="utf-8") + "changed", encoding="utf-8")
    self.assertIn("INPUT_CHANGED", validate_inputs(self.repo, self.snapshot))

def test_batch_rejects_missing_and_extra_polished_files(self):
    self.polished.unlink()
    (self.polished_root / "extra.md").write_text("extra", encoding="utf-8")
    findings = validate_batch(self.repo, self.snapshot, expected_count=2)
    self.assertIn("POLISHED_PATH_SET", findings)
```

- [ ] **Step 2: Run RED**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_validate_narration.py' -v
```

Expected: import failure because `validate_narration.py` does not exist.

- [ ] **Step 3: Implement the exact deterministic checks**

For each episode:

```python
original = parse_narration(pair.original_narration.read_text(encoding="utf-8"))
polished = parse_narration(pair.polished_narration.read_text(encoding="utf-8"))
```

Return stable finding codes for:

- `N_SEQUENCE`: ID tuple differs.
- `OUTSIDE_N_CHANGED`: prefix or suffix differs.
- `EMPTY_SEGMENT:Nxxx`: polished segment is empty.
- `NUMBERS_CHANGED:Nxxx`: normalized numeric token tuple differs in that segment.
- `FORBIDDEN_META_TERM:<term>`: polished N body contains `教材`, `本任务包`, `脚本设计`, `后续制作`, `PPT 制作`, `PPT制作`, or `审核通过`.
- `INPUT_CHANGED`: any snapshot path is missing or its SHA-256 differs.
- `POLISHED_PATH_SET`: expected and actual polished relative paths differ.

Do not claim automated fact equivalence, semantic equivalence, reviewer approval, or visual-anchor proof.

- [ ] **Step 4: Add episode/all CLI modes and run GREEN**

```powershell
python '.agents\skills\polish-course-narration\scripts\validate_narration.py' --repo-root '.' --snapshot 'work\narration-polish-v1\baseline-sha256.json' --episode 1
python '.agents\skills\polish-course-narration\scripts\validate_narration.py' --repo-root '.' --snapshot 'work\narration-polish-v1\baseline-sha256.json' --all
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_validate_narration.py' -v
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
```

Expected: exit 0 and `PASS` when no finding exists; nonzero exit and one stable finding per line otherwise.

Both CLI modes run `validate_inputs` first. `--episode` then validates only the selected polished file; `--all` is reserved for final whole-course validation after all 51 files have been polished.

- [ ] **Step 5: Commit**

```powershell
git add -- .agents/skills/polish-course-narration/scripts/validate_narration.py .agents/skills/polish-course-narration/tests/test_validate_narration.py
git commit --only -m "feat: validate polished narration files" -- .agents/skills/polish-course-narration/scripts/validate_narration.py .agents/skills/polish-course-narration/tests/test_validate_narration.py
```

---

### Task 4: Initialize the real copies and complete one direct-edit pilot

**Files:**
- Create: `outputs/narration-scripts-polished/**/*.md`
- Create: `work/narration-polish-v1/baseline-sha256.json`
- Modify: `outputs/narration-scripts-polished/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md`

**Interfaces:**
- Consumes: the completed lightweight Skill, content contract, episode 01 task package, and original narration.
- Produces: 51 independent copies plus one validated, directly edited pilot episode.

- [ ] **Step 1: Verify the lightweight implementation before real writes**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\polish-course-narration'
```

- [ ] **Step 2: Initialize and validate the 51 byte-identical copies**

```powershell
python '.agents\skills\polish-course-narration\scripts\initialize_polished.py' --repo-root '.' --snapshot 'work\narration-polish-v1\baseline-sha256.json'
$files = Get-ChildItem -LiteralPath 'outputs\narration-scripts-polished' -Recurse -File -Filter '*-narration.md'
if ($files.Count -ne 51) { throw "Expected 51 polished copies; found $($files.Count)" }
$expected = @{
  'module-1-system-cognition' = 13
  'module-2-identifier-coding' = 7
  'module-3-data-and-resolution' = 12
  'module-4-identifier-carrier' = 10
  'module-5-node-construction-operation' = 9
}
$actual = @{}; $files | Group-Object { $_.Directory.Name } | ForEach-Object { $actual[$_.Name] = $_.Count }
if ((Compare-Object $expected.Keys $actual.Keys).Count -ne 0) { throw 'Unexpected module directories' }
foreach ($name in $expected.Keys) { if ($actual[$name] -ne $expected[$name]) { throw "Unexpected count for $name" } }
```

Expected: 51 copied files. Do not run final `--all` yet because the copies intentionally still contain unpolished source wording. If initialization was interrupted before any content edit, rerun with `--resume`; never use `--resume` after a polished file has been edited.

- [ ] **Step 3: Commit the initialized copies and snapshot**

```powershell
git add -- outputs/narration-scripts-polished work/narration-polish-v1/baseline-sha256.json
git commit --only -m "data: initialize polished narration copies" -- outputs/narration-scripts-polished work/narration-polish-v1/baseline-sha256.json
```

- [ ] **Step 4: Directly polish episode 01**

Read completely:

```text
docs/superpowers/specs/2026-07-28-narration-script-full-polish-design.md
episodes/module-1-system-cognition/episode-01-industrial-internet-origins-task-package.md
outputs/narration-scripts/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md
outputs/narration-scripts-polished/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md
```

Edit only the polished file's N body. Preserve its N sequence, numbers, facts, qualifiers, visual anchors, and non-N regions. Do not create manifest, state, review JSON, or transaction artifacts.

- [ ] **Step 5: Validate, manually read once, and commit only episode 01**

```powershell
python '.agents\skills\polish-course-narration\scripts\validate_narration.py' --repo-root '.' --snapshot 'work\narration-polish-v1\baseline-sha256.json' --episode 1
git diff --check -- outputs/narration-scripts-polished/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md
git add -- outputs/narration-scripts-polished/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md
git commit --only -m "content: polish narration episode 01" -- outputs/narration-scripts-polished/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md
```

Because the repository already has approved task-package working-tree changes, the snapshot validator is the only immutable-input gate for this workflow. Do not require unrelated pre-existing Git changes to disappear.

- [ ] **Step 6: Stop for user review before scaling to episodes 02–51**

Report the episode 01 diff, validator result, any content uncertainty, and the exact remaining workflow. Do not build new infrastructure in response to copy-editing issues; adjust only the content rule or deterministic validator when a concrete pilot failure proves it necessary.
