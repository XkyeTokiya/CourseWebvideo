# Narration Polish Execution Skill Implementation Plan

> **状态：已废止，禁止继续执行。** 本计划的事务状态机与批次发布架构超出当前需求。替代计划为 `docs/superpowers/plans/2026-07-29-narration-polish-lightweight-skill-v1.md`。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and validate a project-local `polish-course-narration` Skill that safely creates and maintains 51 polished narration masters in a separate directory without modifying task packages or original narration files.

**Architecture:** Use Python 3.13 standard-library scripts for deterministic parsing, hashing, atomic persistence, batch initialization, state transitions, episode validation, and batch reporting. Treat task packages and `outputs/narration-scripts` as immutable inputs, write only to `outputs/narration-scripts-polished`, and require transaction-scoped machine gates plus independent human review before `SEMANTIC_PASS`.

**Tech Stack:** Python 3.13, `unittest`, UTF-8 Markdown, JSON, SHA-256, Git, project-local Codex Skill metadata.

## Global Constraints

- The authoritative content contract is `docs/superpowers/specs/2026-07-28-narration-script-full-polish-design.md`.
- The authoritative execution contract is `docs/superpowers/specs/2026-07-29-narration-polish-execution-skill-design.md`.
- Never modify any file under `episodes/` during this plan.
- Never modify any file under `outputs/narration-scripts/` after its baseline commit.
- Write narration deliverables only under `outputs/narration-scripts-polished/`.
- Keep the five-module directory structure and the complete episode sequence 01–51.
- Use no third-party Python package; run tests with `python -m unittest`.
- All JSON state and evidence writes must use same-directory temporary files, `fsync`, validation, and `os.replace`.
- A machine failure may enter `REVISION_REQUIRED` for at most three revision cycles; unsafe conflicts or exhausted retries enter `BLOCKED`.
- `SEMANTIC_PASS` requires `reviewer_type=human`, `review_mode=human-independent`, a reviewer distinct from the writer, and three complete review rounds.
- The repository contains unrelated staged and uncommitted work. Every commit must use explicit paths and exclude unrelated changes.
- Never execute the obsolete plan `docs/superpowers/plans/2026-07-29-narration-script-full-polish.md`.

## Scope Boundary

This plan implements and validates the execution Skill, initializes the real batch, and completes the required three-episode pilot. The remaining 48 narration rewrites are a separate content-production plan created only after the user approves pilot quality, validator behavior, and human-review ergonomics. This prevents infrastructure defects from propagating across all 51 deliverables.

---

## File Map

### Skill interface and guidance

- `.agents/skills/polish-course-narration/SKILL.md`: trigger description, authority, workflow, gates, and stop rules.
- `.agents/skills/polish-course-narration/agents/openai.yaml`: Skill display metadata.
- `.agents/skills/polish-course-narration/references/manifest-schema.md`: exact persisted field contract.
- `.agents/skills/polish-course-narration/references/review-rubric.md`: independent human review checklist.

### Deterministic scripts

- `.agents/skills/polish-course-narration/scripts/narration_core.py`: paths, narration parsing, hashing, and tokens.
- `.agents/skills/polish-course-narration/scripts/atomic_io.py`: canonical JSON and atomic replacement.
- `.agents/skills/polish-course-narration/scripts/init_batch.py`: input identity, approval, mirror, and initial state.
- `.agents/skills/polish-course-narration/scripts/preflight.py`: transaction snapshot and manifest skeleton.
- `.agents/skills/polish-course-narration/scripts/validate_episode.py`: per-episode hard gates.
- `.agents/skills/polish-course-narration/scripts/update_state.py`: transitions, review evidence, snapshots, and recovery.
- `.agents/skills/polish-course-narration/scripts/validate_batch.py`: batch gates and report regeneration.

### Tests

- `.agents/skills/polish-course-narration/tests/helpers.py`
- `.agents/skills/polish-course-narration/tests/test_narration_core.py`
- `.agents/skills/polish-course-narration/tests/test_atomic_io.py`
- `.agents/skills/polish-course-narration/tests/test_init_batch.py`
- `.agents/skills/polish-course-narration/tests/test_preflight.py`
- `.agents/skills/polish-course-narration/tests/test_validate_episode.py`
- `.agents/skills/polish-course-narration/tests/test_update_state.py`
- `.agents/skills/polish-course-narration/tests/test_validate_batch.py`

### Runtime artifacts

- `work/narration-polish/2026-07-29-initial/batch-input.json`
- `work/narration-polish/2026-07-29-initial/run-state.json`
- `work/narration-polish/2026-07-29-initial/state-snapshots/`
- `work/narration-polish/2026-07-29-initial/episode-XX-manifest.json`
- `work/narration-polish/2026-07-29-initial/episode-XX-validation.json`
- `work/narration-polish/2026-07-29-initial/episode-XX-review.json`
- `work/narration-polish/2026-07-29-initial/batch-report.md`

---

### Task 1: Commit the immutable original narration baseline

**Files:**
- Add: `outputs/narration-scripts/**/*.md`
- Modify: none
- Test: shell file-count, episode-identity, and source-equality checks

**Interfaces:**
- Consumes: the current 51 original narration files.
- Produces: a Git commit containing exactly the original narration baseline.

- [ ] **Step 1: Verify count, module distribution, and episode sequence**

```powershell
$files = Get-ChildItem -LiteralPath 'outputs\narration-scripts' -Recurse -File -Filter '*-narration.md'
$episodes = $files | ForEach-Object {
  if ($_.Name -notmatch '^episode-(\d{2})-') { throw "Bad narration name: $($_.FullName)" }
  [int]$Matches[1]
}
$counts = $files | Group-Object { $_.Directory.Name } | Sort-Object Name
if ($files.Count -ne 51) { throw "Expected 51 narration files; found $($files.Count)" }
if ((Compare-Object (1..51) ($episodes | Sort-Object)).Count -ne 0) { throw 'Narration episodes are not 01-51' }
$counts | Select-Object Name,Count
```

Expected: five module counts `13, 7, 12, 10, 9`; no exception.

- [ ] **Step 2: Confirm original narration matches task-package section 6**

```powershell
python work\validate_module_decoupling.py
```

