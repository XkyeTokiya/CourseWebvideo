import type { ChapterStepProps } from "../../../src/runtime/types";
import "./BuildStart.css";

// A002 · S-A002(单持续 base-scene)。
// narration step → semantic state(见 outline 视觉步组):
// anchor-established / priorities-paired / boundary-drawn。
const stateByStep = [
  "anchor-established",
  "priorities-paired",
  "boundary-drawn",
] as const;

type SceneState = (typeof stateByStep)[number];

// “323”行动概括的三个组成,词组来自 A002 beat 1 原句;
// 仅作推进安排概括展示,不使用政策文件样式(C003)。
const PLAN_ROWS = [
  { num: "3", label: "三大体系", detail: "网络 · 平台 · 安全" },
  { num: "2", label: "两类应用", detail: "" },
  { num: "3", label: "三大支撑", detail: "" },
] as const;

function BuildStartScene({ state }: { state: SceneState }) {
  return (
    <div className="scene bs" data-state={state}>
      <div className="scene-pad bs-pad">
        <header className="bs-head">
          <h1 className="bs-headline">2018：先把基础搭起来</h1>
          <hr className="rule" />
        </header>

        <section className="bs-anchor card">
          <div className="bs-year">
            <p className="hero-num bs-year-num">2018</p>
            <p className="bs-year-cap">全面实施工业互联网建设的开局之年</p>
          </div>
          <div className="bs-anchor-div" aria-hidden />
          <div className="bs-plan">
            <p className="bs-plan-tag">教材回顾：“323”行动（当时的推进安排概括）</p>
            <ul className="bs-plan-rows">
              {PLAN_ROWS.map((row, index) => (
                <li className={`bs-plan-row bs-r${index}`} key={row.label}>
                  <span className="bs-row-num">{row.num}</span>
                  <span className="bs-row-label">{row.label}</span>
                  {row.detail ? <span className="bs-row-detail">{row.detail}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="bs-focus">
          <article className="bs-fcard">
            <div className="bs-fghost" aria-hidden />
            <div className="bs-fbody card">
              <p className="bs-ftag">首要任务</p>
              <p className="bs-fmain">搭起体系和服务能力</p>
              <p className="bs-fsub">
                让跨企业、跨行业注册与解析有共同运行基础，为后续应用打底
              </p>
            </div>
          </article>

          <article className="bs-fcard">
            <div className="bs-fghost" aria-hidden />
            <div className="bs-fbody card">
              <p className="bs-ftag">早期观察维度</p>
              <ul className="bs-fdims">
                <li>节点接入</li>
                <li>服务范围</li>
                <li>体系稳定运行</li>
              </ul>
            </div>
          </article>
        </div>

        <footer className="bs-takeaway">
          <p className="bs-band">
            <span>建设指标</span>
            <span className="bs-neq">≠</span>
            <span>业务效果：设施数量不回答生产经营是否改变</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export function BuildStart({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <BuildStartScene state={state} />;
}
