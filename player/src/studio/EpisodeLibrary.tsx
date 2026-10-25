import { useEffect, useState } from "react";
import { ArrowRightIcon, CaretDownIcon, CaretRightIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import type { EpisodeCatalogEntry, EpisodeProject, EpisodeStatus } from "../runtime/types";
import { preloadEpisode } from "../catalog/projects";

const labels: Record<EpisodeStatus, string> = { "in-progress": "制作中", ready: "已制作", planned: "待制作" };
const themeMetadata = import.meta.glob<{ id: string; nameZh: string }>(
  "../../.agents/skills/web-video-presentation/themes/*/theme.json",
  { eager: true, import: "default" },
);
const themeNames = Object.fromEntries(Object.values(themeMetadata).map((theme) => [theme.id, theme.nameZh]));
type SortOrder = "updated" | "ascending" | "descending";

function episodeNumber(project: EpisodeProject) {
  return project.id.replace(/^episode-/, "");
}

function courseTitle(project: EpisodeProject) {
  return project.title.replace(/^第\s*\d+\s*期\s*[·・:：]\s*/, "");
}

function compareEntries(a: EpisodeCatalogEntry, b: EpisodeCatalogEntry, order: SortOrder) {
  const byNumber = a.project.id.localeCompare(b.project.id, undefined, { numeric: true });
  if (order === "ascending") return byNumber;
  if (order === "descending") return -byNumber;
  return b.project.updatedAt.localeCompare(a.project.updatedAt) || -byNumber;
}

export function EpisodeLibrary({ entries, statuses }: { entries: EpisodeCatalogEntry[]; statuses: EpisodeStatus[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EpisodeStatus | "all">("all");
  const [sort, setSort] = useState<SortOrder>("updated");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const search = query.trim().toLocaleLowerCase();
  const counts = Object.fromEntries(statuses.map((value) => [value, entries.filter((entry) => entry.project.status === value).length]));
  const visible = entries.filter(({ project }) => {
    const numericSearch = /^\d+$/.test(search);
    const matchesSearch = numericSearch
      ? Number(episodeNumber(project)) === Number(search)
      : `${project.id} ${project.title} 第${Number(episodeNumber(project))}期`.toLocaleLowerCase().includes(search);
    return (status === "all" || project.status === status)
      && (!search || matchesSearch);
  }).sort((a, b) => compareEntries(a, b, sort));
  const selected = visible.find(({ project }) => project.id === selectedId) ?? visible[0];

  useEffect(() => {
    if (!selected || selected.project.status === "planned") return;
    // Warm only the selected course; don't import all 51 episode graphs.
    const timer = window.setTimeout(() => preloadEpisode(selected.project.id), 180);
    return () => window.clearTimeout(timer);
  }, [selected]);

  function resetFilters() {
    setQuery("");
    setStatus("all");
  }

  return (
    <main className="studio-page">
      <div className="studio-brand"><span>COURSEPLAY</span><span className="studio-brand-divider">/</span><span>WEB VIDEO STUDIO</span></div>
      <div className="studio-content">
        <header className="studio-header">
          <div><h1>视频实例库</h1><p className="studio-lede">找到课程，继续预览。</p></div>
          <dl className="studio-summary" aria-label="实例统计">
            <div className="studio-summary-total"><dt>实例</dt><dd>{entries.length}</dd></div>
            {statuses.map((value) => <div key={value}><dt>{labels[value]}</dt><dd>{counts[value]}</dd></div>)}
          </dl>
        </header>

        <div className="studio-search">
          <MagnifyingGlassIcon size={24} weight="light" aria-hidden="true" />
          <input aria-label="搜索课程名称或期次" type="search" placeholder="搜索课程名称或期次" value={query} onChange={(event) => setQuery(event.target.value)} />
          {query && <button className="studio-clear" type="button" aria-label="清空搜索" onClick={() => setQuery("")}><XIcon size={20} aria-hidden="true" /></button>}
        </div>

        <div className="studio-workspace">
          <div className="studio-filters" role="group" aria-label="按制作状态筛选">
            <button type="button" aria-pressed={status === "all"} onClick={() => setStatus("all")}>全部 <span>{entries.length}</span></button>
            {statuses.map((value) => <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>{labels[value]} <span>{counts[value]}</span></button>)}
          </div>
          <div className="studio-sort">
            <label htmlFor="studio-sort">排序</label>
            <div className="studio-select"><select id="studio-sort" value={sort} onChange={(event) => setSort(event.target.value as SortOrder)}><option value="updated">最近更新</option><option value="ascending">期次从小到大</option><option value="descending">期次从大到小</option></select><CaretDownIcon size={16} aria-hidden="true" /></div>
          </div>

          <section className="studio-catalog" aria-label="课程实例">
            {visible.length ? <ul className="studio-episode-list">
              {visible.map(({ project }) => {
                const active = selected?.project.id === project.id;
                return <li key={project.id} className={active ? "is-selected" : undefined}>
                  <button className="studio-episode-row" type="button" aria-pressed={active} aria-label={`第 ${episodeNumber(project)} 期，${courseTitle(project)}，${labels[project.status]}，查看详情`} onClick={() => setSelectedId(project.id)}>
                    <span className="studio-episode-number"><span>EPISODE</span><strong>{episodeNumber(project)}</strong></span>
                    <span className="studio-episode-title">{courseTitle(project)}</span>
                    <StatusLabel status={project.status} />
                    <span className="studio-row-progress">{project.progress.completed}<span> / </span>{project.progress.total}<span> 章</span></span>
                    <CaretRightIcon className="studio-row-chevron" size={18} weight="light" aria-hidden="true" />
                  </button>
                  {active && <div className="studio-mobile-detail"><EpisodeDetail project={project} mobile /></div>}
                </li>;
              })}
            </ul> : <div className="studio-empty"><h2>没有找到匹配的实例</h2><p>试试其他课程名称、期次，或调整制作状态。</p><button type="button" onClick={resetFilters}>清除筛选</button></div>}
            <p className="studio-result-count" role="status">显示 {visible.length} 个实例{search ? ` · 搜索“${query.trim()}”` : ""}</p>
          </section>

          <aside className="studio-detail" aria-label="实例详情">
            {selected ? <EpisodeDetail project={selected.project} /> : <div className="studio-detail-empty"><span>WEB VIDEO</span><p>选择课程后，在这里查看详情。</p></div>}
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatusLabel({ status }: { status: EpisodeStatus }) {
  return <span className={`studio-status studio-status-${status}`}>{labels[status]}</span>;
}

function EpisodeDetail({ project, mobile = false }: { project: EpisodeProject; mobile?: boolean }) {
  const planned = project.status === "planned";
  const { completed, total } = project.progress;
  const percentage = total > 0 ? Math.min(100, Math.max(0, completed / total * 100)) : 0;
  const titleId = mobile ? "studio-mobile-detail-title" : "studio-detail-title";
  const title = courseTitle(project);
  const colon = title.search(/[：:]/);
  const splitTitle = colon >= 0 && colon < 14 && title.length > 18;
  return <section className="studio-detail-content" aria-labelledby={titleId}>
    <div className="studio-detail-cover" aria-hidden="true"><p>WEB VIDEO</p><span>EPISODE</span><div className="studio-cover-number"><strong>{episodeNumber(project)}</strong><hr /></div></div>
    <h2 id={titleId}>{splitTitle ? <>{title.slice(0, colon + 1)}<br className="studio-title-break" />{title.slice(colon + 1)}</> : title}</h2>
    <StatusLabel status={project.status} />
    <div className="studio-chapter-progress"><div><span>章节进度</span><strong>{completed} / {total} 章</strong></div><progress aria-label={`第 ${episodeNumber(project)} 期章节完成进度`} value={percentage} max={100} /></div>
    {planned ? <button className="studio-preview" type="button" disabled>等待制作开始</button> : <a className="studio-preview" href={`/play/${project.id}`} onMouseEnter={() => preloadEpisode(project.id)} onFocus={() => preloadEpisode(project.id)} onPointerDown={() => preloadEpisode(project.id)}><span>打开预览</span><ArrowRightIcon size={24} weight="regular" aria-hidden="true" /></a>}
    <dl className="studio-theme"><div><dt>样式</dt><dd>{themeNames[project.theme] ?? project.theme}</dd></div></dl>
  </section>;
}
