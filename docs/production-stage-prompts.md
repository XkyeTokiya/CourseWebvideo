# CourseWebvideo 生产阶段提示词

> 占位符：`{{episodeId}}`、`{{episodeBranch}}`、`{{protectedBranch}}`、`{{repoRoot}}`、`{{taskPackage}}`、`{{tmpDir}}`。

## 通用约定

- 当前 episode 的正式改动统一累积在 `{{episodeBranch}}`，最终通过 PR 合并到 `{{protectedBranch}}`；不直接修改 `{{protectedBranch}}`。
- 写入 Git 跟踪文件前，确认当前 worktree 位于 `{{episodeBranch}}`。只写 `.tmp/` 过程文件的阶段，HEAD 与该分支提交一致即可，不因分支被其他 worktree 占用而停止。
- 只处理当前 episode 和当前阶段。不从其他 episode 推导内容、数值、文件结构或完成标准。
- 必须以目标文件真实存在且完成标准满足为结束。调研、计划、长篇说明或“已理解要求”都不等于完成。
- 前置文件真实缺失、内容冲突或必要用户决策尚未取得时，准确说明阻塞点后停止；不用假设补齐。

---

## 01 · 确认状态并准备单集分支

```text
[{{episodeId}}-01] 确认状态并准备单集分支

【目标】
确认当前 episode 的真实工作状态，并为后续制作准备唯一分支 {{episodeBranch}}。不额外审核任务包内容。

【执行依据】
先完整阅读 {{repoRoot}}/CLAUDE.md。

【需要完成】
1. 检查当前 HEAD、分支、git status、worktree、origin 和 {{protectedBranch}} 的关系。
2. 检查 {{episodeId}} 已有的 `.tmp/narration-pipeline/`、`player/episodes/{{episodeId}}/inputs/`、`script.md`、`outline.md` 和 `src/`，判断可恢复到哪个阶段。
3. 创建、跟踪或复用 {{episodeBranch}}。分支已在其他 worktree 使用时，报告其位置和状态，不重复创建。

【完成标准】
- {{episodeBranch}} 已存在且其起点明确。
- 已明确当前产物、缺失产物和下一个应执行阶段。
- 没有覆盖用户改动，没有直接修改 {{protectedBranch}}。

【结束输出】
只需简要报告：分支状态、工作树状态、产物恢复点、下一阶段。
```

## 02 · 生成连续稿

```text
[{{episodeId}}-02] 生成连续稿

【目标】
根据当前冻结任务包生成可进入朗读式润色的自然连续口播稿。

【执行依据】
开始前完整阅读：
- {{repoRoot}}/narration-pipeline/.agents/skills/rewrite-course-narration/SKILL.md
- 该 Skill 在 Brief 和 Stage 1 阶段指定的契约与短 Prompt

【需要完成】
1. 只读 {{taskPackage}}，按 Brief 契约生成 {{tmpDir}}/narration-brief.json。
2. Brief 完成后，只以 narration-brief.json 和 Stage 1 短 Prompt 作为连续稿的内容输入，生成 {{tmpDir}}/stage1-continuous-draft.md。
3. 根据 Brief 逐项回读连续稿，修正遗漏、越界和明显断裂。

【完成标准】
- narration-brief.json 区分学习者内容义务、Agent 静默护栏和上游冲突。
- stage1-continuous-draft.md 是自然连续口播，适合教师直接朗读，并覆盖 Brief 的学习者内容义务。
- 连续稿不包含 Nx、A-page、分页或创作过程说明。
- 未明确给定长度范围时，不自行设定数值目标。

【结束输出】
报告两个产物路径及仍需决策的上游冲突，然后停止，不提前润色或编译 A-page。
```

## 04 · 连续稿朗读式润色

```text
[{{episodeId}}-04] 连续稿朗读式润色

【目标】
对既有连续稿进行最小局部的朗读式润色，使其更容易被教师自然、准确地念出来。

【执行依据】
开始前完整阅读 {{repoRoot}}/narration-pipeline/.agents/skills/polish-stage1-narration/SKILL.md，本阶段使用其“连续稿模式”。

【输入】
- {{tmpDir}}/narration-brief.json
- {{tmpDir}}/stage1-continuous-draft.md

【需要完成】
1. 完整通读后，给出“红线清理”和“常规朗读润色”两份清单，等待用户确认。
2. 用户确认后，由当前任务的同一 Agent 按确认范围修改原稿。
3. 对修改后全文回读，检查句法、搭配、指代、专业关系、停顿、信息密度、衔接、重复和收束。

【完成标准】
- 只修改用户确认的项目。
- 不改叙事结构、不新增事实、不替换案例、不改受保护术语。
- 红线外壳已删除，替换句没有换一种说法保留内部话语。
- {{tmpDir}}/stage1-continuous-draft.md 已保存确认后的最终修改。

【结束输出】
简要列出已应用的修改和需转交重写阶段的问题。
```

