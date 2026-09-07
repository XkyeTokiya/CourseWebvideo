# Courseplay handoff v4

公开工具 `pnpm courseplay:handoff` 只接受 `courseplay-a-page/v6` 与 `courseplay-visual-rough/v4`。它不会搜索候选文件或兼容旧版本。

`presentation` 固定输出 `recipe_id`、`content_units`、`slot_bindings`、`media` 和 `relation_carriers`。其中 U 是 visual rough 定义的独立视觉内容单元；下游不得把 G 数量解释为配方或 step 数。

运行时保持 `script beat = outline step = narrations.ts step`。错误使用 `code/path/expected/actual/message/hint/contractSection`，公开目录见 `handoff-v4-error-catalog.json`。生产 Agent 依赖本 contract 与诊断，不读取工具实现推断规则。
