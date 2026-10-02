import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-a001/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-a001/narrations";
import A002Chapter from "./chapters/02-a002/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-a002/narrations";
import A003Chapter from "./chapters/03-a003/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-a003/narrations";
import A004Chapter from "./chapters/04-a004/A004Chapter";
import { narrations as a004Narrations } from "./chapters/04-a004/narrations";
import A005Chapter from "./chapters/05-a005/A005Chapter";
import { narrations as a005Narrations } from "./chapters/05-a005/narrations";
import A006Chapter from "./chapters/06-a006/A006Chapter";
import { narrations as a006Narrations } from "./chapters/06-a006/narrations";

export const id = "episode-20";
export const title = "从前缀到后缀：设计一套可落地的编码规则";

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
    title: "标题与问题",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
  {
    id: "02-a002",
    title: "界定对象与主问题",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-a003",
    title: "编码作用",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "04-a004",
    title: "编码的骨架",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-a005",
    title: "前缀职责",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "06-a006",
    title: "后缀分层与责任",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
];
