import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 06-a006 · 后缀分层与责任页（outline §6 · S-A006 · layered-bands-with-side-notes）
 * 左侧五条有序文字带自上而下堆叠（第五条淡色可选），右侧窄侧栏卡作反衬，
 * 底部收束条压轴；ordered-progression 沿纵深推进。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - roles-introduced：五条带依次落位最简层级，第五条挂可选样式与
 *   「只承载这个范围内的对象差异」导语注脚（A006 · step 1）
 * - hierarchy-stacked：四条带补入职责短语，扩展带补 exact 职责，
 *   R012/R013/R014 由带间递进顺序承载，R015 由扩展带可选注脚的独立位置
 *   承载（A006 · step 2）
 * - discipline-stated：右侧滑入侧栏卡提出反衬（R016 由侧栏内两块对照承载），
 *   底部收束条点亮为焦点（A006 · step 3）
 * exact 逐字项（含全角冒号，自第 2 拍起在对应带内完整可见）：
 * - S027「分类代码:对象属于哪一类」 S028「产品代码:区分型号或属性」
 * - S029「批次号:落到某次生产」 S030「序列号:区分同批次的单件」
 * - S031「扩展数据编码:业务确有需要才保留」
 * 护栏：C009 可选只属于扩展字段；C010 不新增字段角色；C011 不补长度/枚举。
 */
const stateByStep = [
  "roles-introduced",
  "hierarchy-stacked",
  "discipline-stated",
] as const;

type A006State = (typeof stateByStep)[number];

/** 五条角色带（exact S027~S031 逐字；段名加粗，冒号与职责同列保持连续） */
const BANDS = [
  { no: "01", name: "分类代码", duty: "对象属于哪一类" },
  { no: "02", name: "产品代码", duty: "区分型号或属性" },
  { no: "03", name: "批次号", duty: "落到某次生产" },
  { no: "04", name: "序列号", duty: "区分同批次的单件" },
  { no: "05", name: "扩展数据编码", duty: "业务确有需要才保留" },
] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state: A006State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad lb-root" data-state={state}>
      <header className="lb-head">
        <span className="lb-head-tick" aria-hidden="true" />
        <h1 className="lb-headline">后缀承载对象差异</h1>
        <span className="lb-head-rule" aria-hidden="true" />
      </header>

      <div className="lb-main">
        <div className="lb-bands">
          {BANDS.map((band, index) => (
            <div
              key={band.no}
              className={`lb-band lb-band-${index + 1}${
                index === 4 ? " lb-band-optional" : ""
              }`}
            >
              <span className="lb-no">{band.no}</span>
              <p className="lb-band-line">
                <b>{band.name}</b>
                <span className="lb-duty">:{band.duty}</span>
              </p>
              {index === 4 ? (
                <span className="lb-opt-tag">
                  可选 · 只承载这个范围内的对象差异
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <aside className="lb-side" aria-label="字段责任反衬">
          <p className="lb-side-against">字段不是越多越好</p>
          <hr className="rule lb-side-sep" />
          <p className="lb-side-for">字段要有说得清楚的业务责任</p>
        </aside>
      </div>

      <div className="lb-takeaway">
        <p className="lb-takeaway-line">
          每一段都要有一个<b>稳定、说得清楚的业务责任</b>
        </p>
      </div>
    </div>
  );
}
