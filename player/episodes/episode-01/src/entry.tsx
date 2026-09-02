import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import WhyConcept from "./chapters/01-why-concept/WhyConcept";
import { narrations as whyConceptNarrations } from "./chapters/01-why-concept/narrations";
import Anchor2012 from "./chapters/02-anchor-2012/Anchor2012";
import { narrations as anchor2012Narrations } from "./chapters/02-anchor-2012/narrations";
import EngineDataPath from "./chapters/03-engine-data-path/EngineDataPath";
import { narrations as engineDataPathNarrations } from "./chapters/03-engine-data-path/narrations";
import CollabNotParams from "./chapters/04-collab-not-params/CollabNotParams";
import { narrations as collabNotParamsNarrations } from "./chapters/04-collab-not-params/narrations";
import LocalSystems from "./chapters/05-local-systems/LocalSystems";
import { narrations as localSystemsNarrations } from "./chapters/05-local-systems/narrations";
import LocalVsSynergy from "./chapters/06-local-vs-synergy/LocalVsSynergy";
import { narrations as localVsSynergyNarrations } from "./chapters/06-local-vs-synergy/narrations";
import TwoPathsMeet from "./chapters/07-two-paths-meet/TwoPathsMeet";
import { narrations as twoPathsMeetNarrations } from "./chapters/07-two-paths-meet/narrations";
import ConditionFusion from "./chapters/08-condition-fusion/ConditionFusion";
import { narrations as conditionFusionNarrations } from "./chapters/08-condition-fusion/narrations";
import OfficialDefinition from "./chapters/09-official-definition/OfficialDefinition";
import { narrations as officialDefinitionNarrations } from "./chapters/09-official-definition/narrations";
import NotJustConnected from "./chapters/10-not-just-connected/NotJustConnected";
import { narrations as notJustConnectedNarrations } from "./chapters/10-not-just-connected/narrations";
import EnterTheProcess from "./chapters/11-enter-the-process/EnterTheProcess";
import { narrations as enterTheProcessNarrations } from "./chapters/11-enter-the-process/narrations";

export const id = "episode-01";
export const title = "工业互联网的产生与边界";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "why-concept",
    title: "工具都在，为什么还要新概念",
    narrations: whyConceptNarrations,
    Component: WhyConcept,
  },
  {
    id: "anchor-2012",
    title: "2012 年的概念锚点",
    narrations: anchor2012Narrations,
    Component: Anchor2012,
  },
  {
    id: "engine-data-path",
    title: "飞行数据如何服务维护",
    narrations: engineDataPathNarrations,
    Component: EngineDataPath,
  },
  {
    id: "collab-not-params",
    title: "案例说明的是协作，不是参数",
    narrations: collabNotParamsNarrations,
    Component: CollabNotParams,
  },
  {
    id: "local-systems",
    title: "局部系统各自有效",
    narrations: localSystemsNarrations,
    Component: LocalSystems,
  },
  {
    id: "local-vs-synergy",
    title: "从局部数字化走向协同",
    narrations: localVsSynergyNarrations,
    Component: LocalVsSynergy,
  },
  {
    id: "two-paths-meet",
    title: "两条变化在时代背景中相遇",
    narrations: twoPathsMeetNarrations,
    Component: TwoPathsMeet,
  },
  {
    id: "condition-fusion",
    title: "技术只是条件，融合才有意义",
    narrations: conditionFusionNarrations,
    Component: ConditionFusion,
  },
  {
    id: "official-definition",
    title: "从融合走向更大范围的互联",
    narrations: officialDefinitionNarrations,
    Component: OfficialDefinition,
  },
  {
    id: "not-just-connected",
    title: "“连上了”不是终点",
    narrations: notJustConnectedNarrations,
    Component: NotJustConnected,
  },
  {
    id: "enter-the-process",
    title: "用“是否进入工业过程”作判断",
    narrations: enterTheProcessNarrations,
    Component: EnterTheProcess,
  },
];
