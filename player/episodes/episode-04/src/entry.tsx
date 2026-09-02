import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import ProblemScene from "./chapters/01-problem-scene/ProblemScene";
import { narrations as problemSceneNarrations } from "./chapters/01-problem-scene/narrations";
import TransformationBoundary from "./chapters/02-transformation-boundary/TransformationBoundary";
import { narrations as transformationBoundaryNarrations } from "./chapters/02-transformation-boundary/narrations";
import ConnectionFirst from "./chapters/03-connection-first/ConnectionFirst";
import { narrations as connectionFirstNarrations } from "./chapters/03-connection-first/narrations";
import DataAsEvidence from "./chapters/04-data-as-evidence/DataAsEvidence";
import { narrations as dataAsEvidenceNarrations } from "./chapters/04-data-as-evidence/narrations";
import JudgmentToAction from "./chapters/05-judgment-to-action/JudgmentToAction";
import { narrations as judgmentToActionNarrations } from "./chapters/05-judgment-to-action/narrations";
import BrokenChainCases from "./chapters/06-broken-chain-cases/BrokenChainCases";
import { narrations as brokenChainCasesNarrations } from "./chapters/06-broken-chain-cases/narrations";
import SharedCarrier from "./chapters/07-shared-carrier/SharedCarrier";
import { narrations as sharedCarrierNarrations } from "./chapters/07-shared-carrier/narrations";
import ValueRecap from "./chapters/08-value-recap/ValueRecap";
import { narrations as valueRecapNarrations } from "./chapters/08-value-recap/narrations";

export const id = "episode-04";
export const title = "数字化转型:从技术部署到业务价值";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "problem-scene",
    title: "问题场景",
    narrations: problemSceneNarrations,
    Component: ProblemScene,
  },
  {
    id: "transformation-boundary",
    title: "转型边界",
    narrations: transformationBoundaryNarrations,
    Component: TransformationBoundary,
  },
  {
    id: "connection-first",
    title: "连接先行",
    narrations: connectionFirstNarrations,
    Component: ConnectionFirst,
  },
  {
    id: "data-as-evidence",
    title: "数据成证据",
    narrations: dataAsEvidenceNarrations,
    Component: DataAsEvidence,
  },
  {
    id: "judgment-to-action",
    title: "判断落行动",
    narrations: judgmentToActionNarrations,
    Component: JudgmentToAction,
  },
  {
    id: "broken-chain-cases",
    title: "断链反例",
    narrations: brokenChainCasesNarrations,
    Component: BrokenChainCases,
  },
  {
    id: "shared-carrier",
    title: "共同承载",
    narrations: sharedCarrierNarrations,
    Component: SharedCarrier,
  },
  {
    id: "value-recap",
    title: "价值收束",
    narrations: valueRecapNarrations,
    Component: ValueRecap,
  },
];
