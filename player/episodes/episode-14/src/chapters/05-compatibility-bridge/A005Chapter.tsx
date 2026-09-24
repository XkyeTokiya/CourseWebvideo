import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "compatibility-bands",
  "continuation-notes",
  "bridge-takeaway",
] as const;

function BridgeGlyph({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? "cb-glyph cb-glyph-sm" : "cb-glyph"} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 5 40 14.5v19L24 43 8 33.5v-19L24 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="7.4" fill="none" stroke="currentColor" strokeWidth="3.6" />
    </svg>
  );
}

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad cb-root" data-state={state}>
      <header className="cb-header">
        <span className="cb-index" aria-hidden="true">
          2/5
        </span>
        <h1 className="cb-headline">第二项：兼容性</h1>
      </header>

      <div className="cb-main">
        <div className="cb-bands">
          <section className="cb-band cb-band-bridge">
            <span className="cb-band-tag">兼容既有标识</span>
            <div className="cb-bridge-row">
              <div className="cb-existing">
                <div className="cb-old-records" aria-hidden="true">
                  <span className="cb-old-record" />
                  <span className="cb-old-record" />
                  <span className="cb-old-record" />
                </div>
                <p className="cb-group-label">
                  <BridgeGlyph small />
                  已经存在的标识
                </p>
              </div>
              <span className="cb-bridge" aria-hidden="true">
                <span className="cb-bridge-line" />
                <span className="cb-bridge-tag">
                  <BridgeGlyph />
                </span>
              </span>
              <span className="cb-new-chip">
                <BridgeGlyph small />
                新标识
              </span>
            </div>
          </section>

          <section className="cb-band cb-band-standard">
            <span className="cb-band-tag cb-band-tag-standard">协调边界</span>
            <p className="cb-standard-text">与国内已有的相关编码标准协调</p>
          </section>
        </div>

        <aside className="cb-notes">
          <p className="cb-note">兼容不是原样复制旧编码</p>
          <p className="cb-note">迁移和协同中保持历史记录的延续性</p>
        </aside>
      </div>

      <div className="cb-takeaway">
        <span className="cb-takeaway-kicker">换个说法</span>
        <p className="cb-takeaway-text">
          不要为了上一个新方案，把历史数据和业务流程全部推倒重来
        </p>
      </div>
    </div>
  );
}
