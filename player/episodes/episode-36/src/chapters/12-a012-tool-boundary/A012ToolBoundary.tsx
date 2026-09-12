import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A012ToolBoundary.css";

const STATES = ["tools-listed", "tools-bounded", "judgment-retained"] as const;

const TOOLS = ["专业软件", "在线专用设计工具", "办公软件排版功能"] as const;

const SELF_ITEMS = ["附着物", "材质", "位置", "信息主次"] as const;

export default function A012ToolBoundary({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const roleIn = state !== "tools-listed";
  const boundIn = state === "judgment-retained";

  return (
    <div className="a12-root scene-pad">
      <header className="a12-head">
        <h1 className="a12-title">工具是表达手段，替代不了判断</h1>
      </header>

      <div className="a12-frame">
        <div className="a12-main">
          <div className="a12-bands">
            {TOOLS.map((t, i) => (
              <p key={t} className="a12-band" style={{ "--a12-i": String(i) } as CSSProperties}>
                {t}
              </p>
            ))}
            <p className="a12-tail">——都可以。</p>
          </div>

          <aside className={`a12-side${roleIn ? " is-in" : ""}`}>
            <p className="a12-side-kicker">职能</p>
            <p className="a12-side-line">
              工具只负责把<strong>已经想清楚的版面关系</strong>表达出来——替代不了你的判断。
            </p>
          </aside>
        </div>

        <div className={`a12-boundary${boundIn ? " is-in" : ""}`}>
          <p className="a12-boundary-kicker">边界</p>
          <div className="a12-boundary-body">
            <div className="a12-items">
              {SELF_ITEMS.map((s) => (
                <span key={s} className="a12-item">
                  {s}
                </span>
              ))}
            </div>
            <p className="a12-boundary-line">这些，还得你自己想清楚。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
