import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 05-a005 · 前缀职责页（outline §5 · S-A005 · scope-responsibility-ledger）
 * 序列轨道 + 单一台账幅面：三列共享一块板（内部虚线分列，不是三张卡），
 * 上方 01→02→03 序列轨承载 ordered-progression；底部横跨一条约定带。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - three-segments-named：轨道节点与三列按国家→行业→企业顺序依次点亮，
 *   每列写段名与职责短句，完成后三列等序保持（A005 · step 1，
 *   R009/R010 由列的先后相续承载）
 * - conventions-shown：底部约定带升入，「行业代码通常三位，企业代码不超过
 *   二十位」挂「参考示例」角标（A005 · step 2，R011 由角标与右端边界列的
 *   并排位置承载）
 * - authorization-checked：三列与约定带内容不变，右端边界注脚点亮为焦点
 *   （A005 · step 3）
 * exact 逐字项（含全角冒号）：
 * - S022「国家代码:遵从标识体系与注册管理机构要求」（列 1）
 * - S023「行业代码:区分制造业门类」（列 2）
 * - S024「企业代码:区分工业互联网运营单元」（列 3）
 * - S025「行业代码通常三位，企业代码不超过二十位」（约定带，自第 2 拍起）
 * 护栏 C007：长度数字只作参考示例，不呈现为现行通用有效限制或注册依据；
 * 护栏 C008：不补充申请步骤、注册机构名单、字段上限或接口。
 */
const stateByStep = [
  "three-segments-named",
  "conventions-shown",
  "authorization-checked",
] as const;

type A005State = (typeof stateByStep)[number];

/** 三列台账（exact S022/S023/S024 逐字；段名加粗，冒号与职责保持在同一文本节点） */
const SEGMENTS = [
  { no: "01", name: "国家代码", duty: "遵从标识体系与注册管理机构要求" },
  { no: "02", name: "行业代码", duty: "区分制造业门类" },
  { no: "03", name: "企业代码", duty: "区分工业互联网运营单元" },
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state: A005State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad lg-root" data-state={state}>
      <header className="lg-head">
        <span className="lg-head-tick" aria-hidden="true" />
        <h1 className="lg-headline">前缀由三段组成</h1>
        <span className="lg-head-rule" aria-hidden="true" />
      </header>

      <div className="lg-rail" aria-hidden="true">
        <span className="lg-rail-line" />
        {SEGMENTS.map((segment, index) => (
          <span
            key={segment.no}
            className={`lg-node lg-node-${index + 1}`}
          >
            {segment.no}
          </span>
        ))}
      </div>

      <div className="lg-sheet">
        {SEGMENTS.map((segment, index) => (
          <section
            key={segment.no}
            className={`lg-col lg-col-${index + 1}`}
            aria-label={`前缀第 ${index + 1} 段`}
          >
            <span className="lg-col-no">{segment.no}</span>
            <p className="lg-col-text">
              <b>{segment.name}</b>
              <span>:{segment.duty}</span>
            </p>
            <span className="lg-col-foot" aria-hidden="true" />
          </section>
        ))}
      </div>

      <div className="lg-band">
        <span className="lg-band-badge">参考示例</span>
        <p className="lg-band-text">
          <b>行业代码</b>通常三位，<b>企业代码</b>不超过二十位
        </p>
        <div className="lg-band-boundary">
          <p className="lg-band-boundary-main">
            以<b>授权体系</b>和<b>适用版本</b>为准
          </p>
          <p className="lg-band-boundary-sub">
            不能自己发明一个看起来能注册的前缀
          </p>
        </div>
      </div>
    </div>
  );
}
