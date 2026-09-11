import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001OffsiteContext from "./chapters/01-a001-offsite-context/A001OffsiteContext";
import { narrations as a001Narrations } from "./chapters/01-a001-offsite-context/narrations";
import A002InformationIslands from "./chapters/02-a002-information-islands/A002InformationIslands";
import { narrations as a002Narrations } from "./chapters/02-a002-information-islands/narrations";
import A003SmartControlGoal from "./chapters/03-a003-smart-control-goal/A003SmartControlGoal";
import { narrations as a003Narrations } from "./chapters/03-a003-smart-control-goal/narrations";
import A004ActiveIdPositioning from "./chapters/04-a004-active-id-positioning/A004ActiveIdPositioning";
import { narrations as a004Narrations } from "./chapters/04-a004-active-id-positioning/narrations";
import A005BidirectionalFlows from "./chapters/05-a005-bidirectional-flows/A005BidirectionalFlows";
import { narrations as a005Narrations } from "./chapters/05-a005-bidirectional-flows/narrations";
import A006TrackableHistory from "./chapters/06-a006-trackable-history/A006TrackableHistory";
import { narrations as a006Narrations } from "./chapters/06-a006-trackable-history/narrations";
import A007ConditionMonitoring from "./chapters/07-a007-condition-monitoring/A007ConditionMonitoring";
import { narrations as a007Narrations } from "./chapters/07-a007-condition-monitoring/narrations";
import A008ControlShift from "./chapters/08-a008-control-shift/A008ControlShift";
import { narrations as a008Narrations } from "./chapters/08-a008-control-shift/narrations";
import A009QualityEvidence from "./chapters/09-a009-quality-evidence/A009QualityEvidence";
import { narrations as a009Narrations } from "./chapters/09-a009-quality-evidence/narrations";
import A010FullCircle from "./chapters/10-a010-full-circle/A010FullCircle";
import { narrations as a010Narrations } from "./chapters/10-a010-full-circle/narrations";

export const id = "episode-10";
export const title = "注塑模具智能化生产管控：主动标识让模具开口报告状态";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "a001-offsite-context",
    title: "模具离厂之后",
    narrations: a001Narrations,
    Component: A001OffsiteContext,
  },
  {
    id: "a002-information-islands",
    title: "信息连不起来",
    narrations: a002Narrations,
    Component: A002InformationIslands,
  },
  {
    id: "a003-smart-control-goal",
    title: "管控目标",
    narrations: a003Narrations,
    Component: A003SmartControlGoal,
  },
  {
    id: "a004-active-id-positioning",
    title: "主动标识的定位",
    narrations: a004Narrations,
    Component: A004ActiveIdPositioning,
  },
  {
    id: "a005-bidirectional-flows",
    title: "双向的两个方向",
    narrations: a005Narrations,
    Component: A005BidirectionalFlows,
  },
  {
    id: "a006-trackable-history",
    title: "履历怎么被记下来",
    narrations: a006Narrations,
    Component: A006TrackableHistory,
  },
  {
    id: "a007-condition-monitoring",
    title: "状态监测与安全",
    narrations: a007Narrations,
    Component: A007ConditionMonitoring,
  },
  {
    id: "a008-control-shift",
    title: "管控方式的变化",
    narrations: a008Narrations,
    Component: A008ControlShift,
  },
  {
    id: "a009-quality-evidence",
    title: "质量成效与边界",
    narrations: a009Narrations,
    Component: A009QualityEvidence,
  },
  {
    id: "a010-full-circle",
    title: "回到这副模具",
    narrations: a010Narrations,
    Component: A010FullCircle,
  },
];
