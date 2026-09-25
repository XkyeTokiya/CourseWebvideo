import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import OpeningChapter from "./chapters/01-opening/OpeningChapter";
import { narrations as openingNarrations } from "./chapters/01-opening/narrations";

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
];
