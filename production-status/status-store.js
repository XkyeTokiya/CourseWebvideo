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
    const payload = await readJson(INDEX_PATH, token);
    if (!Array.isArray(payload.episodes)) throw new Error('索引格式无效');
    return { ...payload, url: new URL(INDEX_PATH, location.href) };
  }

  async function loadHttpEpisode(id, token = Date.now()) {
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

  window.CourseStatusStore = {
    INDEX_PATH,
    EPISODE_PATTERN,
    cacheBust,
    readJson,
    loadHttpIndex,
    loadHttpEpisode,
    loadDirectoryEntries,
  };
})();
