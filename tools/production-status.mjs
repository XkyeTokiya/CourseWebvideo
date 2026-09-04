import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const STATUS_DIR = path.join(ROOT, 'production-status');
const EPISODES_DIR = path.join(STATUS_DIR, 'episodes');
const PLAYER_DIR = path.join(ROOT, 'player');
const TASK_DIR = path.join(ROOT, 'narration-pipeline', 'episodes');
const TODAY = new Date().toISOString().slice(0, 10);
const NOW = () => new Date().toISOString();
const APPROVAL_KEYS = ['narration', 'visualRough', 'checkpointPlan', 'firstChapter', 'checkpointAudio', 'finalDelivery'];
const HANDOFF_EXEMPT_EPISODES = new Set(['episode-01', 'episode-02', 'episode-03', 'episode-04', 'episode-09']); // 保留明确名单，handoff 当前对所有 episode 均为非强制
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
    approvals: Object.fromEntries(APPROVAL_KEYS.map(k => [k, approval()])), coordination: { owner: null, targetDate: null, blockers: [], notes: '', externalArtifacts: [], paused: false },
    stages: STAGES.map(([stageId, name]) => ({ id: stageId, name, status: stageId === 'chapter-handoff' ? 'not-required' : 'not-started' })), updatedAt: TODAY, updatedBy: 'production-status sync' };
}
function obs(id, current) {
  const dir = path.join(PLAYER_DIR, 'episodes', id); const inputs = path.join(dir, 'inputs');
  const task = findTask(id); const p = path.join(dir, 'project.json'); const project = exists(p) ? readJson(p) : null;
  const file = (name, status = 'present') => { const f = path.join(inputs, name); return exists(f) ? { status, path: rel(f), sha256: sha256(f), failures: [] } : { status: 'missing', path: rel(f), failures: [] }; };
  const fileObservation = f => exists(f) ? { status: 'present', path: rel(f), sha256: sha256(f), failures: [] } : { status: 'missing', path: rel(f), failures: [] };
  const playerScript = fileObservation(path.join(dir, 'script.md')); const playerOutline = fileObservation(path.join(dir, 'outline.md'));
  let aPage = file(`${id}-a-page.json`), visual = file(`${id}-visual-rough.md`), narration = file('approved-spoken-text.txt');
  const av = path.join(inputs, `${id}-a-page-validation.json`); if (exists(av)) { const v = readJson(av); aPage.status = v.failures?.length ? 'invalid' : 'valid'; aPage.failures = v.failures ?? []; }
  const vv = path.join(inputs, `${id}-visual-rough-validation.json`); if (exists(vv)) { const v = readJson(vv); visual.status = v.failures?.length ? 'invalid' : (v.status === 'approved' ? 'approved' : v.status === 'draft' ? 'draft' : 'present'); visual.failures = v.failures ?? []; }
  const audioPath = path.join(dir, 'audio-segments.json'); const segments = exists(audioPath) ? readJson(audioPath) : []; const audioFiles = walk(path.join(dir, 'media', 'audio')).filter(f => /\.(mp3|wav|m4a|ogg)$/i.test(f));
  const expected = segments.map(s => path.join(dir, 'media', 'audio', s.audio)); const missing = expected.filter(f => !exists(f));
  const sourceChapters = walk(path.join(dir, 'src', 'chapters')).filter(f => f.endsWith('.tsx') && !f.endsWith('narrations.ts')).length;
  const title = project?.title && !project.title.includes('待制作') ? project.title : taskTitle(task, id);
  return { title, observations: { taskPackage: task ? { status: 'present', path: rel(task), sha256: sha256(task), failures: [] } : { status: 'missing', path: '', failures: [] }, approvedNarration: narration, aPage, visualRough: visual,
    playerScript, playerOutline,
    player: { projectPath: rel(p), status: project?.status ?? 'missing', chaptersCompleted: project?.progress?.completed ?? 0, chaptersTotal: project?.progress?.total ?? 0, current: project?.progress?.current ?? null, entrypointPresent: exists(path.join(dir, 'src', 'entry.tsx')), sourceChapterCount: sourceChapters },
    audio: { segmentsPath: rel(audioPath), status: !segments.length ? 'not-extracted' : missing.length ? (audioFiles.length ? 'partial' : 'extracted') : 'complete', segmentCount: segments.length, fileCount: audioFiles.length, missingCount: missing.length, source: exists(path.join(dir, 'src')) ? 'narrations.ts' : null, ttsProvider: null },
    delivery: { recording: { status: 'not-observed', paths: [] }, finalVideo: { status: 'not-observed', paths: [] } } } };
}
function runCommand(command, args, cwd = ROOT) {
  const started = Date.now();
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 120000, windowsHide: true });
  return { command: [command, ...args].join(' '), exitCode: result.status ?? 1, durationMs: Date.now() - started, stdout: (result.stdout || '').trim().slice(-4000), stderr: (result.stderr || '').trim().slice(-4000), timedOut: result.error?.code === 'ETIMEDOUT' };
}
function findCompileTrace(id) {
  const candidates = walk(path.join(ROOT, '.tmp')).filter(file => file.toLowerCase().endsWith('.json') && path.basename(file).toLowerCase().includes('compile-trace') && file.includes(`${path.sep}${id}${path.sep}`));
  return candidates.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || null;
}
function runGlobalChecks(enabled) {
  if (!enabled) return [];
  return [['typecheck', ['run', 'typecheck']], ['lint', ['run', 'lint']]].map(([name, args]) => {
    const command = runCommand('pnpm', args, path.join(ROOT, 'player'));
    return { name, command };
  });
}
function scanEpisode(id, doc, options = {}) {
  const checks = {};
  const failures = [];
  const warnings = [];
  const commands = [];
  const o = doc.observations || {};
  const record = (name, pass, detail, command = null) => {
    checks[name] = { status: pass ? 'passed' : 'failed', detail };
    if (!pass) failures.push(`${name}: ${detail}`);
    if (command) commands.push(command);
  };
  record('task-package', o.taskPackage?.status === 'present', o.taskPackage?.status === 'present' ? '任务包存在且已计算指纹' : '任务包缺失');
  const narrationStarted = o.approvedNarration?.status !== 'missing' || o.aPage?.status !== 'missing' || o.visualRough?.status !== 'missing' || o.player?.entrypointPresent;
  record('approved-narration', o.approvedNarration?.status !== 'missing' || !narrationStarted, o.approvedNarration?.status !== 'missing' ? '批准口播已发布' : '尚未发布批准口播');
  record('a-page', o.aPage?.status === 'valid' || (o.aPage?.status === 'missing' && o.approvedNarration?.status === 'missing'), o.aPage?.status === 'valid' ? 'A-page 报告通过' : (o.aPage?.failures?.join('; ') || 'A-page 尚未进入生产'));
  record('visual-rough', !o.visualRough?.failures?.length, o.visualRough?.failures?.join('; ') || (o.visualRough?.status === 'missing' ? 'Visual rough 尚未进入生产' : `Visual rough 状态为 ${o.visualRough?.status}`));
  if (options.upstream !== false) {
    const aPagePath = o.aPage?.path ? path.join(ROOT, o.aPage.path) : null;
    const visualPath = o.visualRough?.path ? path.join(ROOT, o.visualRough.path) : null;
    const approvedPath = o.approvedNarration?.path ? path.join(ROOT, o.approvedNarration.path) : null;
    const taskPath = o.taskPackage?.path ? path.join(ROOT, o.taskPackage.path) : null;
    const tracePath = findCompileTrace(id);
    if (aPagePath && visualPath && approvedPath && taskPath && exists(aPagePath) && exists(visualPath)) {
      const recipes = path.join(ROOT, 'narration-pipeline', '.agents', 'skills', 'design-course-visual-rough', 'references', 'page-recipes');
      const outputDir = path.join(ROOT, '.tmp', 'production-status-scan'); fs.mkdirSync(outputDir, { recursive: true });
      const visualCommand = runCommand('python', [path.join(ROOT, 'narration-pipeline', '.agents', 'skills', 'design-course-visual-rough', 'scripts', 'verify_visual_rough.py'), '--a-page', aPagePath, '--visual-rough', visualPath, '--recipes-dir', recipes, '--output', path.join(outputDir, `${id}-visual-rough-validation.json`)]);
      record('visual-rough-validator', visualCommand.exitCode === 0, visualCommand.exitCode === 0 ? '上游 visual rough validator 通过' : (visualCommand.stderr || visualCommand.stdout || '上游 visual rough validator 失败'), visualCommand);
    }
    if (aPagePath && approvedPath && taskPath && tracePath && exists(aPagePath) && exists(approvedPath) && exists(taskPath)) {
      const outputDir = path.join(ROOT, '.tmp', 'production-status-scan'); fs.mkdirSync(outputDir, { recursive: true });
      const aPageCommand = runCommand('python', [path.join(ROOT, 'narration-pipeline', '.agents', 'skills', 'rewrite-course-narration', 'scripts', 'verify_compilation.py'), '--validation-profile', 'a-page-v6', '--task-package', taskPath, '--compile-trace', tracePath, '--approved-text', approvedPath, '--compiled-json', aPagePath, '--output', path.join(outputDir, `${id}-a-page-validation.json`)]);
      record('a-page-validator', aPageCommand.exitCode === 0, aPageCommand.exitCode === 0 ? '上游 A-page validator 通过' : (aPageCommand.stderr || aPageCommand.stdout || '上游 A-page validator 失败'), aPageCommand);
    } else if (aPagePath && exists(aPagePath) && o.aPage?.status === 'valid' && !tracePath) {
      warnings.push('找不到当前 A-page 对应的 compile trace，未重跑上游 validator');
    }
  }
  if (options.player !== false) {
    const command = runCommand(process.execPath, ['tools/validate-episodes.mjs', '--episode', id], path.join(ROOT, 'player'));
    record('player-contract', command.exitCode === 0, command.exitCode === 0 ? 'episode:check 通过' : (command.stderr || command.stdout || 'episode:check 失败'), command);
  }
  const audio = o.audio || {};
  record('audio-files', audio.status !== 'partial' && audio.missingCount === 0, audio.status === 'not-extracted' ? '尚未提取音频分段' : audio.missingCount ? `缺少 ${audio.missingCount} 个音频文件` : '音频文件与分段齐全');
  if (audio.status === 'not-extracted') warnings.push('音频阶段尚未开始');
  for (const { name, command } of options.globalChecks || []) {
    record(name, command.exitCode === 0, command.exitCode === 0 ? `${name} 通过` : (command.stderr || command.stdout || `${name} 失败`), command);
  }
  const sourceHashes = {};
  for (const key of ['taskPackage', 'approvedNarration', 'aPage', 'visualRough', 'playerScript', 'playerOutline']) if (o[key]?.sha256) sourceHashes[key] = o[key].sha256;
  const blockingFailures = failures.filter(item => !/尚未进入生产|尚未发布批准口播|尚未通过验证|尚未提取音频分段/.test(item));
  if (!blockingFailures.length && failures.length) warnings.push(...failures);
  return { status: blockingFailures.length ? 'failed' : 'passed', ranAt: NOW(), runner: 'production-status scan', checks, failures: blockingFailures, warnings, sourceHashes, commands };
}
function deriveReadiness(doc) {
  const automation = doc.automation || { status: 'not-run', failures: [] };
  const stages = doc.stages || [];
  const current = stages.find(stage => ['blocked', 'in-progress', 'awaiting-approval', 'not-started'].includes(stage.status));
  const reasons = [];
  if (doc.coordination?.paused) reasons.push('负责人已暂停');
  if (automation.status === 'failed') reasons.push(...(automation.failures || []));
  if (automation.status === 'not-run') reasons.push('尚未运行全量机械扫描');
  if (doc.summary?.approvalGaps?.length) reasons.push(`等待人工决策: ${doc.summary.approvalGaps.join(', ')}`);
  const productionStatus = doc.observations?.delivery?.finalVideo?.status === 'present' && doc.approvals?.finalDelivery?.status === 'approved' ? 'complete' : (doc.observations?.taskPackage?.status === 'present' && (doc.observations?.approvedNarration?.status !== 'missing' || doc.observations?.player?.entrypointPresent) ? 'in-progress' : 'not-started');
  const humanStatus = doc.coordination?.paused ? 'paused' : doc.summary?.approvalGaps?.length ? 'needs-decision' : 'none';
  let state = 'in-progress';
  if (doc.observations?.delivery?.finalVideo?.status === 'present' && doc.approvals?.finalDelivery?.status === 'approved') state = 'delivered';
  else if (doc.coordination?.paused || automation.status === 'failed') state = 'blocked';
  else if (automation.status === 'not-run') state = doc.observations?.taskPackage?.status === 'present' && !doc.observations?.approvedNarration?.sha256 ? 'not-started' : 'needs-scan';
  else if (doc.summary?.approvalGaps?.length) state = 'needs-owner';
  else if (productionStatus === 'not-started') state = 'not-started';
  else if (!current) state = 'complete';
  else state = current.status === 'in-progress' ? 'in-progress' : 'ready';
  return { state, canAdvance: ['ready', 'in-progress'].includes(state), reasons, productionStatus, automationStatus: automation.status, humanStatus };
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
  const stageStatus = STAGES.map(([id, name]) => ({ id, name, status: id === 'chapter-handoff' ? 'not-required' : 'not-started' }));
  const set = (id, status) => { stageStatus.find(s => s.id === id).status = status; };
  if (o.taskPackage.status === 'present') set('freeze-task-package', 'complete');
  if (o.approvedNarration.status !== 'missing') set('continuous-narration', 'complete');
  if (o.approvedNarration.status !== 'missing') set('approve-narration', isApprovalDone(a.narration) ? 'complete' : 'awaiting-approval');
  if (o.aPage.status !== 'missing') set('a-page', 'complete'); if (o.aPage.status === 'valid') set('validate-a-page', 'complete');
  if (o.aPage.status !== 'missing') set('compile-trace', 'complete'); if (o.visualRough.status !== 'missing') set('visual-rough', isApprovalDone(a.visualRough) ? 'complete' : 'awaiting-approval');
  if (o.player.entrypointPresent) { set('player-phase-1', 'complete'); set('checkpoint-plan', isApprovalDone(a.checkpointPlan) ? 'complete' : 'awaiting-approval'); set('chapter-handoff', 'not-required'); set('chapter-production', o.player.chaptersTotal && o.player.chaptersCompleted >= o.player.chaptersTotal ? 'complete' : 'in-progress'); set('chapter-acceptance', isApprovalDone(a.firstChapter) ? 'complete' : 'awaiting-approval'); }
  if (o.audio.status !== 'not-extracted') set('audio', isApprovalDone(a.checkpointAudio) ? (o.audio.status === 'complete' ? 'complete' : 'in-progress') : 'awaiting-approval');
  if (o.delivery.finalVideo.status === 'present') set('recording-delivery', a.finalDelivery.status === 'approved' ? 'complete' : 'awaiting-approval');
  const firstOpen = stageStatus.find(s => ['in-progress', 'awaiting-approval', 'blocked', 'not-started'].includes(s.status));
  const status = complete ? 'delivered' : blockers.length ? 'blocked' : gaps.length ? 'awaiting-approval' : (o.approvedNarration.status === 'missing' && !o.player.entrypointPresent ? 'not-started' : 'in-progress');
  doc.summary = { ...doc.summary, status, currentStage: firstOpen?.id ?? 'recording-delivery', nextAction: complete ? '已完成交付' : gaps.length ? `补齐人工审批记录: ${gaps[0]}` : `推进阶段: ${firstOpen?.name ?? '录屏、后期与成片验收'}`, blockers, approvalGaps: gaps };
  doc.stages = stageStatus;
  for (const stage of doc.stages) {
    const stageFailures = [];
    if (stage.id === 'validate-a-page' && o.aPage.failures?.length) stageFailures.push(...o.aPage.failures);
    if (stage.id === 'audio' && o.audio.missingCount) stageFailures.push(`音频缺少 ${o.audio.missingCount} 个文件`);
    stage.health = stageFailures.length ? 'blocked' : (stage.status === 'not-started' || doc.automation?.status === 'not-run' ? 'not-run' : 'passed');
    stage.reasons = stageFailures;
    stage.canAdvance = stage.status === 'complete' || stage.status === 'not-required' || (stage.status === 'in-progress' && !stageFailures.length);
  }
  doc.readiness = deriveReadiness(doc);
  doc.summary.productionStatus = doc.readiness.productionStatus;
  doc.summary.automationStatus = doc.readiness.automationStatus;
  doc.summary.humanStatus = doc.readiness.humanStatus;
  return doc;
}
function save(id, doc) { const out = path.join(EPISODES_DIR, `${id}.json`); const tmp = `${out}.tmp`; fs.writeFileSync(tmp, JSON.stringify(doc, null, 2) + '\n'); fs.renameSync(tmp, out); }
function writeIndex() {
  const files = fs.readdirSync(EPISODES_DIR).filter(f => /^episode-\d{2}\.json$/.test(f)).sort();
  const episodes = files.map(file => compactEpisode(readJson(path.join(EPISODES_DIR, file))));
  const out = path.join(STATUS_DIR, 'index.json'); const tmp = `${out}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify({ schemaVersion: 'coursewebvideo/episode-production-status/index/v1', generatedAt: new Date().toISOString(), count: episodes.length, episodes }, null, 2) + '\n');
  fs.renameSync(tmp, out);
}
function compactEpisode(doc) {
  return { schemaVersion: doc.schemaVersion, episodeId: doc.episodeId, title: doc.title, summary: doc.summary, readiness: doc.readiness, automation: doc.automation, approvals: doc.approvals, coordination: doc.coordination, stages: doc.stages, updatedAt: doc.updatedAt, updatedBy: doc.updatedBy,
    observations: { delivery: doc.observations?.delivery ?? { recording: { status: 'not-observed', paths: [] }, finalVideo: { status: 'not-observed', paths: [] } } } };
}
function ids(args) { if (args.includes('--episode')) return [args[args.indexOf('--episode') + 1]]; return Array.from({ length: 51 }, (_, i) => `episode-${String(i + 1).padStart(2, '0')}`); }
function syncOne(id, initialize = false) { const out = path.join(EPISODES_DIR, `${id}.json`); const old = exists(out) ? readJson(out) : blank(id, id); const next = { ...old, ...obs(id), approvals: old.approvals ?? blank(id, id).approvals, coordination: old.coordination ?? blank(id, id).coordination, updatedAt: TODAY, updatedBy: 'production-status sync' }; applyDerived(next); save(id, next); return next; }
function scanOne(id, options = {}) { const out = path.join(EPISODES_DIR, `${id}.json`); const old = exists(out) ? readJson(out) : syncOne(id); const next = { ...old, ...obs(id), approvals: old.approvals ?? blank(id, id).approvals, coordination: old.coordination ?? blank(id, id).coordination, updatedAt: TODAY, updatedBy: 'production-status scan' }; next.automation = scanEpisode(id, next, options); applyDerived(next); save(id, next); return next; }
function check(doc) { const errors = []; if (doc.schemaVersion !== 'coursewebvideo/episode-production-status/v1') errors.push('schemaVersion'); if (doc.observations.player.projectPath !== ('player/episodes/' + doc.episodeId + '/project.json')) errors.push('player mirror path'); if (doc.summary.status === 'delivered' && doc.approvals.finalDelivery.status !== 'approved') errors.push('delivered without finalDelivery approval'); return errors; }
const args = process.argv.slice(2); const command = args[0] || 'report';
if (command === 'init' || command === 'sync') { for (const id of ids(args)) syncOne(id, command === 'init'); writeIndex(); console.log(`${command}: ${ids(args).length} episode status files updated; index.json regenerated`); }
else if (command === 'scan') { const options = { build: args.includes('--build'), player: !args.includes('--no-player'), upstream: !args.includes('--no-upstream') }; options.globalChecks = runGlobalChecks(options.build); for (const id of ids(args)) scanOne(id, options); writeIndex(); console.log(`scan: ${ids(args).length} episode status files scanned; index.json regenerated`); }
else if (command === 'index') { writeIndex(); console.log('index: production-status/index.json regenerated'); }
else if (command === 'check') { const files = fs.readdirSync(EPISODES_DIR).filter(f => f.endsWith('.json')); const errors = files.flatMap(f => check(readJson(path.join(EPISODES_DIR, f))).map(e => `${f}: ${e}`)); if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; } else console.log(`check: ${files.length} status files valid`); }
else if (command === 'report') { const files = fs.readdirSync(EPISODES_DIR).filter(f => f.endsWith('.json')).sort(); const docs = files.map(f => readJson(path.join(EPISODES_DIR, f))); const states = ['not-started', 'needs-scan', 'in-progress', 'ready', 'needs-owner', 'blocked', 'complete', 'delivered']; for (const state of states) console.log(`${state}: ${docs.filter(d => (d.readiness?.state || d.summary.status) === state).length}`); for (const d of docs) console.log(`${d.episodeId}\t${d.readiness?.state || d.summary.status}\t${d.summary.currentStage}\t${d.summary.nextAction}`); }
else { console.error('Usage: node tools/production-status.mjs init|sync|scan|index|check|report [--episode episode-01] [--build] [--no-upstream]'); process.exitCode = 1; }
