import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import MoreToolsNotStronger from "./chapters/01-more-tools-not-stronger/MoreToolsNotStronger";
import { narrations as moreToolsNarrations } from "./chapters/01-more-tools-not-stronger/narrations";
import QuantityToQuality from "./chapters/02-quantity-to-quality/QuantityToQuality";
import { narrations as quantityToQualityNarrations } from "./chapters/02-quantity-to-quality/narrations";
import MutualPromotion2002 from "./chapters/03-2002-mutual-promotion/MutualPromotion2002";
import { narrations as mutualPromotionNarrations } from "./chapters/03-2002-mutual-promotion/narrations";
import PolicyDirection2024 from "./chapters/04-2024-policy-direction/PolicyDirection2024";
import { narrations as policyDirectionNarrations } from "./chapters/04-2024-policy-direction/narrations";
import StageGoal2035 from "./chapters/05-2026-stage-2035-goal/StageGoal2035";
import { narrations as stageGoalNarrations } from "./chapters/05-2026-stage-2035-goal/narrations";
import DirectionsToSiteDemands from "./chapters/06-directions-to-site-demands/DirectionsToSiteDemands";
import { narrations as directionsNarrations } from "./chapters/06-directions-to-site-demands/narrations";
import KeySupportRole from "./chapters/07-key-support-role/KeySupportRole";
import { narrations as keySupportNarrations } from "./chapters/07-key-support-role/narrations";
import ConnectionSharedAwareness from "./chapters/08-connection-shared-awareness/ConnectionSharedAwareness";
import { narrations as connectionNarrations } from "./chapters/08-connection-shared-awareness/narrations";
import DataIntoAction from "./chapters/09-data-into-action/DataIntoAction";
import { narrations as dataIntoActionNarrations } from "./chapters/09-data-into-action/narrations";
import ExperienceIntoCapability from "./chapters/10-experience-into-capability/ExperienceIntoCapability";
import { narrations as experienceNarrations } from "./chapters/10-experience-into-capability/narrations";
import CollaborationWithinAuthority from "./chapters/11-collaboration-within-authority/CollaborationWithinAuthority";
import { narrations as collaborationNarrations } from "./chapters/11-collaboration-within-authority/narrations";
import SupportMapsToDirections from "./chapters/12-support-maps-to-directions/SupportMapsToDirections";
import { narrations as supportMapsNarrations } from "./chapters/12-support-maps-to-directions/narrations";
import SharedViewAction from "./chapters/13-shared-view-action/SharedViewAction";
import { narrations as sharedViewNarrations } from "./chapters/13-shared-view-action/narrations";
import BroaderGoalDomain from "./chapters/14-broader-goal-domain/BroaderGoalDomain";
import { narrations as broaderGoalNarrations } from "./chapters/14-broader-goal-domain/narrations";
import SupportNotEquation from "./chapters/15-support-not-equation/SupportNotEquation";
import { narrations as supportNotEquationNarrations } from "./chapters/15-support-not-equation/narrations";
import DirectionSupportRecap from "./chapters/16-direction-support-recap/DirectionSupportRecap";
import { narrations as directionSupportNarrations } from "./chapters/16-direction-support-recap/narrations";

export const id = "episode-03";
export const title = "新型工业化与工业互联网：目标与支撑";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "more-tools-not-stronger",
    title: "工具增加，体系就会变强吗",
    narrations: moreToolsNarrations,
    Component: MoreToolsNotStronger,
  },
  {
    id: "quantity-to-quality",
    title: "从量的积累转向质的提升",
    narrations: quantityToQualityNarrations,
    Component: QuantityToQuality,
  },
  {
    id: "2002-mutual-promotion",
    title: "2002 年的两化互动起点",
    narrations: mutualPromotionNarrations,
    Component: MutualPromotion2002,
  },
  {
    id: "2024-policy-direction",
    title: "2024 年政策方向参照",
    narrations: policyDirectionNarrations,
    Component: PolicyDirection2024,
  },
  {
    id: "2026-stage-2035-goal",
    title: "2026 年阶段判断与 2035 目标",
    narrations: stageGoalNarrations,
    Component: StageGoal2035,
  },
  {
    id: "directions-to-site-demands",
    title: "三种方向对应三类现场要求",
    narrations: directionsNarrations,
    Component: DirectionsToSiteDemands,
  },
  {
    id: "key-support-role",
    title: "工业互联网承担关键支撑",
    narrations: keySupportNarrations,
    Component: KeySupportRole,
  },
  {
    id: "connection-shared-awareness",
    title: "连接让分散要素可共同感知",
    narrations: connectionNarrations,
    Component: ConnectionSharedAwareness,
  },
  {
    id: "data-into-action",
    title: "数据要进入判断与行动",
    narrations: dataIntoActionNarrations,
    Component: DataIntoAction,
  },
  {
    id: "experience-into-capability",
    title: "经验沉淀为可复用能力",
    narrations: experienceNarrations,
    Component: ExperienceIntoCapability,
  },
  {
    id: "collaboration-within-authority",
    title: "协同必须守住授权边界",
    narrations: collaborationNarrations,
    Component: CollaborationWithinAuthority,
  },
  {
    id: "support-maps-to-directions",
    title: "四类支撑把方向接到运行上",
    narrations: supportMapsNarrations,
    Component: SupportMapsToDirections,
  },
  {
    id: "shared-view-action",
    title: "共同视图支持协同行动",
    narrations: sharedViewNarrations,
    Component: SharedViewAction,
  },
  {
    id: "broader-goal-domain",
    title: "新型工业化的目标域更广",
    narrations: broaderGoalNarrations,
    Component: BroaderGoalDomain,
  },
  {
    id: "support-not-equation",
    title: "关键支撑，但不是等号",
    narrations: supportNotEquationNarrations,
    Component: SupportNotEquation,
  },
  {
    id: "direction-support-recap",
    title: "方向与支撑的全期结论",
    narrations: directionSupportNarrations,
    Component: DirectionSupportRecap,
  },
];
