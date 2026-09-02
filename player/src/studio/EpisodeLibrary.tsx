import type { EpisodeCatalogEntry, EpisodeStatus } from "../runtime/types";

const labels: Record<EpisodeStatus, string> = { "in-progress": "制作中", ready: "已制作", planned: "待制作" };

export function EpisodeLibrary({ entries, statuses }: { entries: EpisodeCatalogEntry[]; statuses: EpisodeStatus[] }) {
  return (
    <main className="studio-page">
      <header className="studio-header">
        <div><p className="eyebrow">WEB VIDEO STUDIO / PLAYER</p><h1>视频实例库</h1><p className="studio-lede">一个入口，浏览、检查并预览所有新体系实例。</p></div>
        <div className="studio-count"><strong>{entries.length}</strong><span>实例</span></div>
      </header>
      {statuses.map((status) => {
        const group = entries.filter((entry) => entry.project.status === status);
        return <section className="episode-group" key={status}><div className="group-heading"><h2>{labels[status]}</h2><span>{group.length}</span></div><div className="episode-grid">{group.length ? group.map((entry) => <EpisodeCard key={entry.project.id} entry={entry} />) : <div className="empty-group">暂无实例</div>}</div></section>;
      })}
    </main>
  );
}

function EpisodeCard({ entry }: { entry: EpisodeCatalogEntry }) {
  const { project } = entry;
  const href = project.status === "planned" ? null : `/play/${project.id}`;
  const content = <>
    <div className="episode-card-top"><span className={`status status-${project.status}`}>{project.status === "ready" ? "READY" : project.status === "in-progress" ? "IN PROGRESS" : "PLANNED"}</span><span className="episode-id">{project.id}</span></div>
    <h3>{project.title}</h3>
    <dl><div><dt>主题</dt><dd>{project.theme}</dd></div><div><dt>进度</dt><dd>{project.progress.completed}/{project.progress.total} 章</dd></div><div><dt>当前</dt><dd>{project.progress.current ?? "尚未开始"}</dd></div></dl>
    <span className={href ? "open-episode" : "disabled-open"}>{href ? <>打开预览 <span>↗</span></> : "等待制作开始"}</span>
  </>;

  return href
    ? <a className="episode-card episode-card-link" href={href}>{content}</a>
    : <article className="episode-card">{content}</article>;
}
