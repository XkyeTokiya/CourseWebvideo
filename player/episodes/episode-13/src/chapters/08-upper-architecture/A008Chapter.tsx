import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import m003Image from "./assets/M003.png";

/**
 * A008 · 上层读图 —— image-with-reading-notes / persistent-media-reading
 * 教材原图持续在场，reading-order 四条业务系统注记逐条落位，
 * 阅读焦点先转图中数据 HUB 标注，key-points 再呈现 HUB 三项职责。
 */
const stateByStep = [
  "upper-position-open",
  "four-systems-read",
  "hub-connection-shown",
  "hub-role-stated",
] as const;

const SYSTEM_NOTES = [
  { no: "01", abbr: "SAP", duty: "生产计划" },
  { no: "02", abbr: "PLM", duty: "设计图纸和技术文档" },
  { no: "03", abbr: "CRM", duty: "客户信息" },
  { no: "04", abbr: "SRM", duty: "供应商和物料采购" },
] as const;

const HUB_DUTIES = ["软件接口", "数据交换", "汇聚"] as const;
const HUB_DUTY_SEPS = ["、", "与"] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad ua-root" data-state={state}>
      <header className="ua-header">
        <span className="ua-heading-mark" aria-hidden="true" />
        <h1 className="ua-headline">
          <span className="ua-headline-pos">在工厂系统中的位置</span>
          <span className="ua-headline-judge">业务系统经数据 HUB 连接下层</span>
        </h1>
      </header>

      <div className="ua-main">
        <figure className="ua-figure">
          <div className="ua-figure-frame">
            <img
              className="ua-figure-img"
              src={m003Image}
              alt="教材图 1-14：基于工业软件连接器实现异构数据共享（原图占位）"
            />
            <span className="ua-fig-band" aria-hidden="true">
              <span className="ua-fig-band-tag">图中上层系统区</span>
            </span>
            <span className="ua-fig-focus" aria-hidden="true">
              <span className="ua-fig-focus-tag">图中「数据 HUB」标注</span>
            </span>
          </div>
          <figcaption className="ua-figure-caption">
            教材图 1-14 原图 · M003 · 待提供（不得 AI 重绘）
          </figcaption>
        </figure>

        <div className="ua-rail">
          <div className="ua-notes">
            {SYSTEM_NOTES.map((note) => (
              <div className="ua-note" key={note.no}>
                <span className="ua-note-idx">{note.no}</span>
                <span className="ua-note-title">
                  <b className="ua-abbr">{note.abbr}</b>：{note.duty}
                </span>
              </div>
            ))}
          </div>

          <div className="ua-hub">
            <svg className="ua-hub-merge" viewBox="0 0 120 44" aria-hidden="true">
              <path className="ua-hub-merge-path" pathLength={1} d="M12 2 Q12 24 52 30" />
              <path className="ua-hub-merge-path" pathLength={1} d="M46 2 Q48 20 56 28" />
              <path className="ua-hub-merge-path" pathLength={1} d="M74 2 Q72 20 64 28" />
              <path className="ua-hub-merge-path" pathLength={1} d="M108 2 Q108 24 68 30" />
              <circle className="ua-hub-merge-node" cx="60" cy="36" r="5" />
            </svg>
            <div className="ua-hub-plate">
              <div className="ua-hub-name-row">
                <span className="ua-hub-name">数据 HUB</span>
                <span className="ua-hub-ext">（开发软件接口）：</span>
              </div>
              <div className="ua-hub-details">
                <div className="ua-hub-details-inner">
                  <div className="ua-hub-duty-line">
                    {HUB_DUTIES.map((duty, i) => (
                      <span className="ua-duty-item" key={duty}>
                        {i > 0 ? (
                          <span className={`ua-duty-sep ua-sep-${i}`}>{HUB_DUTY_SEPS[i - 1]}</span>
                        ) : null}
                        <span className={`ua-duty ua-duty-${i + 1}`}>{duty}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ua-hub-down-row">
                <span className="ua-hub-drop" aria-hidden="true" />
                <span className="ua-hub-drop-head" aria-hidden="true" />
                <span className="ua-hub-down-tag">与下层系统连接</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
