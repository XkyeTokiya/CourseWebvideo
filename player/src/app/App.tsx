import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { EPISODES, findEpisode } from "../catalog/projects";
import type { EpisodeModule, EpisodeStatus } from "../runtime/types";
import { LegacyPresentationApp } from "../shared/presentation-runtime/LegacyPresentationApp";
import { EpisodeLibrary } from "../studio/EpisodeLibrary";
import "../styles/studio.css";

function currentPath() {
  const match = window.location.pathname.match(/^\/play\/([^/]+)/);
  return match?.[1] ?? null;
}

function PlayerRoute({ id }: { id: string }) {
  const entry = findEpisode(id);
  const [module, setModule] = useState<EpisodeModule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) return;
    entry.load().then(setModule).catch((reason: unknown) => setError(String(reason)));
  }, [entry]);

  if (!entry) return <div className="route-error">找不到实例：{id}</div>;
  if (entry.project.status === "planned") return <div className="route-error">实例尚未进入制作，暂不可预览。</div>;
  if (error) return <div className="route-error">实例加载失败：{error}</div>;
  if (!module) return <div className="route-loading">正在加载实例…</div>;

  return (
    <LegacyPresentationApp
      chapters={module.CHAPTERS}
      episodeId={module.id}
      themeId={entry.project.theme}
    />
  );
}

export function App() {
  const id = currentPath();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.webvideoView = id ? "player" : "studio";
    return () => {
      delete root.dataset.webvideoView;
    };
  }, [id]);

  if (id) {
    return <Suspense fallback={<div className="route-loading">正在加载…</div>}><PlayerRoute id={id} /></Suspense>;
  }
  const statuses: EpisodeStatus[] = ["in-progress", "ready", "planned"];
  return <EpisodeLibrary entries={EPISODES} statuses={statuses} />;
}
