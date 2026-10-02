import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-opening-title/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-opening-title/narrations";
import A002Chapter from "./chapters/02-one-object-many-codes/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-one-object-many-codes/narrations";
import A003Chapter from "./chapters/03-four-questions/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-four-questions/narrations";
import A004Chapter from "./chapters/04-gs1-positioning-types/A004Chapter";
import { narrations as a004Narrations } from "./chapters/04-gs1-positioning-types/narrations";
import A005Chapter from "./chapters/05-gtin-three-segments/A005Chapter";
import { narrations as a005Narrations } from "./chapters/05-gtin-three-segments/narrations";
import A006Chapter from "./chapters/06-five-systems-matrix/A006Chapter";
import { narrations as a006Narrations } from "./chapters/06-five-systems-matrix/narrations";
import A007Chapter from "./chapters/07-gs1-selection-start/A007Chapter";
import { narrations as a007Narrations } from "./chapters/07-gs1-selection-start/narrations";
import A008Chapter from "./chapters/08-cross-stage-and-iot/A008Chapter";
import { narrations as a008Narrations } from "./chapters/08-cross-stage-and-iot/narrations";
import A009Chapter from "./chapters/09-checks-and-mapping/A009Chapter";
import { narrations as a009Narrations } from "./chapters/09-checks-and-mapping/narrations";
import A010Chapter from "./chapters/10-five-systems-division/A010Chapter";
import { narrations as a010Narrations } from "./chapters/10-five-systems-division/narrations";
import A011Chapter from "./chapters/11-four-step-verdict/A011Chapter";
import { narrations as a011Narrations } from "./chapters/11-four-step-verdict/narrations";

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
  {
    id: "03-four-questions",
    title: "四个业务问题",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "04-gs1-positioning-types",
    title: "GS1 定位与类型",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-gtin-three-segments",
    title: "GTIN 三段结构",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "06-five-systems-matrix",
    title: "五体系场景矩阵",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "07-gs1-selection-start",
    title: "GS1 选型起点",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "08-cross-stage-and-iot",
    title: "跨环节与物联网",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "09-checks-and-mapping",
    title: "核对与兼容映射",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
  {
    id: "10-five-systems-division",
    title: "本期总结",
    narrations: a010Narrations,
    Component: A010Chapter,
  },
  {
    id: "11-four-step-verdict",
    title: "四步收束",
    narrations: a011Narrations,
    Component: A011Chapter,
  },
];
