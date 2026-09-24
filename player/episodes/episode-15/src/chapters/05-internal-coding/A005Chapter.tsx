import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "self-managed-named",
  "use-scope-set",
  "boundary-pivoted",
] as const;

const OBJECTS = ["产品", "批次", "其他对象"] as const;

function SelfLoopDiagram() {
  return (
    <svg className="int-loop" viewBox="0 0 480 170" aria-hidden="true">
      <rect className="int-loop-node" x="18" y="53" width="128" height="64" />
      <text className="int-loop-node-text" x="82" y="95" textAnchor="middle">
        企业
      </text>
      <rect className="int-loop-node" x="334" y="53" width="128" height="64" />
      <text className="int-loop-node-text" x="398" y="95" textAnchor="middle">
        内部编码
      </text>
      <path className="int-loop-flow" d="M152 72 H318" pathLength={1} />
      <polygon className="int-loop-head int-loop-head-a" points="318,63 338,72 318,81" />
      <text className="int-loop-label int-loop-label-a" x="236" y="58" textAnchor="middle">
        管理
      </text>
      <path className="int-loop-flow int-loop-flow-b" d="M152 104 H318" pathLength={1} />
      <polygon className="int-loop-head int-loop-head-b" points="318,95 338,104 318,113" />
      <text className="int-loop-label int-loop-label-b" x="236" y="140" textAnchor="middle">
        分配
      </text>
    </svg>
  );
}

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad int-root" data-state={state}>
      <header className="int-header">
        <span className="int-heading-mark" aria-hidden="true" />
        <h1 className="int-headline">第三段：企业内部编码</h1>
      </header>

      <div className="int-split">
        <section className="int-zone int-zone-left">
          <p className="int-zone-kicker">管理归属</p>
          <p className="int-claim">
            企业内部编码由<span className="int-claim-em">企业</span>
            自行管理和分配
          </p>
          <SelfLoopDiagram />
        </section>

        <div className="int-rail" aria-hidden="true">
          <span className="int-rail-line" />
          <span className="int-rail-ghost" />
        </div>

        <section className="int-zone int-zone-right">
          <p className="int-zone-kicker int-right-kicker">用途与写法</p>
          <p className="int-use-lead">用来把不同的对象区分开</p>
          <div className="int-objects">
            {OBJECTS.map((name, index) => (
              <div className="int-object" key={name}>
                <i className="int-object-cap" />
                <span className="int-object-name">{name}</span>
                {index < OBJECTS.length - 1 ? (
                  <span className="int-sep" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
          <p className="int-decide">
            怎么写由<span className="int-claim-em">企业</span>
            按自己的业务需要决定
          </p>
        </section>

        <div className="int-pivot">
          <div className="int-pivot-row">
            <i className="int-mark-check" aria-hidden="true" />
            <div className="int-pivot-copy">
              <span className="int-pivot-tag">这一段承担</span>
              <p className="int-pivot-main int-pivot-yes">对象细分</p>
            </div>
          </div>
          <span className="int-pivot-divider" aria-hidden="true" />
          <div className="int-pivot-row">
            <i className="int-mark-x" aria-hidden="true" />
            <div className="int-pivot-copy">
              <span className="int-pivot-tag">不承担</span>
              <p className="int-pivot-main int-pivot-no">体系层级定位</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
