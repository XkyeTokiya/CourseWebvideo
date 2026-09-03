(function () {
  'use strict';

  const workflow = window.CourseWorkflow;
  const stageMap = new Map(workflow.stages.map(stage => [stage.id, stage]));
  const stateMeta = {
    'not-started': ['未开始', 'neutral'], 'in-progress': ['进行中', 'in-progress'],
    'awaiting-approval': ['待审批', 'awaiting-approval'], blocked: ['阻塞', 'blocked'],
    complete: ['完成', 'complete'], 'not-required': ['无需', 'neutral']
  };
  const artifactMeta = {
    missing: ['缺失', 'danger'], invalid: ['验证失败', 'danger'], draft: ['草稿', 'warn'],
    present: ['存在', 'ok'], valid: ['有效', 'ok'], approved: ['已批准', 'ok'],
    ready: ['就绪', 'ok'], planned: ['已规划', 'warn'], 'in-progress': ['进行中', 'warn'],
    extracted: ['已提取', 'warn'], partial: ['部分完成', 'warn'], complete: ['完整', 'ok'],
    'not-extracted': ['未提取', 'neutral'], 'not-observed': ['未观测', 'neutral'],
    unknown: ['待检查', 'neutral']
  };

  const appState = {
    doc: null,
    episodeId: new URLSearchParams(location.search).get('episode') || 'episode-01',
    selectedStageId: new URLSearchParams(location.search).get('stage'),
    sourceMode: null,
    statusHandle: null,
    repoHandle: null,
    statusUrl: null,
    artifacts: [],
    probes: new Map(),
    previewPath: '',
    checklist: new Set()
  };

  const $ = selector => document.querySelector(selector);
  const dom = {
    loading: $('#loadingScreen'), app: $('#app'), episodeLabel: $('#episodeLabel'), fileLabel: $('#fileLabel'),
    updatedLabel: $('#updatedLabel'), episodeTitle: $('#episodeTitle'), sourceBadge: $('#sourceBadge'), alertStrip: $('#alertStrip'),
    alertSummary: $('#alertSummary'), stageNav: $('#stageNav'), stageSelect: $('#stageSelect'), progressLabel: $('#progressLabel'),
    progressBar: $('#progressBar'), episodePosition: $('#episodePosition'), prevEpisode: $('#prevEpisode'), nextEpisode: $('#nextEpisode'),
    stageNumber: $('#stageNumber'), stageGroup: $('#stageGroup'), stageState: $('#stageState'), stageTitle: $('#stageTitle'),
    stagePurpose: $('#stagePurpose'), stageReviewBadge: $('#stageReviewBadge'), stageAlerts: $('#stageAlerts'),
    stageAlertCount: $('#stageAlertCount'), stageAlertList: $('#stageAlertList'), artifactSummary: $('#artifactSummary'),
    artifactList: $('#artifactList'), previewSection: $('#previewSection'), previewTitle: $('#previewTitle'),
    previewMeta: $('#previewMeta'), previewContent: $('#previewContent'), checklist: $('#checklist'), checkProgress: $('#checkProgress'),
    decisionTitle: $('#decisionTitle'), decisionHelp: $('#decisionHelp'), reviewer: $('#reviewerInput'), reviewNote: $('#reviewNote'),
    decisionActions: $('#decisionActions'), readonlyMessage: $('#readonlyMessage'), approveBtn: $('#approveBtn'),
    requestChangesBtn: $('#requestChangesBtn'), pendingBtn: $('#pendingBtn'), nextStageTitle: $('#nextStageTitle'),
    nextStageDescription: $('#nextStageDescription'), prerequisites: $('#prerequisites'), copyPromptBtn: $('#copyPromptBtn'),
    promptPreview: $('#promptPreview'), connectionDialog: $('#connectionDialog'), statusFileInput: $('#statusFileInput'),
    moreDialog: $('#moreDialog'), ownerInput: $('#ownerInput'), targetDateInput: $('#targetDateInput'),
    coordinationNotes: $('#coordinationNotes'), rawJson: $('#rawJson'), toasts: $('#toasts')
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function localToday() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function serialize(doc) { return `${JSON.stringify(doc, null, 2)}\n`; }
  function episodeNumber(id) { return Number(String(id).match(/\d+/)?.[0] || 1); }
  function episodeLabel(id) { return `第 ${episodeNumber(id)} 集`; }
  function currentStage() { return stageMap.get(appState.selectedStageId) || workflow.stages[0]; }
  function currentStageIndex() { return workflow.stages.findIndex(stage => stage.id === currentStage().id); }
  function stageStatus(id) { return appState.doc.stages?.find(stage => stage.id === id)?.status || 'not-started'; }
  function stageReview(id) { return appState.doc.stageReviews?.[id] || null; }
  function approvalStatus(key) { return appState.doc.approvals?.[key]?.status || 'unrecorded'; }
  function isApprovalDone(key) { return ['approved', 'not-required'].includes(approvalStatus(key)); }
  function toast(message, tone = 'ok') {
    const item = document.createElement('div');
    item.className = `toast ${tone}`;
    item.textContent = message;
    dom.toasts.appendChild(item);
    window.setTimeout(() => item.remove(), 3600);
  }
  async function copyText(value, message) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement('textarea');
      area.value = value; area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
    }
    toast(message);
  }
  function downloadDoc() {
    const blob = new Blob([serialize(appState.doc)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `${appState.doc.episodeId}.json`; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('coursewebvideo-production-status', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('handles');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function storeHandle(key, handle) {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const request = db.transaction('handles', 'readwrite').objectStore('handles').put(handle, key);
      request.onsuccess = resolve; request.onerror = () => reject(request.error);
    });
    db.close();
  }
  async function readHandle(key) {
    try {
      const db = await openDb();
      const value = await new Promise((resolve, reject) => {
        const request = db.transaction('handles').objectStore('handles').get(key);
        request.onsuccess = () => resolve(request.result || null); request.onerror = () => reject(request.error);
      });
      db.close(); return value;
    } catch { return null; }
  }
  async function permissionGranted(handle, write = false) {
    if (!handle?.queryPermission) return false;
    return (await handle.queryPermission({ mode: write ? 'readwrite' : 'read' })) === 'granted';
  }
  async function requestPermission(handle, write = false) {
    if (!handle?.requestPermission) return false;
    return (await handle.requestPermission({ mode: write ? 'readwrite' : 'read' })) === 'granted';
  }

  async function entryFromPath(root, relativePath, kind = 'file') {
    const segments = relativePath.replaceAll('\\', '/').split('/').filter(Boolean);
    let cursor = root;
    for (let index = 0; index < segments.length - 1; index += 1) cursor = await cursor.getDirectoryHandle(segments[index]);
    return kind === 'directory'
      ? cursor.getDirectoryHandle(segments.at(-1))
      : cursor.getFileHandle(segments.at(-1));
  }
  async function findStatusFromPicked(picked, id) {
    const attempts = [
      { base: picked, path: `production-status/episodes/${id}.json`, repo: picked },
      { base: picked, path: `episodes/${id}.json`, repo: null },
      { base: picked, path: `${id}.json`, repo: null }
    ];
    for (const attempt of attempts) {
      try {
        const handle = await entryFromPath(attempt.base, attempt.path);
        return { handle, repo: attempt.repo };
      } catch { /* try next location */ }
    }
    throw new Error(`未找到 production-status/episodes/${id}.json`);
  }

  async function detectHttpStatus(id) {
    const candidates = [`episodes/${id}.json`, `production-status/episodes/${id}.json`];
    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate, { cache: 'no-store' });
        if (!response.ok) continue;
        return { doc: await response.json(), url: new URL(candidate, location.href) };
      } catch { /* try next location */ }
    }
    return null;
  }
  async function loadFromStatusHandle(handle, mode = 'directory') {
    const file = await handle.getFile();
    appState.doc = JSON.parse(await file.text());
    appState.statusHandle = handle;
    appState.sourceMode = mode;
  }
  async function loadInitial() {
    const savedHandle = await readHandle('repository-root');
    if (savedHandle && await permissionGranted(savedHandle, true)) {
      try {
        const result = await findStatusFromPicked(savedHandle, appState.episodeId);
        appState.repoHandle = savedHandle;
        await loadFromStatusHandle(result.handle);
        return true;
      } catch { /* fall back to HTTP */ }
    }
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      const result = await detectHttpStatus(appState.episodeId);
      if (result) {
        appState.doc = result.doc; appState.statusUrl = result.url; appState.sourceMode = 'http';
        return true;
      }
    }
    return false;
  }

  function resolveArtifact(definition) {
    const doc = appState.doc;
    let path = definition.path ? workflow.interpolate(definition.path, doc) : '';
    let status = 'unknown';
    let failures = [];
    let paths = [];
    if (definition.source === 'observation') {
      const item = doc.observations?.[definition.observation] || {};
      path = item.path || path; status = item.status || 'unknown'; failures = item.failures || [];
    } else if (definition.source === 'player') {
      const item = doc.observations?.player || {};
      path = item.projectPath || path; status = item.status || 'unknown';
    } else if (definition.source === 'audio') {
      const item = doc.observations?.audio || {};
      path = item.segmentsPath || path; status = item.status || 'unknown';
    } else if (definition.source === 'delivery') {
      const item = doc.observations?.delivery?.[definition.observation] || {};
      paths = item.paths || []; path = paths[0] || ''; status = item.status || 'unknown';
    }
    const probe = appState.probes.get(path);
    if (probe && definition.source === 'derived') status = probe.exists ? 'present' : 'missing';
    return { ...definition, path, status, failures, paths };
  }
  function statusInfo(status) { return artifactMeta[status] || artifactMeta.unknown; }
  function artifactIsUsable(artifact) { return !['missing', 'invalid', 'unknown', 'not-observed', 'not-extracted'].includes(artifact.status); }
  function artifactHttpUrl(path) { return new URL(`../../${path}`, appState.statusUrl); }

  async function probeArtifact(artifact) {
    if (!artifact.path || artifact.source !== 'derived' || appState.probes.has(artifact.path)) return;
    let exists = false;
    try {
      if (appState.repoHandle) {
        const isDirectory = artifact.path.endsWith('/');
        await entryFromPath(appState.repoHandle, artifact.path, isDirectory ? 'directory' : 'file');
        exists = true;
      } else if (appState.sourceMode === 'http') {
        const response = await fetch(artifactHttpUrl(artifact.path), { method: 'HEAD', cache: 'no-store' });
        exists = response.ok;
      }
    } catch { exists = false; }
    appState.probes.set(artifact.path, { exists });
  }
  async function probeCurrentArtifacts() {
    await Promise.all(appState.artifacts.map(probeArtifact));
    appState.artifacts = currentStage().artifacts.map(resolveArtifact);
    renderArtifacts(); renderNextStage();
  }

  function allAlerts() {
    const doc = appState.doc;
    const alerts = [];
    const hasNarration = doc.observations?.approvedNarration?.status !== 'missing';
    const hasAPage = doc.observations?.aPage?.status !== 'missing';
    const hasVisual = doc.observations?.visualRough?.status !== 'missing';
    const hasPlayer = Boolean(doc.observations?.player?.entrypointPresent);
    const hasChapters = (doc.observations?.player?.sourceChapterCount || 0) > 0;
    const hasAudio = doc.observations?.audio?.status !== 'not-extracted';
    const hasFinal = doc.observations?.delivery?.finalVideo?.status === 'present';
    if (hasNarration && !isApprovalDone('narration')) alerts.push({ stage: 'approve-narration', text: '批准口播文件已经存在，但“批准连续口播”门禁尚未记录。' });
    if (hasAPage && !isApprovalDone('narration')) alerts.push({ stage: 'a-page', text: 'A-page 已生成，但其上游口播门禁尚未通过。' });
    if (hasVisual && !isApprovalDone('visualRough')) alerts.push({ stage: 'visual-rough', text: 'Visual rough 已存在，但仍未记录人工批准。' });
    if (hasPlayer && !isApprovalDone('checkpointPlan')) alerts.push({ stage: 'checkpoint-plan', text: '播放器入口已经存在，但 Checkpoint Plan 尚未通过。' });
    if (hasChapters && !isApprovalDone('firstChapter')) alerts.push({ stage: 'chapter-acceptance', text: '章节文件已经存在，但第 1 章验收尚未通过。' });
    if (hasAudio && !isApprovalDone('checkpointAudio')) alerts.push({ stage: 'audio', text: '音频分段已经提取，但 Checkpoint Audio 尚未确认。' });
    if (hasFinal && !isApprovalDone('finalDelivery')) alerts.push({ stage: 'recording-delivery', text: '最终成片已经登记，但最终交付尚未验收。' });
    return alerts;
  }
  function stageAlerts() {
    const selected = currentStageIndex();
    return allAlerts().filter(alert => workflow.stages.findIndex(stage => stage.id === alert.stage) <= selected);
  }

  function renderHeader() {
    const doc = appState.doc;
    document.title = `${episodeLabel(doc.episodeId)} · ${doc.title}`;
    dom.episodeLabel.textContent = episodeLabel(doc.episodeId);
    dom.fileLabel.textContent = `${doc.episodeId}.json`;
    dom.updatedLabel.textContent = `更新于 ${doc.updatedAt || '未知'} · ${doc.updatedBy || '未知'}`;
    dom.episodeTitle.textContent = doc.title;
    const source = appState.sourceMode === 'directory' ? ['可写 · 仓库目录', 'writable'] : appState.sourceMode === 'file' ? ['单文件 · 下载保存', 'readonly'] : ['在线 · 下载保存', 'readonly'];
    dom.sourceBadge.className = `source-badge ${source[1]}`;
    dom.sourceBadge.querySelector('span').textContent = source[0];
    const alerts = allAlerts();
    dom.alertStrip.classList.toggle('hidden', alerts.length === 0);
    dom.alertSummary.textContent = alerts.length ? `${alerts.length} 项跨阶段事实需要确认` : '';
  }
  function renderStageNav() {
    const groups = [...new Set(workflow.stages.map(stage => stage.group))];
    dom.stageNav.innerHTML = groups.map(group => `
      <div class="stage-group-label">${escapeHtml(group)}</div>
      ${workflow.stages.filter(stage => stage.group === group).map(stage => {
        const status = stageStatus(stage.id);
        const review = stageReview(stage.id);
        const dotStatus = review?.status === 'changes-requested' ? 'blocked' : status;
        return `<button class="stage-link${stage.id === currentStage().id ? ' active' : ''}${stage.gateKey ? ' gate' : ''}" data-stage="${stage.id}" type="button">
          <span class="stage-index"><span>${stage.number}</span></span>
          <span class="stage-copy"><strong>${escapeHtml(stage.label)}</strong><small>${escapeHtml(stage.short)}</small></span>
          <i class="stage-dot ${dotStatus}" aria-hidden="true"></i>
        </button>`;
      }).join('')}
    `).join('');
    dom.stageSelect.innerHTML = workflow.stages.map(stage => `<option value="${stage.id}"${stage.id === currentStage().id ? ' selected' : ''}>${stage.number} · ${escapeHtml(stage.label)}</option>`).join('');
    const completed = appState.doc.stages?.filter(stage => ['complete', 'not-required'].includes(stage.status)).length || 0;
    dom.progressLabel.textContent = `${completed} / 14`;
    dom.progressBar.style.width = `${completed / 14 * 100}%`;
  }
  function renderEpisodeSwitcher() {
    const number = episodeNumber(appState.doc.episodeId);
    dom.episodePosition.textContent = `${String(number).padStart(2, '0')} / 51`;
    dom.prevEpisode.disabled = number <= 1; dom.nextEpisode.disabled = number >= 51;
  }
  function renderStageHero() {
    const stage = currentStage();
    const status = stageStatus(stage.id);
    const [label, className] = stateMeta[status] || stateMeta['not-started'];
    dom.stageNumber.textContent = `阶段 ${stage.number}`; dom.stageGroup.textContent = stage.group;
    dom.stageState.textContent = label; dom.stageState.className = `state-pill ${className}`;
    dom.stageTitle.textContent = stage.label; dom.stagePurpose.textContent = stage.purpose;
    const review = stageReview(stage.id);
    dom.stageReviewBadge.classList.toggle('hidden', !review);
    if (review) {
      const text = review.status === 'approved' ? '人工审核已通过' : review.status === 'changes-requested' ? '已要求修改' : '等待决定';
      dom.stageReviewBadge.textContent = text;
      dom.stageReviewBadge.className = `review-badge ${review.status}`;
    }
  }
  function renderAlerts() {
    const alerts = stageAlerts();
    dom.stageAlerts.classList.toggle('hidden', alerts.length === 0);
    dom.stageAlertCount.textContent = String(alerts.length);
    dom.stageAlertList.innerHTML = alerts.map(alert => `<div class="issue-item">${escapeHtml(alert.text)}</div>`).join('');
  }
  function renderArtifacts() {
    const artifacts = appState.artifacts;
    const available = artifacts.filter(artifactIsUsable).length;
    dom.artifactSummary.textContent = `${available} / ${artifacts.length} 项可用`;
    if (!artifacts.length) {
      dom.artifactList.innerHTML = '<div class="empty-artifacts">当前阶段没有登记可预览产物。</div>';
      return;
    }
    dom.artifactList.innerHTML = artifacts.map((artifact, index) => {
      const [statusLabel, tone] = statusInfo(artifact.status);
      const previewable = Boolean(artifact.path) && !artifact.path.endsWith('/');
      return `<article class="artifact-row">
        <div class="artifact-main">
          <span class="file-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg></span>
          <div class="artifact-copy">
            <div class="artifact-name">${escapeHtml(artifact.label)} <span class="artifact-status ${tone}">${escapeHtml(statusLabel)}</span></div>
            <div class="artifact-path">${escapeHtml(artifact.path || '状态文件未登记路径')}</div>
            ${artifact.note ? `<div class="artifact-note">${escapeHtml(artifact.note)}</div>` : ''}
            ${artifact.failures.length ? `<div class="artifact-note">${escapeHtml(artifact.failures.join('；'))}</div>` : ''}
          </div>
        </div>
        <div class="artifact-side">
          <button class="row-action" data-copy-artifact="${index}" type="button"${artifact.path ? '' : ' disabled'}>复制路径</button>
          <button class="row-action" data-preview-artifact="${index}" type="button"${previewable ? '' : ' disabled'}>预览</button>
        </div>
      </article>`;
    }).join('');
  }
  function checklistStorageKey() { return `coursewebvideo-review-checks:${appState.doc.episodeId}:${currentStage().id}`; }
  function mechanicalChecklistIndices(stage) {
    const doc = appState.doc;
    const o = doc.observations || {};
    const player = o.player || {};
    const stageIsComplete = ['complete', 'not-required'].includes(stageStatus(stage.id));
    const hasTaskPackage = o.taskPackage?.status === 'present';
    const hasNarration = !['missing', 'invalid'].includes(o.approvedNarration?.status);
    const hasValidAPage = o.aPage?.status === 'valid';
    const hasPlayer = Boolean(player.entrypointPresent);
    const chaptersComplete = hasPlayer && player.chaptersTotal > 0 && player.chaptersCompleted >= player.chaptersTotal;

    if (stage.gateKey && (isApprovalDone(stage.gateKey) || stageIsComplete)) return stage.checklist.map((_, index) => index);
    if (stage.id === 'freeze-task-package' && hasTaskPackage) return stage.checklist.map((_, index) => index);
    if (stage.id === 'continuous-narration' && hasNarration) return stage.checklist.map((_, index) => index);
    if (['a-page', 'compile-trace', 'validate-a-page'].includes(stage.id) && hasValidAPage) return stage.checklist.map((_, index) => index);
    if (stage.id === 'player-phase-1' && hasPlayer) return stage.checklist.map((_, index) => index);
    if (stage.id === 'chapter-handoff' && hasPlayer) return stage.checklist.map((_, index) => index);
    if (stage.id === 'chapter-production' && chaptersComplete) return stage.checklist.map((_, index) => index);
    if (!stage.gateKey && stageIsComplete) return stage.checklist.map((_, index) => index);
    return [];
  }
  function loadChecklist() {
    try {
      appState.checklist = new Set(JSON.parse(sessionStorage.getItem(checklistStorageKey()) || '[]'));
    } catch { appState.checklist = new Set(); }
    mechanicalChecklistIndices(currentStage()).forEach(index => appState.checklist.add(index));
  }
  function renderChecklist() {
    const items = currentStage().checklist;
    const automatic = new Set(mechanicalChecklistIndices(currentStage()));
    dom.checklist.innerHTML = items.map((item, index) => `<label class="check-item${automatic.has(index) ? ' automatic' : ''}"><input type="checkbox" data-check="${index}"${appState.checklist.has(index) ? ' checked' : ''}${automatic.has(index) ? ' disabled' : ''}><span>${escapeHtml(item)}</span>${automatic.has(index) ? '<small>机械确认</small>' : ''}</label>`).join('');
    updateCheckProgress();
  }
  function updateCheckProgress() {
    const total = currentStage().checklist.length;
    dom.checkProgress.textContent = `${appState.checklist.size} / ${total}`;
    dom.approveBtn.disabled = appState.checklist.size < total;
  }
  function renderDecision() {
    const stage = currentStage();
    const review = stageReview(stage.id);
    dom.decisionTitle.textContent = stage.gateKey ? workflow.approvalLabels[stage.gateKey] : '记录阶段审核结论';
    dom.decisionHelp.textContent = stage.gateKey ? '这是人工事实。通过后才能正式启动下一阶段。' : '记录本阶段的人工检查结果，不覆盖磁盘观测和推导状态。';
    dom.reviewer.value = review?.reviewedBy || localStorage.getItem('coursewebvideo-reviewer') || '界面人工审核';
    dom.reviewNote.value = review?.note || '';
    const directWrite = appState.sourceMode === 'directory';
    dom.readonlyMessage.classList.toggle('hidden', directWrite);
    dom.readonlyMessage.textContent = '当前数据源不可直接写入。审核后会下载修改后的状态文件。';
    dom.approveBtn.textContent = stage.gateKey ? '通过并放行' : '审核通过';
    updateCheckProgress();
  }
  function reviewAllowsNext(stage) {
    if (stage.gateKey) return isApprovalDone(stage.gateKey);
    return ['complete', 'not-required'].includes(stageStatus(stage.id)) || stageReview(stage.id)?.status === 'approved';
  }
  function renderNextStage() {
    const stage = currentStage();
    const index = currentStageIndex();
    const next = workflow.stages[index + 1];
    const prompt = workflow.interpolate(stage.prompt, appState.doc);
    dom.nextStageTitle.textContent = next ? `启动 ${next.label}` : '完成本集交付';
    dom.nextStageDescription.textContent = next ? next.short : '登记真实交付证据并完成最终验收。';
    dom.promptPreview.textContent = `工作目录：${stage.group === '上游内容' ? `${workflow.root}\\narration-pipeline` : `${workflow.root}\\player`}\n\n${prompt}`;
    const artifactsReady = appState.artifacts.length === 0 || appState.artifacts.every(artifact => !['missing', 'invalid'].includes(artifact.status));
    const checksReady = appState.checklist.size === stage.checklist.length;
    const decisionReady = reviewAllowsNext(stage);
    const conditions = [
      [artifactsReady, '当前阶段没有缺失或验证失败的关键产物'],
      [checksReady, '本阶段审核清单已完成'],
      [decisionReady, stage.gateKey ? '人工门禁已经放行' : '阶段事实或人工审核已完成']
    ];
    dom.prerequisites.innerHTML = conditions.map(([met, label]) => `<div class="prerequisite${met ? ' met' : ''}"><i>${met ? '✓' : ''}</i><span>${escapeHtml(label)}</span></div>`).join('');
    dom.copyPromptBtn.disabled = !conditions.every(([met]) => met);
  }
  function renderMore() {
    const coordination = appState.doc.coordination || {};
    dom.ownerInput.value = coordination.owner || '';
    dom.targetDateInput.value = coordination.targetDate || '';
    dom.coordinationNotes.value = coordination.notes || '';
    dom.rawJson.textContent = serialize(appState.doc);
  }
  function renderAll() {
    renderHeader(); renderStageNav(); renderEpisodeSwitcher(); renderStageHero(); renderAlerts();
    appState.artifacts = currentStage().artifacts.map(resolveArtifact);
    loadChecklist(); renderArtifacts(); renderChecklist(); renderDecision(); renderNextStage(); renderMore();
    dom.loading.classList.add('hidden'); dom.app.classList.remove('hidden');
    probeCurrentArtifacts();
  }

  function selectStage(id, updateUrl = true) {
    if (!stageMap.has(id)) return;
    appState.selectedStageId = id;
    appState.previewPath = '';
    dom.previewSection.classList.add('hidden');
    if (updateUrl) {
      const url = new URL(location.href); url.searchParams.set('stage', id); history.replaceState(null, '', url);
    }
    renderStageNav(); renderStageHero(); renderAlerts();
    appState.artifacts = currentStage().artifacts.map(resolveArtifact);
    loadChecklist(); renderArtifacts(); renderChecklist(); renderDecision(); renderNextStage();
    probeCurrentArtifacts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function readArtifact(path) {
    if (appState.repoHandle) {
      const handle = await entryFromPath(appState.repoHandle, path);
      const file = await handle.getFile();
      return { blob: file, text: await file.text(), type: file.type };
    }
    if (appState.sourceMode === 'http') {
      const response = await fetch(artifactHttpUrl(path), { cache: 'no-store' });
      if (!response.ok) throw new Error(`读取失败：HTTP ${response.status}`);
      const blob = await response.blob();
      return { blob, text: await blob.text(), type: blob.type };
    }
    throw new Error('请连接仓库根目录后预览阶段文件');
  }
  async function previewArtifact(index) {
    const artifact = appState.artifacts[index];
    if (!artifact?.path) return;
    appState.previewPath = artifact.path;
    dom.previewTitle.textContent = artifact.label;
    dom.previewMeta.textContent = artifact.path;
    dom.previewContent.innerHTML = '<div class="preview-error">正在读取文件...</div>';
    dom.previewSection.classList.remove('hidden');
    try {
      const result = await readArtifact(artifact.path);
      const extension = artifact.path.split('.').at(-1)?.toLowerCase();
      if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension)) {
        const url = URL.createObjectURL(result.blob);
        dom.previewContent.innerHTML = `<img src="${url}" alt="${escapeHtml(artifact.label)}">`;
      } else if (['mp4', 'webm', 'mov'].includes(extension)) {
        const url = URL.createObjectURL(result.blob);
        dom.previewContent.innerHTML = `<video src="${url}" controls></video>`;
      } else {
        let text = result.text;
        if (extension === 'json') {
          try { text = JSON.stringify(JSON.parse(text), null, 2); } catch { /* show source text */ }
        }
        dom.previewContent.innerHTML = `<pre>${escapeHtml(text)}</pre>`;
      }
    } catch (error) {
      dom.previewContent.innerHTML = `<div class="preview-error">${escapeHtml(error.message || error)}</div>`;
    }
  }

  async function persistDoc(message) {
    appState.doc.updatedAt = localToday();
    appState.doc.updatedBy = dom.reviewer.value.trim() || '界面人工审核';
    localStorage.setItem('coursewebvideo-reviewer', appState.doc.updatedBy);
    if (appState.sourceMode === 'directory' && appState.statusHandle) {
      if (!await permissionGranted(appState.statusHandle, true) && !await requestPermission(appState.statusHandle, true)) throw new Error('未获得状态文件写权限');
      const writable = await appState.statusHandle.createWritable();
      await writable.write(serialize(appState.doc)); await writable.close();
      toast(message);
    } else {
      downloadDoc(); toast(`${message}；已下载修改后的状态文件`, 'warn');
    }
    renderAll();
  }
  async function saveReview(status) {
    const stage = currentStage();
    const note = dom.reviewNote.value.trim();
    if (status === 'changes-requested' && !note) {
      toast('要求修改时请填写具体审核说明', 'danger'); dom.reviewNote.focus(); return;
    }
    if (status === 'approved' && appState.checklist.size < stage.checklist.length) {
      toast('请先完成本阶段审核清单', 'warn'); return;
    }
    const reviewedBy = dom.reviewer.value.trim() || '界面人工审核';
    const evidence = appState.artifacts.map(artifact => artifact.path).filter(Boolean).join('; ') || null;
    appState.doc.stageReviews ||= {};
    appState.doc.stageReviews[stage.id] = { status, reviewedAt: new Date().toISOString(), reviewedBy, evidence, note: note || null };
    if (stage.gateKey) {
      const approvalStatusValue = status === 'approved' ? 'approved' : status === 'changes-requested' ? 'rejected' : 'pending';
      appState.doc.approvals[stage.gateKey] = { status: approvalStatusValue, decidedAt: new Date().toISOString(), decidedBy: reviewedBy, evidence, note: note || null };
    }
    try { await persistDoc(status === 'approved' ? '审核结论已记录' : status === 'changes-requested' ? '修改要求已记录' : '阶段已标记为待定'); }
    catch (error) { toast(`保存失败：${error.message || error}`, 'danger'); }
  }
  async function saveCoordination() {
    appState.doc.coordination.owner = dom.ownerInput.value.trim() || null;
    appState.doc.coordination.targetDate = dom.targetDateInput.value || null;
    appState.doc.coordination.notes = dom.coordinationNotes.value.trim();
    try { await persistDoc('协调信息已更新'); dom.moreDialog.close(); }
    catch (error) { toast(`保存失败：${error.message || error}`, 'danger'); }
  }

  async function connectRepository() {
    if (!window.showDirectoryPicker) { toast('当前浏览器不支持目录访问，请使用 Chrome 或 Edge', 'warn'); return; }
    try {
      const picked = await window.showDirectoryPicker({ id: 'coursewebvideo-repository', mode: 'readwrite' });
      if (!await permissionGranted(picked, true) && !await requestPermission(picked, true)) return;
      const result = await findStatusFromPicked(picked, appState.episodeId);
      appState.repoHandle = result.repo;
      if (result.repo) await storeHandle('repository-root', picked);
      await loadFromStatusHandle(result.handle);
      appState.probes.clear(); dom.connectionDialog.close(); renderAll();
      if (!result.repo) toast('状态文件已连接；若需预览阶段产物，请改选仓库根目录', 'warn');
    } catch (error) {
      if (error?.name !== 'AbortError') toast(error.message || String(error), 'danger');
    }
  }
  async function loadSelectedFile(file) {
    if (!file) return;
    try {
      appState.doc = JSON.parse(await file.text()); appState.sourceMode = 'file'; appState.statusHandle = null;
      appState.episodeId = appState.doc.episodeId; dom.connectionDialog.close(); renderAll();
    } catch { toast('状态文件不是有效 JSON', 'danger'); }
  }
  async function refresh() {
    try {
      if (appState.sourceMode === 'directory') await loadFromStatusHandle(appState.statusHandle);
      else if (appState.sourceMode === 'http') {
        const result = await detectHttpStatus(appState.episodeId); if (!result) throw new Error('未找到状态文件');
        appState.doc = result.doc; appState.statusUrl = result.url;
      } else { dom.connectionDialog.showModal(); return; }
      appState.probes.clear(); renderAll(); toast('状态已刷新');
    } catch (error) { toast(`刷新失败：${error.message || error}`, 'danger'); }
  }
  function navigateEpisode(offset) {
    const number = episodeNumber(appState.doc.episodeId) + offset;
    if (number < 1 || number > 51) return;
    const id = `episode-${String(number).padStart(2, '0')}`;
    const url = new URL(location.href); url.searchParams.set('episode', id); url.searchParams.delete('stage');
    location.href = url;
  }

  function bindEvents() {
    $('#backBtn').addEventListener('click', () => {
      if (document.referrer.includes('dashboard.html')) history.back(); else location.href = 'dashboard.html';
    });
    $('#themeBtn').addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme; localStorage.setItem('coursewebvideo-theme', theme);
    });
    $('#refreshBtn').addEventListener('click', refresh);
    $('#moreBtn').addEventListener('click', () => { renderMore(); dom.moreDialog.showModal(); });
    $('#showAlertsBtn').addEventListener('click', () => {
      const firstAlert = allAlerts()[0]; if (firstAlert) selectStage(firstAlert.stage);
    });
    dom.stageNav.addEventListener('click', event => {
      const button = event.target.closest('[data-stage]'); if (button) selectStage(button.dataset.stage);
    });
    dom.stageSelect.addEventListener('change', () => selectStage(dom.stageSelect.value));
    dom.prevEpisode.addEventListener('click', () => navigateEpisode(-1));
    dom.nextEpisode.addEventListener('click', () => navigateEpisode(1));
    dom.artifactList.addEventListener('click', event => {
      const preview = event.target.closest('[data-preview-artifact]');
      const copy = event.target.closest('[data-copy-artifact]');
      if (preview) previewArtifact(Number(preview.dataset.previewArtifact));
      if (copy) copyText(appState.artifacts[Number(copy.dataset.copyArtifact)].path, '文件路径已复制');
    });
    $('#closePreviewBtn').addEventListener('click', () => dom.previewSection.classList.add('hidden'));
    $('#copyPathBtn').addEventListener('click', () => appState.previewPath && copyText(appState.previewPath, '文件路径已复制'));
    dom.checklist.addEventListener('change', event => {
      const input = event.target.closest('[data-check]'); if (!input) return;
      const index = Number(input.dataset.check);
      if (input.checked) appState.checklist.add(index); else appState.checklist.delete(index);
      sessionStorage.setItem(checklistStorageKey(), JSON.stringify([...appState.checklist]));
      updateCheckProgress(); renderNextStage();
    });
    dom.approveBtn.addEventListener('click', () => saveReview('approved'));
    dom.requestChangesBtn.addEventListener('click', () => saveReview('changes-requested'));
    dom.pendingBtn.addEventListener('click', () => saveReview('pending'));
    dom.copyPromptBtn.addEventListener('click', () => copyText(dom.promptPreview.textContent, '下一阶段提示词已复制'));
    $('#pickRepoBtn').addEventListener('click', connectRepository);
    $('#pickStatusBtn').addEventListener('click', () => dom.statusFileInput.click());
    dom.statusFileInput.addEventListener('change', () => loadSelectedFile(dom.statusFileInput.files[0]));
    $('#downloadBtn').addEventListener('click', downloadDoc);
    $('#saveCoordinationBtn').addEventListener('click', saveCoordination);
  }

  async function boot() {
    document.documentElement.dataset.theme = localStorage.getItem('coursewebvideo-theme') || 'dark';
    bindEvents();
    const loaded = await loadInitial();
    if (!loaded) {
      dom.loading.classList.add('hidden'); dom.connectionDialog.showModal(); return;
    }
    if (!stageMap.has(appState.selectedStageId)) appState.selectedStageId = stageMap.has(appState.doc.summary?.currentStage) ? appState.doc.summary.currentStage : workflow.stages[0].id;
    renderAll();
  }

  boot();
}());
