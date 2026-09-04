import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import ReceivingBreakpoint from "./chapters/01-receiving-breakpoint/ReceivingBreakpoint";
import { narrations as receivingBreakpointNarrations } from "./chapters/01-receiving-breakpoint/narrations";
import PrivateCodeScope from "./chapters/02-private-code-scope/PrivateCodeScope";
import { narrations as privateCodeScopeNarrations } from "./chapters/02-private-code-scope/narrations";
import BoundaryContextGap from "./chapters/03-boundary-context-gap/BoundaryContextGap";
import { narrations as boundaryContextGapNarrations } from "./chapters/03-boundary-context-gap/narrations";
import ObjectCodeCarrier from "./chapters/04-object-code-carrier/ObjectCodeCarrier";
import { narrations as objectCodeCarrierNarrations } from "./chapters/04-object-code-carrier/narrations";
import DigitalIdentity from "./chapters/05-digital-identity/DigitalIdentity";
import { narrations as digitalIdentityNarrations } from "./chapters/05-digital-identity/narrations";
import IdentityVsNumber from "./chapters/06-identity-vs-number/IdentityVsNumber";
import { narrations as identityVsNumberNarrations } from "./chapters/06-identity-vs-number/narrations";
import IdentityAcrossStages from "./chapters/07-identity-across-stages/IdentityAcrossStages";
import { narrations as identityAcrossStagesNarrations } from "./chapters/07-identity-across-stages/narrations";
import LoopbackSummary from "./chapters/10-loopback-summary/LoopbackSummary";
import { narrations as loopbackSummaryNarrations } from "./chapters/10-loopback-summary/narrations";

export const id = "episode-05";
export const title = "对象身份锚点";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "receiving-breakpoint",
    title: "收货现场的断点",
    narrations: receivingBreakpointNarrations,
    Component: ReceivingBreakpoint,
  },
  {
    id: "private-code-scope",
    title: "私码的来历与成立范围",
    narrations: privateCodeScopeNarrations,
    Component: PrivateCodeScope,
  },
  {
    id: "boundary-context-gap",
    title: "跨界之后的语境缺失",
    narrations: boundaryContextGapNarrations,
    Component: BoundaryContextGap,
  },
  {
    id: "object-code-carrier",
    title: "对象、编码、载体分层",
    narrations: objectCodeCarrierNarrations,
    Component: ObjectCodeCarrier,
  },
  {
    id: "digital-identity",
    title: "工业对象的数字身份",
    narrations: digitalIdentityNarrations,
    Component: DigitalIdentity,
  },
  {
    id: "identity-vs-number",
    title: "编号与身份编码的分界",
    narrations: identityVsNumberNarrations,
    Component: IdentityVsNumber,
  },
  {
    id: "identity-across-stages",
    title: "一个身份贯穿四个环节",
    narrations: identityAcrossStagesNarrations,
    Component: IdentityAcrossStages,
  },
  {
    id: "loopback-summary",
    title: "从私码断点回到身份锚点",
    narrations: loopbackSummaryNarrations,
    Component: LoopbackSummary,
  },
];
