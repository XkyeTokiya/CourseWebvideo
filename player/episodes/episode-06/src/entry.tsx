import type { ChapterDef } from "../../../src/shared/presentation-runtime/registry/types";
import Cover from "./chapters/00-cover/Cover";
import { narrations as coverNarrations } from "./chapters/00-cover/narrations";
import ScanAndQuestions from "./chapters/01-scan-and-questions/ScanAndQuestions";
import { narrations as scanAndQuestionsNarrations } from "./chapters/01-scan-and-questions/narrations";

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
];
