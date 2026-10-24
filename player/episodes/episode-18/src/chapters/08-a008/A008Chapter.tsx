import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 08-md-chain · MD 主码与身份链页（outline §8 · S-A008 ·
 * linear-steps-with-takeaway，ordered-progression）
 * 持续主码场景：MD 定义区在上承载，落点注记与深度边界注记衔接其下；
* 身份链带按 V→NSI→MD 真实顺序逐段点亮，缺失后果行在链下逐条承接。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - md-defined：标题与 MD 定义区落位（step 1）
 * - payload-located：落点注记收窄，深度注记补齐"够用"边界
 *   （step 2，R015 由定义到落点的收窄连接承载）
 * - chain-ordered：身份链带按 V→NSI→MD 顺序点亮
 *   （step 3，R016 由落点注记向顺序链的衔接承载）
 * - breakage-shown：后果行在链下逐条承接（step 4，
 *   R017 由顺序链向缺失说明的承接承载）
 * 护栏：不推导 MD 的长度、字符集、校验算法或字段拆分；
 * 不把三段顺序写成注册流程或解析调用顺序。
 */
const stateByStep = [
  "md-defined",
  "payload-located",
  "chain-ordered",
  "breakage-shown",
] as const;

type A008State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A008State, number> = {
  "md-defined": 0,
  "payload-located": 1,
  "chain-ordered": 2,
  "breakage-shown": 3,
};

/** 身份链（G027：定解释方式 → 给体系位置 → 落对象编码） */
const CHAIN = [
  { seg: "V", duty: "先定下解释方式" },
  { seg: "NSI", duty: "接着给出体系位置" },
  { seg: "MD", duty: "落到对象编码上" },
] as const;

/** 三段缺失的后果（G028） */
const BREAKS = [
  { lost: "跳过版本", result: "后面的结构可能读不对" },
  { lost: "没有体系标识", result: "主码就没有归属" },
  { lost: "没有主码", result: "就落不到具体的物品上" },
] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state: A008State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];

  const payloadOn = at >= 1;
  const chainOn = at >= 2;
  const breaksOn = at >= 3;

  return (
    <div className="ww-root" data-state={state}>
      <header className="ww-head">
        <span className="ww-head-tag">第 3 段</span>
        <h1 className="ww-headline">
          MD，<em>主码</em>
        </h1>
      </header>

      <div className="ww-body">
        <div className="ww-defcol">
          <section className="ww-def">
            <p className="ww-def-kicker">MD 表示——</p>
            <p className="ww-def-text">
              某一<b>行业或应用系统</b>中标准化的编码
            </p>
          </section>

          <section className={`ww-payload${payloadOn ? " is-on" : ""}`}>
            <p className="ww-payload-line">
              具体对象在既定体系里的<b>标准化表达</b>，就落在这一段
            </p>
          </section>

          <p className={`ww-depth${payloadOn ? " is-on" : ""}`}>
            理解到<b>“主码承载对象编码”</b>这一层，就够用了
          </p>
        </div>

        <div className="ww-chaincol">
          <div className="ww-chain" aria-label="身份链 V → NSI → MD">
            {CHAIN.map((node, index) => (
              <span
                key={node.seg}
                className="ww-chain-item"
                style={
                  {
                    "--ww-i": index,
                    "--ww-chain": chainOn ? "1" : "0",
                  } as React.CSSProperties
                }
              >
                <span className="ww-chain-seg">{node.seg}</span>
                <span className="ww-chain-duty">{node.duty}</span>
              </span>
            ))}
          </div>

          <div className={`ww-breaks${breaksOn ? " is-on" : ""}`}>
            <p className="ww-breaks-title">少一段，断一截——</p>
            {BREAKS.map((row, index) => (
              <p
                key={row.lost}
                className="ww-break-row"
                style={{ "--ww-j": index } as React.CSSProperties}
              >
                <span className="ww-break-lost">{row.lost}</span>
                <span className="ww-break-arrow" aria-hidden="true">
                  ➔
                </span>
                <span className="ww-break-result">{row.result}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
