import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m002Scene from "./assets/M002.png";

const stateByStep = [
  "second-segment-focused",
  "layers-named",
  "digits-mapped",
  "example-scope-set",
] as const;

const LAYERS = [
  { no: "01", name: "国家代码", role: "国家层级", digits: "088" },
  { no: "02", name: "行业代码", role: "行业层级", digits: "100" },
  { no: "03", name: "企业代码", role: "企业层级", digits: "12345678" },
] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad slc-root" data-state={state}>
      <header className="slc-header">
        <span className="slc-heading-mark" aria-hidden="true" />
        <h1 className="slc-headline">第二段：服务机构代码的三层</h1>
      </header>

      <p className="slc-issue">
        服务机构代码由<span className="slc-issue-name">国家代码</span>、
        <span className="slc-issue-name">行业代码</span>和
        <span className="slc-issue-name">企业代码</span>组成
      </p>

      <div className="slc-main">
        <div className="slc-left">
          <div className="slc-cards">
            {LAYERS.map((layer) => (
              <div className="slc-card" key={layer.no}>
                <span className="slc-card-no">{layer.no}</span>
                <p className="slc-card-name">{layer.name}</p>
                <div className="slc-well">
                  <span className="slc-well-ghost" aria-hidden="true">
                    ？？？
                  </span>
                  <span className="slc-well-digits">{layer.digits}</span>
                  <span className="slc-well-role">{layer.role}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="slc-example">
            <span className="slc-example-vaa">VAA</span>
            <span className="slc-example-text">
              示例中 <em className="slc-digit">088</em> 表示国家层级，
              <em className="slc-digit">100</em> 表示行业层级，
              <em className="slc-digit">12345678</em> 表示企业层级
            </span>
          </p>
        </div>

        <figure className="slc-media">
          <img className="slc-media-img" src={m002Scene} alt="" />
          <figcaption className="slc-media-cap">场景图 · 占位</figcaption>
        </figure>
      </div>

      <div className="slc-takeaway">
        <p className="slc-take-main">这些数字是看懂层级的例子</p>
        <div className="slc-take-bounds">
          <span className="slc-take-chip">
            <i className="slc-take-x" aria-hidden="true" />
            不是每个行业的固定数字
          </span>
          <span className="slc-take-chip">
            <i className="slc-take-x" aria-hidden="true" />
            不是每一层的固定长度
          </span>
        </div>
      </div>
    </div>
  );
}
