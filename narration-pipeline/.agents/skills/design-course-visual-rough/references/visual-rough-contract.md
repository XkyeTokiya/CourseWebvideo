# Visual rough v4 contract

当前唯一组合是 `courseplay-a-page/v6` + `courseplay-visual-rough/v4`。

每页保持固定字段，并包含三个结构段：`视觉内容单元`、`页面骨架`、`关系保真`。U 是视觉内容单元，不是 A-page 的语义分组：

```markdown
1. `U001 <- G001 + G002`
2. `U002 <- G003`
3. `U003 <- G001 + G003`
```

U 跨页连续编号。映射允许多 G 合并、单 G 拆到多个 U、同一 G 同时参与主体与结论。每个源 G 至少被覆盖一次，但 G 与 U 不要求同数、同序。配方计数只看 U；验证错误不得建议调整 A-page 的 G。

页面骨架每行必须是 `slot <- S/U/M/none`。G、R、E、C 不得直接绑定骨架。rough 不得复制任何 `guidance_text`，silent constraint 的 ID 和 instruction 均不得进入可见结构。

每个源 R 在关系保真中有且只有一个载体。媒体需求为 `none` 或 `Mxxx / photorealistic_ai|textbook_original`；M 全篇连续，图片页恰好 `ceil(A/3)`，AI 严格多数。教材原图引用合法 E，AI 图证据为 none。

相邻配方不同；十页以上至少四种配方。逻辑图只允许具体的 restricted recipe v2。注册表没有这类配方时，全篇逻辑图上限自动收紧为零。

错误统一使用 `code/path/expected/actual/message/hint/contractSection`，公开目录见 `error-catalog.json`。
