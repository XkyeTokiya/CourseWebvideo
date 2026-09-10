# `outline.md` 格式规范

`outline.md` 是从批准口播、原始文章和视觉粗设交接到章节开发的中间契约。
它面向人阅读和编辑，使用 Markdown；不写成 JSON、YAML、CSS 或动画脚本。

Phase 1 先创建模块化 `script.md` 与 `outline.md` 外壳，再按章创作 script →
outline 内容对并原位提交。全部章节完成后由 runner 自动填充全局派生段落，不装配
或重新生成整份 outline。这个模型不改变最终 Markdown 格式，也不改变
`script → outline` 的权威方向。

> ## outline 的职责
>
> outline 必须同时说明：
>
> - 章节边界、口播节拍和每章口播估时；
> - 页面配方、基础构图、持续元素和内容槽位；
> - 每个 step 的口播焦点，以及相对前一步的视觉变化；
> - 章节级信息池、媒体资格和需要确认的场景例外。
>
> `step` 是口播与画面实现的交接单位，不自动等于新页面。Phase 1 以已提交
> script 章节的 Beat 边界为计划真相源；Phase 2 创建 `narrations.ts` 时必须逐拍
> 复制，届时它才是运行时 step 数与口播文本的最终真相源。如果实现改变 step 数，必须同步 outline，
> 并重新检查持久化游标。不得把 narration beat 数直接称为页面数，也不能仅凭
> scene/step 比例判定设计失败；应检查连续 step 是否复用主构图，以及是否存在
> 无理由的逐 step 重构图。
>
> **Courseplay-bound mode**：只接受 `episodes/<id>/inputs/` 下已通过 preflight 的
> 正式 A-page v6 + visual rough v4，必须完整读取
> [`COURSEPLAY-BOUND-MODE.md`](COURSEPLAY-BOUND-MODE.md)。此时 A-page 默认对应
> 一个 chapter 和一个持续 `base-scene`；`semantic state` 是 base-scene 内的稳定状态
> 描述，不是额外的制作层。outline 必须分别报告 base-scene、accent-frame、
> custom-scene 与 narration beat 数，并读取
> [`COURSEPLAY-STATE-MECHANISMS.md`](COURSEPLAY-STATE-MECHANISMS.md) 区分
> relationship mechanism、semantic state 与 step instruction。
> 当前章节需要有可用的批准口播和页面指导；缺少、版本/episode/source/批准状态
> 不一致时 fail-fast，不自行猜测，也不以“等价输入”降级 Phase 1。
> 只有显式调用 handoff 时，才读取其公开作者契约卡和 canonical example 处理固定输入；
> 正式输入已通过 preflight 后，Phase 2 不调用 handoff 时才可直接提供等价的当前
> 章节上下文。
>
> **写 outline 前必读**：先读 [`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md) 的来源原则，
> 再读本文件的格式。
> 当前章 script 候选决定该章节拍与顺序，并与 outline 候选一次提交；正式
> `script.md` 用于全局复核。`article.md` 如有则补充画面信息池。Courseplay
> 另以 A-page、visual rough 与素材清单为权威来源；这些职责不能互换。

---

## 一、来源与职责边界

### 1.1 来源如何使用

| 来源 | outline 从中读取什么 | 不应做什么 |
|---|---|---|
| 当前章 script 候选 | 本章 narration beat 顺序、口播焦点和估时 | 不从别章内容反推当前章 outline |
| 正式 `script.md` | 全局章节顺序、衔接与完整 narration beat 序列 | 不把标题、序号或实现说明混入口播 |
| `article.md`（如有） | 画面信息池：数字、引用、案例、出处、时间、对比等 | 不改写原文，不用文章细节打乱批准口播顺序 |
| A-page v6 | 批准语义、`nx`、screen source/guidance、静默护栏、证据关系、进入/退出条件 | 不改写批准口播；不保存最终文案，不增加 guidance 覆盖表 |
| visual rough v4 | 页面配方、基础骨架、媒体区、S/G/U 槽位和关系载体 | 不省略媒体 ID、媒体角色或原图限制；不复制 A-page 文本；G/U 不反推 Beat 数 |

直接提供口播稿而没有 `article.md` 时，信息池退化为主动设计的画面信息池，
例如已知的对比、元数据和结构提示；不得编造事实、数字、logo 或素材来源。

### 1.2 交接责任

```text
A-page / visual rough
    → 章节边界、内容语义、页面配方、基础骨架、媒体资格
outline.md
    → 持续构图、内容槽位、step 状态变化、场景例外、信息池
chapter agent
    → 组件、CSS、动画、具体视觉演示
narrations.ts
    → 运行时 step 数与 TTS 文本
```

outline 必须让 chapter agent 知道“固定什么、变化什么、何时允许换场”；但不应
规定组件名、DOM 结构、CSS、动画类型、keyframe、毫秒值或 SVG/Canvas 选型。

### 1.3 Courseplay Phase 2 可选交接

handoff 是可选的隔离上下文工具。需要为主线程或 subagent 生成紧凑输入时，可以执行：

```powershell
pnpm courseplay:handoff -- --episode <episode-id> --a-page <Axxx>
```

生成的 `episodes/<episode-id>/.handoffs/<Axxx>.json` 是一种紧凑输入。也可以直接
提供等价的当前章节 outline、调度、A-page/Beat、visual rough、主题和素材。v4 生成器把当前章元数据、准确
`narration.beats`、screen guidance、`presentation`、结构化 steps、静默护栏和素材
片段切成 compact 派生包。显式调用 handoff 时，生成或 `--check` 失败只表示该工具
无法从当前文件生成可靠包；报告具体输入问题即可，不把错误扩展成全局制作停止条件。
无论采用哪条路径，都只给章节 Agent 当前章必要上下文，不从历史章节猜测内容。

Outline 只投影步骤、状态、持续元素、聚焦关系和制作指令，不保存最终文案权威，
也不增加 guidance 覆盖表或下游内容清单。普通 S/G 不承担逐项落屏义务，
章节三源创作规则只以 [`CHAPTER-CRAFT.md`](CHAPTER-CRAFT.md#courseplay-v4三源创作唯一详细规则) 为准。

---

## 二、工作表示与文件总体结构

### 2.1 模块化初始外壳

Courseplay 使用正式 A-page JSON 的 `pages[]` 顺序和 `pages[].a_id` 确定性创建初始
`script.md` 与 `outline.md`。outline 外壳只包含固定封面、章节边界与三个全局边界：

```markdown
# Video Outline

<!-- GLOBAL:metadata:BEGIN -->
> **编译状态**：in-progress
> **主题**：pending（Checkpoint Plan 待选）
> **章节**：<由 pages.length 计数>
<!-- GLOBAL:metadata:END -->

## 整集视觉调度

<!-- GLOBAL:schedule:BEGIN -->
<!-- GLOBAL-CONTENT: pending -->
<!-- GLOBAL:schedule:END -->

## 0. cover — 封面（1 silent step · fixed 15s）

## 1. A001 — pending

<!-- CHAPTER:A001:BEGIN tx=pending -->
<!-- CHAPTER-CONTENT: pending -->
<!-- CHAPTER:A001:END -->

## 素材清单

<!-- GLOBAL:materials:BEGIN -->
<!-- GLOBAL-CONTENT: pending -->
<!-- GLOBAL:materials:END -->
```

初始化不得生成 chapter title、step 数、base-scene、页面配方、核心判断、结构
指纹、关系机制、semantic state、信息池或媒体判断。相同 A-page 输入必须生成
相同外壳。文件已存在时只允许两种自动处理：与仓库旧模板逐字一致的原始占位文件
可迁移为新外壳；带当前 chapter/global 边界的格式进入恢复。其他既有内容必须返回
`PHASE1_ARTIFACT_CONFLICT`，不得覆盖。普通项目在内容
章节确定后创建同格式的最小外壳。

每个 chapter section 是当前章唯一可写范围。`tx` 仅证明正式 script / outline
中的同章内容属于同一次提交，不表示质量或审查状态。三个全局边界不维护
pending/ready/stale 状态；章节重提后 runner 清空其派生内容，`finalize` 再自动生成。
初始化后禁止整份覆盖正式文件。

### 2.2 Chapter-local 与 global-derived

每个 chapter section 保存当前章可独立审查的契约：

| Chapter-local（逐章提交） | Global-derived（finalize 自动生成） |
|---|---|
| 章节标题、A-page / Chapter | 正文总时长、章节数、Narration beats 总数 |
| 基础场景、页面配方、核心判断、结构指纹 | Base / Accent / Custom counts |
| 语义关系、关系机制、持续元素、内容槽位 | 整集视觉调度表 |
| 信息池、step table、accent / custom 声明 | 相邻章节差异检查 |
| 当前章素材需求 | 按章节汇总的完整素材清单 |

处理 A004 时不得同步重写顶部总计、整集调度表或其他章节。global-derived
内容在所有 chapter sections 提交后计算并原位填入边界区。最终 `outline.md`
仍严格使用下面的现有格式。

### 2.3 正式文件结构

每期正文章节前默认加入独立封面：

```markdown
## 0. cover — 封面（1 silent step · fixed 15s）
```

封面无口播，不进入正文 narration beat 统计。封面内容来自实例的
`src/data/cover.json`。`episodes/_shared/covers/` 封面内容库是可选来源；也可以使用用户提供、
当前实例已有或根据当前项目编写的内容，库文件缺失或内容不同不阻止制作。
`episode:new` 默认 JSON 是可编辑的结构占位。组件显式映射
`course`、`module`、`task`、`point`、`lede`、`chips` 并忽略 `style`。如果源
JSON 没有 `subtitle`，使用 `lede`，不要机械截取正文第一句。

正文顶部至少包含：

```markdown
# Video Outline

> **主题**：pending（Checkpoint Plan 待选；批准后原位替换）
> **正文时长**：约 <T> 分 <S> 秒
> **章节数**：<N> 章 / <M> narration beats
```

Courseplay 模式用下面五行替换普通项目的“章节数”行：

```markdown
> **章节**：<N>
> **Base scenes**：<B>
> **Accent frames**：<A>
> **Custom scenes**：<C>
> **Narration beats**：<M>
```

统计必须如实反映正文：封面不计入正文 A-page、base-scene 或 narration beat；
不得把 narration beat 数称为页面数。每个 A-page 默认一个 base-scene，但额外
base-scene 必须说明必要性并进入 Checkpoint Plan；不设置固定 beat 数、accent 数
或 scene/step 比例阈值。

Courseplay 在 metadata 后、正文章节前必须加入整集视觉调度表。metadata、调度表、
素材汇总由 runner 在所有 chapter sections 提交后一次 `finalize` 生成；Agent 不手工
维护状态或统计：

```markdown
## 整集视觉调度

| A-page | 页面配方 | 语义关系 | 关系机制 | 主构图 | 强调方式 | 媒体 | 与相邻页的主要差异 |
|---|---|---|---|---|---|---|---|
| A001 | `central-question` | 前提汇聚到问题 | `premise-to-question` | 三个前提围绕中心问题 | 中心焦点转移 | none | 与封面不同，不使用居中标题幕 |
```

该表用于控制整集节奏和 Phase 2 交接，不增加场景。相邻章节不得仅替换文字而
复用同一主构图、卡片比例、强调机制和固定 chrome。

---

## 三、章节契约

### 3.1 章节标题

```markdown
## 1. <chapter-id> — <章节标题>（<S> steps · ~<T>s）
```

| 部分 | 规则 |
|---|---|
| `N` | 从 1 开始，与 `src/entry.tsx` 中 `CHAPTERS` 注册顺序一致 |
| `<chapter-id>` | 小写拉丁字母、数字和连字符；用于 React key、章节目录和音频目录 |
| `<章节标题>` | 给人看的中文标题，不直接进入 React 代码 |
| `<S>` | 本章 narration step 数；在当前契约下与对应口播 beat 数一致 |
| `~<T>s` | 本章口播估时；封面使用 `fixed 15s`，不计入正文总时长 |

章节标题中的时长括号支持 ASCII `(...)` 与中文全角 `（...）` 两种排版，二者不改变
章节语义。不要为了迎合括号样式改写口播或其他内容。

Courseplay 不设置硬门槛；普通项目可参考每章 3–8 步、30–60 秒。
章节边界应由主题切换和完整教学判断决定，不为凑步数拆分批准口播。

### 3.2 Courseplay 章节字段

正式 Courseplay 输入下，每章至少包含：

```markdown
**A-page / Chapter**：`A001`
**基础场景**：`S-A001` — <持续主构图>
**页面配方**：`<recipe>`
**核心判断**：<本章必须让观众形成的判断>
**结构指纹**：`<slot-a | slot-b | slot-c>`
**语义关系**：<本章内容之间的关系>
**关系机制**：`<mechanism-id>` — <如何保持页面骨架并推进关系>
**持续元素**：<标题、媒体区、内容组区、判断区等>
**内容槽位**：<槽位 ID 与其语义>
**强调页**：`K-A001-01` 或 `none`
**额外复杂场景**：`none`，或 <scene ID、用途、必要性、确认状态>
```

每章另须声明 `**可见标题**`：`保留`，或在满足省略边界时写 `none` 并附
`**省略理由**`（哪些既有主体/收束槽位已完整表达同一判断）。省略权是受限的
删除性例外，完整边界、声明格式与审查问句见
[`COURSEPLAY-BOUND-MODE.md`](COURSEPLAY-BOUND-MODE.md)
「可见标题省略（实验性授权）」。

字段的作用：

- `基础场景`描述一套持续的主构图，不是某一个瞬间的截图；
- `结构指纹`保留 visual rough 中使本页区别于其他页面的核心槽位组合；
- `语义关系`说明内容是顺序、并列、对照、汇聚、定义、读图还是其他关系；
- `关系机制`说明如何表达该关系，但不列状态序列，也不暗示 step 数；常见机制
  及开放扩展方式见 [`COURSEPLAY-STATE-MECHANISMS.md`](COURSEPLAY-STATE-MECHANISMS.md)；
- `持续元素`说明后续 step 中哪些元素必须继续可识别；
- `内容槽位`说明内容进入哪里，以及哪些位置可以更新；
- `额外复杂场景`只有在 base-scene 与 accent-frame 都不足时才填写，并必须说明必要性。

### 3.3 信息池

每章在章节字段后列出信息池，供 chapter agent 按需转化为画面细节：

```markdown
**信息池**：
- <类型>：<具体内容> —— <来源 article §X / Lxx 或可追溯简注>
- <类型>：<具体内容> —— <来源 article §X / Lxx 或可追溯简注>
- <类型>：<具体内容> —— <来源 article §X / Lxx 或可追溯简注>
```

有 `article.md` 时，每章至少列出 3 条有来源的抽取项。没有 article 时，明确写成
“主动设计的画面信息池”，并只使用已知事实或不承载事实的结构元素。

---

## 四、视觉步组与 step

### 4.1 先定主构图，再定状态变化

普通项目使用“视觉页面/步组”；Courseplay 使用“base-scene/semantic state”。
两者都遵守同一顺序：

1. 先确定能承载本组内容与关系的主构图。
2. 再将批准口播的 beat 映射到 step。
3. 为每个 base-scene / custom-scene step 命名最终形成的 semantic state，并写清
   本步场景指令；accent-frame 使用固定的 `K-Axxx-xx · accent` 例外格式。
4. 只有内容关系或空间组织确实无法继续承载时，才声明新场景。

Courseplay 的每个 narration beat 对应一个 step；一个 step 内可以在同一主构图中
完成多个内部呈现动作，不因内部动作增加 narration step、base-scene 或 custom-scene。
显式调用 handoff 时，script/outline 的页面标题、beat 分隔和映射语法以
[`handoff v4 作者契约卡`](../../../../docs/courseplay-handoff-v4-author-contract.md) 为准；
其他输入可使用等价的当前章节表达。

### 4.2 Courseplay step 格式

```markdown
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 四类系统已经存在 | `S-A005 · systems-equal` (~12s) | 建立四个等权槽位，并在本 step 内依次补齐内容；完成后全部等权 |
| 2 | 它们分别完成局部任务 | `S-A005 · systems-equal` (~16s) | 保持四卡等权，在原槽位补充职责说明；不产生当前选中项 |
```

这个示例用于展示连续 step 复用同一 state，不是两步模板。其他章节可以是 1、3、4 或
更多 step；同一个 semantic state 可以连续重复。semantic state 使用章节内
自定义的 `lower-kebab-case` 名称，描述该 step 结束时形成的稳定画面，不使用
`init/add/focus/update/conclude` 作为全局枚举。`accent` 只能引用本章已声明的
accent-frame。custom-scene 在 Phase 1 只能声明为 `proposed`，并写明 base-scene
与 accent-frame 均不足的必要性；局部/全局审查只检查候选是否合法，不得写“已确认”。
Checkpoint Plan 批准后改为 `approved`，Phase 2 只能引用 `approved` 的 scene ID。

accent-frame 使用固定的两段引用，不附加 semantic state：

```markdown
| 4 | 全篇最终判断 | `K-A015-01 · accent` (~5s) | 切换到已声明的低成本强调页；只承载核心句和必要短 kicker |
```

不要写成 `K-A015-01 · <semantic-state> · accent-frame`。accent 已经表示独立
强调场景类型，额外 state 会让 Phase 2 的 scene/state 解析产生歧义。

每一行必须同时说明：

- `Narration focus`：这条口播在讲什么；
- `Scene · Semantic state`：当前仍在哪个场景，以及本步结束时画面形成了什么
  稳定结果；
- `本步场景指令`：哪些内容建立、保持、补充、弱化、聚焦、更新或收束，哪些
  主构图继续不变；一个 step 内若有多个内部动作，还要说明顺序和最终结果。

首个 step 必须说明建立的基础槽位；后续 step 不能只写“显示 X”，必须说明与前一步
的关系。持续元素默认保留，可被弱化、聚焦或更新，但不得无理由消失或整体重排。

排版兼容约定：step 行的估时括号同样支持 `(~Ts)` 与 `（~Ts）`；页面映射和其他
元数据保持清楚可读即可。

Beat 边界由正式 `script.md` 显式持久化；outline 不再计算默认拍数或由视觉内容组推导
目标拍数。
若作者合并或拆分了先前已写入的 Beat，必须重提同章 script + outline 内容对；
outline 只记录最终映射，不另设偏离公式。

需要解释 Beat 边界时可在章节块内联记录理由，格式：

```markdown
（合并 4→3：组2/组3 同槽单句枚举，合并后 18s ≥4s）
（扩张 4→5：takeaway 独立口播句 + 新稳定画面）
（并入：组1 本页无口播，画面自 A011 持续）
```

理由只用于审阅，不从 G/U 数量推导 pass/fail；唯一机械门禁是全部非空 Beat 顺序
拼接后与当前 `nx` 一致。

### 4.3 narration step 与 semantic state 的映射

不要先规定每个 A-page 的 step 数，也不要从关系机制或槽位数量反推。按以下顺序：

- 先读取正式 `script.md` 当前章中由 `---` 持久化的 narration Beat；恢复时不得
  重新推断或静默改变；
- 再读取 visual rough 的编号内容组、页面骨架和独立槽位；
- 判断本 step 内如何呈现这些内容，以及结束时形成什么稳定画面；
- 若稳定画面与前一步相同，重复同一 semantic state，并用“保持……”写清焦点；
- 只有当前 base-scene 无法承载新的关系或空间组织时才声明额外场景。

独立槽位与独立讲解要求 outline 写清场景指令，但不构成“一槽位一个 state”。
同一卡片、同一轨道或同一语义组中的组合短语可以共同出现；多个独立槽位也可以
在一个 step 内依次呈现，最终形成一个稳定 state。state 可以少于、等于或多于
页面中的内容组数量，但 narration step 始终与批准 beat 对齐。

只有真实顺序过程才默认使用逐项 active / past / upcoming。并列关系、对照关系、
定义组装和图片阅读采用各自关系机制，不能统一解释为卡片轮流高亮。不能因为某个
step 超过 10 秒、一个 step 内包含多个内部动作或相邻 step 复用 state 就自动拆分、
换场或判定失败。

### 4.4 普通项目格式

普通项目可以使用以下格式，不要求 Courseplay 的 scene/state 字段：

```markdown
**视觉步组**：
- 页面 A（steps 1–3）— <复用的主构图与内容关系>
  - step 1 (~Ts) — <本步屏幕重点；首步说明基础槽位>
  - step 2 (~Ts) — <相对前一步的局部状态变化>
  - step 3 (~Ts) — <相对前一步的局部状态变化>
```

普通项目也应避免连续 step 无理由重构图；只有内容关系或空间组织确实改变时才
切换页面。所有项目的 outline 都不写动画类型、CSS 手段、微观时长或实现代码。

---

## 五、口播节选与素材清单

### 5.1 口播节选

每章末尾可附 1–3 句口播节选，帮助人类快速确认章节判断。它不是完整稿子，
完整口播只回 `script.md`；不得从节选重新生成 narration 或切分 step。

### 5.2 素材清单

每个 chapter section 记录本章媒体需求；完成阶段在 outline 末尾的
global-derived 占位区按章节汇总所有媒体需求：

```markdown
## 素材清单

### A001
- ✓ `M001`：<媒体角色>（<已就位路径>）
- ⚠️ `M002`：<媒体角色>（待提供 / placeholder）
```

Courseplay 必须继承 visual rough 中每个媒体需求的 ID、所属 A-page、媒体角色和
就位状态。未就位素材不得省略；必须标记为待提供或 placeholder。需要教材原图时，
必须标明原图要求，不能用 AI 图、描摹或重绘图冒充原始证据。

---

## 六、命名与时长速查

| 对象 | 规则 | 示例 |
|---|---|---|
| 章节 id | 小写 + 连字符 | `coldopen`、`why-good` |
| 章节目录 | `0N-<id>` | `src/chapters/01-coldopen/` |
| 音频目录 | `<id>` | `episodes/<episode-id>/media/audio/coldopen/` |
| 音频文件 | `<step-N>.mp3`，N 从 1 开始 | `.../coldopen/1.mp3` |

`(~Ts)` 只表示口播估时，通常按对应口播字数 ÷ 4 估算；不写动画时长、错峰量、
keyframe 或毫秒值。章节实现阶段决定具体动画与持续微动。音频工具直接读取
`narrations.ts`，不从 outline 节选或临时重切。

---

## 七、最小审查

审查分为机械完整性和作者判断，两者都不创建 review 文件或 PASS/REVISE 状态。

### 7.1 Runner 必须阻止的内容缺失

- [ ] A-page 顺序唯一，正式 script / outline 各章恰好出现一次
- [ ] 当前章全部非空 Beat 顺序拼接与当前 `nx` 一致
- [ ] 每个 Beat 恰好对应一个连续编号的 outline step
- [ ] 所有受保护关系 ID 均出现，S/U/R/M 引用属于当前 A-page / rough
- [ ] script / outline 同章事务一致；任一章未提交时不得 finalize
- [ ] metadata、调度和素材汇总由已提交章节自动生成

这些检查失败会造成内容缺失或错配，因此由 runner fail-fast。

### 7.2 作者提交前的最小判断

- [ ] outline 让 chapter agent 知道本章固定什么、每步变化什么、何时确有必要换场
- [ ] 默认使用一个持续 base-scene；accent 有真实强调目的
- [ ] custom-scene 为 `none` 或带必要性说明的 `proposed`，没有伪称已获批准
- [ ] 没有从槽位、recipe、时长或固定模板反推 Beat 数

这些属于创作质量，由作者当场修正；默认不调用独立 reviewer。用户明确要求时可
进行 independent review，但报告通过消息返回，不成为 Phase 1 状态。

### 7.3 Finalize 前的最小全局判断

- [ ] 没有明显的相邻章节“只换文字、构图完全相同”
- [ ] custom 候选与缺失素材已准备在 Checkpoint Plan 披露

机械的章节顺序、nx、Beat/step、引用、统计和素材汇总由 `finalize` 重新验证。
发现质量问题只重提受影响章节；不得重写无关章节或完整 `outline.md`。
