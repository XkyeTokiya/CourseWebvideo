import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001OpeningLimitedSpace.css";

const stateByStep = [
  "title-anchored",
  "scene-grounded",
  "size-tension-shown",
  "question-reframed",
  "episode-framed",
] as const;

type A001State = (typeof stateByStep)[number];

export default function A001OpeningLimitedSpace({ step }: ChapterStepProps) {
  const state: A001State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const sceneOn = state !== "title-anchored";
  const tensionOn =
    state === "size-tension-shown" || state === "question-reframed" || state === "episode-framed";
  const reframeOn = state === "question-reframed" || state === "episode-framed";
  const framedOn = state === "episode-framed";

  const rootClass = [
    "ol-scene",
    "scene-pad",
    sceneOn ? "is-scene-on" : "",
    reframeOn ? "is-reframed" : "",
    framedOn ? "is-framed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <header className="ol-head">
        <h1 className="ol-headline">
          标识载体要和附着物<em>一起设计</em>
        </h1>
        <span className="ol-kicker">模块 4 · 任务 4.1 · 4.1.3 标识载体设计</span>
      </header>

      <div className="ol-main">
        <figure className="ol-media">
          <div className="ol-frame">
            <div className="ol-placeholder">
              <span className="ol-ph-tag">IMAGE · 16:9</span>
              <span className="ol-ph-title">工业设计台 · 车间贴标现场</span>
              <span className="ol-ph-note">素材待提供（photorealistic_ai）</span>
            </div>

            <div className={`ol-schematic${sceneOn ? " is-on" : ""}`}>
              <span className="ol-sch-label">附着关系示意 · 非实物照片</span>
              <div className="ol-sch-stage">
                <div
                  className={`ol-att ol-att-big${tensionOn ? " is-on" : ""}${reframeOn ? " is-dim" : ""}`}
                >
                  <span className="ol-att-name">标识 · 做大</span>
                  <b className="ol-att-verdict">装不下 · 挡住别的东西</b>
                </div>
                <div
                  className={`ol-att ol-att-small${tensionOn ? " is-on is-late" : ""}${reframeOn ? " is-dim" : ""}`}
                >
                  <span className="ol-att-name">标识 · 做小</span>
                  <b className="ol-att-verdict">看不清</b>
                </div>
                <div className="ol-part">
                  <span className="ol-part-name">零件表面</span>
                  <span className="ol-part-feats" aria-hidden="true" />
                  <span className={`ol-zone${sceneOn ? " is-on" : ""}`}>
                    <i>可用的一小块</i>
                  </span>
                  <span className={`ol-fit${reframeOn ? " is-on" : ""}`}>配合附着物 · 一起设计</span>
                </div>
              </div>
            </div>
          </div>
          <figcaption className="ol-cap">
            <span>M001 · 车间贴标现场（placeholder）</span>
            <span>通用情境 · 不代表具体项目</span>
          </figcaption>

          <div className="ol-anchor">
            <span className="ol-anchor-lead">本集主题</span>
            <p className="ol-anchor-title">标识载体设计：尺寸、位置、耐久与信息层级</p>
          </div>
        </figure>

        <aside className="ol-rail">
          <p className={`ol-rail-lead${sceneOn ? " is-on" : ""}`}>车间现场 · 一个很常见的场面</p>

          <div className="ol-tension">
            <article className={`ol-try${tensionOn ? " is-on" : ""}${reframeOn ? " is-dim" : ""}`}>
              <span className="ol-try-key hero-num">大</span>
              <div className="ol-try-body">
                <h2>标识做大了</h2>
                <p>装不上，还会挡住别的东西</p>
              </div>
            </article>
            <article
              className={`ol-try${tensionOn ? " is-on is-late" : ""}${reframeOn ? " is-dim" : ""}`}
            >
              <span className="ol-try-key hero-num">小</span>
              <div className="ol-try-body">
                <h2>标识做小了</h2>
                <p>上面的关键信息又看不清</p>
              </div>
            </article>
          </div>

          <div className={`ol-reframe${reframeOn ? " is-on" : ""}`}>
            <p className="ol-reframe-no">问题，不是「把标识放上去」</p>
            <p className="ol-reframe-yes">
              它得和所贴附的物件<em>配合、一起设计</em>
            </p>
          </div>

          <div className={`ol-closing${framedOn ? " is-on" : ""}`}>
            <p>
              这一期，聊怎么把这两者当成<em>一件事</em>来设计
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