Expected: all modules pass. On any mismatch, stop for a human baseline decision without editing either input.

- [ ] **Step 3: Commit only original narration**

```powershell
git add -- outputs/narration-scripts
git commit --only -m "data: track original narration baseline" -- outputs/narration-scripts
```

Expected: 51 narration files committed; unrelated staged changes remain outside the commit.

- [ ] **Step 4: Verify tracked and clean baseline**

```powershell
if ((git ls-files 'outputs/narration-scripts/**/*.md' | Measure-Object).Count -ne 51) { throw 'Git does not track 51 narration files' }
git diff --exit-code -- outputs/narration-scripts
```

Expected: exit code 0.

---

### Task 2: Scaffold the project-local Skill

**Files:**
- Create: `.agents/skills/polish-course-narration/SKILL.md`
- Create: `.agents/skills/polish-course-narration/agents/openai.yaml`
- Create: `.agents/skills/polish-course-narration/scripts/`
- Create: `.agents/skills/polish-course-narration/references/`
- Create: `.agents/skills/polish-course-narration/tests/`

**Interfaces:**
- Consumes: the two approved specifications.
- Produces: a discoverable Skill directory named `polish-course-narration`.

- [ ] **Step 1: Initialize Skill and metadata**

```powershell
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\init_skill.py' polish-course-narration `
  --path '.agents\skills' `
  --resources scripts,references `
  --interface 'display_name=Course Narration Polisher' `
  --interface 'short_description=逐集安全润色课程口播并执行结构、事实与人工复核门禁' `
  --interface 'default_prompt=Use $polish-course-narration to initialize and safely polish one course narration episode.'
New-Item -ItemType Directory -Force '.agents\skills\polish-course-narration\tests' | Out-Null
```

Expected: the five required directories/files exist.

- [ ] **Step 2: Replace SKILL.md with the executable contract**

Write this content using `apply_patch`:

```markdown
---
name: polish-course-narration
description: Safely polish course narration Markdown episode by episode while preserving N-segment structure, facts, protected terms, numbers, qualifiers, visual anchors, and PPT compatibility. Use in this course repository to initialize, edit, validate, review, resume, or report on outputs/narration-scripts-polished without modifying task packages or original narration baselines.
---

# Polish Course Narration

Read `docs/superpowers/specs/2026-07-28-narration-script-full-polish-design.md` and `docs/superpowers/specs/2026-07-29-narration-polish-execution-skill-design.md` completely before acting.

## Authority

- Treat `episodes/` as the frozen PPT source.
- Treat `outputs/narration-scripts/` as the frozen narration baseline.
- Write narration only under `outputs/narration-scripts-polished/`.
- Write evidence only under `work/narration-polish/{run_id}/`.

## Workflow

1. Initialize and approve the complete batch.
2. Begin exactly one episode transaction.
3. Complete and validate its manifest before drafting.
4. Edit only the current polished N body.
5. Run complete episode validation after every revision.
6. Stop at `MACHINE_PASS` until independent human review completes.
7. Advance state only through `update_state.py`.
8. Regenerate and validate the batch report after committed transitions.

## Stop rules

Enter `BLOCKED` for immutable-input changes, unresolved fact or mapping conflicts, invalid identity, an invalid write set, or three exhausted revisions. Never repair frozen inputs in this workflow.
```

- [ ] **Step 3: Validate metadata and Skill structure**

```powershell
Get-Content -Raw '.agents\skills\polish-course-narration\agents\openai.yaml'
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\polish-course-narration'
```

Expected: quoted interface strings, default prompt contains `$polish-course-narration`, and output says `Skill is valid!`.

- [ ] **Step 4: Commit scaffold**

```powershell
git add -- .agents/skills/polish-course-narration
git commit --only -m "feat: scaffold narration polish skill" -- .agents/skills/polish-course-narration
```

---

### Task 3: Implement narration parsing, pairing, and tokens

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/narration_core.py`
- Create: `.agents/skills/polish-course-narration/tests/helpers.py`
- Create: `.agents/skills/polish-course-narration/tests/test_narration_core.py`

**Interfaces:**
- Produces: `NarrationDocument`, `EpisodePaths`, `parse_narration`, `discover_episode_paths`, `sha256_path`, `numeric_tokens`, and `entity_tokens`.

- [ ] **Step 1: Write failing parser tests**

In `tests/helpers.py`, add the scripts directory to `sys.path` and define the exact two-segment fixture used below:

```python
SKILL_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_ROOT / "scripts"))
SAMPLE_NARRATION = "# 示例\n\n[N001]\n第一段含 2021 年和 2–3 名。\n\n[N002]\n第二段。\n\n### 6.1 Narration Duration Estimate\n保持不变。\n"
```

```python
class NarrationCoreTests(unittest.TestCase):
    def test_parse_preserves_regions_and_segments(self):
        doc = parse_narration(SAMPLE_NARRATION)
        self.assertEqual(doc.ids, ("N001", "N002"))
        self.assertEqual(doc.segments["N001"].strip(), "第一段含 2021 年和 2–3 名。")
        self.assertTrue(doc.prefix.startswith("# 示例"))
        self.assertTrue(doc.suffix.startswith("### 6.1 Narration Duration Estimate"))

    def test_rejects_non_contiguous_ids(self):
        with self.assertRaisesRegex(ValueError, "contiguous"):
            parse_narration(SAMPLE_NARRATION.replace("[N002]", "[N003]"))

    def test_extracts_numbers_and_entities(self):
        self.assertEqual(numeric_tokens("AII2022 建议 2–3 名，每月 1 次"), ("2022", "2–3", "1"))
        self.assertIn("AII2022", entity_tokens("依据 AII2022 和《建设导则》"))
        self.assertIn("《建设导则》", entity_tokens("依据 AII2022 和《建设导则》"))
```

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_narration_core.py' -v
```

- [ ] **Step 3: Implement exact public types**

```python
import hashlib
import re
from dataclasses import dataclass
from pathlib import Path

