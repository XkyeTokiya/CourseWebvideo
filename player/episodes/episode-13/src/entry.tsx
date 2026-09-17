import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-opening-question/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-opening-question/narrations";
import A002Chapter from "./chapters/02-challenge-source/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-challenge-source/narrations";
import A003Chapter from "./chapters/03-stages-goal/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-stages-goal/narrations";
import A004Chapter from "./chapters/04-system-gap/A004Chapter";
import { narrations as a004Narrations } from "./chapters/04-system-gap/narrations";
import A005Chapter from "./chapters/05-pain-amplify/A005Chapter";
import { narrations as a005Narrations } from "./chapters/05-pain-amplify/narrations";
import A006Chapter from "./chapters/06-connector-approach/A006Chapter";
import { narrations as a006Narrations } from "./chapters/06-connector-approach/narrations";
import A007Chapter from "./chapters/07-identity-foundation/A007Chapter";
import { narrations as a007Narrations } from "./chapters/07-identity-foundation/narrations";
import A008Chapter from "./chapters/08-upper-architecture/A008Chapter";
import { narrations as a008Narrations } from "./chapters/08-upper-architecture/narrations";
import A009Chapter from "./chapters/09-lower-chain/A009Chapter";
import { narrations as a009Narrations } from "./chapters/09-lower-chain/narrations";
import A010Chapter from "./chapters/10-data-forms/A010Chapter";
import { narrations as a010Narrations } from "./chapters/10-data-forms/narrations";
import A011Chapter from "./chapters/11-resource-delivery/A011Chapter";
import { narrations as a011Narrations } from "./chapters/11-resource-delivery/narrations";
import A012Chapter from "./chapters/12-before-after/A012Chapter";
import { narrations as a012Narrations } from "./chapters/12-before-after/narrations";
import A013Chapter from "./chapters/13-division-collaboration/A013Chapter";
import { narrations as a013Narrations } from "./chapters/13-division-collaboration/narrations";
import A014Chapter from "./chapters/14-closing-judgment/A014Chapter";
import { narrations as a014Narrations } from "./chapters/14-closing-judgment/narrations";

export const id = "episode-13";
export const title = "第 13 期 · 基于工业软件连接器的异构数据共享";

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
    id: "02-challenge-source",
    title: "挑战来源",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-stages-goal",
    title: "环节目标",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "04-system-gap",
    title: "系统差异",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-pain-amplify",
    title: "痛点放大",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "06-connector-approach",
    title: "连接方案",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "07-identity-foundation",
    title: "锚点基础",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "08-upper-architecture",
    title: "上层读图",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "09-lower-chain",
    title: "下层链路",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
  {
    id: "10-data-forms",
    title: "数据形态",
    narrations: a010Narrations,
    Component: A010Chapter,
  },
  {
    id: "11-resource-delivery",
    title: "资源交付",
    narrations: a011Narrations,
    Component: A011Chapter,
  },
  {
    id: "12-before-after",
    title: "机制对比",
    narrations: a012Narrations,
    Component: A012Chapter,
  },
  {
    id: "13-division-collaboration",
    title: "分工协作",
    narrations: a013Narrations,
    Component: A013Chapter,
  },
  {
    id: "14-closing-judgment",
    title: "收束判断",
    narrations: a014Narrations,
    Component: A014Chapter,
  },
];
