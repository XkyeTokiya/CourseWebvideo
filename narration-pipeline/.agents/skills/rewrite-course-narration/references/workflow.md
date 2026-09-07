# rewrite-course-narration 流程

本文件只说明阶段顺序。A-page 字段、ID、引用、timing、normalizer 和 trace 规则统一见 [A-page v6 作者契约卡](a-page-v6-author-contract.md)；完整合成输入见 [canonical example](examples/a-page-v6/)。

```text
冻结任务包 → Brief → 隔离连续稿 → 用户批准 → A-page v6 + work trace
          → 黑盒验收 → 发布正式 inputs → 可选 visual rough v4
```

## 1. Brief

只读冻结任务包，产出 `.tmp/narration-pipeline/<task>/episode-XX/narration-brief.json`。把学习者内容、静默护栏和上游冲突分开；任务包、旧稿和停用流程不作为 Stage 1 输入。

## 2. 隔离连续稿

Stage 1 只接收 Brief 和短 Prompt，输出没有 Nx/B/step 分隔的连续稿。不得把制作说明、审计声明或未来待办写成学习者台词。

## 3. 用户批准

批准前不生成 `approved-spoken-text.txt`，不切 Nx，不生成 A-page。批准后规范化换行和边缘空白，内部口播文本保持不变。

## 4. A-page 编译

按页面认知任务切分已批准口播，产出 A-page v6；任务包只在编译期参与覆盖 trace。视觉、媒体、配方和布局留给 visual rough。作者具体填写方式只看契约卡，不读实现。

## 5. 验收与发布

用现有 A-page 黑盒验证入口检查正式 JSON 与 work trace；通过后发布批准稿、A-page 和验证报告到 `player/episodes/<episode-id>/inputs/`。trace 留在 `.tmp`。失败按 [A-page error index](error-catalog.json) 查码，未登记项报告工具缺陷。

## 6. 下游路由

需要视觉结构时，进入 `design-course-visual-rough`，读取其作者契约卡、canonical example、当前 recipe 和失败时的 error index。需要章节上下文压缩时，handoff v4 是可选工具，读取 [handoff v4 作者契约卡](../../../player/docs/courseplay-handoff-v4-author-contract.md)。不调用 handoff 不改变章节制作输入要求。
