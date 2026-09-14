import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001OnsiteQuestion from "./chapters/01-a001-onsite-question/A001OnsiteQuestion";
import { narrations as a001Narrations } from "./chapters/01-a001-onsite-question/narrations";
import A002LinkageBoundary from "./chapters/02-a002-linkage-boundary/A002LinkageBoundary";
import { narrations as a002Narrations } from "./chapters/02-a002-linkage-boundary/narrations";
import A003TwoObjectKinds from "./chapters/03-a003-two-object-kinds/A003TwoObjectKinds";
import { narrations as a003Narrations } from "./chapters/03-a003-two-object-kinds/narrations";
import A004AnchorNotContainer from "./chapters/04-a004-anchor-not-container/A004AnchorNotContainer";
import { narrations as a004Narrations } from "./chapters/04-a004-anchor-not-container/narrations";
import A005SixStages from "./chapters/05-a005-six-stages/A005SixStages";
import { narrations as a005Narrations } from "./chapters/05-a005-six-stages/narrations";
import A006RecordsToThread from "./chapters/06-a006-records-to-thread/A006RecordsToThread";
import { narrations as a006Narrations } from "./chapters/06-a006-records-to-thread/narrations";
import A007IndustryActors from "./chapters/07-a007-industry-actors/A007IndustryActors";
import { narrations as a007Narrations } from "./chapters/07-a007-industry-actors/narrations";
import A008ThreeScales from "./chapters/08-a008-three-scales/A008ThreeScales";
import { narrations as a008Narrations } from "./chapters/08-a008-three-scales/narrations";
import A009ReturnOnsite from "./chapters/09-a009-return-onsite/A009ReturnOnsite";
import { narrations as a009Narrations } from "./chapters/09-a009-return-onsite/narrations";
import A010CapabilityBoundary from "./chapters/10-a010-capability-boundary/A010CapabilityBoundary";
import { narrations as a010Narrations } from "./chapters/10-a010-capability-boundary/narrations";
import A011FourQuestions from "./chapters/11-a011-four-questions/A011FourQuestions";
import { narrations as a011Narrations } from "./chapters/11-a011-four-questions/narrations";
import A012SummaryJudgment from "./chapters/12-a012-summary-judgment/A012SummaryJudgment";
import { narrations as a012Narrations } from "./chapters/12-a012-summary-judgment/narrations";

export const id = "episode-08";
export const title = "工业互联网标识解析作用与意义";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "a001-onsite-question",
    title: "现场与问题",
    narrations: a001Narrations,
    Component: A001OnsiteQuestion,
  },
  {
    id: "a002-linkage-boundary",
    title: "贯通的边界",
    narrations: a002Narrations,
    Component: A002LinkageBoundary,
  },
  {
    id: "a003-two-object-kinds",
    title: "两类对象",
    narrations: a003Narrations,
    Component: A003TwoObjectKinds,
  },
  {
    id: "a004-anchor-not-container",
    title: "锚点不是容器",
    narrations: a004Narrations,
    Component: A004AnchorNotContainer,
  },
  {
    id: "a005-six-stages",
    title: "六个环节",
    narrations: a005Narrations,
    Component: A005SixStages,
  },
  {
    id: "a006-records-to-thread",
    title: "记录成为线索",
    narrations: a006Narrations,
    Component: A006RecordsToThread,
  },
  {
    id: "a007-industry-actors",
    title: "各管各的系统",
    narrations: a007Narrations,
    Component: A007IndustryActors,
  },
  {
    id: "a008-three-scales",
    title: "三层如何衔接",
    narrations: a008Narrations,
    Component: A008ThreeScales,
  },
  {
    id: "a009-return-onsite",
    title: "重返检修现场",
    narrations: a009Narrations,
    Component: A009ReturnOnsite,
  },
  {
    id: "a010-capability-boundary",
    title: "能力与责任边界",
    narrations: a010Narrations,
    Component: A010CapabilityBoundary,
  },
  {
    id: "a011-four-questions",
    title: "四个观察问题",
    narrations: a011Narrations,
    Component: A011FourQuestions,
  },
  {
    id: "a012-summary-judgment",
    title: "分工与判断",
    narrations: a012Narrations,
    Component: A012SummaryJudgment,
  },
];
