import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-a001/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-a001/narrations";
import A002Chapter from "./chapters/02-a002/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-a002/narrations";

export const id = "episode-25";
export const title = "标识数据模型：从数字对象到属性与事件";

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
    title: "一个对象，两种存在",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
];
