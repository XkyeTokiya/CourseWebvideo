import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003TwoObjectKinds.css";

const states = [
  "object-groups-placed",
  "anchor-shared",
  "specificity-noted",
] as const;

type TkState = (typeof states)[number];

const PHYSICAL = ["产品", "设备", "零部件"];
const DIGITAL = ["模型", "算法", "工艺"];

export default function A003TwoObjectKinds({ step }: ChapterStepProps) {
  const state: TkState = states[step] ?? states[states.length - 1];
  const anchorOn = state !== "object-groups-placed";
  const noteOn = state === "specificity-noted";

  return (
    <div className={`tk-scene scene-pad${anchorOn ? " is-anchored" : ""}`}>
      <h1 className="tk-title">物理对象与数字对象</h1>

      <div className="tk-anchor" aria-hidden={!anchorOn}>
        <p className="tk-anchor-label">同一个稳定身份</p>
        <div className="tk-anchor-reqs">
          <p>
            设备进入数字世界需要<b>稳定的身份</b>
          </p>
          <p>
            数字模型和工艺资料同样需要<b>明确的指向</b>
          </p>
        </div>
      </div>

      <div className="tk-groups">
        <svg
          className="tk-enclosure"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect
            x="1.5"
            y="5"
            width="97"
            height="93"
            rx="3"
            pathLength="100"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <article className="tk-group card">
          <h2 className="tk-group-name">物理对象</h2>
          <ul className="tk-items">
            {PHYSICAL.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="tk-exact">物理对象：产品、设备、零部件</p>
        </article>

        <article className="tk-group card">
          <h2 className="tk-group-name">数字对象</h2>
          <ul className="tk-items">
            {DIGITAL.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="tk-exact">数字对象：模型、算法、工艺</p>
        </article>
      </div>

      <footer className="tk-note">
        <p
          className={`tk-note-line${noteOn ? " is-on" : ""}`}
          aria-hidden={!noteOn}
        >
          讨论对象不再是模糊的“同类设备”，而是<em>具体到某一台</em>，以及
          <em>和它相关的数字资源</em>。
        </p>
      </footer>
    </div>
  );
}
