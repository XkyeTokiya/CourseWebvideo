import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/** step（0 基）→ handoff steps[].scene_state 的 semantic state（末位兜底） */
const stateByStep = [
  "split-established",
  "prefix-annotated",
  "suffix-annotated",
  "roles-combined",
] as const;

type A006State = (typeof stateByStep)[number];

/** 抽象字符段：条码状竖线，示意“那串字符”，不指向任何真实编码示例 */
function CharBars({ count }: { count: number }) {
  return (
    <div className="ps-bars" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export default function A006Chapter({ step }: ChapterStepProps) {
  const state: A006State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad ps-root" data-state={state}>
      <header className="ps-header">
        <span className="ps-header-mark" aria-hidden="true" />
        <h1 className="ps-headline">前缀和后缀各回答什么</h1>
        <span className="ps-subject">一个 Handle 标识 · 由两部分组成</span>
      </header>

      <div className="ps-split">
        {/* 左结构位：前缀（R005 由左侧标注承载） */}
        <section className="ps-half ps-half--prefix">
          <div className="ps-tagrow">
            <span className="ps-tag">前缀</span>
            <span className="ps-hint">斜杠前面</span>
          </div>
          <CharBars count={7} />
          <div className="ps-note">
            <p className="ps-duty">分配给企业或组织的唯一标识</p>
            <p className="ps-question">
              这段身份由哪个管理范围负责？
              <span className="ps-underline" aria-hidden="true" />
            </p>
            <p className="ps-relation">定位 → 管理范围</p>
          </div>
        </section>

        {/* 中枢：斜杠分隔，向下收束两个问题的分工 */}
        <div className="ps-pivot" aria-hidden="true">
          <span className="ps-slash" />
          <span className="ps-pivot-label">斜杠</span>
          <span className="ps-spine" />
        </div>

        {/* 右结构位：后缀（R006 由右侧标注承载） */}
        <section className="ps-half ps-half--suffix">
          <div className="ps-tagrow">
            <span className="ps-tag">后缀</span>
            <span className="ps-hint">斜杠后面</span>
          </div>
          <CharBars count={6} />
          <div className="ps-note">
            <p className="ps-duty">企业内部用来标识具体产品</p>
            <p className="ps-question">
              究竟是哪一个对象？
              <span className="ps-underline" aria-hidden="true" />
            </p>
            <p className="ps-relation">区分 → 内部对象</p>
          </div>
        </section>
      </div>

      <div className="ps-judgment">
        <span className="ps-judgment-ghost">两个问题的分工</span>
        <div className="ps-judgment-body">
          <div className="ps-converge" aria-hidden="true">
            <span className="ps-rail ps-rail--l" />
            <span className="ps-node" />
            <span className="ps-rail ps-rail--r" />
          </div>
          <p className="ps-lead">两个问题，分工不同</p>
          <p className="ps-core">合起来，才是完整的对象身份</p>
        </div>
      </div>
    </div>
  );
}
