import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-a001/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-a001/narrations";

export const id = "episode-18";
export const title = "Ecode 编码：版本、体系标识与主码";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "01-a001",
    title: "开场与跨环节记录",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
];
