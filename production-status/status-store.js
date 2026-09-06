(() => {
  'use strict';

  const INDEX_PATH = 'index.json';
  const EPISODE_PATTERN = /^episode-\d{2}\.json$/i;

  function cacheBust(url, token = Date.now()) {
    const result = new URL(url, location.href);
    result.searchParams.set('_refresh', String(token));
    return result.href;
  }

  async function readJson(url, token = Date.now()) {
    const response = await fetch(cacheBust(url, token), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) throw new Error(`读取失败：HTTP ${response.status}`);
    return response.json();
  }

  async function loadHttpIndex(token = Date.now()) {
    const health = await readJson('/health', token);
    if (health.service !== 'coursewebvideo-production-status') throw new Error('本地服务版本不匹配，请重新运行启动生产状态工作台.cmd');
    const payload = await readJson(INDEX_PATH, token);
    if (!Array.isArray(payload.episodes)) throw new Error('索引格式无效');
    return { ...payload, url: new URL(INDEX_PATH, location.href) };
  }

  async function loadHttpEpisode(id, token = Date.now()) {
    const health = await readJson('/health', token);
    if (health.service !== 'coursewebvideo-production-status') throw new Error('本地服务版本不匹配，请重新运行启动生产状态工作台.cmd');
    const payload = await readJson(`episodes/${id}.json`, token);
    return { doc: payload, url: new URL(`episodes/${id}.json`, location.href) };
  }

  async function loadDirectoryEntries(directoryHandle) {
    const entries = [];
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'file' && EPISODE_PATTERN.test(name)) entries.push({ name, handle });
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    const loaded = [];
    const failures = [];
    const concurrency = 8;
    for (let offset = 0; offset < entries.length; offset += concurrency) {
      const batch = entries.slice(offset, offset + concurrency);
      const results = await Promise.allSettled(batch.map(async entry => {
        const file = await entry.handle.getFile();
        return { doc: JSON.parse(await file.text()), handle: entry.handle };
      }));
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') loaded.push(result.value);
        else failures.push({ name: batch[index].name, error: result.reason });
      });
    }
    return { loaded, failures };
  }

  const APPROVALS = [
    ['narration', '批准口播', doc => doc.observations?.approvedNarration?.status !== 'missing'],
    ['visualRough', 'Visual rough', doc => doc.observations?.visualRough?.status !== 'missing'],
    ['checkpointPlan', 'Checkpoint Plan', doc => Boolean(doc.observations?.player?.entrypointPresent)],
    ['firstChapter', '首章验收', doc => (doc.observations?.player?.sourceChapterCount || 0) > 0],
    ['checkpointAudio', '音频门禁', doc => doc.observations?.audio?.status !== 'not-extracted'],
    ['finalDelivery', '成片验收', doc => doc.observations?.delivery?.finalVideo?.status === 'present'],
  ];

  function htmlEscape(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function installApprovalControls() {
    const root = document.getElementById('root');
    if (!root || !('MutationObserver' in window)) return;
    const style = document.createElement('style');
    style.textContent = '.approval-panel{margin-top:18px;padding:16px 18px;background:var(--surface);border:1px solid var(--line);border-radius:6px}.approval-panel h2{margin:0;font-size:15px}.approval-panel p{margin:4px 0 12px;color:var(--muted);font-size:12px}.approval-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line);font-size:12px}.approval-row small{color:var(--muted)}.approval-row button{height:30px;padding:0 10px;border:1px solid var(--accent);border-radius:4px;background:var(--accent);color:#fff;font-size:12px}.approval-row button.revoke{background:var(--surface);color:var(--accent)}.approval-row button:disabled{opacity:.5;cursor:wait}.approval-status{font-weight:600}.approval-status.ok{color:var(--ok)}.approval-status.warn{color:var(--warn)}.approval-status.muted{color:var(--muted)}@media(max-width:560px){.approval-row{grid-template-columns:minmax(0,1fr) auto}.approval-row small{grid-column:1}.approval-row button{grid-column:2;grid-row:1 / span 2}}';
    document.head.append(style);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    async function waitScan(runId) {
      for (let attempt = 0; attempt < 240; attempt += 1) {
        await sleep(500);
        const response = await fetch(`/api/production-status/scan?run=${encodeURIComponent(runId)}`, { cache: 'no-store' });
        const result = await response.json();
        if (result.status !== 'running') return result;
      }
      throw new Error('扫描超时');
    }
    const render = () => {
      const doc = window.d;
      if (!doc || root.querySelector('.approval-panel')) return;
      const exemptions = new Set(doc.workflow?.exemptions || []);
      const rows = APPROVALS.map(([key, label, applies]) => {
        const approval = doc.approvals?.[key] || {};
        const exempt = exemptions.has(key);
        const applicable = applies(doc);
        const approved = approval.status === 'approved';
        const state = exempt ? '旧流程豁免' : approved ? '已通过' : applicable ? '待审批' : '未进入阶段';
        const tone = exempt || approved ? 'ok' : applicable ? 'warn' : 'muted';
        const action = exempt || !applicable ? '' : `<button class="${approved ? 'revoke' : ''}" data-approval-gate="${key}" data-approval-status="${approved ? 'unrecorded' : 'approved'}">${approved ? '撤销通过' : '审批通过'}</button>`;
        return `<div class="approval-row"><strong>${label}</strong><small>${exempt ? '沿用旧流程，不需要当前门禁' : applicable ? '人工决策写回状态文件' : '相关生产输入尚未出现'}</small><span class="approval-status ${tone}">${state}</span>${action}</div>`;
      }).join('');
      const panel = document.createElement('section');
      panel.className = 'approval-panel';
      panel.innerHTML = `<h2>人工门禁</h2><p>这里只处理人工决策；机器扫描失败仍会独立保留并阻塞生产。</p>${rows}`;
      root.append(panel);
      panel.querySelectorAll('[data-approval-gate]').forEach(button => {
        button.addEventListener('click', async () => {
          panel.querySelectorAll('button').forEach(item => { item.disabled = true; });
          button.textContent = '写回中…';
          try {
            const response = await fetch('/api/production-status/approval', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ episode: doc.episodeId, gate: button.dataset.approvalGate, status: button.dataset.approvalStatus }) });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
            const result = await waitScan(payload.run.id);
            if (result.status !== 'passed') throw new Error(result.error || result.output || '扫描失败');
            location.reload();
          } catch (error) {
            panel.querySelectorAll('button').forEach(item => { item.disabled = false; });
            button.textContent = button.dataset.approvalStatus === 'approved' ? '审批通过' : '撤销通过';
            alert(`门禁操作失败：${htmlEscape(error.message || error)}`);
          }
        });
      });
    };
    new MutationObserver(render).observe(root, { childList: true });
    render();
  }

  window.CourseStatusStore = {
    INDEX_PATH,
    EPISODE_PATTERN,
    cacheBust,
    readJson,
    loadHttpIndex,
    loadHttpEpisode,
    loadDirectoryEntries,
    installApprovalControls,
  };
  installApprovalControls();
})();
