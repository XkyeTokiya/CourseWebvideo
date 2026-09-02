import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./PolicyDirection2024.css";

const states = [
  "provenance-established",
  "deployment-directions-shown",
  "direction-provenance-pinned",
] as const;

type PolicyDirectionState = (typeof states)[number];

export default function PolicyDirection2024({ step }: ChapterStepProps) {
  const state: PolicyDirectionState = states[step] ?? states[states.length - 1];
  const cardsOn = state !== "provenance-established";
  const pinned = state === "direction-provenance-pinned";

  return (
    <div className="pd-scene scene-pad">
      <h1 className="pd-thesis">
        2024 年《决定》把制造业方向与工业互联网<em>同时写入部署</em>
      </h1>

      <div className="pd-band">
        <span className="pd-band-date">2024年7月18日</span>
        <span className="pd-band-text">
          中央通过了《中共中央关于进一步全面深化改革　推进中国式现代化的决定》
        </span>
      </div>

      <div className="pd-cards">
        <section
          className="pd-card pd-card--deploy"
          data-on={cardsOn ? "on" : "waiting"}
          style={{ "--pd-i": "0" } as CSSProperties}
        >
          <div className="pd-card-body">
            <p className="pd-card-kicker">部署位置</p>
            <div className="pd-deploy">
              <p>
                提出<i>推进新型工业化</i>
              </p>
              <p>
                提出<i>发展工业互联网</i>
              </p>
            </div>
          </div>
        </section>

        <section
          className={`pd-card pd-card--direction${pinned ? " is-pinned" : ""}`}
          data-on={cardsOn ? "on" : "waiting"}
          style={{ "--pd-i": "1" } as CSSProperties}
        >
          <div className="pd-card-body">
            <p className="pd-card-kicker">制造业方向</p>
            <div className="pd-dir-chips">
              <span>高端化</span>
              <span>智能化</span>
              <span>绿色化</span>
            </div>
            <p className={`pd-pin${pinned ? " is-on" : ""}`} aria-hidden={!pinned}>
              是
              <em>2024 年这份文件</em>
              提出的方向表述
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
