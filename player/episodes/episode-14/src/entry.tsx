import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-opening-question/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-opening-question/narrations";
import A002Chapter from "./chapters/02-definition-resources/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-definition-resources/narrations";
import A003Chapter from "./chapters/03-beyond-distinction/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-beyond-distinction/narrations";
import A004Chapter from "./chapters/04-uniqueness-scope/A004Chapter";
import { narrations as a004Narrations } from "./chapters/04-uniqueness-scope/narrations";
import A005Chapter from "./chapters/05-compatibility-bridge/A005Chapter";
import { narrations as a005Narrations } from "./chapters/05-compatibility-bridge/narrations";
import A006Chapter from "./chapters/06-practicality-field/A006Chapter";
import { narrations as a006Narrations } from "./chapters/06-practicality-field/narrations";
import A007Chapter from "./chapters/07-extensibility-reserve/A007Chapter";
import { narrations as a007Narrations } from "./chapters/07-extensibility-reserve/narrations";
import A008Chapter from "./chapters/08-scientific-structure/A008Chapter";
import { narrations as a008Narrations } from "./chapters/08-scientific-structure/narrations";
import A009Chapter from "./chapters/09-joint-check/A009Chapter";
import { narrations as a009Narrations } from "./chapters/09-joint-check/narrations";
import A010Chapter from "./chapters/10-boundary-closing/A010Chapter";
import { narrations as a010Narrations } from "./chapters/10-boundary-closing/narrations";

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
  {
    id: "04-uniqueness-scope",
    title: "唯一性与范围限定",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-compatibility-bridge",
    title: "兼容性与迁移延续",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "06-practicality-field",
    title: "实用性与现场条件",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "07-extensibility-reserve",
    title: "扩展性与容量预留",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "08-scientific-structure",
    title: "科学性与结构校验",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "09-joint-check",
    title: "五问联检",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
  {
    id: "10-boundary-closing",
    title: "边界与收束",
    narrations: a010Narrations,
    Component: A010Chapter,
  },
];
