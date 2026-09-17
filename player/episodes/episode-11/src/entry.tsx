import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import A001PharmacyVerification from "./chapters/01-pharmacy-verification/A001PharmacyVerification";
import { narrations as a001Narrations } from "./chapters/01-pharmacy-verification/narrations";
import A002ChainRoles from "./chapters/02-a002-chain-roles/A002ChainRoles";
import { narrations as a002Narrations } from "./chapters/02-a002-chain-roles/narrations";
import A003RecordsUnrecognized from "./chapters/03-a003-records-unrecognized/A003RecordsUnrecognized";
import { narrations as a003Narrations } from "./chapters/03-a003-records-unrecognized/narrations";
import A004ThreeBreaks from "./chapters/04-a004-three-breaks/A004ThreeBreaks";
import { narrations as a004Narrations } from "./chapters/04-a004-three-breaks/narrations";
import A005BeyondConnection from "./chapters/05-a005-beyond-connection/A005BeyondConnection";
import { narrations as a005Narrations } from "./chapters/05-a005-beyond-connection/narrations";
import A006EncodeAndResolve from "./chapters/06-a006-encode-and-resolve/A006EncodeAndResolve";
import { narrations as a006Narrations } from "./chapters/06-a006-encode-and-resolve/narrations";
import A007TwoCodeSystems from "./chapters/07-a007-two-code-systems/A007TwoCodeSystems";
import { narrations as a007Narrations } from "./chapters/07-a007-two-code-systems/narrations";
import A008CapabilityBoundary from "./chapters/08-a008-capability-boundary/A008CapabilityBoundary";
import { narrations as a008Narrations } from "./chapters/08-a008-capability-boundary/narrations";
import A009SharedAnchor from "./chapters/09-a009-shared-anchor/A009SharedAnchor";
import { narrations as a009Narrations } from "./chapters/09-a009-shared-anchor/narrations";
import A010FiveStages from "./chapters/10-a010-five-stages/A010FiveStages";
import { narrations as a010Narrations } from "./chapters/10-a010-five-stages/narrations";
import A011DivisionUnchanged from "./chapters/11-a011-division-unchanged/A011DivisionUnchanged";
import { narrations as a011Narrations } from "./chapters/11-a011-division-unchanged/narrations";
import A012TraceablePath from "./chapters/12-a012-traceable-path/A012TraceablePath";
import { narrations as a012Narrations } from "./chapters/12-a012-traceable-path/narrations";
import A013EntryVsMechanism from "./chapters/13-a013-entry-vs-mechanism/A013EntryVsMechanism";
import { narrations as a013Narrations } from "./chapters/13-a013-entry-vs-mechanism/narrations";
import A014WhatChanges from "./chapters/14-a014-what-changes/A014WhatChanges";
import { narrations as a014Narrations } from "./chapters/14-a014-what-changes/narrations";
import A015BackToTheBox from "./chapters/15-a015-back-to-the-box/A015BackToTheBox";
import { narrations as a015Narrations } from "./chapters/15-a015-back-to-the-box/narrations";
import A016ThreeLayerRecap from "./chapters/16-a016-three-layer-recap/A016ThreeLayerRecap";
import { narrations as a016Narrations } from "./chapters/16-a016-three-layer-recap/narrations";
import A017BeyondTechnology from "./chapters/17-a017-beyond-technology/A017BeyondTechnology";
import { narrations as a017Narrations } from "./chapters/17-a017-beyond-technology/narrations";

export const id = "episode-11";
export const title = "药品供应链协同：唯一标识让一盒药全程可查可追";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "pharmacy-verification",
    title: "药房收货核验",
    narrations: a001Narrations,
    Component: A001PharmacyVerification,
  },
  {
    id: "chain-roles",
    title: "链条上的角色",
    narrations: a002Narrations,
    Component: A002ChainRoles,
  },
  {
    id: "records-unrecognized",
    title: "记录很多却不互认",
    narrations: a003Narrations,
    Component: A003RecordsUnrecognized,
  },
  {
    id: "three-breaks",
    title: "三个断点",
    narrations: a004Narrations,
    Component: A004ThreeBreaks,
  },
  {
    id: "beyond-connection",
    title: "对接之外的条件",
    narrations: a005Narrations,
    Component: A005BeyondConnection,
  },
  {
    id: "encode-and-resolve",
    title: "编码与解析各做什么",
    narrations: a006Narrations,
    Component: A006EncodeAndResolve,
  },
  {
    id: "two-code-systems",
    title: "两套体系的关系",
    narrations: a007Narrations,
    Component: A007TwoCodeSystems,
  },
  {
    id: "capability-boundary",
    title: "能力的边界",
    narrations: a008Narrations,
    Component: A008CapabilityBoundary,
  },
  {
    id: "shared-anchor",
    title: "共同指向从哪里来",
    narrations: a009Narrations,
    Component: A009SharedAnchor,
  },
  {
    id: "five-stages",
    title: "阶段的铺开",
    narrations: a010Narrations,
    Component: A010FiveStages,
  },
  {
    id: "division-unchanged",
    title: "分工没有改变",
    narrations: a011Narrations,
    Component: A011DivisionUnchanged,
  },
  {
    id: "traceable-path",
    title: "路径如何成立",
    narrations: a012Narrations,
    Component: A012TraceablePath,
  },
  {
    id: "entry-vs-mechanism",
    title: "入口与机制分开",
    narrations: a013Narrations,
    Component: A013EntryVsMechanism,
  },
  {
    id: "what-changes",
    title: "变化发生在哪里",
    narrations: a014Narrations,
    Component: A014WhatChanges,
  },
  {
    id: "back-to-the-box",
    title: "回扣开场对象",
    narrations: a015Narrations,
    Component: A015BackToTheBox,
  },
  {
    id: "three-layer-recap",
    title: "三层关系复述",
    narrations: a016Narrations,
    Component: A016ThreeLayerRecap,
  },
  {
    id: "beyond-technology",
    title: "技术之外的那一半",
    narrations: a017Narrations,
    Component: A017BeyondTechnology,
  },
];
