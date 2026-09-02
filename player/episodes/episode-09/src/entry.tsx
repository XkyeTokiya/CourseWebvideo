import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import AfterScan from "./chapters/01-after-scan/AfterScan";
import { narrations as afterScanNarrations } from "./chapters/01-after-scan/narrations";
import RecordsWithoutChain from "./chapters/02-records-without-chain/RecordsWithoutChain";
import { narrations as recordsWithoutChainNarrations } from "./chapters/02-records-without-chain/narrations";
import FragmentedRecords from "./chapters/03-fragmented-records/FragmentedRecords";
import { narrations as fragmentedRecordsNarrations } from "./chapters/03-fragmented-records/narrations";
import LifecycleContinuity from "./chapters/04-lifecycle-continuity/LifecycleContinuity";
import { narrations as lifecycleContinuityNarrations } from "./chapters/04-lifecycle-continuity/narrations";
import IdentityAsAnchor from "./chapters/05-identity-as-anchor/IdentityAsAnchor";
import { narrations as identityAsAnchorNarrations } from "./chapters/05-identity-as-anchor/narrations";
import AnchorGroups from "./chapters/06-anchor-groups/AnchorGroups";
import { narrations as anchorGroupsNarrations } from "./chapters/06-anchor-groups/narrations";
import FeedbackWithIdentity from "./chapters/07-feedback-with-identity/FeedbackWithIdentity";
import { narrations as feedbackWithIdentityNarrations } from "./chapters/07-feedback-with-identity/narrations";
import LookupChanged from "./chapters/08-lookup-changed/LookupChanged";
import { narrations as lookupChangedNarrations } from "./chapters/08-lookup-changed/narrations";
import EvidenceBoundary from "./chapters/09-evidence-boundary/EvidenceBoundary";
import { narrations as evidenceBoundaryNarrations } from "./chapters/09-evidence-boundary/narrations";
import ReconnectSameObject from "./chapters/10-reconnect-same-object/ReconnectSameObject";
import { narrations as reconnectSameObjectNarrations } from "./chapters/10-reconnect-same-object/narrations";

export const id = "episode-09";
export const title = "发动机质量追溯：统一标识串起分散记录";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "after-scan",
    title: "认出发动机之后",
    narrations: afterScanNarrations,
    Component: AfterScan,
  },
  {
    id: "records-without-chain",
    title: "有记录，还没有追溯链",
    narrations: recordsWithoutChainNarrations,
    Component: RecordsWithoutChain,
  },
  {
    id: "fragmented-records",
    title: "记录为什么接不起来",
    narrations: fragmentedRecordsNarrations,
    Component: FragmentedRecords,
  },
  {
    id: "lifecycle-continuity",
    title: "同一台发动机走完全生命周期",
    narrations: lifecycleContinuityNarrations,
    Component: LifecycleContinuity,
  },
  {
    id: "identity-as-anchor",
    title: "统一标识只做关联锚点",
    narrations: identityAsAnchorNarrations,
    Component: IdentityAsAnchor,
  },
  {
    id: "anchor-groups",
    title: "五类信息围绕一个标识",
    narrations: anchorGroupsNarrations,
    Component: AnchorGroups,
  },
  {
    id: "feedback-with-identity",
    title: "售后反馈带着身份回查",
    narrations: feedbackWithIdentityNarrations,
    Component: FeedbackWithIdentity,
  },
  {
    id: "lookup-changed",
    title: "改变的是查找方式",
    narrations: lookupChangedNarrations,
    Component: LookupChanged,
  },
  {
    id: "evidence-boundary",
    title: "三项案例数字的证据边界",
    narrations: evidenceBoundaryNarrations,
    Component: EvidenceBoundary,
  },
  {
    id: "reconnect-same-object",
    title: "围绕同一对象重新连接",
    narrations: reconnectSameObjectNarrations,
    Component: ReconnectSameObject,
  },
];
