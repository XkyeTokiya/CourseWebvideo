import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-opening-title/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-opening-title/narrations";
import A002Chapter from "./chapters/02-one-object-many-codes/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-one-object-many-codes/narrations";

export const id = "episode-19";
export const title = "GS1 与五类编码体系怎么选";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "01-opening-title",
    title: "开场标题",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
  {
    id: "02-one-object-many-codes",
    title: "一个对象，多套编号",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
];
