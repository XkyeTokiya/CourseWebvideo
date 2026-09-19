import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001Chapter from "./chapters/01-identity-question/A001Chapter";
import { narrations as a001Narrations } from "./chapters/01-identity-question/narrations";
import A002Chapter from "./chapters/02-three-segments/A002Chapter";
import { narrations as a002Narrations } from "./chapters/02-three-segments/narrations";
import A003Chapter from "./chapters/03-issuing-agency/A003Chapter";
import { narrations as a003Narrations } from "./chapters/03-issuing-agency/narrations";
import A004Chapter from "./chapters/04-service-org-layers/A004Chapter";
import { narrations as a004Narrations } from "./chapters/04-service-org-layers/narrations";
import A005Chapter from "./chapters/05-internal-coding/A005Chapter";
import { narrations as a005Narrations } from "./chapters/05-internal-coding/narrations";

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
  {
    id: "02-three-segments",
    title: "三段结构总览",
    narrations: a002Narrations,
    Component: A002Chapter,
  },
  {
    id: "03-issuing-agency",
    title: "第一段：发码机构代码",
    narrations: a003Narrations,
    Component: A003Chapter,
  },
  {
    id: "04-service-org-layers",
    title: "第二段：服务机构代码",
    narrations: a004Narrations,
    Component: A004Chapter,
  },
  {
    id: "05-internal-coding",
    title: "第三段：企业内部编码",
    narrations: a005Narrations,
    Component: A005Chapter,
  },
];
