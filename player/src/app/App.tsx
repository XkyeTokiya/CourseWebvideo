import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { EPISODES, findEpisode, getLoadedEpisode, preloadEpisode } from "../catalog/projects";
import { ObsCaptureApp } from "../capture/ObsCaptureApp";
import type { EpisodeModule, EpisodeStatus } from "../runtime/types";
import { LegacyPresentationApp } from "../shared/presentation-runtime/LegacyPresentationApp";
import { EpisodeLibrary } from "../studio/EpisodeLibrary";
import "../styles/studio.css";

type Route = { kind: "studio" } | { kind: "play" | "capture"; id: string };
const statuses: EpisodeStatus[] = ["in-progress", "ready", "planned"];

function currentRoute(pathname = window.location.pathname): Route {
  const capture = pathname.match(/^\/obs\/([^/]+)/);
  if (capture) return { kind: "capture", id: capture[1]! };
  const play = pathname.match(/^\/play\/([^/]+)/);
  if (play) return { kind: "play", id: play[1]! };
  return { kind: "studio" };
}

function useEpisodeModule(id: string) {
  const entry = findEpisode(id);
  const [module, setModule] = useState<EpisodeModule | null>(() => getLoadedEpisode(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry || entry.project.status === "planned") return;
    let active = true;
    entry.load().then((loaded) => {
      if (active) setModule(loaded);
    }).catch((reason: unknown) => {
      if (active) setError(String(reason));
    });
    return () => { active = false; };
  }, [entry, id]);

  return { entry, module, error };
}

function PlayerRoute({ id }: { id: string }) {
  const { entry, module, error } = useEpisodeModule(id);
  if (!entry) return <div className="route-error">找不到实例：{id}</div>;
  if (entry.project.status === "planned") return <div className="route-error">实例尚未进入制作，暂不可预览。</div>;

  return <>
    <a className="exit-player" href="/">返回实例库</a>
    {error ? <div className="route-error">实例加载失败：{error}</div> : !module ? <div className="route-loading">正在加载实例…</div> : (
      <LegacyPresentationApp chapters={module.CHAPTERS} episodeId={module.id} themeId={entry.project.theme} />
    )}
  </>;
}

function CaptureRoute({ id }: { id: string }) {
  const { entry, module, error } = useEpisodeModule(id);
  if (!entry) return <div className="route-error">找不到实例：{id}</div>;
  if (entry.project.status === "planned") return <div className="route-error">实例尚未进入制作，暂不可录制。</div>;
  if (error) return <div className="route-error">实例加载失败：{error}</div>;
  if (!module) return <div className="route-loading">正在准备 OBS 画布…</div>;
  return <ObsCaptureApp chapters={module.CHAPTERS} episodeId={module.id} themeId={entry.project.theme} />;
}

export function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const [studioVisited, setStudioVisited] = useState(route.kind === "studio");
  const studioScroll = useRef(0);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const onPopState = () => {
      if (document.documentElement.dataset.webvideoView === "studio") studioScroll.current = window.scrollY;
      const next = currentRoute();
      setRoute(next);
      if (next.kind === "studio") setStudioVisited(true);
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.webvideoView = route.kind === "capture" ? "capture" : route.kind === "play" ? "player" : "studio";
    window.scrollTo({ top: route.kind === "studio" ? studioScroll.current : 0, behavior: "instant" });
    return () => { delete root.dataset.webvideoView; };
  }, [route]);

  function handleNavigation(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin || url.hash || !/^\/(?:$|(?:play|obs)\/[^/]+\/?$)/.test(url.pathname)) return;
    event.preventDefault();
    if (url.href === window.location.href) return;
    if (route.kind === "studio") studioScroll.current = window.scrollY;
    const next = currentRoute(url.pathname);
    if (next.kind !== "studio") preloadEpisode(next.id);
    else setStudioVisited(true);
    window.history.pushState(null, "", `${url.pathname}${url.search}`);
    setRoute(next);
  }

  return <div onClick={handleNavigation}>
    {studioVisited && <div hidden={route.kind !== "studio"}><EpisodeLibrary entries={EPISODES} statuses={statuses} /></div>}
    {route.kind === "play" && <Suspense fallback={<div className="route-loading">正在加载…</div>}><PlayerRoute key={route.id} id={route.id} /></Suspense>}
    {route.kind === "capture" && <Suspense fallback={<div className="route-loading">正在加载 OBS 画布…</div>}><CaptureRoute key={route.id} id={route.id} /></Suspense>}
  </div>;
}
