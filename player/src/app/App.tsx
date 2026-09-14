import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { EPISODES, findEpisode } from "../catalog/projects";
import { ObsCaptureApp } from "../capture/ObsCaptureApp";
import type { EpisodeModule, EpisodeStatus } from "../runtime/types";
import { LegacyPresentationApp } from "../shared/presentation-runtime/LegacyPresentationApp";
import { EpisodeLibrary } from "../studio/EpisodeLibrary";
import "../styles/studio.css";

type Route = { kind: "studio" } | { kind: "play" | "capture"; id: string };

function currentRoute(): Route {
  const capture = window.location.pathname.match(/^\/obs\/([^/]+)/);
  if (capture) return { kind: "capture", id: capture[1]! };
  const play = window.location.pathname.match(/^\/play\/([^/]+)/);
  if (play) return { kind: "play", id: play[1]! };
  return { kind: "studio" };
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

function CaptureRoute({ id }: { id: string }) {
  const entry = findEpisode(id);
  const [module, setModule] = useState<EpisodeModule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) return;
    entry.load().then(setModule).catch((reason: unknown) => setError(String(reason)));
  }, [entry]);

  if (!entry) return <div className="route-error">找不到实例：{id}</div>;
  if (entry.project.status === "planned") return <div className="route-error">实例尚未进入制作，暂不可录制。</div>;
  if (error) return <div className="route-error">实例加载失败：{error}</div>;
  if (!module) return <div className="route-loading">正在准备 OBS 画布…</div>;

  return <ObsCaptureApp chapters={module.CHAPTERS} episodeId={module.id} themeId={entry.project.theme} />;
}

export function App() {
  const route = currentRoute();
  const id = route.kind === "studio" ? null : route.id;

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.webvideoView = route.kind === "capture" ? "capture" : id ? "player" : "studio";
    return () => {
      delete root.dataset.webvideoView;
    };
  }, [id, route.kind]);

  if (route.kind === "play") {
    return <Suspense fallback={<div className="route-loading">正在加载…</div>}><PlayerRoute id={route.id} /></Suspense>;
  }
  if (route.kind === "capture") {
    return <Suspense fallback={<div className="route-loading">正在加载 OBS 画布…</div>}><CaptureRoute id={route.id} /></Suspense>;
  }
  const statuses: EpisodeStatus[] = ["in-progress", "ready", "planned"];
  return <EpisodeLibrary entries={EPISODES} statuses={statuses} />;
}
