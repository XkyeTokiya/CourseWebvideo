# Courseplay handoff v4

handoff 是 script/outline 之后、章节制作之前的条件式派生缓存，不是默认步骤或强制门禁。只有明确请求、已证实上下文超预算、接收方不能安全读取正式输入的跨边界交接，或诊断测试时才生成；否则记录 `handoff=skipped`。生产作者的触发记录、固定输入、Markdown 语法、输出职责和 normalizer 边界统一见 [handoff v4 作者契约卡](courseplay-handoff-v4-author-contract.md)；合成成功样例见 [canonical example](examples/courseplay-handoff-v4/)。

公开工具只接受 `courseplay-a-page/v6` + `courseplay-visual-rough/v4`。它实际检查 script beat 与 outline step，以及当前页的引用、关系载体和素材清单；不读取或验证 `narrations.ts`，不声称三者相等。`narrations.ts` 由既有提取/运行时流程负责。

失败使用 `code/path/expected/actual/message/hint/contractSection`，错误目录是 [handoff-v4-error-catalog.json](handoff-v4-error-catalog.json)。未登记异常统一作为工具缺陷返回；不读取工具实现猜规则。
