import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001OpeningLimitedSpace from "./chapters/01-a001-opening-limited-space/A001OpeningLimitedSpace";
import { narrations as a001Narrations } from "./chapters/01-a001-opening-limited-space/narrations";

export const id = "episode-36";
export const title = "标识载体设计：尺寸、位置、耐久与信息层级";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "a001-opening-limited-space",
    title: "片头与开场问题",
    narrations: a001Narrations,
    Component: A001OpeningLimitedSpace,
  },
];
