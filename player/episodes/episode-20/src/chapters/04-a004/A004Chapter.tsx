import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 04-a004 · 骨架页（outline §4 · S-A004 · split-compare-with-pivot）
 * 画面主体是一块「编码骨架」结构板：左右两半共享同一块板（前缀半区用冷色
 * 面、后缀半区用工艺绿面），中缝斜线元件竖立并上下出头，不用两张独立卡片。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - frames-settled：结构板落位——前缀/后缀两个半区 + 斜线元件竖立，
 *   分格保持空槽（A004 · step 1）
 * - duties-split：左半区写入「回答：管理范围」三个分格（国家/行业/企业），
 *   右半区写入「指向：对象差异」四个分格（类/产品/批/件），
 *   R007 由左右对照的两半区承载（A004 · step 2）
 * - slash-boundaried：斜线元件高亮，判据标签「斜线只做结构分隔」挂上中缝，
 *   两侧补「不是接口路径 / 不是系统调用」小注，R008 由判据标签承载
 *   （A004 · step 3）
 * exact S020「斜线只做结构分隔」自第 3 拍起在判据标签逐字完整可见。
 * 护栏 C006：斜线只作结构分隔呈现，不作接口路径、系统调用、数据库分隔或
 * 解析协议；两侧小注为其否定式边界，非功能描述。
 */
const stateByStep = [
  "frames-settled",
  "duties-split",
  "slash-boundaried",
] as const;

type A004State = (typeof stateByStep)[number];

/** 前缀半区分格（beat 2：由哪个国家、哪个行业、哪家企业管理） */
const PREFIX_CELLS = ["哪个国家", "哪个行业", "哪家企业"] as const;

/** 后缀半区分格（beat 2：哪一类、哪一个产品、哪一批、哪一件） */
const SUFFIX_CELLS = ["哪一类", "哪个产品", "哪一批", "哪一件"] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state: A004State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad sk-root" data-state={state}>
      <header className="sk-head">
        <span className="sk-head-tick" aria-hidden="true" />
        <h1 className="sk-headline">编码的两段骨架</h1>
        <span className="sk-head-rule" aria-hidden="true" />
      </header>

      <div className="sk-stage">
        <div className="sk-plate">
          <section className="sk-half sk-half-prefix" aria-label="标识前缀">
            <div className="sk-half-head">
              <h2 className="sk-half-name">标识前缀</h2>
              <span className="sk-half-sub">回答 · 管理范围</span>
            </div>
            <div className="sk-cells">
              {PREFIX_CELLS.map((cell) => (
                <span className="sk-cell" key={cell}>
                  {cell}
                </span>
              ))}
            </div>
          </section>

          <div className="sk-slash" aria-hidden="true" />

          <section className="sk-half sk-half-suffix" aria-label="标识后缀">
            <div className="sk-half-head">
              <h2 className="sk-half-name">标识后缀</h2>
              <span className="sk-half-sub">指向 · 对象差异</span>
            </div>
            <div className="sk-cells">
              {SUFFIX_CELLS.map((cell) => (
                <span className="sk-cell" key={cell}>
                  {cell}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="sk-pivot" aria-label="斜线判据">
          <p className="sk-pivot-label">斜线只做结构分隔</p>
          <div className="sk-pivot-notes">
            <span className="sk-pivot-note">不是接口路径</span>
            <span className="sk-pivot-note">不是系统调用</span>
          </div>
        </div>
      </div>
    </div>
  );
}
