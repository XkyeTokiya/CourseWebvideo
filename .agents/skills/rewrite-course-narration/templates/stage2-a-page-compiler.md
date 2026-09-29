# Stage 2 — A-page v6 编译提示

本文件是可复制的流程提示，不重复作者契约。编译前读取：

1. [A-page v6 作者契约卡](../references/a-page-v6-author-contract.md)；
2. [canonical example](../references/examples/a-page-v6/)；
3. 已批准连续口播、Brief，以及冻结任务包中编译期需要的职责/证据/关系。

编译目标是一个 A 对应一页的 `courseplay-a-page/v6` JSON 和 work-only trace。不要改写批准口播，不把 B/旧 Media Plan/视觉字段放进正式 JSON。视觉粗设、媒体、recipe 和布局由后续阶段负责。

写完后调用现有黑盒验证入口；失败只按 [error index](../references/error-catalog.json) 查码。契约卡、canonical example 和错误索引没有覆盖的失败，报告为工具缺陷，不读取 validator/parser/handoff 实现。
