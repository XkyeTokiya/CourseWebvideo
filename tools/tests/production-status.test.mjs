import test from 'node:test';
import assert from 'node:assert/strict';
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
