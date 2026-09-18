import "./OneItemOneCode.css";
import m002Url from "./assets/m002-textbook.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A004 · 平台读图页（S-A017 · image-with-reading-notes）
 * 关系机制 persistent-media-reading：教材原图（M002）从首拍起持续在场不卸载，
 * 阅读顺序（U010：平台锚点 → 两步赋码 → 边界说明）与要点（U011：五方协作）
 * 在右侧固定注记区逐拍迁移。R007 由锚点说明到赋码说明的先后排列承载；
 * R008 由协作组卡沿笔记页边线向锚点卡回指的排布承载。
 */
const stateByStep = [
  "question-to-platform",
  "coding-steps",
  "identity-bound",
  "boundary-noted",
  "collaboration-mapped",
] as const;

type OneItemState = (typeof stateByStep)[number];

const PARTIES = ["二级节点", "供应商", "主机厂", "修理厂", "质量追溯系统"];

export default function OneItemOneCode({ step }: ChapterStepProps) {
  const state: OneItemState = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className={`scene oo-scene state-${state}`}>
      <div className="scene-pad oo-pad">
        <header className="oo-head">
          <h1 className="oo-headline serif-cn">一件一码建立共同身份</h1>
          <hr className="rule oo-head-rule" />
        </header>

        <div className="oo-main">
          {/* image 槽 · M002 教材关系原图（textbook_original，首拍起持续在场） */}
          <div className="oo-media-col">
            <figure className="oo-media card">
              <img
                className="oo-media-img"
                src={m002Url}
                alt="教材图 1-13「基于标识解析的精益化管理」关系原图（当前为占位图，待替换教材原图）"
              />
              <figcaption className="oo-media-caption">
                <span className="oo-media-title">教材图 1-13 · 基于标识解析的精益化管理</span>
                <span className="oo-media-note mono">M002 · 占位，待替换教材原图</span>
              </figcaption>
            </figure>
            {/* 第 3 拍起：读图读出的判断大字，沉淀在原图下方 */}
            <p className="oo-reading-hero serif-cn">跟本体分不开的身份</p>
          </div>

          {/* 固定注记区：左侧笔记页边线持续在场，末拍点亮为 R008 回指路径 */}
          <div className="oo-notes">
            <div className="oo-rail" aria-hidden="true">
              <span className="oo-rail-margin" />
              <span className="oo-rail-refline" />
              <span className="oo-rail-refhead" />
              <span className="oo-rail-reflabel mono">围绕零部件标识协作</span>
            </div>

            {/* U010 · reading-order */}
            <section className="oo-reading">
              <p className="oo-question serif-cn">
                断掉的链子，怎么接上？
                <span className="oo-catch" aria-hidden="true" />
              </p>

              {/* 平台锚点（G010 · S018 exact）——R008 回指目标 */}
              <div className="oo-anchor card">
                <span className="oo-anchor-tag mono">锚点 · 平台</span>
                <p className="oo-anchor-hero serif-cn">一件一码精益化管理平台</p>
                <p className="oo-anchor-sub">接住断掉的链子，给每件零部件一个共同身份</p>

                {/* 第 3 拍补齐的锚点说明（槽位自首拍预留） */}
                <div className="oo-anchor-extra">
                  <hr className="rule oo-anchor-extra-rule" />
                  <div className="oo-anchor-extra-row">
                    <span className="oo-fuse" aria-hidden="true">
                      <i className="oo-fuse-body" />
                      <i className="oo-fuse-code" />
                      <i className="oo-fuse-joint" />
                    </span>
                    <p className="oo-anchor-extra-text">
                      <span className="oo-extra-sub">打刻或打印到本体上，离开供应商就带着</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* R007 · 获取编码后完成赋码：锚点说明在前、赋码说明在后的先后排列 */}
              <div className="oo-seq">
                <div className="oo-stepcard card oo-stepcard-a">
                  <span className="oo-step-tag mono">先 · 第一步</span>
                  <p className="oo-step-title serif-cn">获取编码</p>
                  <p className="oo-step-sub">供应商从平台获取编码</p>
                </div>
                <div className="oo-conn" aria-hidden="true">
                  <span className="oo-conn-line" />
                  <span className="oo-conn-head" />
                </div>
                <div className="oo-stepcard card oo-stepcard-b">
                  <span className="oo-step-tag mono">后 · 第二步</span>
                  <p className="oo-step-title serif-cn">本体打刻 · 打印</p>
                  <p className="oo-step-sub">标识直接做在零部件本体上</p>
                </div>
              </div>

              {/* 第 4 拍 · 边界说明（U010 补充） */}
              <div className="oo-boundary">
                <div className="oo-boundary-row">
                  <span className="oo-mark oo-mark-no mono">不是</span>
                  <p className="oo-no-text">
                    把业务数据塞进这个码里
                    <span className="oo-no-strike" aria-hidden="true" />
                  </p>
                </div>
                <div className="oo-boundary-row">
                  <span className="oo-mark oo-mark-yes mono">先解决</span>
                  <p className="oo-yes-line">让每件零部件有明确身份</p>
                  <span className="oo-yes-arrow mono" aria-hidden="true">→</span>
                  <p className="oo-yes-line2">不同环节的记录，围绕它关联</p>
                </div>
              </div>
            </section>

            {/* U011 · key-points · R008：协作组卡向锚点卡回指 */}
            <section className="oo-keypoints">
              <p className="oo-note-label mono">要点 · 协作</p>
              <div className="oo-collab card">
                <p className="oo-collab-hang mono">
                  <span className="oo-collab-hang-arrow" aria-hidden="true">↑</span>
                  都挂在同一个锚点：一件一码精益化管理平台
                </p>
                <p className="oo-collab-title serif-cn">都通过零部件的标识，建立业务联系</p>
                <div className="oo-parties">
                  {PARTIES.map((party) => (
                    <span className="oo-party serif-cn" key={party}>
                      {party}
                    </span>
                  ))}
                </div>
                <p className="oo-collab-foot">
                  <b>各管一段</b>，彼此衔接
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
