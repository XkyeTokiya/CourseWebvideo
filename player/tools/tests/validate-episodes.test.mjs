import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const validator = path.resolve(import.meta.dirname, "../validate-episodes.mjs");

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

async function createFixture(project, { entry = true } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "episode-check-"));
  await write(path.join(root, ".agents", "skills", "web-video-presentation", "themes", "fixture", "theme.json"), "{}\n");
  await write(path.join(root, ".agents", "skills", "web-video-presentation", "themes", "fixture", "tokens.css"), ":root {}\n");
  await write(path.join(root, "episodes", "episode-test", "project.json"), JSON.stringify(project));
  if (entry) await write(path.join(root, "episodes", "episode-test", "src", "entry.tsx"), "export const CHAPTERS = [];\n");
  return root;
}

const validProject = {
  id: "episode-test",
  title: "Fixture",
  status: "in-progress",
  theme: "fixture",
  progress: { completed: 0, total: 1, current: null },
  updatedAt: "2026-09-01",
};

test("episode:check ignores legacy rolling-review bookkeeping", async () => {
  const root = await createFixture({
    ...validProject,
    progress: { completed: 0, total: 1, current: "A001" },
    reviewProtocol: "chapter-review/rolling-v1",
  });
  try {
    await write(path.join(root, "episodes", "episode-test", "src", "chapters", "01-A001", "Chapter.tsx"), "export default null;\n");

    const result = await execFileAsync(process.execPath, [validator, "--episode", "episode-test"], { cwd: root });
    assert.match(result.stdout, /episode:check 通过/);
    assert.equal(result.stderr, "");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

for (const scenario of [
  {
    name: "rejects an illegal status",
    project: { ...validProject, status: "reviewing" },
    expected: /status 必须是 planned\/in-progress\/ready/,
  },
  {
    name: "rejects an unknown theme",
    project: { ...validProject, theme: "missing-theme" },
    expected: /theme 不存在：missing-theme/,
  },
  {
    name: "rejects invalid progress",
    project: { ...validProject, progress: { completed: 2, total: 1, current: null } },
    expected: /progress 必须是有效的 completed\/total/,
  },
  {
    name: "requires an entry for a non-planned episode",
    project: validProject,
    entry: false,
    expected: /in-progress 实例必须存在 src\/entry\.tsx/,
  },
]) {
  test(`episode:check ${scenario.name}`, async () => {
    const root = await createFixture(scenario.project, { entry: scenario.entry });
    try {
      await assert.rejects(
        execFileAsync(process.execPath, [validator, "--episode", "episode-test"], { cwd: root }),
        (error) => scenario.expected.test(error.stderr),
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