## 05 · 连续稿红线审查与放行

```text
[{{episodeId}}-05] 连续稿红线审查与放行

【目标】
判断润色后的连续稿是否仍存在学习者口播红线；无红线问题时冻结放行稿。

【执行依据】
开始前完整阅读 {{repoRoot}}/narration-pipeline/.agents/skills/polish-stage1-narration/SKILL.md，使用其红线定义、二次扫描和独立口播测试。

【输入】
- {{tmpDir}}/narration-brief.json
- {{tmpDir}}/stage1-continuous-draft.md

【需要完成】
1. 完整审查连续稿，判断是否包含红线表达、红线的同义改写或无法独立成立的内部话语。
2. 同时检查口播是否超出 Brief 的事实、术语和范围。
3. 审查通过时，将连续稿原样写入 {{tmpDir}}/approved-spoken-text.txt。

【完成标准】
- 有红线或事实冲突：明确判定不通过，列出位置与原因，返回阶段 04；本阶段不直接改稿。
- 无红线且无未解决冲突：approved-spoken-text.txt 已存在，并与通过审查的连续稿内容完全一致。

【结束输出】
只报告“通过并已冻结”或“不通过并返回阶段 04”，附必要原因。
```

## 06 · 编译 A-page 与视觉粗设

```text
[{{episodeId}}-06] 编译 A-page 与视觉粗设

【目标】
把已放行的连续口播编译为 A-page v6，完成验证后产出与之对应的 visual rough v4 草案。

【执行依据】
先完整阅读：
- {{repoRoot}}/narration-pipeline/.agents/skills/rewrite-course-narration/SKILL.md
- 该 Skill 指定的 A-page v6 作者契约、canonical example 和模板

A-page 通过后，再完整阅读：
- {{repoRoot}}/narration-pipeline/.agents/skills/design-course-visual-rough/SKILL.md
- 该 Skill 指定的 visual rough v4 作者契约、canonical example 和当前 recipe

【需要完成】
1. 以 {{tmpDir}}/approved-spoken-text.txt 作为口播母版，结合只读任务包编译 A-page v6。
2. 生成 compile trace，并执行 A-page 公开验证入口；未通过时根据 error index 定位并修正。
3. 以已验证的 A-page 生成 visual rough v4 draft，并执行 visual rough 公开验证入口。

【必须产物】
- {{tmpDir}}/{{episodeId}}-a-page.json
- {{tmpDir}}/{{episodeId}}-a-page-validation.json
- {{tmpDir}}/{{episodeId}}-b-to-a-compile-trace.json
- {{tmpDir}}/{{episodeId}}-visual-rough.md
- {{tmpDir}}/{{episodeId}}-visual-rough-validation.json

【完成标准】
- A-page 满足 `coverage_passed=true`、`failures=[]`、`unresolved=[]`。
- visual rough 验证通过，状态仍为 draft。
- approved-spoken-text.txt 和任务包没有被改写。
- 所有产物仍在 {{tmpDir}}，未发布到 player inputs。

【结束输出】
报告 A-page 页数、两项验证结论和五个产物路径，然后停止。
```

## 10 · 用户授权并发布正式 inputs

```text
[{{episodeId}}-10] 用户授权并发布正式 inputs

【目标】
在用户明确授权后，将已通过验证的口播、A-page 和 visual rough 发布为 Player 正式输入。

【执行依据】
开始前完整阅读：
- {{repoRoot}}/narration-pipeline/.agents/skills/rewrite-course-narration/SKILL.md
- {{repoRoot}}/narration-pipeline/.agents/skills/design-course-visual-rough/SKILL.md
- 两个 Skill 指定的发布与停止规则

【授权前】
1. 核对阶段 06 的五个产物和验证结论。
2. 向用户展示待发布文件、A-page 页数、visual rough 状态和目标 inputs 路径。
3. 等待用户明确授权。授权前不写入 inputs。

【授权后】
1. 由当前任务的同一 Agent 将 visual rough 设为 approved/production，并刷新必要验证。
2. 通过 {{repoRoot}}/narration-pipeline/scripts/publish_handoff.py 发布正式文件。
3. 在 {{episodeBranch}} 提交并 push 本次 inputs 改动。

【必须产物】
player/episodes/{{episodeId}}/inputs/ 中：
- approved-spoken-text.txt
- {{episodeId}}-a-page.json
- {{episodeId}}-a-page-validation.json
- {{episodeId}}-visual-rough.md
- {{episodeId}}-visual-rough-validation.json

【完成标准】
- 用户已明确授权。
- 五个正式文件齐备、来源一致且验证通过。
- visual rough 为 approved/production。
- compile trace 仍保留在 `.tmp`，未进入 inputs。
- 改动已 push 到 {{episodeBranch}}。

【结束输出】
报告用户授权、发布文件、验证结论和分支提交。
```

