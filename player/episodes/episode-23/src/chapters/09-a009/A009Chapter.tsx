import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009Chapter.css";
import m004 from "./assets/m004.png";

const stateByStep = ["four-roles-set", "flow-traced"] as const;

const ROLES = ["数据使用方", "数据提供方", "授权过程", "交换通道"] as const;

const STEPS = [
  { actor: "使用方", move: "提出访问申请" },
  { actor: "数据提供方", move: "参与审批" },
  { actor: "使用方", move: "提出交换请求" },
  { actor: "交换通道", move: "查询并核验授权条件" },
  { actor: "数据提供方", move: "提供数据" },
  { actor: "使用方", move: "获取数据" },
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const traced = state === "flow-traced";

  return (
    <div className="rd-scene scene-pad">
      <header className="rd-head">
        <h1 className="rd-headline">一种可信的数据共享方案</h1>
        <div className="rd-head-rule" />
      </header>

      <div className="rd-main">
        <figure className="rd-media card">
          <img
            className="rd-media-img"
            src={m004}
            alt="教材图 3-3 占位图（原图待提供）"
          />
          <figcaption className="rd-media-cap">
            教材图 3-3「一种可信的数据共享方案」· 原图待提供（现为占位图）
          </figcaption>
        </figure>

        <div className="rd-rail">
          <section className="rd-roles card is-on" aria-label="四个部分">
            <p className="rd-tag">
              四个部分：数据使用方、数据提供方、授权过程、交换通道
            </p>
            <ul className="rd-role-list">
              {ROLES.map((role, i) => (
                <li
                  key={role}
                  className="rd-role"
                  style={{ "--rd-i": i } as CSSProperties}
                >
                  {role}
                </li>
              ))}
            </ul>
          </section>

          <section
            className={`rd-flow card${traced ? " is-on" : " is-pending"}`}
            aria-hidden={!traced}
            aria-label="六步关系"
          >
            <p className="rd-tag">六步关系</p>
            <ol className="rd-steps">
              {STEPS.map((s, i) => (
                <li
                  key={s.move}
                  className="rd-step"
                  style={{ "--rd-i": i } as CSSProperties}
                >
                  <span className="rd-step-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rd-step-actor">{s.actor}</span>
                  <span className="rd-step-move">{s.move}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
