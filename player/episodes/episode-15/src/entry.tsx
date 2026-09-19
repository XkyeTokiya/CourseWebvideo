import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-identity-question/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-identity-question/narrations";

export const id = "episode-15";
export const title = "第 15 期 · VAA 编码：从发码机构到企业内部编码";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "01-identity-question",
    title: "片头与开场情境",
    narrations: a001Narrations,
    Component: A001Chapter,
  },
];