N_HEADER_RE = re.compile(r"(?m)^\[(N\d{3})\]\r?$")
TAIL_RE = re.compile(r"(?m)^#{2,3}\s+6\.1\s+Narration Duration Estimate\r?$")
EPISODE_RE = re.compile(r"^episode-(\d{2})-")
NUMBER_RE = re.compile(r"(?<!\d)(?:\d+\s*[–—-]\s*\d+|\d+(?:\.\d+)?(?:%|％)?)(?!\d)")
ENTITY_RE = re.compile(r"《[^》]+》|[A-Za-z][A-Za-z0-9._-]{2,}")

@dataclass(frozen=True)
class NarrationDocument:
    prefix: str
    body: str
    suffix: str
    ids: tuple[str, ...]
    segments: dict[str, str]

@dataclass(frozen=True)
class EpisodePaths:
    episode: int
    module: str
    task_package: Path
    original_narration: Path
    polished_narration: Path

def parse_narration(text: str) -> NarrationDocument:
    first = re.search(r"(?m)^\[N001\]\r?$", text)
    if first is None:
        raise ValueError("missing N001")
    tail = TAIL_RE.search(text, first.end())
    if tail is None:
        raise ValueError("missing narration duration suffix")
    prefix = text[:first.start()]
    body = text[first.start():tail.start()]
    suffix = text[tail.start():]
    matches = list(N_HEADER_RE.finditer(body))
    ids = tuple(match.group(1) for match in matches)
    expected = tuple(f"N{index:03d}" for index in range(1, len(ids) + 1))
    if ids != expected:
        raise ValueError("N IDs must be contiguous")
    segments = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        segments[match.group(1)] = body[match.end():end]
    return NarrationDocument(prefix, body, suffix, ids, segments)

def discover_episode_paths(repo_root: Path, expected_count: int = 51) -> tuple[EpisodePaths, ...]:
    def index_files(root: Path, suffix: str) -> dict[tuple[str, int], Path]:
        indexed = {}
        for path in sorted(root.glob(f"*/episode-*{suffix}")):
            match = EPISODE_RE.match(path.name)
            if match is None:
                raise ValueError(f"invalid episode filename: {path}")
            key = (path.parent.name, int(match.group(1)))
            if key in indexed:
                raise ValueError(f"duplicate episode path: {key}")
            indexed[key] = path
        return indexed

    tasks = index_files(repo_root / "episodes", "-task-package.md")
    originals = index_files(repo_root / "outputs" / "narration-scripts", "-narration.md")
    if len(tasks) != expected_count or len(originals) != expected_count:
        raise ValueError(f"expected {expected_count} task/narration files")
    if tasks.keys() != originals.keys():
        raise ValueError("task and narration episode keys differ")
    return tuple(
        EpisodePaths(
            episode=episode,
            module=module,
            task_package=tasks[(module, episode)],
            original_narration=originals[(module, episode)],
            polished_narration=repo_root / "outputs" / "narration-scripts-polished" / module / originals[(module, episode)].name,
        )
        for module, episode in sorted(tasks)
    )

