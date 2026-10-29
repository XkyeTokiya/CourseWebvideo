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
import A007Chapter from "./chapters/07-a007/A007Chapter";
import { narrations as a007Narrations } from "./chapters/07-a007/narrations";
import A008Chapter from "./chapters/08-a008/A008Chapter";
import { narrations as a008Narrations } from "./chapters/08-a008/narrations";
import A009Chapter from "./chapters/09-a009/A009Chapter";
import { narrations as a009Narrations } from "./chapters/09-a009/narrations";
import A010Chapter from "./chapters/10-a010/A010Chapter";
import { narrations as a010Narrations } from "./chapters/10-a010/narrations";

export const id = "episode-21";
export const title = "工业大数据：从哪里来、怎样产生价值";

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
    title: "标题与开场问题",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
  {
    id: "02-a002",
    title: "定义与范围",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-a003",
    title: "三类来源与汇合",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "04-a004",
    title: "数据形态",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-a005",
    title: "一般特征",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "06-a006",
    title: "工业特征",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "07-a007",
    title: "处理链",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "08-a008",
    title: "关联与模式",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "09-a009",
    title: "价值方向",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
  {
    id: "10-a010",
    title: "总结",
    narrations: a010Narrations,
    Component: A010Chapter,
  },
];
