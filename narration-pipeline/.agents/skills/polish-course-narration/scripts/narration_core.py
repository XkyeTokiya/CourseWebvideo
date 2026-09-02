import hashlib
import re
from dataclasses import dataclass
from pathlib import Path


N_HEADER_RE = re.compile(r"(?m)^\[(N\d{3})\]\r?$")
TAIL_RE = re.compile(r"(?m)^#{2,3}\s+6\.1\s+Narration Duration Estimate\r?$")
EPISODE_RE = re.compile(r"^episode-(\d{2})-")
NUMBER_RE = re.compile(r"(?<!\d)(?:\d+\s*[–—-]\s*\d+|\d+(?:\.\d+)?(?:%|％)?)(?!\d)")
ENTITY_RE = re.compile(r"《[^》]+》|[A-Za-z][A-Za-z0-9._-]{2,}")
COURSE_MODULE_EPISODE_RANGES = (
    ("module-1-system-cognition", range(1, 14)),
    ("module-2-identifier-coding", range(14, 21)),
    ("module-3-data-and-resolution", range(21, 33)),
    ("module-4-identifier-carrier", range(33, 43)),
    ("module-5-node-construction-operation", range(43, 52)),
)


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
    prefix = text[:first.start()]
    body = text[first.start():tail.start()] if tail is not None else text[first.start():]
    suffix = text[tail.start():] if tail is not None else ""
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
    episodes = tuple(sorted(episode for _, episode in tasks))
    if episodes != tuple(range(1, expected_count + 1)):
        raise ValueError("episode sequence must be unique and complete")
    if expected_count == 51:
        expected_keys = {
            (module, episode)
            for module, episode_range in COURSE_MODULE_EPISODE_RANGES
            for episode in episode_range
        }
        if tasks.keys() != expected_keys:
            raise ValueError("episode paths must match the five-module topology")
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
