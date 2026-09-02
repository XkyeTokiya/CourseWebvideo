import type { ChapterDef } from "../shared/presentation-runtime/registry/types";

export type { ChapterDef, ChapterStepProps } from "../shared/presentation-runtime/registry/types";
export type PlaybackMode = "manual" | "audio" | "auto";
export type EpisodeStatus = "planned" | "in-progress" | "ready";

export interface EpisodeModule {
  id: string;
  title: string;
  CHAPTERS: ChapterDef[];
}


export interface EpisodeProgress {
  completed: number;
  total: number;
  current: string | null;
}

export interface EpisodeProject {
  id: string;
  title: string;
  status: EpisodeStatus;
  theme: string;
  progress: EpisodeProgress;
  updatedAt: string;
}

export interface EpisodeCatalogEntry {
  project: EpisodeProject;
  load: () => Promise<EpisodeModule>;
}
