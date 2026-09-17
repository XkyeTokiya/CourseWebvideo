import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import OpeningCheck from "./chapters/01-opening-check/OpeningCheck";
import { narrations as openingNarrations } from "./chapters/01-opening-check/narrations";

export const id = "episode-12";
export const title = "汽车零部件精益管理：一物一码如何减少错装与串货";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "opening-check",
    title: "开场情境页",
    narrations: openingNarrations,
    Component: OpeningCheck,
  },
];