def sha256_path(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def numeric_tokens(text: str) -> tuple[str, ...]:
    return tuple(re.sub(r"\s+", "", match.group(0)) for match in NUMBER_RE.finditer(text))

def entity_tokens(text: str) -> tuple[str, ...]:
    return tuple(match.group(0) for match in ENTITY_RE.finditer(text))
```

Use the code above as the initial implementation, then adjust only when the failing tests demonstrate a defect.

- [ ] **Step 4: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_narration_core.py' -v
git add -- .agents/skills/polish-course-narration/scripts/narration_core.py .agents/skills/polish-course-narration/tests/helpers.py .agents/skills/polish-course-narration/tests/test_narration_core.py
git commit --only -m "feat: parse and pair narration episodes" -- .agents/skills/polish-course-narration/scripts/narration_core.py .agents/skills/polish-course-narration/tests/helpers.py .agents/skills/polish-course-narration/tests/test_narration_core.py
```

Expected: tests pass and only the three named files are committed.

---

### Task 4: Implement canonical JSON and atomic persistence

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/atomic_io.py`
- Create: `.agents/skills/polish-course-narration/tests/test_atomic_io.py`

**Interfaces:**
- Produces: `utc_now`, `base_envelope`, `canonical_json_bytes`, `with_content_hash`, `verify_content_hash`, `atomic_write_bytes`, `atomic_write_json`, and `load_verified_json`.

- [ ] **Step 1: Write failing atomic tests**

Import `unittest.mock` as `mock` so replacement failure can be injected without changing the filesystem implementation.

```python
class AtomicIoTests(unittest.TestCase):
    def test_atomic_json_round_trip(self):
        target = self.root / "state.json"
        atomic_write_json(target, {"schema_version": 1, "revision": 2}, "tx-2")
        loaded = load_verified_json(target)
        self.assertEqual(loaded["revision"], 2)
        self.assertTrue(verify_content_hash(loaded))
        self.assertEqual(list(self.root.glob("*.tmp-*")), [])

    def test_rejects_corrupt_hash(self):
        target = self.root / "state.json"
        target.write_text('{"content_hash":"bad","revision":2}', encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "content hash"):
            load_verified_json(target)

    def test_replace_failure_keeps_previous_target(self):
        target = self.root / "state.json"
        atomic_write_json(target, {"schema_version": 1, "revision": 1}, "tx-1")
        with mock.patch("atomic_io.os.replace", side_effect=OSError("interrupted")):
            with self.assertRaisesRegex(OSError, "interrupted"):
                atomic_write_json(target, {"schema_version": 1, "revision": 2}, "tx-2")
        self.assertEqual(load_verified_json(target)["revision"], 1)
```

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_atomic_io.py' -v
```

- [ ] **Step 3: Implement atomic functions**

```python
from datetime import datetime, timezone

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

def base_envelope(run_id: str, transaction_id: str, revision: int) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "run_id": run_id,
        "transaction_id": transaction_id,
        "revision": revision,
        "created_at": utc_now(),
    }

def canonical_json_bytes(data: Mapping[str, Any]) -> bytes:
    return (json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")

def with_content_hash(data: Mapping[str, Any]) -> dict[str, Any]:
    payload = dict(data)
    payload.pop("content_hash", None)
    payload["content_hash"] = hashlib.sha256(canonical_json_bytes(payload)).hexdigest()
    return payload

def atomic_write_bytes(path: Path, data: bytes, transaction_id: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(f"{path.name}.tmp-{transaction_id}")
    with temp.open("wb") as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temp, path)
```

Implement JSON write/read around these functions. Reject invalid UTF-8, invalid JSON, non-object roots, and hash mismatches.

- [ ] **Step 4: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_atomic_io.py' -v
git add -- .agents/skills/polish-course-narration/scripts/atomic_io.py .agents/skills/polish-course-narration/tests/test_atomic_io.py
git commit --only -m "feat: add atomic narration state writes" -- .agents/skills/polish-course-narration/scripts/atomic_io.py .agents/skills/polish-course-narration/tests/test_atomic_io.py
```

---

### Task 5: Implement batch identity approval and 51-file initialization

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/init_batch.py`
- Create: `.agents/skills/polish-course-narration/tests/test_init_batch.py`

**Interfaces:**
- Consumes: `discover_episode_paths`, Git metadata, an explicit human approval, and a run directory.
- Produces: `prepare_candidate`, `approve_candidate`, `publish_polished_tree`, approved `batch-input.json`, and initial `run-state.json`.

- [ ] **Step 1: Write failing initialization tests**

```python
def test_prepare_rejects_untracked_input_in_git_mode(self):
    with self.assertRaisesRegex(ValueError, "not tracked"):
        prepare_candidate(self.repo, self.run_dir, "approved-working-tree", "git", expected_count=2)

def test_approve_rejects_wrong_candidate_hash(self):
    candidate = prepare_candidate(self.repo, self.run_dir, "approved-working-tree", "approved-working-tree", expected_count=2)
    with self.assertRaisesRegex(ValueError, "candidate hash"):
        approve_candidate(candidate, "0" * 64, "human:project-owner")

def test_publish_is_complete_byte_identical_and_one_shot(self):
    approved = self.prepare_and_approve(expected_count=2)
    state = publish_polished_tree(self.repo, self.run_dir, approved, expected_count=2)
    self.assertEqual(state["batch_status"], "BATCH_INITIALIZED")
    self.assertEqual(len(state["episodes"]), 2)
    self.assertEqual(self.original(1).read_bytes(), self.polished(1).read_bytes())
    with self.assertRaisesRegex(ValueError, "already exists"):
        publish_polished_tree(self.repo, self.run_dir, approved, expected_count=2)
```

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_init_batch.py' -v
```

- [ ] **Step 3: Implement two-phase identity approval**

Implement these functions:

```python
def git_text(repo_root: Path, *args: str) -> str:
    result = subprocess.run(["git", *args], cwd=repo_root, text=True, capture_output=True, check=False)
    if result.returncode != 0:
        raise ValueError(result.stderr.strip() or "git command failed")
    return result.stdout.strip()

def file_identity(repo_root: Path, path: Path, mode: str) -> dict[str, object]:
    relative_path = path.relative_to(repo_root).as_posix()
    identity = {
        "path": relative_path,
        "size": path.stat().st_size,
        "sha256": sha256_path(path),
        "identity_mode": mode,
        "git_commit": None,
        "git_blob": None,
    }
    if mode == "git":
        tracked = subprocess.run(["git", "ls-files", "--error-unmatch", "--", relative_path], cwd=repo_root, capture_output=True)
        clean = subprocess.run(["git", "diff", "--quiet", "HEAD", "--", relative_path], cwd=repo_root)
        if tracked.returncode != 0 or clean.returncode != 0:
            raise ValueError(f"git input is not tracked and clean: {relative_path}")
        identity["git_commit"] = git_text(repo_root, "rev-parse", "HEAD")
        identity["git_blob"] = git_text(repo_root, "ls-files", "-s", "--", relative_path).split()[1]
    elif mode != "approved-working-tree":
        raise ValueError(f"unsupported identity mode: {mode}")
    return identity

def build_identity_record(repo_root: Path, pair: EpisodePaths, task_mode: str, narration_mode: str) -> dict[str, object]:
    return {
        "episode": pair.episode,
        "module": pair.module,
        "task_package": file_identity(repo_root, pair.task_package, task_mode),
        "original_narration": file_identity(repo_root, pair.original_narration, narration_mode),
    }

def prepare_candidate(repo_root: Path, run_dir: Path, task_mode: str, narration_mode: str, expected_count: int = 51) -> Path:
    pairs = discover_episode_paths(repo_root, expected_count)
    records = [build_identity_record(repo_root, pair, task_mode, narration_mode) for pair in pairs]
    candidate = base_envelope(run_id=run_dir.name, transaction_id="batch-prepare", revision=0)
    candidate.update({"status": "CANDIDATE", "records": records})
    atomic_write_json(run_dir / "batch-input.candidate.json", candidate, "batch-prepare")
    return run_dir / "batch-input.candidate.json"

def approve_candidate(candidate_path: Path, candidate_hash: str, reviewer_id: str) -> Path:
    candidate = load_verified_json(candidate_path)
    if candidate["content_hash"] != candidate_hash:
        raise ValueError("candidate hash does not match")
    if not reviewer_id.strip():
        raise ValueError("reviewer ID is required")
    approved = dict(candidate)
    approved.update({"status": "APPROVED", "approved_by": reviewer_id, "approval_mode": "human-explicit", "approved_at": utc_now()})
    target = candidate_path.with_name("batch-input.json")
    atomic_write_json(target, approved, "batch-approve")
    return target
```

For `git` identity, require the path to be tracked and clean, and record `git rev-parse HEAD` plus the blob from `git ls-files -s -- <path>`. For `approved-working-tree`, record normalized path, size, SHA-256, and null Git identity.

- [ ] **Step 4: Implement atomic tree publication**

Create `outputs/narration-scripts-polished.tmp-{run_id}`, copy all originals with `shutil.copyfile`, verify byte equality and one-to-one paths, and publish with `os.replace` only when the final directory does not exist. Create 51 `DISCOVERED` entries and set `BATCH_INITIALIZED` only after all counts and hashes pass.

- [ ] **Step 5: Add exact CLI commands**

```powershell
python '.agents\skills\polish-course-narration\scripts\init_batch.py' prepare --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --task-mode 'approved-working-tree' --narration-mode 'git'
$candidate = Get-Content -Raw 'work\narration-polish\2026-07-29-initial\batch-input.candidate.json' | ConvertFrom-Json
python '.agents\skills\polish-course-narration\scripts\init_batch.py' approve --run-dir 'work\narration-polish\2026-07-29-initial' --candidate-hash $candidate.content_hash --reviewer-id 'human:project-owner'
python '.agents\skills\polish-course-narration\scripts\init_batch.py' publish --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial'
```

- [ ] **Step 6: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_init_batch.py' -v
git add -- .agents/skills/polish-course-narration/scripts/init_batch.py .agents/skills/polish-course-narration/tests/test_init_batch.py
git commit --only -m "feat: initialize narration polish batches" -- .agents/skills/polish-course-narration/scripts/init_batch.py .agents/skills/polish-course-narration/tests/test_init_batch.py
```

Expected: all tests pass.

---

### Task 6: Implement transaction preflight and manifest skeletons

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/preflight.py`
- Create: `.agents/skills/polish-course-narration/tests/test_preflight.py`

**Interfaces:**
- Consumes: approved batch input, current run state, episode number, and writer identity.
- Produces: `begin_transaction(repo_root, run_dir, episode, writer_id)` and an atomic episode manifest in `BASELINED`.

- [ ] **Step 1: Write failing transaction tests**

```python
def test_begin_snapshots_all_polished_files_and_write_set(self):
    tx = begin_transaction(self.repo, self.run_dir, 1, "agent:codex", expected_count=2)
    self.assertEqual(tx["episode"], 1)
    self.assertEqual(len(tx["polished_snapshot"]), 2)
    self.assertTrue(any("episode-01-manifest.json" in path for path in tx["allowed_write_set"]))

def test_rejects_second_active_transaction(self):
    begin_transaction(self.repo, self.run_dir, 1, "agent:codex", expected_count=2)
    with self.assertRaisesRegex(ValueError, "active transaction"):
        begin_transaction(self.repo, self.run_dir, 2, "agent:codex", expected_count=2)
```

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_preflight.py' -v
```

- [ ] **Step 3: Implement begin_transaction**

The function must verify `BATCH_INITIALIZED`, reject an active transaction, verify task/original hashes, snapshot all polished files and current run artifacts, generate a UUID transaction ID, and persist this allowed write set:

```python
allowed = {
    polished_current.relative_to(repo_root).as_posix(),
    f"work/narration-polish/{run_id}/episode-{episode:02d}-manifest.json",
    f"work/narration-polish/{run_id}/episode-{episode:02d}-validation.json",
    f"work/narration-polish/{run_id}/run-state.json",
    f"work/narration-polish/{run_id}/state-snapshots/**",
    f"work/narration-polish/{run_id}/batch-report.md",
}
```

Create one manifest N record per parsed ID with explicit empty lists for protected terms, numbers, qualifiers, entities, visual anchors, and first reveals. Reject `CONTEXT_LOCKED` until every N record has non-empty `role`, a valid `risk_level`, and all list fields present.

- [ ] **Step 4: Add the begin CLI**

```powershell
python '.agents\skills\polish-course-narration\scripts\preflight.py' begin --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --episode 1 --writer-id 'agent:codex'
```

Expected: prints transaction ID, manifest path, and `BASELINED` without editing narration.

- [ ] **Step 5: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_preflight.py' -v
git add -- .agents/skills/polish-course-narration/scripts/preflight.py .agents/skills/polish-course-narration/tests/test_preflight.py
git commit --only -m "feat: add narration episode preflight" -- .agents/skills/polish-course-narration/scripts/preflight.py .agents/skills/polish-course-narration/tests/test_preflight.py
```

Expected: all tests pass.

---

### Task 7: Implement the episode hard-gate validator

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/validate_episode.py`
- Create: `.agents/skills/polish-course-narration/tests/test_validate_episode.py`
- Modify: `.agents/skills/polish-course-narration/tests/helpers.py`

**Interfaces:**
- Consumes: task package, original/polished narration, manifest, transaction snapshot, and state.
- Produces: `Finding`, `ValidationResult`, `validate_episode`, and atomic validation reports.

- [ ] **Step 1: Write one mutation case per gate family**

```python
CASES = (
    (mutate_original, "READONLY_HASH"),
    (mutate_other_polished, "WRITE_SET"),
    (mutate_prefix, "OUTSIDE_BODY"),
    (mutate_id, "N_STRUCTURE"),
    (move_number_to_n002, "NUMBER_SEGMENT"),
    (remove_protected_term, "PROTECTED_TERM"),
    (remove_qualifier, "QUALIFIER"),
    (remove_anchor, "VISUAL_ANCHOR"),
    (copy_first_reveal_to_n001, "FIRST_REVEAL"),
    (add_textbook_word, "TEXTBOOK_ZERO"),
)
```

Also test warning `NEW_ENTITY`, warning `LENGTH_CHANGE` above 10%, and coexistence of warnings with hard errors.

Add the ten named mutation functions to `tests/helpers.py`. Each function must change exactly one fixture path and return that path so the test can assert mutation scope.

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_validate_episode.py' -v
```

- [ ] **Step 3: Implement public result types and ordered checks**

```python
@dataclass(frozen=True)
class Finding:
    code: str
    severity: Literal["error", "warning"]
    episode: int
    n_id: str | None
    message: str

@dataclass(frozen=True)
class ValidationResult:
    passed: bool
    findings: tuple[Finding, ...]
    old_length: int
    new_length: int
    change_percent: float
```

Run checks in this order: read-only identity, transaction write set, prefix/suffix, N sequence, per-N numbers, protected terms, qualifiers, visual anchors, first reveals, backstage language, new entities, per-N length, total length, state/report consistency. `教材` is an error. High-risk backstage phrases are warnings requiring review. Protected changes pass only through an item in `approved_equivalences` containing old text, new text, reason, and human reviewer identity.

- [ ] **Step 4: Write report and classify failure**

The report must contain schema/run/transaction/revision identity, episode, input and manifest hashes, findings, pass result, and content hash. A failed report enters `VALIDATION_FAILED`; classify as `unsafe` only for immutable-input, identity, transaction-scope, fact, or mapping conflicts. Other failures enter `REVISION_REQUIRED` while revision count is below 3.

- [ ] **Step 5: Add the validation CLI**

```powershell
python '.agents\skills\polish-course-narration\scripts\validate_episode.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --episode 1
```

Expected exit codes: 0 for machine pass, 2 for revision required, 3 for blocked.

- [ ] **Step 6: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_validate_episode.py' -v
git add -- .agents/skills/polish-course-narration/scripts/validate_episode.py .agents/skills/polish-course-narration/tests/test_validate_episode.py
git commit --only -m "feat: validate polished narration episodes" -- .agents/skills/polish-course-narration/scripts/validate_episode.py .agents/skills/polish-course-narration/tests/test_validate_episode.py
```

Expected: all tests pass.

---

### Task 8: Implement state transitions, human review gates, and recovery

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/update_state.py`
- Create: `.agents/skills/polish-course-narration/tests/test_update_state.py`

**Interfaces:**
- Consumes: verified evidence, review records, current state, and requested transition.
- Produces: `advance_episode`, `record_human_review`, `recover_state`, state snapshots, and top-level state.

- [ ] **Step 1: Write failing transition and recovery tests**

```python
def test_three_failed_revisions_end_blocked(self):
    state = self.state_at("DRAFTED")
    for count in (1, 2, 3):
        state = advance_episode(state, 1, "VALIDATION_FAILED", self.failed_report(), "agent:codex")
        state = advance_episode(state, 1, "REVISION_REQUIRED", self.failed_report(), "agent:codex")
        self.assertEqual(state["episodes"]["01"]["revision_count"], count)
        if count < 3:
            state = advance_episode(state, 1, "DRAFTED", self.revision_evidence(), "agent:codex")
    self.assertEqual(state["episodes"]["01"]["status"], "BLOCKED")

def test_semantic_pass_requires_independent_human(self):
    state = self.state_at("MACHINE_PASS", writer_id="agent:codex")
    with self.assertRaisesRegex(ValueError, "independent human"):
        record_human_review(state, 1, self.review(reviewer_type="agent", reviewer_id="agent:reviewer"))

def test_semantic_pass_rejects_writer_as_reviewer(self):
    state = self.state_at("MACHINE_PASS", writer_id="human:owner")
    with self.assertRaisesRegex(ValueError, "distinct"):
        record_human_review(state, 1, self.review(reviewer_type="human", reviewer_id="human:owner"))

def test_semantic_pass_rejects_missing_round_or_waiver_reason(self):
    state = self.state_at("MACHINE_PASS", writer_id="agent:codex")
    with self.assertRaisesRegex(ValueError, "nine review IDs"):
        record_human_review(state, 1, self.review(reviewer_type="human", reviewer_id="human:owner", remove_id="PPT-03"))
    with self.assertRaisesRegex(ValueError, "waiver reason"):
        record_human_review(state, 1, self.review(reviewer_type="human", reviewer_id="human:owner", blank_waiver_reason=True))

def test_recovery_uses_highest_valid_revision(self):
    self.write_valid_revision(4)
    self.write_invalid_revision(5)
    recovered = recover_state(self.run_dir)
    self.assertEqual(recovered["recovered_from_revision"], 4)
    self.assertEqual(recovered["batch_status"], "RECOVERY_REQUIRED")
```

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_update_state.py' -v
```

- [ ] **Step 3: Implement the exact transition map**

```python
ALLOWED = {
    "DISCOVERED": {"BASELINED"},
    "BASELINED": {"CONTEXT_LOCKED"},
    "CONTEXT_LOCKED": {"DRAFTED"},
    "DRAFTED": {"MACHINE_PASS", "VALIDATION_FAILED"},
    "VALIDATION_FAILED": {"REVISION_REQUIRED", "BLOCKED"},
    "REVISION_REQUIRED": {"DRAFTED", "BLOCKED"},
    "MACHINE_PASS": {"SEMANTIC_PASS", "REVISION_REQUIRED", "BLOCKED"},
    "SEMANTIC_PASS": {"FINAL_PASS", "REVISION_REQUIRED"},
    "FINAL_PASS": {"DONE", "REVISION_REQUIRED"},
    "DONE": set(),
    "BLOCKED": set(),
}
```

Only `record_human_review` may request `SEMANTIC_PASS`. Require human reviewer type, mode `human-independent`, reviewer ID different from writer, all nine review IDs, no `FAIL`, and a reason for every `WAIVED` item.

- [ ] **Step 4: Implement evidence-first snapshots and recovery**

Write evidence first, then `state-snapshots/run-state.<revision>.json`, verify every referenced evidence hash, atomically replace `run-state.json`, then regenerate `batch-report.md`. Recovery scans snapshots descending, selects the highest complete reference chain, creates a new `RECOVERY_REQUIRED` revision, and records higher orphan artifacts without accepting them.

- [ ] **Step 5: Add state and recovery CLIs**

```powershell
python '.agents\skills\polish-course-narration\scripts\update_state.py' advance --run-dir 'work\narration-polish\2026-07-29-initial' --episode 1 --target 'CONTEXT_LOCKED' --actor-id 'agent:codex'
python '.agents\skills\polish-course-narration\scripts\update_state.py' record-review --run-dir 'work\narration-polish\2026-07-29-initial' --episode 1 --review-file 'work\narration-polish\2026-07-29-initial\episode-01-review.json'
python '.agents\skills\polish-course-narration\scripts\update_state.py' recover --run-dir 'work\narration-polish\2026-07-29-initial'
```

`record-review` validates all human evidence before mutation. `recover` never accepts orphan reports.

- [ ] **Step 6: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_update_state.py' -v
git add -- .agents/skills/polish-course-narration/scripts/update_state.py .agents/skills/polish-course-narration/tests/test_update_state.py
git commit --only -m "feat: enforce narration review state machine" -- .agents/skills/polish-course-narration/scripts/update_state.py .agents/skills/polish-course-narration/tests/test_update_state.py
```

Expected: all tests pass.
---

### Task 9: Implement final batch validation and reporting

**Files:**
- Create: `.agents/skills/polish-course-narration/scripts/validate_batch.py`
- Create: `.agents/skills/polish-course-narration/tests/test_validate_batch.py`

**Interfaces:**
- Consumes: approved inputs, episode states/reports, and original/polished trees.
- Produces: `validate_batch(repo_root, run_dir, require_done=True)` and deterministic `batch-report.md`.

- [ ] **Step 1: Write failing batch tests**

```python
def test_requires_exact_pairs_and_all_done(self):
    result = validate_batch(self.repo, self.run_dir, expected_count=2, require_done=True)
    self.assertFalse(result.passed)
    self.assertIn("EPISODE_NOT_DONE", {item.code for item in result.findings})

def test_report_is_regenerated_from_state(self):
    self.mark_all_done()
    result = validate_batch(self.repo, self.run_dir, expected_count=2, require_done=True)
    self.assertTrue(result.passed)
    report = (self.run_dir / "batch-report.md").read_text(encoding="utf-8")
    self.assertIn("| 01 | DONE |", report)
    self.assertIn("任务包变化 | 0", report)
```

- [ ] **Step 2: Run and confirm import failure**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_validate_batch.py' -v
```

- [ ] **Step 3: Implement final gates and report regeneration**

Define:

```python
@dataclass(frozen=True)
class BatchResult:
    passed: bool
    findings: tuple[Finding, ...]
    episode_statuses: dict[str, str]
    task_package_changes: int
    original_narration_changes: int
```

Check exact 51-file pairing, immutable hashes, no extra polished narration files, all referenced report hashes, required episode states, zero remaining `教材`, N structure, aggregate warnings, and no active transaction. Generate Markdown entirely from verified state; never patch prior report text.

- [ ] **Step 4: Add batch CLI modes**

```powershell
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial'
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --allow-incomplete
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --verify-inputs-only
```

Default requires all 51 `DONE`; `--allow-incomplete` validates existing states; `--verify-inputs-only` compares task/original files to approved input identities without checking completion.

- [ ] **Step 5: Run tests and commit**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_validate_batch.py' -v
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
git add -- .agents/skills/polish-course-narration/scripts/validate_batch.py .agents/skills/polish-course-narration/tests/test_validate_batch.py
git commit --only -m "feat: validate narration polish batches" -- .agents/skills/polish-course-narration/scripts/validate_batch.py .agents/skills/polish-course-narration/tests/test_validate_batch.py
```

Expected: full test suite passes.

---

### Task 10: Add schemas, human rubric, and CLI guidance

**Files:**
- Create: `.agents/skills/polish-course-narration/references/manifest-schema.md`
- Create: `.agents/skills/polish-course-narration/references/review-rubric.md`
- Modify: `.agents/skills/polish-course-narration/SKILL.md`

**Interfaces:**
- Consumes: stable names and transitions from Tasks 3–9.
- Produces: exact operator guidance without duplicating content-polish policy.

- [ ] **Step 1: Write manifest-schema.md**

Document required fields for batch input, run state, episode manifest, validation report, and human review. Include one complete episode-01 JSON example using `schema_version`, `run_id`, `transaction_id`, `revision`, `batch_input_hash`, `writer_id`, `writer_type`, `reviewer_id`, `reviewer_type`, `review_mode`, `review_rounds`, `approved_equivalences`, `status`, `findings`, and `content_hash`.

- [ ] **Step 2: Write review-rubric.md**

Use these exact review IDs:

```text
FACT-01 facts, definitions, and conclusions unchanged
FACT-02 numbers, units, ranges, and case attribution unchanged
FACT-03 qualifiers and conclusion strength preserved
VOICE-01 every sentence serves learner understanding
VOICE-02 backstage audit language removed without replacement audit tone
VOICE-03 continuous read is natural and references are complete
PPT-01 visual anchors remain in their original N segment
PPT-02 first reveals and list counts remain aligned
PPT-03 adjacent-episode boundary remains unchanged
```

Require `PASS`, `FAIL`, or `WAIVED` for all nine, with N IDs and reasons. Final review must be human; agent pre-review is advisory.

- [ ] **Step 3: Add exact CLI examples to SKILL.md**

Document `prepare`, `approve`, `publish`, `begin`, `validate`, `record-review`, `advance`, `recover`, and `validate-batch` commands using `work/narration-polish/2026-07-29-initial`. Keep detailed fields in references.

- [ ] **Step 4: Regenerate openai.yaml after the final SKILL.md edit**

```powershell
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\generate_openai_yaml.py' '.agents\skills\polish-course-narration' `
  --interface 'display_name=Course Narration Polisher' `
  --interface 'short_description=逐集安全润色课程口播并执行结构、事实与人工复核门禁' `
  --interface 'default_prompt=Use $polish-course-narration to initialize and safely polish one course narration episode.'
```

- [ ] **Step 5: Validate docs and tests**

```powershell
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\polish-course-narration'
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
$unfinishedPattern = @(('T' + 'BD'), ('T' + 'ODO'), ('implement' + ' later'), ('fill' + ' in')) -join '|'
$hits = Get-ChildItem -LiteralPath '.agents\skills\polish-course-narration' -Recurse -File | Select-String -Pattern $unfinishedPattern
if ($hits) { $hits; throw 'Skill contains unfinished markers' }
```

Expected: Skill valid, tests pass, no unfinished markers.

- [ ] **Step 6: Commit**

```powershell
git add -- .agents/skills/polish-course-narration/SKILL.md .agents/skills/polish-course-narration/agents/openai.yaml .agents/skills/polish-course-narration/references
git commit --only -m "docs: define narration polish operating contract" -- .agents/skills/polish-course-narration/SKILL.md .agents/skills/polish-course-narration/agents/openai.yaml .agents/skills/polish-course-narration/references
```

---

### Task 11: Initialize the real 51-file batch with human input approval

**Files:**
- Create: `outputs/narration-scripts-polished/**/*.md`
- Create: `work/narration-polish/2026-07-29-initial/**/*`
- Modify: none under `episodes/` or `outputs/narration-scripts/`

**Interfaces:**
- Consumes: tracked original narration, current frozen task packages, and human confirmation of the candidate hash.
- Produces: byte-identical polished tree and `BATCH_INITIALIZED` state.

- [ ] **Step 1: Run tests before runtime writes**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\polish-course-narration'
```

- [ ] **Step 2: Prepare candidate manifest**

```powershell
python '.agents\skills\polish-course-narration\scripts\init_batch.py' prepare `
  --repo-root '.' `
  --run-dir 'work\narration-polish\2026-07-29-initial' `
  --task-mode 'approved-working-tree' `
  --narration-mode 'git'
```

Expected: 51 paired records and candidate hash; no polished directory.

- [ ] **Step 3: Stop for explicit human confirmation**

Show `batch-input.candidate.json`, all paths, narration commit/blob identities, task-package working-tree hashes, and candidate hash. Do not approve until the user confirms that exact hash.

- [ ] **Step 4: Approve the confirmed candidate**

```powershell
$candidate = Get-Content -Raw 'work\narration-polish\2026-07-29-initial\batch-input.candidate.json' | ConvertFrom-Json
python '.agents\skills\polish-course-narration\scripts\init_batch.py' approve `
  --run-dir 'work\narration-polish\2026-07-29-initial' `
  --candidate-hash $candidate.content_hash `
  --reviewer-id 'human:project-owner'
```

- [ ] **Step 5: Publish and validate initialized tree**

```powershell
python '.agents\skills\polish-course-narration\scripts\init_batch.py' publish --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial'
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --allow-incomplete
```

Expected: 51 byte-identical polished files, 51 `DISCOVERED` entries, `BATCH_INITIALIZED`, no input changes.

- [ ] **Step 6: Commit initialized output and durable identity only**

```powershell
git add -- outputs/narration-scripts-polished work/narration-polish/2026-07-29-initial/batch-input.json work/narration-polish/2026-07-29-initial/run-state.json work/narration-polish/2026-07-29-initial/state-snapshots work/narration-polish/2026-07-29-initial/batch-report.md
git commit --only -m "data: initialize polished narration batch" -- outputs/narration-scripts-polished work/narration-polish/2026-07-29-initial/batch-input.json work/narration-polish/2026-07-29-initial/run-state.json work/narration-polish/2026-07-29-initial/state-snapshots work/narration-polish/2026-07-29-initial/batch-report.md
```

---

### Task 12: Run the three-episode acceptance pilot

**Files:**
- Modify: `outputs/narration-scripts-polished/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md`
- Modify: `outputs/narration-scripts-polished/module-3-data-and-resolution/episode-27-apifox-template-interface-debug-narration.md`
- Modify: `outputs/narration-scripts-polished/module-5-node-construction-operation/episode-43-secondary-node-leadership-deployment-models-narration.md`
- Create/Modify: matching manifests, reports, snapshots, state, and batch report

**Interfaces:**
- Consumes: implemented Skill, approved batch, and human reviewer.
- Produces: concept, operation, and high-risk episodes at `DONE`.

- [ ] **Step 1: Process episode 01 to MACHINE_PASS**

Invoke `$polish-course-narration`, begin episode 01 as writer `agent:codex`, complete all N manifest records, advance to `CONTEXT_LOCKED`, edit only the polished N body, validate, and revise until `MACHINE_PASS` or `BLOCKED`.

- [ ] **Step 2: Obtain independent human review for episode 01**

Present original/polished narration, task constraints, manifest, report, and nine review IDs. Stop at `MACHINE_PASS` until a human distinct from `agent:codex` completes all rounds. Then advance `SEMANTIC_PASS → FINAL_PASS → DONE` with final validation.

- [ ] **Step 3: Repeat the isolated transaction for episode 27**

Use a new transaction ID. Verify episode 01 and all other polished files match the episode-27 transaction-start snapshot. Require human review before `DONE`.

- [ ] **Step 4: Repeat the isolated transaction for episode 43**

Treat standards, dates, responsibility terms, recommendation strength, and cross-episode transition as high risk. Require human review before `DONE`.

- [ ] **Step 5: Run pilot-wide verification**

```powershell
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --allow-incomplete
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
```

Expected: episodes 01, 27, 43 `DONE`; remaining 48 `DISCOVERED`; inputs unchanged; tests pass.

- [ ] **Step 6: Commit each pilot separately**

Stage only that episode's polished file, manifest, validation report, human review file, required snapshots, state, and batch report. Use messages:

```text
content: polish narration episode 01
content: polish narration episode 27
content: polish narration episode 43
```

- [ ] **Step 7: Review pilot findings before remaining episodes**

Report validator false positives, manifest omissions, reviewer friction, length warnings, and style drift. Add a failing regression test before every implementation adjustment. Do not begin remaining episodes until the user approves pilot results and frozen Skill behavior.

---

### Task 13: Final verification and execution handoff

**Files:**
- Read: Skill, tests, pilot artifacts, and Git diffs
- Modify: only defects demonstrated by a failing regression test

**Interfaces:**
- Consumes: Tasks 1–12.
- Produces: validated Skill and basis for a separate remaining-48-episode plan.

- [ ] **Step 1: Run deterministic checks**

```powershell
python -m unittest discover -s '.agents\skills\polish-course-narration\tests' -p 'test_*.py' -v
python 'C:\Users\liuxn\.codex\skills\.system\skill-creator\scripts\quick_validate.py' '.agents\skills\polish-course-narration'
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --allow-incomplete
git diff --check
```

Expected: tests pass, Skill valid, pilot report valid, no whitespace errors.

- [ ] **Step 2: Verify immutable inputs and scope**

```powershell
python '.agents\skills\polish-course-narration\scripts\validate_batch.py' --repo-root '.' --run-dir 'work\narration-polish\2026-07-29-initial' --verify-inputs-only
git diff --exit-code -- outputs/narration-scripts
git status --short
```

Expected: task packages still match the human-approved working-tree hashes, and tracked original narration remains clean. Pre-existing unrelated task-package changes do not cause a false failure because they are compared to `batch-input.json`, not to `HEAD`.

- [ ] **Step 3: Produce handoff**

Report Skill path, test result, approved batch hash and identity modes, pilot states, immutable-input result, warnings, approved equivalences, regression tests, and recommendation for the remaining-48 plan.

- [ ] **Step 4: Commit verification fixes only when present**

```powershell
git commit --only -m "fix: harden narration polish pilot gates" -- .agents/skills/polish-course-narration
```

Skip when verification required no changes.
