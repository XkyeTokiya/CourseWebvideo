import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-a001/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-a001/narrations";
import A002Chapter from "./chapters/02-a002/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-a002/narrations";
import A003Chapter from "./chapters/03-a003/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-a003/narrations";

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
  {
    id: "02-a002",
    title: "身份问题",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-a003",
    title: "Ecode 定义与物联网语境",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
];
