import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const dir = path.join(root, 'production-status', 'episodes');
const ids = fs.readdirSync(dir).filter(name => /^episode-\d{2}\.json$/.test(name));

test('all 51 episode status documents exist', () => {
  assert.equal(ids.length, 51);
});

test('status documents retain the cross-project contract', () => {
  for (const name of ids) {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
    assert.equal(doc.schemaVersion, 'coursewebvideo/episode-production-status/v1');
    assert.equal(doc.episodeId, name.slice(0, -5));
    assert.equal(doc.stages.length, 14);
    assert.equal(doc.observations.player.projectPath, `player/episodes/${doc.episodeId}/project.json`);
    assert.ok(doc.approvals.finalDelivery);
  }
});

test('local observations match known episodes', () => {
  const ep01 = JSON.parse(fs.readFileSync(path.join(dir, 'episode-01.json'), 'utf8'));
  const ep35 = JSON.parse(fs.readFileSync(path.join(dir, 'episode-35.json'), 'utf8'));
  assert.equal(ep01.observations.player.chaptersCompleted, 12);
  assert.equal(ep01.observations.audio.fileCount, 35);
  assert.equal(ep35.observations.player.status, 'ready');
  assert.equal(ep35.observations.visualRough.status, 'approved');
  assert.notEqual(ep35.summary.status, 'delivered');
});

test('scan separates production stage, automation health, and owner decisions', () => {
  const episode04 = JSON.parse(fs.readFileSync(path.join(dir, 'episode-04.json'), 'utf8'));
  const episode10 = JSON.parse(fs.readFileSync(path.join(dir, 'episode-10.json'), 'utf8'));
  const episode05 = JSON.parse(fs.readFileSync(path.join(dir, 'episode-05.json'), 'utf8'));
  assert.equal(episode04.readiness.state, 'blocked');
  assert.match(episode04.readiness.reasons.join('\n'), /缺少 21 个音频文件/);
  assert.equal(episode10.summary.productionStatus, 'not-started');
  assert.ok(['passed', 'failed'].includes(episode10.automation.status));
  assert.equal(episode05.readiness.humanStatus, 'needs-decision');
  assert.equal(episode05.readiness.automationStatus, 'failed');
  assert.equal(episode05.stages.length, 14);
  assert.ok(episode05.stages.every(stage => 'health' in stage && 'canAdvance' in stage));
});

test('legacy workflow episodes do not acquire current upstream gates', () => {
  for (const id of ['episode-01', 'episode-02', 'episode-03', 'episode-09']) {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, `${id}.json`), 'utf8'));
    assert.equal(doc.workflow?.mode, 'legacy');
    assert.ok(doc.workflow.exemptions.includes('checkpointAudio'));
    assert.ok(!doc.summary.approvalGaps.includes('checkpointAudio'));
    assert.ok(doc.automation.warnings.some(warning => warning.includes('旧流程实例')));
  }
});

test('status index covers exactly the persisted episode set', async () => {
  const port = 18000 + (process.pid % 1000);
  const server = spawn(process.execPath, ['production-status/production-status-server.mjs', '--port', String(port)], { cwd: root, stdio: 'ignore' });
  try {
    let response;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      try {
        response = await fetch(`http://127.0.0.1:${port}/production-status/index.json?_test=index`);
        break;
      } catch {
        await new Promise(resolve => setTimeout(resolve, 25));
      }
    }
    assert.equal(response?.status, 200);
    const index = await response.json();
    assert.equal(index.schemaVersion, 'coursewebvideo/episode-production-status/index/v1');
    assert.equal(index.count, ids.length);
    assert.deepEqual(index.episodes.map(doc => doc.episodeId), ids.map(name => name.slice(0, -5)).sort());
  } finally {
    server.kill();
  }
});

test('status service triggers an episode scan and rejects invalid ids', async () => {
  const port = 19000 + (process.pid % 1000);
  const server = spawn(process.execPath, ['production-status/production-status-server.mjs', '--port', String(port)], { cwd: root, stdio: 'ignore' });
  try {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try { if ((await fetch(`http://127.0.0.1:${port}/health`)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    const health = await fetch(`http://127.0.0.1:${port}/health`).then(response => response.json());
    assert.equal(health.service, 'coursewebvideo-production-status');
    assert.match(health.serviceScript, /production-status-server\.mjs$/);
    const invalid = await fetch(`http://127.0.0.1:${port}/api/production-status/scan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ episode: '../bad' }) });
    assert.equal(invalid.status, 400);
    const started = await fetch(`http://127.0.0.1:${port}/api/production-status/scan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ episode: 'episode-10' }) });
    assert.equal(started.status, 202);
    const run = await started.json();
    let state;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      state = await fetch(`http://127.0.0.1:${port}/api/production-status/scan?run=${encodeURIComponent(run.id)}`).then(response => response.json());
      if (state.status !== 'running') break;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    assert.equal(state.status, 'passed');
    assert.equal(state.exitCode, 0);
  } finally {
    server.kill();
  }
});

test('status service records and rescans manual approvals', async () => {
  const port = 20000 + (process.pid % 1000);
  const file = path.join(dir, 'episode-06.json');
  const original = fs.readFileSync(file, 'utf8');
  const server = spawn(process.execPath, ['production-status/production-status-server.mjs', '--port', String(port)], { cwd: root, stdio: 'ignore' });
  try {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try { if ((await fetch(`http://127.0.0.1:${port}/health`)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    const started = await fetch(`http://127.0.0.1:${port}/api/production-status/approval`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ episode: 'episode-06', gate: 'narration', status: 'approved', decidedBy: 'test' }) });
    assert.equal(started.status, 202);
    const payload = await started.json();
    assert.equal(payload.approval.status, 'approved');
    assert.equal(payload.approval.decidedBy, 'test');
    let state;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      state = await fetch(`http://127.0.0.1:${port}/api/production-status/scan?run=${encodeURIComponent(payload.run.id)}`).then(response => response.json());
      if (state.status !== 'running') break;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    assert.equal(state.status, 'passed');
    const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(doc.approvals.narration.status, 'approved');
    assert.ok(!doc.summary.approvalGaps.includes('narration'));
  } finally {
    fs.writeFileSync(file, original);
    server.kill();
  }
});
