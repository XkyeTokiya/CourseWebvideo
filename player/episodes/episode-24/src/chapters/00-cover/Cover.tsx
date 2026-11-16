import { CoverSlide } from "../../../../../src/shared/presentation-runtime/components/CoverSlide";
import coverJson from "../../data/cover.json";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

export default function Cover(_props: ChapterStepProps) {
  const data = {
    course: coverJson.course,
    module: coverJson.module,
    task: coverJson.task,
    point: coverJson.point,
    lede: coverJson.lede,
    chips: coverJson.chips,
  };
  return <CoverSlide data={data} />;
}
