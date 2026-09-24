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
import A006Chapter from "./chapters/06-prefix-suffix-split/A006Chapter";
import { narrations as a006Narrations } from "./chapters/06-prefix-suffix-split/narrations";
import A007Chapter from "./chapters/07-prefix-layering/A007Chapter";
import { narrations as a007Narrations } from "./chapters/07-prefix-layering/narrations";
import A008Chapter from "./chapters/08-suffix-objects/A008Chapter";
import { narrations as a008Narrations } from "./chapters/08-suffix-objects/narrations";
import A009Chapter from "./chapters/09-full-handle-reading/A009Chapter";
import { narrations as a009Narrations } from "./chapters/09-full-handle-reading/narrations";

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
  {
    id: "06-prefix-suffix-split",
    title: "前后缀分工",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "07-prefix-layering",
    title: "前缀分层",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "08-suffix-objects",
    title: "后缀对象",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "09-full-handle-reading",
    title: "完整示例",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
];
