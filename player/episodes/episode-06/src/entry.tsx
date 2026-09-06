import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import ScanAndQuestions from "./chapters/01-scan-and-questions/ScanAndQuestions";
import { narrations as scanAndQuestionsNarrations } from "./chapters/01-scan-and-questions/narrations";
import IdentityKey from "./chapters/02-identity-key/IdentityKey";
import { narrations as identityKeyNarrations } from "./chapters/02-identity-key/narrations";
import WhatResolutionDoes from "./chapters/03-what-resolution-does/WhatResolutionDoes";
import { narrations as whatResolutionDoesNarrations } from "./chapters/03-what-resolution-does/narrations";
import DnsAnalogyLimits from "./chapters/04-dns-analogy-limits/DnsAnalogyLimits";
import { narrations as dnsAnalogyLimitsNarrations } from "./chapters/04-dns-analogy-limits/narrations";
import TwoPartsInseparable from "./chapters/05-two-parts-inseparable/TwoPartsInseparable";
import { narrations as twoPartsInseparableNarrations } from "./chapters/05-two-parts-inseparable/narrations";
import QueryWalkthrough from "./chapters/06-query-walkthrough/QueryWalkthrough";
import { narrations as queryWalkthroughNarrations } from "./chapters/06-query-walkthrough/narrations";
import RecursiveEntryNode from "./chapters/07-recursive-entry-node/RecursiveEntryNode";
import { narrations as recursiveEntryNodeNarrations } from "./chapters/07-recursive-entry-node/narrations";
import GlobalNationalLayer from "./chapters/08-global-national-layer/GlobalNationalLayer";
import { narrations as globalNationalLayerNarrations } from "./chapters/08-global-national-layer/narrations";
import IndustryEnterpriseLayer from "./chapters/09-industry-enterprise-layer/IndustryEnterpriseLayer";
import { narrations as industryEnterpriseLayerNarrations } from "./chapters/09-industry-enterprise-layer/narrations";
import FiveRolesCollaborate from "./chapters/10-five-roles-collaborate/FiveRolesCollaborate";
import { narrations as fiveRolesCollaborateNarrations } from "./chapters/10-five-roles-collaborate/narrations";
import ResultBoundary from "./chapters/11-result-boundary/ResultBoundary";
import { narrations as resultBoundaryNarrations } from "./chapters/11-result-boundary/narrations";
import FromCodeToInfo from "./chapters/12-from-code-to-info/FromCodeToInfo";
import { narrations as fromCodeToInfoNarrations } from "./chapters/12-from-code-to-info/narrations";

export const id = "episode-06";
export const title = "标识解析体系与层级";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "scan-and-questions",
    title: "扫码确认之后",
    narrations: scanAndQuestionsNarrations,
    Component: ScanAndQuestions,
  },
  {
    id: "identity-key",
    title: "身份键与挂载的信息",
    narrations: identityKeyNarrations,
    Component: IdentityKey,
  },
  {
    id: "what-resolution-does",
    title: "解析到底做什么",
    narrations: whatResolutionDoesNarrations,
    Component: WhatResolutionDoes,
  },
  {
    id: "dns-analogy-limits",
    title: "类比到哪里为止",
    narrations: dnsAnalogyLimitsNarrations,
    Component: DnsAnalogyLimits,
  },
  {
    id: "two-parts-inseparable",
    title: "两部分缺一不可",
    narrations: twoPartsInseparableNarrations,
    Component: TwoPartsInseparable,
  },
  {
    id: "query-walkthrough",
    title: "沿一次查询走一遍",
    narrations: queryWalkthroughNarrations,
    Component: QueryWalkthrough,
  },
  {
    id: "recursive-entry-node",
    title: "查询侧的入口角色",
    narrations: recursiveEntryNodeNarrations,
    Component: RecursiveEntryNode,
  },
  {
    id: "global-national-layer",
    title: "大范围协同层",
    narrations: globalNationalLayerNarrations,
    Component: GlobalNationalLayer,
  },
  {
    id: "industry-enterprise-layer",
    title: "逐层缩小到行业与企业",
    narrations: industryEnterpriseLayerNarrations,
    Component: IndustryEnterpriseLayer,
  },
  {
    id: "five-roles-collaborate",
    title: "五个角色如何协作",
    narrations: fiveRolesCollaborateNarrations,
    Component: FiveRolesCollaborate,
  },
  {
    id: "result-boundary",
    title: "结果有边界",
    narrations: resultBoundaryNarrations,
    Component: ResultBoundary,
  },
  {
    id: "from-code-to-info",
    title: "从读码到拿到结果",
    narrations: fromCodeToInfoNarrations,
    Component: FromCodeToInfo,
  },
];
