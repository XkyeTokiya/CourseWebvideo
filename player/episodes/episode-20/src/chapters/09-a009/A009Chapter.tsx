import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 09-a009 · 规范与示例读图页（outline §9 · S-A009 · image-with-reading-notes）
 * 左大右窄读图：左侧为教材原图阅读区 —— M004（教材图 2-9，textbook_original）
 * 原图待接入，先以「原图待接入」占位卡按真实比例留位（诚实占位，不描摹、
 * 不重绘）；占位卡底部内嵌一条抽象读序轴，第二拍从左到右点亮 ①② 读序标记，
 * 只标「前缀段 / 后缀各段」的结构，不出现示例字符串（C016）。
 * 右侧注释轨：核验提示卡（step 1）→ 阅读顺序卡（step 2，含示例边界 chip）；
 * 底部横贯边界提示条（step 2 末点亮）。媒体与注释卡不反复卸载。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - standards-entered：占位阅读区 + 核验提示卡 + 版本核验注脚
 *   （A009 · step 1，R024 由核验提示卡承载）
 * - reading-demonstrated：读序点亮 + 阅读顺序卡 + 两道边界提示
 *   （A009 · step 2，R025 由阅读顺序卡承载，R026 由边界提示卡/条承载）
 * 护栏 C015：不确认标准现行有效/相互替代/覆盖全部行业，不出现具体标准编号；
 * 护栏 C016：示例字符串不标注为真实注册编码、标签内容或标准编号。
 */
const stateByStep = [
  "standards-entered",
  "reading-demonstrated",
] as const;

type A009State = (typeof stateByStep)[number];

export default function A009Chapter({ step }: ChapterStepProps) {
  const state: A009State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad rn-root" data-state={state}>
      <header className="rn-head">
        <span className="rn-head-tick" aria-hidden="true" />
        <h1 className="rn-headline">规范性检查</h1>
        <span className="rn-head-rule" aria-hidden="true" />
      </header>

      <div className="rn-main">
        <figure className="rn-media">
          <div className="rn-view">
            <div className="rn-placeholder">
              <span className="rn-placeholder-mark">教材图 2-9</span>
              <span className="rn-placeholder-note">原图待接入 · 比例保留</span>
            </div>
            <div className="rn-axis">
              <span className="rn-axis-seg rn-axis-prefix">
                前缀段
                <i className="rn-seq rn-seq-1" aria-hidden="true">
                  1
                </i>
              </span>
              <span className="rn-axis-seg rn-axis-suffix">
                后缀各段
                <i className="rn-seq rn-seq-2" aria-hidden="true">
                  2
                </i>
              </span>
            </div>
          </div>
          <figcaption className="rn-media-note">
            <span className="rn-media-badge">教材原图阅读区</span>
            <span className="rn-media-tag">占位</span>
          </figcaption>
        </figure>

        <div className="rn-rail">
          <section className="rn-note rn-note-verify" aria-label="核验提示">
            <span className="rn-kicker">审查清单</span>
            <p className="rn-line">行业标准与数据交换要求，放进审查清单</p>
            <p className="rn-sub">
              比如汽车零部件这类行业，就有相关的国家标准或行业标准
            </p>
            <p className="rn-footnote">
              按当时的<b>适用版本</b>去核 · 不凭印象下结论
            </p>
          </section>

          <section className="rn-note rn-note-reading" aria-label="阅读顺序">
            <span className="rn-kicker">读法</span>
            <p className="rn-line">从左到右，一段一段读出职责</p>
            <p className="rn-sub">
              先读前缀说明的管理范围，再读后缀每一段对应的对象差异
            </p>
            <span className="rn-boundary-chip">
              示例只练方法 · 不代表注册结果
            </span>
          </section>
        </div>
      </div>

      <div className="rn-bottom">
        <p className="rn-bottom-line">
          不从字符外观推断<b>校验规则或接口含义</b> · 含义由具体规范决定
        </p>
      </div>
    </div>
  );
}
