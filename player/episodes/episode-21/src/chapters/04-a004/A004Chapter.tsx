import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004Chapter.css";
import m002 from "./assets/m002.png";

/**
 * 04-data-forms · 数据形态（outline §4 · S-A004 · image-with-insight-rail）
 * mechanism: persistent-media-reading — M002 车间多载体记录图保持常驻作
 * 阅读锚点，形态分类条与示例条沿图侧导轨在同一步内先后落位，阅读焦点
 * 从分类移到示例。本章无 protected_relations。
 *
 * 单拍（step 0）在本 step 内依次完成：分类条（exact S028 整句逐字拆成
 * "既包含…也包含…"两段连续排布）→ 示例条（表格记录/设备传感器数据/
 * 日志文件），终态 forms-and-examples 两轨稳定并列。
 *
 * 护栏 C006：三种形态不画成数据库产品或文件格式图标墙——分类条只用
 * 文字层带；示例条用小圆点行而非格式图标。
 */
const FORM_SEGMENTS = [
  { lead: "既包含传统的", term: "结构化", tail: "数据" },
  { lead: "也包含", term: "半结构化", tail: "和管理" },
  { lead: "", term: "非结构化", tail: "数据" },
] as const;

const EXAMPLES = [
  { text: "表格记录" },
  { text: "设备传感器数据" },
  { text: "日志文件" },
] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  void step; // 单拍：进章即落位全部内容，终态 forms-and-examples

  return (
    <div className="fm-scene scene-pad" data-state="forms-and-examples">
      <header className="fm-head">
        <h1 className="fm-headline">
          数据的<em>形态</em>：不止一种样子
        </h1>
        <div className="fm-head-rule rule" />
      </header>

      <div className="fm-main">
        <figure className="fm-media card">
          <img
            className="fm-media-shot"
            src={m002}
            alt="车间多种记录载体并存现场（M002 占位图，现场图待提供）"
          />
          <figcaption className="fm-media-cap">
            <span>车间里 · 多种记录载体并存</span>
            <span className="fm-media-missing">M002 · 现场图待提供</span>
          </figcaption>
        </figure>

        <div className="fm-rail">
          <section className="fm-forms" aria-label="形态分类">
            <p className="fm-rail-kicker">形态分类</p>
            <p className="fm-forms-line">
              {FORM_SEGMENTS.map((seg, i) => (
                <span key={seg.term} className="fm-seg" style={{ "--fm-i": i } as CSSProperties}>
                  {seg.lead && <span className="fm-seg-lead">{seg.lead}</span>}
                  <span className="fm-seg-term">{seg.term}</span>
                  {seg.tail && <span className="fm-seg-tail">{seg.tail}</span>}
                </span>
              ))}
            </p>
            <p className="fm-forms-foot">三种形态都是这门数据集合的组成部分</p>
          </section>

          <section className="fm-examples" aria-label="组成示例">
            <p className="fm-rail-kicker">组成示例 · 都可能成为它的一部分</p>
            {EXAMPLES.map((ex, i) => (
              <p
                key={ex.text}
                className="fm-example"
                style={{ "--fm-j": i } as CSSProperties}
              >
                <span className="fm-example-dot" aria-hidden="true" />
                {ex.text}
              </p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
