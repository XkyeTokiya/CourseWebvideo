import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import ReceivingBreakpoint from "./chapters/01-receiving-breakpoint/ReceivingBreakpoint";
import { narrations as receivingBreakpointNarrations } from "./chapters/01-receiving-breakpoint/narrations";

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
];
