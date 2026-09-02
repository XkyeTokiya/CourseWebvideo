import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import OpenLoopLine from "./chapters/01-open-loop-line/OpenLoopLine";
import { narrations as openLoopLineNarrations } from "./chapters/01-open-loop-line/narrations";
import CentralQuestion from "./chapters/02-central-question/CentralQuestion";
import { narrations as centralQuestionNarrations } from "./chapters/02-central-question/narrations";
import NetworkFoundation from "./chapters/03-network-foundation/NetworkFoundation";
import { narrations as networkFoundationNarrations } from "./chapters/03-network-foundation/narrations";
import PlatformCommonSpace from "./chapters/04-platform-common-space/PlatformCommonSpace";
import { narrations as platformCommonSpaceNarrations } from "./chapters/04-platform-common-space/narrations";
import DataToJudgment from "./chapters/05-data-to-judgment/DataToJudgment";
import { narrations as dataToJudgmentNarrations } from "./chapters/05-data-to-judgment/narrations";
import SecurityFullPath from "./chapters/06-security-full-path/SecurityFullPath";
import { narrations as securityFullPathNarrations } from "./chapters/06-security-full-path/narrations";
import FourDutiesChain from "./chapters/07-four-duties-chain/FourDutiesChain";
import { narrations as fourDutiesChainNarrations } from "./chapters/07-four-duties-chain/narrations";
import PhysicalDigitalPivot from "./chapters/08-physical-digital-pivot/PhysicalDigitalPivot";
import { narrations as physicalDigitalPivotNarrations } from "./chapters/08-physical-digital-pivot/narrations";
import PerceptionModelLayers from "./chapters/09-perception-model-layers/PerceptionModelLayers";
import { narrations as perceptionModelLayersNarrations } from "./chapters/09-perception-model-layers/narrations";
import ThreeLayersToAction from "./chapters/10-three-layers-to-action/ThreeLayersToAction";
import { narrations as threeLayersToActionNarrations } from "./chapters/10-three-layers-to-action/narrations";
import UpwardFlowOpenLoop from "./chapters/11-upward-flow-open-loop/UpwardFlowOpenLoop";
import { narrations as upwardFlowOpenLoopNarrations } from "./chapters/11-upward-flow-open-loop/narrations";
import DownwardFlowFeedback from "./chapters/12-downward-flow-feedback/DownwardFlowFeedback";
import { narrations as downwardFlowFeedbackNarrations } from "./chapters/12-downward-flow-feedback/narrations";
import FeedbackFormsFlexible from "./chapters/13-feedback-forms-flexible/FeedbackFormsFlexible";
import { narrations as feedbackFormsFlexibleNarrations } from "./chapters/13-feedback-forms-flexible/narrations";
import FiveBusinessDirections from "./chapters/14-five-business-directions/FiveBusinessDirections";
import { narrations as fiveBusinessDirectionsNarrations } from "./chapters/14-five-business-directions/narrations";
import ClosingLoopSummary from "./chapters/15-closing-loop-summary/ClosingLoopSummary";
import { narrations as closingLoopSummaryNarrations } from "./chapters/15-closing-loop-summary/narrations";

export const id = "episode-02";
export const title = "工业互联网的体系构成";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "open-loop-line",
    title: "联网之后，行动仍未回来",
    narrations: openLoopLineNarrations,
    Component: OpenLoopLine,
  },
  {
    id: "central-question",
    title: "四个体系要共同回答的问题",
    narrations: centralQuestionNarrations,
    Component: CentralQuestion,
  },
  {
    id: "network-foundation",
    title: "网络先打开信息入口",
    narrations: networkFoundationNarrations,
    Component: NetworkFoundation,
  },
  {
    id: "platform-common-space",
    title: "平台把分散能力放进共同空间",
    narrations: platformCommonSpaceNarrations,
    Component: PlatformCommonSpace,
  },
  {
    id: "data-to-judgment",
    title: "数据要经过处理，才成为判断依据",
    narrations: dataToJudgmentNarrations,
    Component: DataToJudgment,
  },
  {
    id: "security-full-path",
    title: "安全必须覆盖整条信息路径",
    narrations: securityFullPathNarrations,
    Component: SecurityFullPath,
  },
  {
    id: "four-duties-chain",
    title: "四项职责缺一都会形成断点",
    narrations: fourDutiesChainNarrations,
    Component: FourDutiesChain,
  },
  {
    id: "physical-digital-pivot",
    title: "物理现场与数字空间开始协同",
    narrations: physicalDigitalPivotNarrations,
    Component: PhysicalDigitalPivot,
  },
  {
    id: "perception-model-layers",
    title: "先建立感知与数字模型两层",
    narrations: perceptionModelLayersNarrations,
    Component: PerceptionModelLayers,
  },
  {
    id: "three-layers-to-action",
    title: "三个层次共同把信息变成行动",
    narrations: threeLayersToActionNarrations,
    Component: ThreeLayersToAction,
  },
  {
    id: "upward-flow-open-loop",
    title: "上行信息让系统看见，却还没改变现场",
    narrations: upwardFlowOpenLoopNarrations,
    Component: UpwardFlowOpenLoop,
  },
  {
    id: "downward-flow-feedback",
    title: "决策下行之后，还要让新状态再次上行",
    narrations: downwardFlowFeedbackNarrations,
    Component: DownwardFlowFeedback,
  },
  {
    id: "feedback-forms-flexible",
    title: "反馈形式多样，不等于必须全自动",
    narrations: feedbackFormsFlexibleNarrations,
    Component: FeedbackFormsFlexible,
  },
  {
    id: "five-business-directions",
    title: "五类业务方向，共用一套闭环条件",
    narrations: fiveBusinessDirectionsNarrations,
    Component: FiveBusinessDirections,
  },
  {
    id: "closing-loop-summary",
    title: "双向流相接，生产才可能持续优化",
    narrations: closingLoopSummaryNarrations,
    Component: ClosingLoopSummary,
  },
];
