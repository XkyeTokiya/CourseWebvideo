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
import A011Chapter from "./chapters/11-a011/A011Chapter";
import { narrations as a011Narrations } from "./chapters/11-a011/narrations";

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
  {
    id: "04-a004",
    title: "编码体系的边界",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-a005",
    title: "三段总览",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "06-a006",
    title: "V 版本段",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "07-a007",
    title: "NSI 体系标识段",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "08-a008",
    title: "MD 主码与身份链",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "09-a009",
    title: "示例阅读",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
  {
    id: "10-a010",
    title: "三步读法与应用语境",
    narrations: a010Narrations,
    Component: A010Chapter,
  },
  {
    id: "11-a011",
    title: "三层收束",
    narrations: a011Narrations,
    Component: A011Chapter,
  },
];
