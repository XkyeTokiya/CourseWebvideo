import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-opening-question/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-opening-question/narrations";
import A002Chapter from "./chapters/02-definition-resources/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-definition-resources/narrations";
import A003Chapter from "./chapters/03-beyond-distinction/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-beyond-distinction/narrations";

export const id = "episode-14";
export const title = "第 14 期 · 标识编码体系认知";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "01-opening-question",
    title: "情境提问",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
  {
    id: "02-definition-resources",
    title: "定义与作用",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-beyond-distinction",
    title: "起点与判断标准",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
];
