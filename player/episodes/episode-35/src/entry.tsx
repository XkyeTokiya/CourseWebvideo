import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import ProcessQuestion from "./chapters/01-process-question/ProcessQuestion";
import { narrations as processQuestionNarrations } from "./chapters/01-process-question/narrations";
import ThreeDecisionCombo from "./chapters/02-three-decision-combo/ThreeDecisionCombo";
import { narrations as threeDecisionComboNarrations } from "./chapters/02-three-decision-combo/narrations";
import ObjectConstraint from "./chapters/03-object-constraint/ObjectConstraint";
import { narrations as objectConstraintNarrations } from "./chapters/03-object-constraint/narrations";
import ProcessRewritesCode from "./chapters/04-process-rewrites-code/ProcessRewritesCode";
import { narrations as processRewritesCodeNarrations } from "./chapters/04-process-rewrites-code/narrations";
import GeometryFieldLimits from "./chapters/05-geometry-field-limits/GeometryFieldLimits";
import { narrations as geometryFieldLimitsNarrations } from "./chapters/05-geometry-field-limits/narrations";
import DamageBranch from "./chapters/06-damage-branch/DamageBranch";
import { narrations as damageBranchNarrations } from "./chapters/06-damage-branch/narrations";
import CandidateCompare from "./chapters/07-candidate-compare/CandidateCompare";
import { narrations as candidateCompareNarrations } from "./chapters/07-candidate-compare/narrations";
import ShortlistDirections from "./chapters/08-shortlist-directions/ShortlistDirections";
import { narrations as shortlistDirectionsNarrations } from "./chapters/08-shortlist-directions/narrations";
import RouteValidation from "./chapters/09-route-validation/RouteValidation";
import { narrations as routeValidationNarrations } from "./chapters/09-route-validation/narrations";
import DecisionLedger from "./chapters/10-decision-ledger/DecisionLedger";
import { narrations as decisionLedgerNarrations } from "./chapters/10-decision-ledger/narrations";
import SelectionConclusion from "./chapters/11-selection-conclusion/SelectionConclusion";
import { narrations as selectionConclusionNarrations } from "./chapters/11-selection-conclusion/narrations";

export const id = "episode-35";
export const title = "标识载体选型";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "process-question",
    title: "工艺后还能读吗",
    narrations: processQuestionNarrations,
    Component: ProcessQuestion,
  },
  {
    id: "three-decision-combo",
    title: "选型是三项组合",
    narrations: threeDecisionComboNarrations,
    Component: ThreeDecisionCombo,
  },
  {
    id: "object-constraint",
    title: "对象决定起点",
    narrations: objectConstraintNarrations,
    Component: ObjectConstraint,
  },
  {
    id: "process-rewrites-code",
    title: "工艺会改写码面",
    narrations: processRewritesCodeNarrations,
    Component: ProcessRewritesCode,
  },
  {
    id: "geometry-field-limits",
    title: "几何与现场限制",
    narrations: geometryFieldLimitsNarrations,
    Component: GeometryFieldLimits,
  },
  {
    id: "damage-branch",
    title: "污染损伤是检查分支",
    narrations: damageBranchNarrations,
    Component: DamageBranch,
  },
  {
    id: "candidate-compare",
    title: "候选组合与成本",
    narrations: candidateCompareNarrations,
    Component: CandidateCompare,
  },
  {
    id: "shortlist-directions",
    title: "初选方向",
    narrations: shortlistDirectionsNarrations,
    Component: ShortlistDirections,
  },
  {
    id: "route-validation",
    title: "真实路线验证",
    narrations: routeValidationNarrations,
    Component: RouteValidation,
  },
  {
    id: "decision-ledger",
    title: "现场决策顺序",
    narrations: decisionLedgerNarrations,
    Component: DecisionLedger,
  },
  {
    id: "selection-conclusion",
    title: "选型收束",
    narrations: selectionConclusionNarrations,
    Component: SelectionConclusion,
  },
];
