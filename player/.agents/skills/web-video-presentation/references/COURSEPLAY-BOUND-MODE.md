# Courseplay-bound mode

正式 Courseplay 输入使用本模式。可选 handoff 工具支持 v4/v1→handoff v1、
v5/v2→handoff v2（继续服务 ep04）、v6/v3→handoff v3（后续新生产）；版本组合
校验属于显式调用该工具时的输入契约，不是全局制作门禁。v3 的三源创作详细规则
唯一存放在 [`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md#courseplay-v3三源创作唯一详细规则)；
本文件说明内容边界、可选上下文打包与通用场景调度。

## 目标与术语

Courseplay 的 A-page 是一个完整教学判断，不是一个口播瞬间。下游实现要
保留口播节拍，同时避免把每个节拍都升级成需要重新设计的页面。

- **narration beat**：口播、TTS 与自动播放节拍，对应一个 `step`。
- **semantic state**：某个 narration step 结束时，同一构图已经形成的稳定画面；
  名称由本章内容产生，可以被多个 step 重复引用。
- **relationship mechanism**：整章表达顺序、并列、对照、汇聚、定义或读图等
  关系的方式；它不规定 step 或 state 数量。
- **base-scene**：一个 A-page 的主要持续视觉框架。
- **accent-frame**：用于金句、转折、概念边界或最终判断的低成本独立全屏页。
- **custom-scene**：需要新构图、新素材或复杂结构的额外场景。

当前视觉焦点独占舞台；`step` 不自动等于重新构图。一个 A-page 可以有
多个 narration beat 和 semantic state，但默认只有一个 base-scene。这里的“默认”
是起始规划约束，不是禁止例外的硬等式；若确需多个 base-scene，必须在 outline
中说明必要性，并在 Checkpoint Plan 中确认。

## 输入与版本路由

- 章节制作需要明确的当前 A-page、批准口播、visual rough/页面指导、outline 调度、
  主题和素材；可以直接提供这些等价的当前章节输入，也可以用 handoff 打包。
- 显式调用 handoff 时，工具读取 episode 根级固定文件：`project.json`、`script.md`、
  `outline.md`、`<episode-id>-a-page.json`、`<episode-id>-visual-rough.md`，以及声明
  `approved_text` 时的 `approved-spoken-text.txt`。工具不动态搜索候选文件；路径或
  格式不符合时报告该命令的输入错误，不把它升级为全仓库 validator。
- 新生产使用 `courseplay-a-page/v6` + `courseplay-visual-rough/v3`；v6 `screen` 是 guidance，v3 只写结构绑定、配方、媒体和 R 载体，不复制 `guidance_text`。
- v5/v2 为冻结兼容路径，保留 `screen_source` 与现有 screen adaptation 行为；v4/v1 只由旧兼容验证路径读取。
- 缺少当前章节实际所需的批准口播或页面指导时，列出缺项并请求补充；仅仅没有
  生成 handoff、文件不在工具默认路径或 script 使用不同排版，不阻止直接制作。
- 每个 A-page 必须包含非空 `nx`；它是该页的批准口播源，不能由下游补写或改写。
- 顶层 `approved_text` 如已声明，必须能解析到批准稿文件；它用于整稿交叉核对，
  不替代各页 `nx`，也不构成进入本模式所需的第三种 schema。
- A-page 顺序、视觉粗设页面顺序、口播语义与媒体资格保持一致。
- 封面是独立场景，不计入正文 A-page 场景数。

显式调用 handoff 时，推荐并按工具契约使用以下 A-page 格式：

```markdown
## Axxx · <页面标题>

<Beat 1 原文>

---

<Beat 2 原文>
```

在 handoff 输入中，每个 `pages[].a_id` 必须对应且仅对应一个标题，顺序必须与 `pages[]` 一致；
标题和 metadata 不进入口播，`---` 只分隔当前 A-page 内的 Beat。每页 Beat 拼接
经空白归一化后必须等于该页 `nx`，Beat 数必须等于 outline 当前章节 step 数。
不调用 handoff 时，可直接提供清楚标明 A-page 和 Beat 的等价输入；纯排版差异
本身不构成制作停止条件。

## 继承通用 outline 契约

Courseplay-bound mode 是通用 outline 格式的增量约束，不是替代格式。除本文件
新增的 scene / state 字段外，outline 仍必须包含：

- 独立 `00-cover`、通用 metadata、总时长与章节摘要；
- 每章信息池及来源；
- 末尾按章节整理的素材清单；
- visual rough 中已有媒体需求的 ID、所属 A-page、媒体角色和就位状态。

素材未就位时标记为待提供或 placeholder，不得省略。封面不进入正文
A-page、base-scene 或 narration beat 统计。

## 场景绑定

- A-page 顺序默认就是 chapter 顺序；如需偏离，必须说明章节边界为何不能按该顺序
  承载，并在 Checkpoint Plan 中确认。
- 每个 A-page 默认对应一个 base-scene。
- visual rough 的配方、骨架、媒体和语义区域在该 scene 的多个 step 中持续有效。
- v2 的 screen source 继续按冻结规则承载；v3 的普通 S/G 只指导内容和结构，
  不要求逐项落屏，也不形成 G→section 对应。R 仍须由明确关系载体保真。
- 已出现的持续元素默认保留；可以弱化、聚焦或更新固定槽位，不得无理由
  消失或整体重排。

Courseplay 不设全局 state 标签白名单。每章使用能描述稳定画面结果的
`lower-kebab-case` semantic state，例如 `systems-equal`、
`question-dominant`、`definition-assembled`。建立、保持、补充、聚焦、更新和
收束属于本步场景指令，不是固定 state 类型。完整决策方式见
[`COURSEPLAY-STATE-MECHANISMS.md`](COURSEPLAY-STATE-MECHANISMS.md)。

## Step 与 semantic state 粒度

每个 A-page 没有固定 beat 或 state 数。narration beat 按 CLAUDE.md §1.4 的
锚点与偏离规则切分：默认每页等于该页 visual rough 的 G 组数 N（以
`### 上屏内容组` 下 `数字. Gxxx` 编号行计数），偏离仅限合并/扩张/并入
三类并内联标注。beat 数确定后，按以下顺序确定每条 step 如何落到
semantic state：

1. 将 visual rough 的编号 G 组和其中的 S 子项作为候选状态单位；
2. 对照页面骨架中的卡片、轨道、媒体区与判断区，确认实际视觉槽位；
3. 对照口播，判断各内容组或子项是否被独立讲解和依次强调。

独立视觉槽位和独立口播焦点是需要写清场景指令的证据，不构成“一槽位一个
state”的最低配额。粗设已放在同一卡片或同一轨道中的组合短语可以一起出现；
一个 step 也可以在同一主构图中依次呈现多个子项，最终落到一个稳定 state。
无论拆分、合并还是复用 state，都不得自动增加 narration step 或 base-scene。

判断时先按编号内容组确定锚点，再对照批准口播验证每个锚点是否有独立口播句
与稳定画面，最后检查偏离标注。每条 step 都必须有可执行的场景指令，但相邻
step 可以重复引用同一 semantic state；重复时用“保持……”说明仍持续的构图和
本次口播焦点。state 的拆分、合并或复用不自动增加场景，也不要求所有 A-page
使用相同步数。

不要预设每页三步，也不要按每个名词机械拆步。三步可以是正确结果；错误的
是为了统一步数改写批准口播、压缩页面骨架，或把同一槽位中的组合短语
无意义拆开。关系机制的名称或示例长度也不得用于反推 step 数。

`(~Ts)` 根据对应口播估算，没有统一时长上限。超过 10 秒不能单独成为拆分、
换场或判定失败的理由。每个 base-scene step 引用一个结束时的 semantic state；
只有本 beat 结束时形成了不同的稳定画面结果，才使用新的 state，否则复用前一
state。内部呈现动作不另计 semantic state。

每拍必须有非空口播。beat 是 narration beat，不允许空拍；无口播的内容组不能
独占一拍，无锚点的引入/过渡句并入其画面所属的相邻组拍。拍边界与句子边界
不对齐是合法形态：句内切分仅限强分隔标点（，；：）且两侧分属不同组锚点；
组锚点优先于句子完整性，句子完整性优先于逐组拆分。量词扫描是警告不是锚点：
骨架措辞中的“三张/四条”与编号内容组数不一致时（如 layered-bands 的组内
文字带数），以编号内容组为准。≥4s 含边界（仅 <4s 违规）；时长按 a-page
`timing_model`（230 字/分）估算，不做逐字精算。

## Accent frame

以下内容可以使用 accent-frame：核心判断、独立成立的金句、概念边界、
章节转折或最终结论。全屏强调不是默认错误，也不设硬性数量上限；它必须
带来明显的停顿、转折或认知聚焦价值。

- 使用共享 StatementFrame 类结构与主题原语，保持低制作成本。
- 只承载一句核心句及必要的短 kicker，不新增复杂卡片、图表、媒体或关系演示。
- 如果 accent-frame 取代 base-scene 的底部判断条，该判断只在 accent-frame 中
  保留；不得在 base-scene 另行重复。普通解释句、重复结论或仅为让 step 看起来
  不同而产生的全屏页不合格。

## Custom scene

只有 base-scene 与 accent-frame 都无法正确表达时才增加 custom-scene。
outline 必须为每个 custom-scene 写明：

1. scene ID 与所属 A-page；
2. 新构图、新素材或复杂结构的用途；
3. 为什么不能在 base-scene 内通过既有槽位、权重变化或 semantic state 表达；
4. 为什么不能使用低成本 accent-frame；
5. 在 Checkpoint Plan 中等待用户确认。

## Courseplay outline 接口

顶部规模摘要同时报告：

```markdown
> **章节**：11
> **Base scenes**：11
> **Accent frames**：4
> **Custom scenes**：0
> **Narration beats**：45
```

每章必须声明：

```markdown
**基础场景**：`S-A001` — <持续构图>
**页面配方**：`<recipe>`
**结构指纹**：`<slot-a | slot-b | slot-c>`
**语义关系**：<顺序 / 并列 / 对照 / 汇聚 / 定义 / 读图 / 其他>
**关系机制**：`<mechanism-id>` — <如何保持骨架并推进关系>
**持续元素**：<标题、媒体区、内容组区、判断区>
**可见标题**：`保留`，或 `none` 并另起一行 `**省略理由**`
**强调页**：`K-A001-01` 或 `none`
**额外复杂场景**：`none`，或列出 scene ID 与必要性
```

Base-scene 与 custom-scene 的 step 行同时引用场景与 semantic state：

```markdown
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 正式定义与范围 | `S-A009 · definition-assembled` (~36s) | 在同一 beat 内依次组装定义层，最终全部稳定保留 |
```

不要把这个单 step 示例理解为推荐数量。1、2、3、4 或更多 step 都可由批准
口播产生；同一个 semantic state 也可以出现在连续多行。

accent-frame step 只写 `K-Axxx-xx · accent`，不再附加 semantic state 或
`accent-frame` 第三段。例如：

```markdown
| 4 | 最终判断 | `K-A015-01 · accent` (~5s) | 低成本全屏强调，不重复 base-scene 结论 |
```

outline 仍只描述节奏、内容、场景连续性与信息密度，不写 CSS、动画类型、
毫秒值或实现手段。

## 可见标题省略（v2 冻结兼容）

outline Agent 拥有一项受限的“重复标题省略权”：可以把语义重复的论点标题
声明为不进入画面。这是删除性例外，不是“标题自由可选”，边界只有以下几条：

- 只能删除标题，不能改写标题；
- 只能在同页现有主体或收束区域已经完整表达该判断时删除；
- 不能为了删除标题而新造文案、新增槽位或改变配方；
- 不能删除主体、底栏或其他区域；
- 标题仍作为该章「核心判断」元数据保留，只是不进入画面；
- 标题承担的任何 V/R 在现有画面中找不到明确对应时，必须保留标题。

每章按二选一声明 `**可见标题**`。正常情况：

```markdown
**可见标题**：`保留`
```

省略时：

```markdown
**可见标题**：`none`
**省略理由**：<哪些既有主体/收束槽位已完整表达同一判断>
```

`可见标题：none` 时，基础场景、结构指纹与持续元素不再包含标题区，且不得
用任何新元素顶替标题职能；visual rough 文件本身不作任何修改。

实验期第一阶段不开放：

- 修改或缩写标题；
- 删除 takeaway；
- 把 takeaway 重新定义成内容组；
- 任意移动 V/R；
- 改变配方家族；
- 合并上屏内容组；
- 自由选择「主要语义载体」。

章节 Agent 只按 outline 的 `可见标题` 字段严格执行，不获得额外判断权：
声明 `none` 时页面不含标题区，不得自行恢复标题，也不得为顶替标题新造
判断句；声明 `保留` 时按现行骨架渲染。省略页必须能通过
[`COURSEPLAY-OUTLINE-REVIEW.md`](COURSEPLAY-OUTLINE-REVIEW.md) 的对应审查
问句——删除论点标题后，观众是否仍能从当前已有画面中完整得到同一判断；
只要存在疑问，继续保留。outline 顶部在实验期披露省略页清单（如
「可见标题省略：A00X、A00Y，理由见各章」），用于跑一到两集后统计哪些
页面通过、哪些页面因标题是唯一判断载体而无法删除，再决定第二步是否
开放「标题语义向既有主体槽位转移」。

v3 不继承上述“标题默认必须显示”的来源义务。标题 S 是页面判断方向；是否设置
独立标题区由 visual rough、Outline 的既有字段和实际构图共同决定。不得为了省略
标题而丢失页面判断，也不得在 Outline 中增加最终文案字段。

## 章节实现

handoff 是可选的上下文打包工具。需要隔离当前章节输入时，可以执行：

```powershell
pnpm courseplay:handoff -- --episode <episode-id> --a-page <Axxx>
```

生成的 `episodes/<episode-id>/.handoffs/<Axxx>.json` 可作为紧凑输入；也可以直接
提供等价的当前章节输入。v2 包提供冻结的 `screen_source`；v3 包提供当前 A 的准确
beats、`screen_guidance`、`presentation`、steps、关系、护栏和素材片段。使用包时，
章节 Agent 只读该包、本文件、`COURSEPLAY-STATE-MECHANISMS.md`、`CHAPTER-CRAFT.md`、
目标代码及必要的第 1 章风格参考；直接提供输入时保持相同的当前章节范围。
`narration.authority` 指向 `a_page.nx`（fixture-only 候选除外）。显式调用 handoff
后生成或 `--check` 失败时，报告该工具无法生成的输入错误；不因此阻断其他章节制作路径。

- v2 `screen_source` 继续使用 screen adaptation 内容检查；v3 不登记逐条口播来源，
  只按 [`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md#courseplay-v3三源创作唯一详细规则)
  进行三源创作和页面自检。

- 一个 A-page 默认实现为一个持续 Scene 组件，将 narration `step` 显式映射到
  semantic state；映射结果允许重复；
  额外 base-scene 只有在 outline 声明必要性并经 Checkpoint Plan 确认后才实现。
- 场景指令复用同一 SceneFrame 与主要 DOM 位置；不要把 `step` 直接当 active
  索引或可见元素数量。
- accent-frame 可暂时切换到共享 StatementFrame；它不改变 narration beat 规则。
- custom-scene 只能实现 outline 已声明且经 Checkpoint Plan 确认的场景。
- `narrations.ts` 仍然一条 narration 对应一个 beat，其长度可以大于 scene 数。

推荐结构：

```tsx
export function A001Chapter({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) return <StatementFrame>{statement}</StatementFrame>;
  const stateByStep = ["premises-established", "question-dominant"] as const;
  return <A001Scene state={stateByStep[step] ?? stateByStep.at(-1)!} />;
}
```

`A001Scene` 始终保留基础构图，只根据 semantic state 与本步场景指令控制槽位
的可见、主次和内容状态。不同 step 可以映射到同一 state。

## Checkpoint Plan

除原有五项对齐外，必须增加：

```markdown
视觉制作规模：
- Base scenes：<N>
- Accent frames：<K>
- Custom scenes：<C>
- Narration beats：<M>

请重点确认：
1. 哪些强调句值得独立全屏；
2. custom-scene 的必要性是否成立；
3. 每个 A-page 的主体是否保持一个持续视觉框架。
```

不要把 narration beat 数称为页面数。
