# Workflow — rewrite-course-narration 五步流程

## 总览

```
冻结任务包(只读) → [1 提炼 Brief] → ..\.tmp\narration-pipeline\<任务>\episode-XX/narration-brief.json
Brief + 短 Prompt → [2 隔离连续稿] → ..\.tmp\narration-pipeline\<任务>\episode-XX/连续口播草稿
连续口播草稿 → [3 人工批准] → ..\.tmp\narration-pipeline\<任务>\episode-XX/批准母版
批准母版 + 编译期任务包 → [4 A 页面编译] → A 页面 v6 候选 + work-only coverage trace
批准母版 + A 页面候选 + trace → [5 验收并发布] → ..\player\episodes\episode-XX\inputs/三份正式 handoff
```

两个人工门禁：
- **门禁 A（批准）**：连续稿必须经用户明确批准后才能生成 `approved-spoken-text.txt`。
- **编译停止门**：职责冲突、事实边界不清、E 无法解析或 trace 有未解决项时停止并请求决策。

## 步骤 1：提炼 Brief

- **输入**：冻结任务包 `episodes/<模块子目录>/episode-XX-...-task-package.md`（只读）。
- **输出**：`..\.tmp\narration-pipeline\<任务>\episode-XX/narration-brief.json`（可选：同目录的 `stage0-conflicts.json`，仅在确实存在职责、事实边界或口播边界冲突时创建）。
- **内容分类**：每项信息先区分为学习者内容义务、Agent 静默护栏或上游冲突；静默护栏只约束生成，不成为学习者台词。
- **领域内核**：任务包内容含来源、制作、审计或真实性外壳时，只有能够独立成立的领域内核可以进入 Brief；去壳会改变事实性质时写入 `stage0-conflicts.json`，不得改成无条件事实。
- **规则**：任务包只读；Brief 不得包含旧口播文字、旧 N/B 编号、原 B 数量与边界、旧映射、分镜结构或 `---`。
- **注意**：不开发编译器，Brief 由 Agent 提炼、人工确认。

## 步骤 2：隔离生成连续稿

- **输入**：`narration-brief.json` + `templates/stage1-short-prompt.md`。
- **禁止输入**：任务包、旧稿、原 B 表、冲突台账、长 Prompt。
- **输出**：一篇没有 Nx、Bs、step、分隔线的连续口播。
- **目标**：只解决内容讲清、语言自然、叙事成立；只讲学习者内容义务，不把静默护栏改写成免责声明或内部说明；不关心怎样切页、怎样对应原 B。

## 步骤 3：人工批准

- **内容基线**：事实、领域语义限定、学习者内容义务和相邻主题边界准确完整。
- **质量通道一——硬红线审读**：逐段检查情境真实性补丁、课程来源归属、制作与画面说明、审计免责声明、未来待办及其同义改写。存在任一命中，状态为 `待修改`。
- **质量通道二——常规口播质量审读**：在去除红线后的完整稿件上重新审读句法搭配、听觉指代、专业关系、口播节奏、段落衔接、重复收束和自然教师语气。
- **叙事检查**：开场问题真实成立，正文逐步回答，结尾回扣而不机械复述，不预告相邻主题。
- **独立完成**：两个质量通道必须分别完成；没有发现硬红线，不等于语言与叙事已经通过。
- **职责边界**：本 Skill 审批的是整篇新连续稿，不生成局部润色清单，也不要求用户逐句确认。
- **状态**：只有两个 — `待修改` 或 `已批准`。
- **批准后**：在当前 `..\.tmp\narration-pipeline\<任务>\episode-XX/` 保存批准母版候选；明确批准门不因后续发布而改变。
- **规范化语义**：剥离【视频标题】【开场导入】【正文讲解】三节标题；CRLF/CR 统一为 LF；去首尾空行；内部文本逐字符保留。见 `scripts/verify_compilation.py` 的 `canonicalize_stage1_output`。
- **禁止**：批准前不得切 Nx 或生成 A 页面。

## 步骤 4：A 页面编译

