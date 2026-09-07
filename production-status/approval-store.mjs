import fs from 'node:fs';
import path from 'node:path';

export const APPROVAL_KEYS = ['narration', 'visualRough', 'checkpointPlan', 'firstChapter', 'checkpointAudio', 'finalDelivery'];
export const APPROVALS_SCHEMA = 'coursewebvideo/production-approvals/v1';

export function emptyApproval() {
  return { status: 'unrecorded', decidedAt: null, decidedBy: null, evidence: null, note: null };
}

export function emptyApprovals() {
  return Object.fromEntries(APPROVAL_KEYS.map(key => [key, emptyApproval()]));
}

export function loadApprovalStore(statusDir) {
  const file = path.join(statusDir, 'manual-approvals.json');
  if (!fs.existsSync(file)) return { schemaVersion: APPROVALS_SCHEMA, episodes: {} };
  const store = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (store.schemaVersion !== APPROVALS_SCHEMA || !store.episodes || typeof store.episodes !== 'object' || Array.isArray(store.episodes)) {
    throw new Error(`invalid manual approval store: ${file}`);
  }
  return store;
}

export function approvalsFor(store, episodeId) {
  const saved = store.episodes?.[episodeId] ?? {};
  return Object.fromEntries(APPROVAL_KEYS.map(key => [key, saved[key] ?? emptyApproval()]));
}

export function saveApprovalStore(statusDir, store) {
  const file = path.join(statusDir, 'manual-approvals.json');
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify({ schemaVersion: APPROVALS_SCHEMA, episodes: store.episodes ?? {} }, null, 2)}\n`);
  fs.renameSync(temp, file);
}
