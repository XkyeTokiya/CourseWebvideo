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

test('status index covers exactly the persisted episode set', async () => {
  const port = 18000 + (process.pid % 1000);
  const server = spawn(process.execPath, ['tools/production-status-server.mjs', '--port', String(port)], { cwd: root, stdio: 'ignore' });
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
