import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M004 from "./assets/M004.png";

/**
 * 06-china-prefixes · A007 我国前缀与示例(3 拍,配方 image-with-summary-rail)
 * 关系机制 locate-then-assemble:两条前缀卡并列定位后,示例层级按
 * "前缀→企业代码→产品编号"逐级拼入,最终归并成完整示例路径。
 * step → semantic state 显式映射,允许重复,末态兜底(outline S-A007):
 * - prefixes-located:标题与 summary 轨建立,根节点下两条前缀卡并列落位(ISO 下 1.2.156/联合分支下 2.16.156)
 * - china-narrowed:保持前缀卡,轨内补充"1.2.156 代表中国、3001 制造业分支",收窄条呈现向右收窄方向
 * - example-assembled:示例图(M004)引入,最终判断区按"前缀+企业代码+产品编号"归并完整示例路径
 */
const stateByStep = [
  "prefixes-located",
  "china-narrowed",
  "example-assembled",
] as const;

type ChinaPrefixesState = (typeof stateByStep)[number];

/** 两条前缀:分支名与编号全部来自批准口播第 1 拍,并列等权,不补第三分支与码表 */
const PREFIXES = [
  { branch: "ISO 分支下", num: "1.2.156" },
  { branch: "联合分支下", num: "2.16.156" },
] as const;

/** 收窄链:两级范围来自批准口播第 2 拍,条宽按"越往右越窄"示意,不标数值刻度 */
const NARROW = [
  { num: "1.2.156", name: "代表中国", width: "100%" },
  { num: "3001", name: "制造业分支", width: "56%" },
] as const;

/** 示例三段:名称与数值逐字来自批准口播第 3 拍;归并端只给槽位名,不提前拼出完整串(A008 揭示) */
const SEGMENTS = [
  { label: "生产商 OID 前缀", value: "1.2.156.3001" },
  { label: "企业代码", value: "0501" },
  { label: "产品编号", value: "1001.01" },
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state: ChinaPrefixesState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad cp-root" data-state={state}>
      <header className="cp-header">
        <h1 className="cp-headline">我国分支位置与示例路径</h1>
      </header>

      <div className="cp-main">
        <section className="cp-rail" aria-label="前缀定位与收窄">
          <p className="cp-rail-head">前缀定位</p>

          <div className="cp-locate">
            <div className="cp-root-chip">
              <span className="cp-root-glyph">根</span>
            </div>
            <div className="cp-stubs" aria-hidden="true">
              <i />
              <i />
            </div>
            <div className="cp-cards">
              {PREFIXES.map((p) => (
                <div className="cp-card" key={p.num}>
                  <span className="cp-card-kicker">{p.branch}</span>
                  <span className="cp-card-num hero-num">{p.num}</span>
                  <span className="cp-card-sub">我国的前缀</span>
                </div>
              ))}
            </div>
            <p className="cp-locate-note">
              我国在这两个根分支里<b>各自的位置</b>
            </p>
          </div>

          <div className="cp-narrow">
            <div className="cp-bars">
              {NARROW.map((n) => (
                <div className="cp-bar" style={{ width: n.width }} key={n.num}>
                  <span className="cp-bar-num hero-num">{n.num}</span>
                  <span className="cp-bar-name">{n.name}</span>
                </div>
              ))}
            </div>
            <p className="cp-narrow-note">
              越往右走，范围<b>收得越窄</b>
            </p>
          </div>
        </section>

        <figure className="cp-media">
          <div className="cp-media-slot">
            <span className="cp-media-pending">示例现场图</span>
            <img
              className="cp-media-img"
              src={M004}
              alt="工业电池示例现场图（占位图）"
            />
          </div>
          <figcaption className="cp-media-caption">
            <span className="cp-media-badge">工业电池示例</span>
            <span className="cp-media-note">占位图 · M004</span>
          </figcaption>
        </figure>
      </div>

      <div className="cp-judgment">
        <p className="cp-judgment-head">示例路径</p>
        <div className="cp-judgment-body">
          <div className="cp-seg-col">
            {SEGMENTS.map((s) => (
              <div className="cp-seg" key={s.label}>
                <span className="cp-seg-label">{s.label}</span>
                <span className="cp-seg-value hero-num">{s.value}</span>
              </div>
            ))}
          </div>
          <span className="cp-merge" aria-hidden="true">
            <i />
            <b />
          </span>
          <div className="cp-merged">
            <span className="cp-merged-label">完整示例路径</span>
            <span className="cp-merged-sub">逐级拼成</span>
          </div>
        </div>
      </div>
    </div>
  );
}
