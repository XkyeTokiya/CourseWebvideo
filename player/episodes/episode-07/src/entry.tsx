import type { ChapterDef } from "../../../src/runtime/types";
import { Cover } from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import { SiteQuestion } from "./chapters/01-site-question/SiteQuestion";
import { narrations as siteQuestionNarrations } from "./chapters/01-site-question/narrations";
import { BuildStart } from "./chapters/02-build-start/BuildStart";
import { narrations as buildStartNarrations } from "./chapters/02-build-start/narrations";
import { CapabilityPhase } from "./chapters/03-capability-phase/CapabilityPhase";
import { narrations as capabilityPhaseNarrations } from "./chapters/03-capability-phase/narrations";
import { PiercePlan } from "./chapters/04-pierce-plan/PiercePlan";
import { narrations as piercePlanNarrations } from "./chapters/04-pierce-plan/narrations";
import { TargetReading } from "./chapters/05-target-reading/TargetReading";
import { narrations as targetReadingNarrations } from "./chapters/05-target-reading/narrations";
import { ScaleLayers } from "./chapters/06-scale-layers/ScaleLayers";
import { narrations as scaleLayersNarrations } from "./chapters/06-scale-layers/narrations";
import { WrapCheck } from "./chapters/07-wrap-check/WrapCheck";
import { narrations as wrapCheckNarrations } from "./chapters/07-wrap-check/narrations";

export const id = "episode-07";
export const title = "我国标识解析从建设走向规模应用";

// 本次 outline-first 直接接续测试范围:仅封面 + A001 样板。
// A002–A007 尚未制作,不注册任何未实现章节。
export const CHAPTERS: ChapterDef[] = [
  {
    id: "00-cover",
    title: "封面",
    narrations: coverNarrations,
    stepDurationsMs: [15000],
    Component: Cover,
  },
  {
    id: "01-site-question",
    title: "现场提问：能解析，还不等于业务在用",
    narrations: siteQuestionNarrations,
    Component: SiteQuestion,
  },
  {
    id: "02-build-start",
    title: "2018：先把基础搭起来",
    narrations: buildStartNarrations,
    Component: BuildStart,
  },
  {
    id: "03-capability-phase",
    title: "2021—2023：能力增强",
    narrations: capabilityPhaseNarrations,
    Component: CapabilityPhase,
  },
  {
    id: "04-pierce-plan",
    title: "2024—2026：以“贯通”为关键词",
    narrations: piercePlanNarrations,
    Component: PiercePlan,
  },
  {
    id: "05-target-reading",
    title: "目标值，不是完成值",
    narrations: targetReadingNarrations,
    Component: TargetReading,
  },
  {
    id: "06-scale-layers",
    title: "规模应用的三层变化",
    narrations: scaleLayersNarrations,
    Component: ScaleLayers,
  },
  {
    id: "07-wrap-check",
    title: "建设不停，应用加深",
    narrations: wrapCheckNarrations,
    Component: WrapCheck,
  },
];
