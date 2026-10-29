import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007Chapter.css";
import m003 from "./assets/m003.png";

/**
 * 07-processing-chain · 处理链（outline §7 · S-A007 · image-with-insight-rail）
 * mechanism: ordered-progression — M003 车间采集存储图保持常驻作语境锚点，
 * 采集/存储/价值环节三条链节条沿图侧导轨按真实先后落位：前一阶段完成后
 * 弱化为已完成并打钩，后一阶段成为当前焦点。R008（采集之后进入存储）与
 * R009（存储之后通向价值环节）由三条链节条的先后次序承载。
 *
 * step → semantic state：collection-entered → storage-kept →
 * value-stages-ahead。
 *
 * exact 义务：S041（采集之后要存储…保留住）与 S042（再往后是治理/交易/
 * 分析）整句逐字渲染。护栏 C009：处理链只使用正文支持的阶段，不补充
 * 数据库、算法或接口。
 */
const stateByStep = ["collection-entered", "storage-kept", "value-stages-ahead"] as const;

/** 采集条渠道注记（指导 S040） */
const SOURCE_CHANNELS = ["物联网技术", "业务系统汇入", "外部渠道汇入"] as const;

/** 价值环节三项（指导 S042） */
const VALUE_STAGES = ["数据治理", "数据交易", "数据分析"] as const;

function ChainCheck() {
  return (
    <span className="pc-chain-check" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5.5 12.5 L10 17 L18.5 7.5" pathLength={100} />
      </svg>
    </span>
  );
}

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const storageOn = step >= 1;
  const valueOn = step >= 2;

  const rootCls = ["pc-scene", "scene-pad", storageOn && "is-storage", valueOn && "is-value"]
    .filter(Boolean)
    .join(" ");

  const chainCls = (current: boolean, past: boolean) =>
    `pc-chain card${current ? " is-current" : ""}${past ? " is-past" : ""}`;

  return (
    <div className={rootCls} data-state={state}>
      <header className="pc-head">
        <h1 className="pc-headline">
          一条基本的<em>处理链</em>
        </h1>
        <p className="pc-head-side">采集 → 存储 → 价值环节</p>
      </header>

      <div className="pc-main">
        <figure className="pc-media card">
          <img
            className="pc-media-shot"
            src={m003}
            alt="车间数据采集与存储现场（M003 占位图，现场图待提供）"
          />
          <figcaption className="pc-media-cap">
            <span>车间里 · 数据采集与存储现场</span>
            <span className="pc-media-missing">M003 · 现场图待提供</span>
          </figcaption>
        </figure>

        <div className="pc-rail">
          {/* 采集条：落位后随推进弱化为已完成 */}
          <section className={chainCls(true, storageOn)}>
            <div className="pc-chain-head">
              <span className="pc-chain-mark hero-num">1</span>
              <p className="pc-chain-name">采集</p>
              <ChainCheck />
            </div>
            <div className="pc-channels">
              {SOURCE_CHANNELS.map((c, i) => (
                <span
                  key={c}
                  className="pc-channel-chip"
                  style={{ "--pc-i": i } as CSSProperties}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="pc-chain-foot">数据先要被采集</p>
          </section>

          {/* 存储条：拍 2 落位（exact S041） */}
          <section className={chainCls(storageOn, valueOn)}>
            <div className="pc-chain-head">
              <span className="pc-chain-mark hero-num">2</span>
              <p className="pc-chain-name">存储</p>
              <ChainCheck />
            </div>
            {!storageOn && <p className="pc-chain-ghost-text">采集之后 · 待落位</p>}
            {storageOn && (
              <p className="pc-chain-line">采集之后要存储，把必要的<strong>时间和对象上下文</strong>保留住</p>
            )}
          </section>

          {/* 价值环节条：拍 3 落位（exact S042） */}
          <section className={chainCls(valueOn, false)}>
            <div className="pc-chain-head">
              <span className="pc-chain-mark hero-num">3</span>
              <p className="pc-chain-name">价值环节</p>
              <ChainCheck />
            </div>
            {!valueOn && <p className="pc-chain-ghost-text">存储之后 · 待落位</p>}
            {valueOn && (
              <>
                <div className="pc-value-chips">
                  {VALUE_STAGES.map((v, i) => (
                    <span
                      key={v}
                      className="pc-value-chip"
                      style={{ "--pc-j": i } as CSSProperties}
                    >
                      {v}
                    </span>
                  ))}
                </div>
                <p className="pc-chain-foot">再往后，是这些价值环节</p>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