## 12 · Player 计划、首章制作与验收修改

```text
[{{episodeId}}-12] Player 计划、首章制作与验收修改

【目标】
由同一 Agent 在当前任务中完成 Player Phase 1、Checkpoint Plan、第 1 章完整实现，并持续根据用户反馈修改至首章验收通过。

【执行依据】
开始前完整阅读 {{repoRoot}}/player/.agents/skills/web-video-presentation/SKILL.md。
进入 Skill 中的 Phase 1、Checkpoint Plan、handoff 或单章实现时，继续阅读该部分明确指定的必读文件。每次实现或修改首章前，重读 CHAPTER-CRAFT.md、COURSEPLAY-BOUND-MODE.md 和 COURSEPLAY-STATE-MECHANISMS.md。

【第一段：Player 计划】
1. 在 {{repoRoot}}/player 对正式 inputs 执行 Courseplay preflight。
2. 使用 phase1 runner 的 init、逐 A commit-chapter 和 finalize 完成 script.md 与 outline.md。
3. 整理稿子、Outline、主题、素材和开发模式五项 Checkpoint Plan，等待用户确认。

【第二段：首章制作】
获得 Checkpoint Plan 确认后：
1. 写入已确认的主题和开发模式。
2. 按需生成第 1 个 A-page 的 compact handoff。
3. 综合 guidance、beats 和 presentation 完整实现第 1 章的 TSX、CSS、narrations.ts 和必需素材。
4. 运行 `pnpm episode:check && pnpm typecheck && pnpm lint`。
5. 提供预览方式和验收要点，等待用户验收。

【第三段：反馈修改】
用户提出问题时，由当前同一 Agent 修改最小范围、重跑验证并再次请用户验收。重复该循环，直到用户明确表示首章通过。

【必须产物】
- player/episodes/{{episodeId}}/script.md
- player/episodes/{{episodeId}}/outline.md
- 已确认的 project.json 主题与状态
- 第 1 章的完整代码、narrations.ts 和素材

【完成标准】
- script.md 与 outline.md 已由 runner finalize。
- Checkpoint Plan 五项已获用户确认。
- 第 1 章是完整可验收版本，不是骨架版。
- 用户反馈已由当前 Agent 修改并复验。
- 用户已明确表示首章通过。
- 验证命令通过，改动已 push 到 {{episodeBranch}}。

【本阶段不做】
不执行 audio:extract、TTS、录屏或后期。
```

## 17 · 第 2～N 章制作、审查与结清

```text
[{{episodeId}}-17] 第 2～N 章制作、审查与结清

【目标】
以已验收首章为当期代码模式参考，按 Checkpoint Plan 确认的开发模式完成剩余章节并结清验收。

【执行依据】
开始前完整阅读 {{repoRoot}}/player/.agents/skills/web-video-presentation/SKILL.md。
每次实现或修改一章前，按 Skill 阅读 CHAPTER-CRAFT.md、COURSEPLAY-BOUND-MODE.md、COURSEPLAY-STATE-MECHANISMS.md、当前主题和当前章输入。

【需要完成】
1. 确认首章已通过用户验收，读取 Checkpoint Plan 选定的 A/B/C 模式。
2. 按该模式逐章获取当前章输入，实现 TSX、CSS、narrations.ts 和必需素材。
3. 每章完成后运行 `pnpm episode:check && pnpm typecheck && pnpm lint`，先修复失败再继续。
4. 按 A/B/C 模式完成逐章或整体验收，并对用户反馈做最小范围修改。
5. 完成后确认 entry.tsx 章节注册、project.json 状态和全集代码验证。

【必须产物】
- 第 2～N 章的完整代码、CSS、narrations.ts 和必需素材
- 更新后的 player/episodes/{{episodeId}}/src/entry.tsx
- 状态正确的 player/episodes/{{episodeId}}/project.json

【完成标准】
- 所有正文章节均已完整实现。
- 选定模式要求的验收和反馈修改已结清。
- episode:check、typecheck 和 lint 均通过。
- 改动已 push 到 {{episodeBranch}}。
- {{episodeBranch}} 到 {{protectedBranch}} 的 PR 已创建或更新。

【本阶段不做】
不执行 audio:extract、TTS、录屏或后期。
```
