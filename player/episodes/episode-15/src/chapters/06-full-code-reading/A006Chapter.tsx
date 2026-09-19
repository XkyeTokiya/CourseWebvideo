import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M003 from "./assets/M003.png";

const stateByStep = [
  "code-assembled",
  "head-anchored",
  "layers-swept",
  "tail-connected",
  "slash-explained",
  "reading-purpose-set",
] as const;

const MID_CELLS = [
  { digits: "088", label: "国家层级" },
  { digits: "100", label: "行业层级" },
  { digits: "12345678", label: "企业层级" },
] as const;

const READ_STOPS = [
  { no: "01", name: "开头" },
  { no: "02", name: "中间" },
  { no: "03", name: "末尾" },
] as const;

function MidBracket() {
  return (
    <svg
      className="fcr-bracket-svg"
      viewBox="0 0 621 30"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="fcr-bracket-path"
        d="M4 3v15a7 7 0 0 0 7 7h599a7 7 0 0 0 7-7V3"
        pathLength={1}
      />
    </svg>
  );
}

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad fcr-root" data-state={state}>
      <header className="fcr-header">
        <span className="fcr-heading-mark" aria-hidden="true" />
        <h1 className="fcr-headline">整条编码的读法</h1>
      </header>

      <div className="fcr-main">
        <div className="fcr-reading">
          <div className="fcr-strip">
            <div className="fcr-grp fcr-grp-head">
              <span className="fcr-digits fcr-digits-head">VAA</span>
              <span className="fcr-cell-label fcr-label-head">发码机构代码</span>
            </div>

            <div className="fcr-grp fcr-grp-mid">
              <div className="fcr-mid-row">
                {MID_CELLS.map((cell) => (
                  <div className="fcr-cell" key={cell.digits}>
                    <span className="fcr-digits">{cell.digits}</span>
                    <span className="fcr-cell-label fcr-label-mid">{cell.label}</span>
                  </div>
                ))}
              </div>
              <div className="fcr-bracket">
                <MidBracket />
                <p className="fcr-bracket-label">
                  <span className="fcr-bracket-lead">共同组成</span>服务机构代码
                </p>
              </div>
            </div>

            <span className="fcr-sep" aria-hidden="true">
              /
            </span>

            <div className="fcr-grp fcr-grp-tail">
              <span className="fcr-tail-name">企业内部编码</span>
              <span className="fcr-cell-label fcr-label-tail">留给企业管理</span>
            </div>
          </div>

          <div className="fcr-progress">
            <span className="fcr-progress-line" aria-hidden="true" />
            {READ_STOPS.map((stop) => (
              <div className="fcr-stop" key={stop.no}>
                <span className="fcr-stop-dot" aria-hidden="true" />
                <span className="fcr-stop-no">{stop.no}</span>
                <span className="fcr-stop-name">{stop.name}</span>
              </div>
            ))}
          </div>

          <span className="fcr-sweep" aria-hidden="true" />
        </div>

        <aside className="fcr-side">
          <figure className="fcr-media">
            <img
              className="fcr-media-img"
              src={M003}
              alt="现场语境占位图：对象身份核对场景，不含可读编码"
            />
            <figcaption className="fcr-media-cap">现场语境 · 占位</figcaption>
          </figure>

          <div className="fcr-rail">
            <span className="fcr-rail-ghost" aria-hidden="true">
              /
            </span>
            <div className="fcr-rail-note fcr-note-slash">
              <span className="fcr-note-tick" aria-hidden="true" />
              <p className="fcr-note-text">
                末尾用分隔符接上企业内部编码，斜杠后那一段留给企业管理
              </p>
            </div>
            <div className="fcr-rail-note fcr-note-purpose">
              <span className="fcr-note-tick" aria-hidden="true" />
              <p className="fcr-note-text">读它是为了看懂层级怎么排</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
