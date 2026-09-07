---
name: rewrite-course-narration
description: Use when regenerating learner-facing continuous narration from a frozen course task package, then compiling approved narration into one-A-per-page production JSON.
---

# Rewrite Course Narration

## Overview

从冻结课程任务包提炼独立 Brief，仅凭 Brief 与短 Prompt 生成连续口播；用户明确批准后，把批准母版编译为 `courseplay-a-page/v6`。一条 A 严格对应一页，正式 A 文档冻结页面语义、证据、关系、时间和 screen guidance；最终上屏措辞由下游综合 guidance、当前 A 口播与 visual rough 创作。视觉配方和媒体安排由后续 `design-course-visual-rough` 独立完成。当前工具只接受 `courseplay-a-page/v6`。任务包中的 B 只在编译期用于覆盖验收，不进入正式 JSON、正式报告或下游流程。

## When to Use

- 需要从冻结任务包重新生成整篇 learner-facing 连续口播；
- 既有口播不再作为可继承母版，需要按 Brief 隔离重建；
- 需要把已批准口播编译为一 A 一页的生产契约。

## Routing Boundary

- **唯一入口**：`rewrite-course-narration` — Brief → 隔离连续稿 → 人工批准 → A 页面编译 → 验收发布。
- **既有稿请求**：不复用旧 N 稿、历史母版或停用流程产物；需要新口播时，从冻结任务包重新提炼 Brief 并重新取得批准。
- **任务包边界**：B 是编译期职责、证据和关系输入，不是页面单位。旧 Media Plan 不进入 v6。
- **下游边界**：下游只接收 `..\player\episodes\episode-XX\inputs/` 三份正式文件，不读取任务包或 work trace。本 Skill 不定义坐标、模板、CSS、字号、组件或 renderer。

## Workflow

1. **提炼 Brief**：只读冻结任务包（`episodes/**/episode-XX-*-task-package.md`），生成 `narration-brief.json`。详见 `references/brief-contract.md`。
2. **隔离生成连续稿**：Stage 1 只接收 `narration-brief.json` 与 `templates/stage1-short-prompt.md`。不读取任务包、旧稿、原 B 表、冲突台账或长 Prompt。输出自然连续口播，不含 Nx、A 页面或分隔线。
3. **人工批准**：先核对内容义务与事实边界，再分别完成硬红线审读和常规口播质量审读。任一项不通过均保持 `待修改`；只有用户明确批准后，才生成唯一 `approved-spoken-text.txt`。批准前不得切 Nx 或生成 A 页面。
4. **A 页面编译**：按作者契约卡把批准连续稿编译为 A-page，并把任务包覆盖记录留在 work-only compile trace；原 B 与旧 Media Plan 都不进入正式 A 文档。详见 `templates/stage2-a-page-compiler.md` 与 `references/courseplay-a-page-v6.schema.json`。
5. **验收并正式发布**：按 [A-page v6 作者契约卡](references/a-page-v6-author-contract.md) 使用现有黑盒验证入口；只有 trace 无未解决项且报告通过，才可发布正式输入。随后可调用 `design-course-visual-rough` 形成 visual rough v4。

## 口播质量契约

- Brief 提炼时必须区分学习者内容义务、Agent 静默护栏和上游冲突；静默护栏约束写作，但不成为台词。
- 任务包中的来源、制作、审计或真实性外壳应先剥离；只有能够独立成立的领域内核才能进入 Brief，不能独立成立时必须上报冲突。
- Stage 1 不得输出情境真实性补丁、课程来源归属、制作或画面说明、审计免责声明和未来待办，也不得用同义改写保留这些内部话语。
- 人工批准前必须分别完成硬红线审读和常规口播质量审读。红线清理不能代替语言、专业关系、节奏和叙事检查；任一通道不通过，状态均为 `待修改`。

## A-page 作者入口

生产 Agent 只路由到以下三个公开资源：

- [作者契约卡](references/a-page-v6-author-contract.md)：输入/输出、字段、允许值、ID/引用、跨页规则、精确语法、normalizer 边界与错误处理。
- [canonical example](references/examples/a-page-v6/)：唯一合成成功样例，测试也直接读取它。
- [error index](references/error-catalog.json)：只在黑盒验证失败时按错误码局部读取。

`templates/courseplay-a-page-v6-template.json` 只是可复制的空白骨架；`references/workflow.md`、`references/acceptance-checklist.md` 和 `templates/stage2-a-page-compiler.md` 只说明流程与入口，不另行定义字段规则。不要读取 validator、parser 或 handoff 实现来推断契约。

## Stop Rules

- 冻结任务包只读；发现错漏时记录并上报，不修改。
- 未经用户明确批准，不创建批准母版、不进入 A 页面编译。
- 发生职责冲突、事实边界不清或 trace 有未解决项时，停止并请求决策。
- 不默认下发 subagent；只有用户明确授权或已启用 Skill 的强制验证流程要求时才允许。
- 新生产只生成 v6，不把 B 映射或静默护栏泄漏到正式 handoff。

## Verification

```bash
python -m unittest discover -s .agents/skills/rewrite-course-narration/tests -p "test_*.py" -v
python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py \
  --validation-profile a-page-v6 \
  --task-package episodes/<module>/episode-XX-...-task-package.md \
  --compile-trace ..\.tmp\narration-pipeline\<task>\episode-XX/episode-XX-b-to-a-compile-trace.json \
  --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt \
  --compiled-json ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json \
  --output ..\player\episodes\episode-XX\inputs/episode-XX-a-page-validation.json
```

## Common Pitfalls

口播阶段仍遵守批准与隔离流程；A-page 阶段只按作者契约卡和 canonical example 编写。验证失败时只按 error index 查码；未登记项报告工具缺陷，不通过阅读实现扩大公开规则。
