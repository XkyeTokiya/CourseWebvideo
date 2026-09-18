import "./InstallArchive.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/* S-A027 · layered-bands-with-side-notes
 * step → semantic state（与 outline step 表逐字一致，允许重复） */
const stateByStep = [
  "archive-stage-set",
  "archive-band-in",
  "side-note-traceback",
] as const;

type InstallArchiveState = (typeof stateByStep)[number];

export default function InstallArchive({ step }: ChapterStepProps) {
  const state: InstallArchiveState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene ia-scene state-${state}`}>
      <div className="scene-pad ia-pad">
        <h1 className="ia-headline serif-cn">装机档案把零部件连到整车</h1>

        {/* U015 · 档案带：围绕同一标识的三条装机记录，逐行汇入同一整车 */}
        <section className="ia-archive card" aria-label="整车装机档案带">
          <header className="ia-band-head">
            <span className="ia-band-tag mono">整车装机档案</span>
            <span className="ia-band-note mono">记录 · 哪些零部件 进入了 哪辆整车</span>
          </header>

          <div className="ia-band-body">
            <div className="ia-slots" aria-hidden="true">
              <span className="ia-slot mono">装机记录 · 待补</span>
              <span className="ia-slot mono">装机记录 · 待补</span>
              <span className="ia-slot mono">装机记录 · 待补</span>
            </div>

            <div className="ia-rows">
              <span className="ia-guide mono">同一标识</span>
              {[0, 1, 2].map((i) => (
                <div className={`ia-row ia-row-${i + 1}`} key={i}>
                  <span className="ia-part">
                    <i className="ia-mark" aria-hidden="true" />
                    <b className="serif-cn">零部件</b>
                  </span>
                  <span className="ia-rec" aria-hidden="true">
                    <i className="ia-rec-line" />
                    <em className="ia-rec-label mono">进入</em>
                    <i className="ia-rec-arrow" />
                  </span>
                </div>
              ))}
              <div className="ia-vehicle">
                <i className="ia-mark ia-mark-vehicle" aria-hidden="true" />
                <b className="serif-cn">整车</b>
              </div>
            </div>
          </div>
        </section>

        {/* R011 · 档案带 → 回查侧注（enables，由上下层级 + 支持连接承载） */}
        <div className="ia-support" aria-hidden="true">
          <i className="ia-support-line ia-support-line-l" />
          <span className="ia-support-label mono">支持质量异常回查</span>
          <i className="ia-support-line ia-support-line-r" />
          <i className="ia-support-arrow" />
        </div>

        {/* U016 · 回查侧注：质量异常沿档案回查具体对象，对照孤立记录 */}
        <section className="ia-side" aria-label="质量异常回查侧注">
          <div className="ia-trace">
            <span className="ia-flag">
              <i className="ia-flag-dot" aria-hidden="true" />
              <b className="serif-cn">质量异常</b>
            </span>
            <span className="ia-path" aria-hidden="true">
              <i className="ia-path-line" />
              <em className="ia-path-label mono">回查</em>
              <i className="ia-path-arrow" />
            </span>
            <div className="ia-hits">
              <span className="ia-hit">
                <i className="ia-mark ia-mark-hit" aria-hidden="true" />
                <b className="serif-cn">具体零部件</b>
              </span>
              <span className="ia-hit">
                <i className="ia-mark ia-mark-hit" aria-hidden="true" />
                <b className="serif-cn">具体车辆</b>
              </span>
            </div>
          </div>

          <div className="ia-contrast">
            <div className="ia-scatter" aria-hidden="true">
              <i className="ia-chip ia-chip-1" />
              <i className="ia-chip ia-chip-2" />
              <i className="ia-chip ia-chip-3" />
              <svg className="ia-zig" viewBox="0 0 560 36" preserveAspectRatio="none">
                <polyline points="6,26 90,8 180,30 270,10 360,30 450,10 540,26" />
              </svg>
              <span className="ia-zig-x" />
            </div>
            <p className="ia-contrast-text serif-cn">
              不用在孤立记录之间<em>来回跳</em>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