- **输入**：`approved-spoken-text.txt` + 冻结任务包中的职责、证据和关系 + `narration-brief.json`。旧 Media Plan 不进入 v4/v5/v6 编译输入。
- **候选输出**：`courseplay-a-page/v6` JSON；每个 `pages` 元素是一页 A，并包含 `screen` guidance 与 reviewer-only `silent_constraints`。另生成 `courseplay-b-to-a-trace/v2` work trace，仅供上游覆盖验收。冻结 v4/v5 仅保留兼容验证。
- **规则**：
  - 第一遍按页面认知任务切分 A，A 边界同时满足语义完整、Nx 连续和制作时长；原 B 不决定 A 数量；
  - 每个 A 有且仅有一个非空连续 `nx`；`concat(pages[*].nx)` 与批准母版逐字符一致；
  - 第二遍先从任务包语义分镜的“必须/必要可见信息”提取语义原子，再依据当前 A 的 Nx、教学目的或受保护关系完成归属；不得借用相邻 B 增加页面密度，也不得把批准稿已删除的旧内容重新塞入 guidance；
  - 把制作作用相同的原子轻量组合成 S/G guidance，保留具体枚举、数值、条件与关系；每个 S 使用最窄 E 集合，默认 `reference`；
  - v6 work trace 的每个 B 行以 `visible_source_units` 记录原子到 A/S 指导池的覆盖，或记录有理由的省略；原子本身不进入正式 A-page；
  - JSON 给出内容方向、重点、事实边界与 exact 义务，不是下游逐条落屏清单；
  - 不复制旧 Media Plan；
  - `silent_constraints` 只存放来源、统计审计、外推和实现边界，不进入 `nx`、guidance 或可见槽位；
  - 不输出任何视觉、媒体、图片配额、页面配方或布局字段；
  - A 目标时长小于 8 秒时默认与相邻页合并；确有独立教学理由才填写 `short_page_reason`；
  - trace 必须覆盖任务包全部 B、A 引用存在且顺序单调，并且 `unresolved=[]`。

## 步骤 5：验收并正式发布

- **机械检查**：严格字段和类型、正式文档无 B、Nx 无损、连续 A ID、callback、E 自包含引用、确定性 A 时长、短页理由、S/G 唯一性、静默护栏隔离与 trace 覆盖均通过。
- **人工检查（四项）**：
  1. 对照任务包可见信息列逐项确认语义原子全部进入 `visible_source_units`；`covered` 可沿 A → S 找到实际文本，`omitted` 原因与当前批准 Nx 一致，不能只依赖 `responsibilities_resolved=true`；
  2. 每页 A 的语义要求确实能支持对应 `nx`；
  3. 事实和相邻主题边界没有越界。
  4. `exact` 只锁定确需逐字稳定的原子，不把可改写解释整句一并锁定；不使用机械长度阈值。
- **人工检查（四项）通过后发布**：`..\player\episodes\episode-XX\inputs/` 固定包含 `approved-spoken-text.txt`、`episode-XX-a-page.json`、`episode-XX-a-page-validation.json`。trace 始终留在 work，不进入 handoff。
- **正式命令**：`python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py --validation-profile a-page-v6 --task-package episodes/<module>/episode-XX-...-task-package.md --compile-trace ..\.tmp\narration-pipeline\<task>\episode-XX/episode-XX-b-to-a-compile-trace.json --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt --compiled-json ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json --output ..\player\episodes\episode-XX\inputs/episode-XX-a-page-validation.json`
- **正式报告**：记录 A 页数、A 总目标时长、短页例外、三份输入哈希、`coverage_passed`、trace SHA-256 和 failures；不得列 B ID 或映射。

## 停止条件

- 用户要求只给方案/清单时不执行生成；
- 未获批准时；
- 职责冲突、事实边界不清、证据无法解析或 trace 有未解决项时；
- 用户明确授权之外不下发 subagent；
- 新生产只生成 v6；v4/v5 仅供既有产物兼容与回归验证。
