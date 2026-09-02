import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ConnectionFirst.css";

const states = [
  "connection-capability-set",
  "information-flowing",
  "fragment-to-capability",
] as const;

type ConnectionFirstState = (typeof states)[number];

function slotPhase(index: number, current: number) {
  if (index < current) return "past";
  if (index === current) return "active";
  return "upcoming";
}

export default function ConnectionFirst({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const current = states.indexOf(state as ConnectionFirstState);

  return (
    <div className="cf-scene scene-pad" data-phase={state}>
      <header className="cf-head">
        <p className="cf-kicker">看清这条路径 · 从连接、数据和智能说起</p>
        <h1 className="cf-title">
          连接先让信息<em>到达</em>，再暴露孤立断点
        </h1>
      </header>

      <div className="cf-chain">
        <article className="cf-card card" data-phase={slotPhase(0, current)}>
          <span className="cf-idx hero-num">01</span>
          <h2 className="cf-card-title">连接是起点：一切都能够通信</h2>
          <div className="cf-body">
            <ul className="cf-list">
              <li>
                <b>设备、系统、流程、人员</b>彼此能够通信
              </li>
              <li>
                <b>传感器</b>感知状态
              </li>
              <li>
                <b>执行器</b>接收指令
              </li>
              <li>
                <b>不同环节</b>交换信息
              </li>
            </ul>
          </div>
        </article>

        <span className="cf-link cf-link-1" aria-hidden="true" />

        <article className="cf-card card" data-phase={slotPhase(1, current)}>
          <span className="cf-idx hero-num">02</span>
          <h2 className="cf-card-title">信息才有机会到达需要它的环节</h2>
          <div className="cf-body">
            <div className="cf-track">
              <span className="cf-mile">采集</span>
              <span className="cf-mile">传递</span>
              <span className="cf-mile cf-mile-final">到达</span>
            </div>
            <p className="cf-flow-cap">运行状态与业务信息沿环节被采集、传递</p>
            <p className="cf-footnote">连接解决的是信息能不能到达</p>
          </div>
        </article>

        <span className="cf-link cf-link-2" aria-hidden="true" />

        <article className="cf-card cf-result card" data-phase={slotPhase(2, current)}>
          <span className="cf-idx hero-num">03</span>
          <h2 className="cf-card-title">连上，不等于用好了</h2>
          <div className="cf-body">
            <div className="cf-silos">
              <span className="cf-silo">设备日志</span>
              <span className="cf-silo">质量结果</span>
              <span className="cf-silo">库存</span>
              <span className="cf-silo">生产计划</span>
            </div>
            <p className="cf-frag">各自封闭 · 企业看到的仍是几个局部片段</p>
            <div className="cf-transform">
              <span className="cf-condition">持续收集 · 分析 · 应用</span>
              <span className="cf-tarrow" aria-hidden="true" />
              <span className="cf-badge">数据能力</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
