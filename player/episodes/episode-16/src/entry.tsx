import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-opening-question/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-opening-question/narrations";
import A002Chapter from "./chapters/02-system-framework/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-system-framework/narrations";
import A003Chapter from "./chapters/03-governance-entry/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-governance-entry/narrations";
import A004Chapter from "./chapters/04-governance-division/A004Chapter";
import { narrations as a004Narrations } from "./chapters/04-governance-division/narrations";
import A005Chapter from "./chapters/05-country-context/A005Chapter";
import { narrations as a005Narrations } from "./chapters/05-country-context/narrations";

export const id = "episode-16";
export const title = "第 16 期 · Handle 编码：前缀、后缀与分布式解析";

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
    title: "开场提问",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
  {
    id: "02-system-framework",
    title: "体系框架",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-governance-entry",
    title: "治理入口",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "04-governance-division",
    title: "治理分工",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-country-context",
    title: "国家语境",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
];
