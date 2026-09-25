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
];
