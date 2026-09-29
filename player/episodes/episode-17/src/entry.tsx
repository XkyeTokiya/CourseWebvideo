import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import OpeningChapter from "./chapters/01-opening/OpeningChapter";
import { narrations as openingNarrations } from "./chapters/01-opening/narrations";
import A003Chapter from "./chapters/02-naming-problem/A003Chapter";
import { narrations as a003Narrations } from "./chapters/02-naming-problem/narrations";
import A004Chapter from "./chapters/03-oid-definition/A004Chapter";
import { narrations as a004Narrations } from "./chapters/03-oid-definition/narrations";
import A005Chapter from "./chapters/04-root-branches/A005Chapter";
import { narrations as a005Narrations } from "./chapters/04-root-branches/narrations";
import A006Chapter from "./chapters/05-tree-encoding/A006Chapter";
import { narrations as a006Narrations } from "./chapters/05-tree-encoding/narrations";
import A007Chapter from "./chapters/06-china-prefixes/A007Chapter";
import { narrations as a007Narrations } from "./chapters/06-china-prefixes/narrations";
import A008Chapter from "./chapters/07-full-path/A008Chapter";
import { narrations as a008Narrations } from "./chapters/07-full-path/narrations";
import A009Chapter from "./chapters/08-flexible-growth/A009Chapter";
import { narrations as a009Narrations } from "./chapters/08-flexible-growth/narrations";
import A010Chapter from "./chapters/09-uniqueness-path/A010Chapter";
import { narrations as a010Narrations } from "./chapters/09-uniqueness-path/narrations";
import A011Chapter from "./chapters/10-no-autocorrect/A011Chapter";
import { narrations as a011Narrations } from "./chapters/10-no-autocorrect/narrations";
import A012Chapter from "./chapters/11-goal-and-scope/A012Chapter";
import { narrations as a012Narrations } from "./chapters/11-goal-and-scope/narrations";
import A013Chapter from "./chapters/12-summary/A013Chapter";
import { narrations as a013Narrations } from "./chapters/12-summary/narrations";

export const id = "episode-17";
export const title = "OID 编码：树状命名如何保证唯一性";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    // A001+A002 合并章（Checkpoint Plan 确认）：标题拍 + 电池引用语境 + 四类记录
    id: "01-opening",
    title: "开场导入",
    narrations: openingNarrations,
    Component: OpeningChapter,
  },
  {
    id: "02-naming-problem",
    title: "命名难题",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "03-oid-definition",
    title: "定义与体系",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "04-root-branches",
    title: "根分支",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
  {
    id: "05-tree-encoding",
    title: "树状编码",
    narrations: a006Narrations,
    Component: A006Chapter,
  },
  {
    id: "06-china-prefixes",
    title: "我国前缀与示例",
    narrations: a007Narrations,
    Component: A007Chapter,
  },
  {
    id: "07-full-path",
    title: "完整路径",
    narrations: a008Narrations,
    Component: A008Chapter,
  },
  {
    id: "08-flexible-growth",
    title: "灵活扩展",
    narrations: a009Narrations,
    Component: A009Chapter,
  },
  {
    id: "09-uniqueness-path",
    title: "唯一性判断",
    narrations: a010Narrations,
    Component: A010Chapter,
  },
  {
    id: "10-no-autocorrect",
    title: "纠错边界",
    narrations: a011Narrations,
    Component: A011Chapter,
  },
  {
    id: "11-goal-and-scope",
    title: "目标与收束",
    narrations: a012Narrations,
    Component: A012Chapter,
  },
  {
    id: "12-summary",
    title: "本期总结",
    narrations: a013Narrations,
    Component: A013Chapter,
  },
];
