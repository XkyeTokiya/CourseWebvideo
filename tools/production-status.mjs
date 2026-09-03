import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const STATUS_DIR = path.join(ROOT, 'production-status');
const EPISODES_DIR = path.join(STATUS_DIR, 'episodes');
const PLAYER_DIR = path.join(ROOT, 'player');
const TASK_DIR = path.join(ROOT, 'narration-pipeline', 'episodes');
const TODAY = '2026-09-03';
const APPROVAL_KEYS = ['narration', 'visualRough', 'checkpointPlan', 'firstChapter', 'checkpointAudio', 'finalDelivery'];
const STAGES = [
  ['freeze-task-package', '冻结任务包'], ['continuous-narration', '连续口播'], ['approve-narration', '批准口播'],
  ['a-page', 'A-page'], ['compile-trace', '编译追踪'], ['validate-a-page', 'A-page 验证'],
  ['visual-rough', 'Visual rough'], ['player-phase-1', 'Player Phase 1'], ['checkpoint-plan', 'Checkpoint Plan'],
  ['chapter-handoff', '单章 handoff'], ['chapter-production', '章节制作'], ['chapter-acceptance', '后续章节与验收'],
  ['audio', '音频'], ['recording-delivery', '录屏、后期与成片验收']
];

const exists = p => fs.existsSync(p);
const rel = p => path.relative(ROOT, p).replaceAll('\\', '/');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha256 = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function walk(dir) { if (!exists(dir)) return []; return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
function findTask(id) { return walk(TASK_DIR).find(p => path.basename(p).startsWith(`${id}-`) && p.endsWith('-task-package.md')); }
function taskTitle(p, id) { if (!p) return id; const text = fs.readFileSync(p, 'utf8'); return text.match(/^# 第\s*\d+\s*集《([^》]+)》/m)?.[1] ?? id; }
function approval() { return { status: 'unrecorded', decidedAt: null, decidedBy: null, evidence: null, note: null }; }
function blank(id, title) {
  return { schemaVersion: 'coursewebvideo/episode-production-status/v1', episodeId: id, title,
    summary: { status: 'not-started', currentStage: 'freeze-task-package', nextAction: '开始冻结任务包后的连续口播生产', blockers: [], approvalGaps: [] },
    observations: { taskPackage: { status: 'missing', path: '' }, approvedNarration: { status: 'missing', path: '' }, aPage: { status: 'missing', path: '' }, visualRough: { status: 'missing', path: '' },
      player: { projectPath: `player/episodes/${id}/project.json`, status: 'missing', chaptersCompleted: 0, chaptersTotal: 0, current: null, entrypointPresent: false, sourceChapterCount: 0 },
      audio: { segmentsPath: `player/episodes/${id}/audio-segments.json`, status: 'not-extracted', segmentCount: 0, fileCount: 0, missingCount: 0, source: null, ttsProvider: null },
      delivery: { recording: { status: 'not-observed', paths: [] }, finalVideo: { status: 'not-observed', paths: [] } } },
    approvals: Object.fromEntries(APPROVAL_KEYS.map(k => [k, approval()])), coordination: { owner: null, targetDate: null, blockers: [], notes: '', externalArtifacts: [] },
    stages: STAGES.map(([stageId, name]) => ({ id: stageId, name, status: 'not-started' })), updatedAt: TODAY, updatedBy: 'production-status sync' };
}
function obs(id, current) {
  const dir = path.join(PLAYER_DIR, 'episodes', id); const inputs = path.join(dir, 'inputs');
  const task = findTask(id); const p = path.join(dir, 'project.json'); const project = exists(p) ? readJson(p) : null;
  const file = (name, status = 'present') => { const f = path.join(inputs, name); return exists(f) ? { status, path: rel(f), sha256: sha256(f), failures: [] } : { status: 'missing', path: rel(f), failures: [] }; };
  let aPage = file(`${id}-a-page.json`), visual = file(`${id}-visual-rough.md`), narration = file('approved-spoken-text.txt');
  const av = path.join(inputs, `${id}-a-page-validation.json`); if (exists(av)) { const v = readJson(av); aPage.status = v.failures?.length ? 'invalid' : 'valid'; aPage.failures = v.failures ?? []; }
  const vv = path.join(inputs, `${id}-visual-rough-validation.json`); if (exists(vv)) { const v = readJson(vv); visual.status = v.failures?.length ? 'invalid' : (v.status === 'approved' ? 'approved' : v.status === 'draft' ? 'draft' : 'present'); visual.failures = v.failures ?? []; }
  const audioPath = path.join(dir, 'audio-segments.json'); const segments = exists(audioPath) ? readJson(audioPath) : []; const audioFiles = walk(path.join(dir, 'media', 'audio')).filter(f => /\.(mp3|wav|m4a|ogg)$/i.test(f));
  const expected = segments.map(s => path.join(dir, 'media', 'audio', s.audio)); const missing = expected.filter(f => !exists(f));
  const sourceChapters = walk(path.join(dir, 'src', 'chapters')).filter(f => f.endsWith('.tsx') && !f.endsWith('narrations.ts')).length;
  const title = project?.title && !project.title.includes('待制作') ? project.title : taskTitle(task, id);
  return { title, observations: { taskPackage: task ? { status: 'present', path: rel(task), sha256: sha256(task), failures: [] } : { status: 'missing', path: '', failures: [] }, approvedNarration: narration, aPage, visualRough: visual,
    player: { projectPath: rel(p), status: project?.status ?? 'missing', chaptersCompleted: project?.progress?.completed ?? 0, chaptersTotal: project?.progress?.total ?? 0, current: project?.progress?.current ?? null, entrypointPresent: exists(path.join(dir, 'src', 'entry.tsx')), sourceChapterCount: sourceChapters },
    audio: { segmentsPath: rel(audioPath), status: !segments.length ? 'not-extracted' : missing.length ? (audioFiles.length ? 'partial' : 'extracted') : 'complete', segmentCount: segments.length, fileCount: audioFiles.length, missingCount: missing.length, source: exists(path.join(dir, 'src')) ? 'narrations.ts' : null, ttsProvider: null },
    delivery: { recording: { status: 'not-observed', paths: [] }, finalVideo: { status: 'not-observed', paths: [] } } } };
}
function applyDerived(doc) {
  const o = doc.observations; const a = doc.approvals; const blockers = [...doc.coordination.blockers];
  const isApprovalDone = item => ['approved', 'not-required'].includes(item?.status);
  for (const section of [o.aPage, o.visualRough]) if (section.failures?.length) blockers.push(...section.failures.map(x => `验证失败: ${x}`));
  if (o.audio.missingCount) blockers.push(`音频缺少 ${o.audio.missingCount} 个文件`);
  const gaps = [];
  if (o.approvedNarration.status !== 'missing' && !isApprovalDone(a.narration)) gaps.push('narration');
  if (o.visualRough.status !== 'missing' && !isApprovalDone(a.visualRough)) gaps.push('visualRough');
  if (o.player.entrypointPresent && !isApprovalDone(a.checkpointPlan)) gaps.push('checkpointPlan');
  if (o.player.sourceChapterCount > 0 && !isApprovalDone(a.firstChapter)) gaps.push('firstChapter');
  if (o.audio.status !== 'not-extracted' && !isApprovalDone(a.checkpointAudio)) gaps.push('checkpointAudio');
  if (o.delivery.finalVideo.status === 'present' && !isApprovalDone(a.finalDelivery)) gaps.push('finalDelivery');
  const complete = o.delivery.finalVideo.status === 'present' && a.finalDelivery.status === 'approved';
  const stageStatus = STAGES.map(([id, name]) => ({ id, name, status: 'not-started' }));
  const set = (id, status) => { stageStatus.find(s => s.id === id).status = status; };
  if (o.taskPackage.status === 'present') set('freeze-task-package', 'complete');
  if (o.approvedNarration.status !== 'missing') set('continuous-narration', 'complete');
  if (o.approvedNarration.status !== 'missing') set('approve-narration', isApprovalDone(a.narration) ? 'complete' : 'awaiting-approval');
  if (o.aPage.status !== 'missing') set('a-page', 'complete'); if (o.aPage.status === 'valid') set('validate-a-page', 'complete');
  if (o.aPage.status !== 'missing') set('compile-trace', 'complete'); if (o.visualRough.status !== 'missing') set('visual-rough', isApprovalDone(a.visualRough) ? 'complete' : 'awaiting-approval');
  if (o.player.entrypointPresent) { set('player-phase-1', 'complete'); set('checkpoint-plan', isApprovalDone(a.checkpointPlan) ? 'complete' : 'awaiting-approval'); set('chapter-handoff', 'complete'); set('chapter-production', o.player.chaptersTotal && o.player.chaptersCompleted >= o.player.chaptersTotal ? 'complete' : 'in-progress'); set('chapter-acceptance', isApprovalDone(a.firstChapter) ? 'complete' : 'awaiting-approval'); }
  if (o.audio.status !== 'not-extracted') set('audio', isApprovalDone(a.checkpointAudio) ? (o.audio.status === 'complete' ? 'complete' : 'in-progress') : 'awaiting-approval');
  if (o.delivery.finalVideo.status === 'present') set('recording-delivery', a.finalDelivery.status === 'approved' ? 'complete' : 'awaiting-approval');
  const firstOpen = stageStatus.find(s => ['in-progress', 'awaiting-approval', 'blocked', 'not-started'].includes(s.status));
  const status = complete ? 'delivered' : blockers.length ? 'blocked' : gaps.length ? 'awaiting-approval' : (o.approvedNarration.status === 'missing' && !o.player.entrypointPresent ? 'not-started' : 'in-progress');
  doc.summary = { status, currentStage: firstOpen?.id ?? 'recording-delivery', nextAction: complete ? '已完成交付' : gaps.length ? `补齐人工审批记录: ${gaps[0]}` : `推进阶段: ${firstOpen?.name ?? '录屏、后期与成片验收'}`, blockers, approvalGaps: gaps };
  doc.stages = stageStatus; return doc;
}
function save(id, doc) { const out = path.join(EPISODES_DIR, `${id}.json`); const tmp = `${out}.tmp`; fs.writeFileSync(tmp, JSON.stringify(doc, null, 2) + '\n'); fs.renameSync(tmp, out); }
function ids(args) { if (args.includes('--episode')) return [args[args.indexOf('--episode') + 1]]; return Array.from({ length: 51 }, (_, i) => `episode-${String(i + 1).padStart(2, '0')}`); }
function syncOne(id, initialize = false) { const out = path.join(EPISODES_DIR, `${id}.json`); const old = exists(out) ? readJson(out) : blank(id, id); const next = { ...old, ...obs(id), approvals: old.approvals ?? blank(id, id).approvals, coordination: old.coordination ?? blank(id, id).coordination, updatedAt: TODAY, updatedBy: 'production-status sync' }; applyDerived(next); save(id, next); return next; }
function check(doc) { const errors = []; if (doc.schemaVersion !== 'coursewebvideo/episode-production-status/v1') errors.push('schemaVersion'); if (doc.observations.player.projectPath !== ('player/episodes/' + doc.episodeId + '/project.json')) errors.push('player mirror path'); if (doc.summary.status === 'delivered' && doc.approvals.finalDelivery.status !== 'approved') errors.push('delivered without finalDelivery approval'); return errors; }
const args = process.argv.slice(2); const command = args[0] || 'report';
if (command === 'init' || command === 'sync') { for (const id of ids(args)) syncOne(id, command === 'init'); console.log(`${command}: ${ids(args).length} episode status files updated`); }
else if (command === 'check') { const files = fs.readdirSync(EPISODES_DIR).filter(f => f.endsWith('.json')); const errors = files.flatMap(f => check(readJson(path.join(EPISODES_DIR, f))).map(e => `${f}: ${e}`)); if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; } else console.log(`check: ${files.length} status files valid`); }
else if (command === 'report') { const files = fs.readdirSync(EPISODES_DIR).filter(f => f.endsWith('.json')).sort(); const docs = files.map(f => readJson(path.join(EPISODES_DIR, f))); for (const status of ['not-started', 'in-progress', 'awaiting-approval', 'blocked', 'delivered']) console.log(`${status}: ${docs.filter(d => d.summary.status === status).length}`); for (const d of docs) console.log(`${d.episodeId}\t${d.summary.status}\t${d.summary.currentStage}\t${d.summary.nextAction}`); }
else { console.error('Usage: node tools/production-status.mjs init|sync|check|report [--episode episode-01]'); process.exitCode = 1; }
