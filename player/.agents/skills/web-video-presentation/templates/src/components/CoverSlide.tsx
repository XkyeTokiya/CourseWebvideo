import type { CSSProperties } from "react";
import coverJson from "../data/cover.json";
import "./CoverSlide.css";

type CoverData = Omit<typeof coverJson, "style">;

// Map only content fields. The source `style` field is intentionally ignored.
const data: CoverData = {
  course: coverJson.course,
  module: coverJson.module,
  task: coverJson.task,
  point: coverJson.point,
  lede: coverJson.lede,
  chips: coverJson.chips,
};

export function CoverSlide() {
  const titleLines = data.point.title.split(/\\n|\n/).filter(Boolean);
  const titleSize = Math.max(
    48,
    Math.min(92, 92 - Math.max(0, titleLines[0]!.length - 12) * 2),
  );
  const vars = { "--cover-title-size": `${titleSize}px` } as CSSProperties;
  const footer = `${data.module.no} · ${data.task.no} · ${data.point.no}`;

  return (
    <section className="cover-slide cover-theme" style={vars} aria-label="封面">
      <div className="cover-topbar">
        <span className="cover-book">课程《{data.course}》</span>
        <span className="cover-module">
          <b>{data.module.no}</b><span>{data.module.name}</span>
        </span>
      </div>
      <div className="cover-main">
        <div className="cover-task">
          <b>{data.task.no}</b><span>{data.task.name}</span>
        </div>
        <span className="cover-point">{data.point.no}</span>
        <h1>
          {titleLines.map((line, i) => (
            <span key={`${line}-${i}`}>{line}</span>
          ))}
        </h1>
        <p className="cover-subtitle">{data.lede}</p>
        <div className="cover-rule" />
        {!!data.chips?.length && (
          <div className="cover-chips" aria-label="关键词">
            {data.chips.map((chip) => <span key={chip}>{chip}</span>)}
          </div>
        )}
      </div>
      <div className="cover-footer">{footer}</div>
    </section>
  );
}
