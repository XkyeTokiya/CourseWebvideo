# 《工业互联网标识解析应用技术》单集任务包进度

## 1. 文档定位

- 课程架构：[course-video-architecture.md](./course-video-architecture.md)
- 架构状态：`confirmed`
- 跟踪范围：51 个单集任务包
- 初始化日期：2026-07-19
- 当前完成口径：只有通过结构与语义验证的任务包才计为“已验证”。

本文件是进度台账，只回答“当前完成到哪里”。它不替代课程架构、教材、权威来源或单集任务包，也不作为事实证据。分集标题、来源范围、前置关系和相邻边界以课程架构为准；事实内容以实际检查的教材和权威来源为准。

## 2. 状态定义

| 状态 | 判定条件 |
|---|---|
| 未开始 | 尚未进入该集的证据准备 |
| 证据准备 | 正在盘点、读取和核验该集资料，尚未稳定边界 |
| 边界确定 | 主问题、包含/排除范围、相邻分集边界已经稳定 |
| 讲稿冻结 | 带稳定 ID 的连续讲稿已经冻结 |
| 分镜映射 | 语义级教学分镜已映射到讲稿 ID |
| 待验证 | 任务包内容已齐，正在进行结构与语义验证 |
| 已验证 | 验证通过，已记录文件路径和验证日期；计入完成数 |
| 阻塞 | 因证据缺失、来源冲突、授权环境缺失或其他明确原因无法继续 |

正常状态迁移：

```text
未开始 → 证据准备 → 边界确定 → 讲稿冻结 → 分镜映射 → 待验证 → 已验证
```

“阻塞”可从任一进行中状态进入。阻塞解除后，应回到进入阻塞前的状态，不得直接改为“已验证”。

## 3. 汇总

| 状态 | 集数 |
|---|---:|
| 未开始 | 0 |
| 证据准备 | 0 |
| 边界确定 | 0 |
| 讲稿冻结 | 0 |
| 分镜映射 | 0 |
| 待验证 | 0 |
| 已验证 | 51 |
| 阻塞 | 0 |

模块分布：模块一 13 集，模块二 7 集，模块三 12 集，模块四 10 集，模块五 9 集。

## 4. 分集进度

| 集号 | 标题 | 任务包状态 | 证据状态 | 动态核验 | 任务包文件 | 最后验证日期 | 阻塞/备注 |
|---:|---|---|---|---|---|---|---|
| 01 | 工业互联网为何产生：从单点信息化到人机物互联 | 已验证 | 完整 | 不适用 | [episode-01-industrial-internet-origins-task-package.md](../../episodes/module-1-system-cognition/episode-01-industrial-internet-origins-task-package.md) | 2026-07-28 | 1367.5 字符当量（5.70–6.22 分钟）、12 段 N001–N012 精确一次映射；模块首集冷启动自足；模块间解耦已人工核验 |
| 02 | 工业互联网如何形成数据闭环 | 已验证 | 完整 | 不适用 | [episode-02-industrial-internet-data-loop-task-package.md](../../episodes/module-1-system-cognition/episode-02-industrial-internet-data-loop-task-package.md) | 2026-07-28 | 1337.0 字符当量（5.57–6.08 分钟）、13 段 N001–N013 精确一次映射；教材图 1-2 重复标图缺口已受控；模块间解耦已人工核验 |
| 03 | 新型工业化为什么需要工业互联网 | 已验证 | 完整 | 已核验 | [episode-03-new-industrialization-industrial-internet-task-package.md](../../episodes/module-1-system-cognition/episode-03-new-industrialization-industrial-internet-task-package.md) | 2026-07-28 | 1429.0 字符当量（5.95–6.50 分钟）、13 段 N001–N013 精确一次映射；动态政策核验边界保持；模块间解耦已人工核验 |
| 04 | 数字化转型的“连接—数据—智能”链条 | 已验证 | 完整 | 待核验 | [episode-04-digital-transformation-chain-task-package.md](../../episodes/module-1-system-cognition/episode-04-digital-transformation-chain-task-package.md) | 2026-07-28 | 1454.5 字符当量（6.06–6.61 分钟）、14 段 N001–N014 精确一次映射；标准现行状态和企业参考架构版本未进入口播；模块间解耦已人工核验 |
| 05 | 工业互联网标识：为什么“私码”难以跨企业 | 已验证 | 完整 | 不适用 | [episode-05-industrial-internet-identifier-private-code-task-package.md](../../episodes/module-1-system-cognition/episode-05-industrial-internet-identifier-private-code-task-package.md) | 2026-07-28 | 1341.5 字符当量（5.59–6.10 分钟）、10 段 N001–N010 精确一次映射；编码、载体和解析边界已模块级化；模块间解耦已人工核验 |
| 06 | 标识解析体系如何把编码变成可查询信息 | 已验证 | 完整 | 待核验 | [episode-06-identifier-resolution-system-task-package.md](../../episodes/module-1-system-cognition/episode-06-identifier-resolution-system-task-package.md) | 2026-07-28 | 1439.0 字符当量（6.00–6.54 分钟）、14 段 N001–N014 精确一次映射；当前节点布局和规模未进入口播；模块间解耦已人工核验 |
| 07 | 我国标识解析从建设走向规模应用 | 已验证 | 完整 | 已核验 | [episode-07-china-identifier-scale-application-task-package.md](../../episodes/module-1-system-cognition/episode-07-china-identifier-scale-application-task-package.md) | 2026-07-28 | 1425.5 字符当量（5.94–6.48 分钟）、14 段 N001–N014 精确一次映射；政策目标与完成状态保持分离；模块间解耦已人工核验 |
| 08 | 标识解析怎样贯通对象、环节与产业链 | 已验证 | 完整 | 待核验 | [episode-08-identifier-resolution-connectivity-task-package.md](../../episodes/module-1-system-cognition/episode-08-identifier-resolution-connectivity-task-package.md) | 2026-07-28 | 1481.0 字符当量（6.17–6.73 分钟）、13 段 N001–N013 精确一次映射；接口与数据机制改为模块级边界；模块间解耦已人工核验 |
| 09 | 发动机全生命周期管理：把分散系统串成追溯链 | 已验证 | 完整 | 不适用 | [episode-09-engine-lifecycle-traceability-task-package.md](../../episodes/module-1-system-cognition/episode-09-engine-lifecycle-traceability-task-package.md) | 2026-07-28 | 1495.0 字符当量（6.23–6.80 分钟）、14 段 N001–N014 精确一次映射；教材案例成效数字保持案例归属；模块间解耦已人工核验 |
| 10 | 主动标识如何改变模具生产管控 | 已验证 | 完整 | 不适用 | [episode-10-active-identifier-mold-control-task-package.md](../../episodes/module-1-system-cognition/episode-10-active-identifier-mold-control-task-package.md) | 2026-07-28 | 1468.5 字符当量（6.12–6.67 分钟）、14 段 N001–N014 精确一次映射；主动载体技术边界已模块级化；模块间解耦已人工核验 |
| 11 | 药品供应链协同：从唯一标识到全链数据 | 已验证 | 完整 | 不适用 | [episode-11-pharmaceutical-supply-chain-collaboration-task-package.md](../../episodes/module-1-system-cognition/episode-11-pharmaceutical-supply-chain-collaboration-task-package.md) | 2026-07-28 | 1563.0 字符当量（6.51–7.10 分钟）、14 段 N001–N014 精确一次映射；图 1-12 敏感视觉边界保持；模块间解耦已人工核验 |
| 12 | 汽车零部件精益管理：一物一码如何减少错装与串货 | 已验证 | 完整 | 不适用 | [episode-12-automotive-parts-lean-management-task-package.md](../../episodes/module-1-system-cognition/episode-12-automotive-parts-lean-management-task-package.md) | 2026-07-28 | 1306.0 字符当量（5.44–5.94 分钟）、14 段 N001–N014 精确一次映射；预计成片 6.14–6.84 分钟；模块间解耦已人工核验 |
| 13 | 工业软件连接器：异构系统如何共享数据 | 已验证 | 完整 | 待核验 | [episode-13-industrial-software-connectors-task-package.md](../../episodes/module-1-system-cognition/episode-13-industrial-software-connectors-task-package.md) | 2026-07-28 | 1278.0 字符当量（5.33–5.81 分钟）、14 段 N001–N014 精确一次映射；预计成片 6.03–6.81 分钟，模块一内部闭合；模块间解耦已人工核验 |
| 14 | 好的标识编码必须满足哪些原则 | 已验证 | 完整 | 不适用 | [episode-14-identifier-coding-principles-task-package.md](../../episodes/module-2-identifier-coding/episode-14-identifier-coding-principles-task-package.md) | 2026-07-28 | 结构、1279.0 字符当量（5.33–5.81 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；五项编码原则及限定语保持教材边界；图片媒体生成提示词已写入任务包；模块间解耦已人工核验 |
| 15 | VAA 编码：从发码机构到企业内部编码 | 已验证 | 完整 | 待核验 | [episode-15-vaa-coding-from-issuer-to-enterprise-task-package.md](../../episodes/module-2-identifier-coding/episode-15-vaa-coding-from-issuer-to-enterprise-task-package.md) | 2026-07-28 | 结构、1394.5 字符当量（5.81–6.34 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；VAA 发码机构、导则和相关行业标准现行版本未核验，未作当前性断言；图片提示词及技术图 source-based redraw/synthesis 约束已写入任务包；模块间解耦已人工核验 |
| 16 | Handle 编码：前缀、后缀与分布式解析 | 已验证 | 完整 | 待核验 | [episode-16-handle-prefix-suffix-distributed-resolution-task-package.md](../../episodes/module-2-identifier-coding/episode-16-handle-prefix-suffix-distributed-resolution-task-package.md) | 2026-07-28 | 结构、1468.5 字符当量（6.12–6.67 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；DONA/MPA、中国 MPA 及 `86.` 前缀现行状态未核验，未作当前性断言；技术图限定 source-based redraw/synthesis，生成候选 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 17 | OID 编码：树状命名如何保证唯一性 | 已验证 | 完整 | 待核验 | [episode-17-oid-tree-naming-task-package.md](../../episodes/module-2-identifier-coding/episode-17-oid-tree-naming-task-package.md) | 2026-07-28 | 结构、1256.5 字符当量（5.24–5.71 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；OID 组织/分支管理信息未按现行版本核验，已限定为教材记载；图片提示词及技术图 source-based redraw/synthesis 约束已写入任务包；模块间解耦已人工核验 |
| 18 | Ecode 编码：版本、体系标识与主码 | 已验证 | 完整 | 待核验 | [episode-18-ecode-version-system-master-task-package.md](../../episodes/module-2-identifier-coding/episode-18-ecode-version-system-master-task-package.md) | 2026-07-28 | 结构、1383.0 字符当量（5.76–6.29 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；GB/T 31866-2015/2023 现行版本、NSI 分配及 MD 细则未核验，未作当前性断言；技术图限定 source-based redraw/synthesis，M001 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 19 | GS1 与五类编码体系怎么选 | 已验证 | 完整 | 待核验 | [episode-19-gs1-five-coding-systems-selection-task-package.md](../../episodes/module-2-identifier-coding/episode-19-gs1-five-coding-systems-selection-task-package.md) | 2026-07-28 | 结构、1446.5 字符当量（6.03–6.58 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；GS1 现行规则、授权关系与前缀分配未核验，未作当前性断言；技术图限定 source-based redraw/synthesis，M001/M006 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 20 | 从前缀到后缀：设计一套可落地的编码规则 | 已验证 | 完整 | 待核验 | [episode-20-prefix-suffix-coding-rule-design-task-package.md](../../episodes/module-2-identifier-coding/episode-20-prefix-suffix-coding-rule-design-task-package.md) | 2026-07-28 | 结构、1386.0 字符当量（5.78–6.30 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；教材标准现行性、字段细则和注册/接口未核验，未进入当前性口播主张；技术图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 21 | 工业大数据从哪里来、怎样产生价值 | 已验证 | 完整 | 不适用 | [episode-21-industrial-big-data-value-task-package.md](../../episodes/module-3-data-and-resolution/episode-21-industrial-big-data-value-task-package.md) | 2026-07-28 | 结构、1405.0 字符当量（5.85–6.39 分钟）、12 段 N001–N012 精确一次映射、证据覆盖与语义复核均通过；图 3-1 引用资产语义不匹配，已排除并以正文 source-based synthesis/redraw 约束处理链；M001 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 22 | 主数据、业务数据、元数据与数据字典的边界 | 已验证 | 完整 | 不适用 | [episode-22-industrial-data-concept-boundaries-task-package.md](../../episodes/module-3-data-and-resolution/episode-22-industrial-data-concept-boundaries-task-package.md) | 2026-07-28 | 结构、1473.5 字符当量（6.14–6.70 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；冲突温湿度例项和个人样式示例值已排除；技术图限定 source-based synthesis/redraw，M001–M003 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 23 | 工业数据共享如何跨越产线、工厂与产业链 | 已验证 | 完整 | 待核验 | [episode-23-industrial-data-sharing-levels-task-package.md](../../episodes/module-3-data-and-resolution/episode-23-industrial-data-sharing-levels-task-package.md) | 2026-07-28 | 结构、1354.0 字符当量（5.64–6.15 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；具体交换标准、版权/产权规则和管理办法版本未核验，未作当前性断言；技术图限定 source-based synthesis/redraw，M001–M003 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 24 | 数据要素为什么需要标识体系 | 已验证 | 完整 | 待核验 | [episode-24-data-elements-identifier-system-task-package.md](../../episodes/module-3-data-and-resolution/episode-24-data-elements-identifier-system-task-package.md) | 2026-07-28 | 结构、1272.0 字符当量（5.30–5.78 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；政策计划、当前制度、节点中间件、字段/接口未核验且未进入当前性口播主张；数据要素—标识关系图限定 source-based synthesis/redraw，M001–M002 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 25 | 标识数据模型：从数字对象到属性与事件 | 已验证 | 完整 | 待核验 | [episode-25-identifier-data-model-task-package.md](../../episodes/module-3-data-and-resolution/episode-25-identifier-data-model-task-package.md) | 2026-07-28 | 结构、1467.0 字符当量（6.11–6.67 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；标识数据模型白皮书版本未标注，未作当前版本主张；技术图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 26 | 二级节点 OpenAPI：一次请求包含什么 | 已验证 | 完整 | 待核验 | [episode-26-secondary-node-openapi-request-structure-task-package.md](../../episodes/module-3-data-and-resolution/episode-26-secondary-node-openapi-request-structure-task-package.md) | 2026-07-28 | 结构、1465.5 字符当量（6.11–6.66 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；接口版本、路径、字段、响应和 Token 时效未核验且未进入当前性主张；技术图限定 source-based redraw/synthesis，M001–M002 标记 illustrative；未启动下游制作；模块间解耦已人工核验；第 7 节历史映射错位已校正 |
| 27 | 用 Apifox 调试标识数据模板接口 | 已验证 | 完整 | 待核验 | [episode-27-apifox-template-interface-debug-task-package.md](../../episodes/module-3-data-and-resolution/episode-27-apifox-template-interface-debug-task-package.md) | 2026-07-28 | 结构、1326.5 字符当量（5.53–6.03 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；当前 Apifox 界面、接口路径、字段、响应、认证方式和 Token 时效未核验，未复用教材公网 IP、账号、Token 或截图；M001 标记 illustrative，M002–M008 限定 source-based redraw/synthesis；未启动下游制作；模块间解耦已人工核验 |
| 28 | 顶级节点与企业节点分别负责什么 | 已验证 | 完整 | 待核验 | [episode-28-top-level-and-enterprise-node-roles-task-package.md](../../episodes/module-3-data-and-resolution/episode-28-top-level-and-enterprise-node-roles-task-package.md) | 2026-07-28 | 结构、1389.0 字符当量（5.79–6.31 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；顶级节点数量/布局、企业系统组合、规范和接口版本未核验且未作 2026 现状断言；节点图限定 source-based redraw/synthesis，M001 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 29 | 二级节点为什么是承上启下的公共服务平台 | 已验证 | 完整 | 待核验 | [episode-29-secondary-node-public-service-platform-task-package.md](../../episodes/module-3-data-and-resolution/episode-29-secondary-node-public-service-platform-task-package.md) | 2026-07-28 | 结构、1445.5 字符当量（6.02–6.57 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；导则当前版本、组件数量/部署拓扑、接口协议、性能与安全指标待核验且未进入当前性口播主张；技术图限定 source-based redraw/synthesis，M001 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 30 | 三级业务管理系统如何完成前缀申请与注册 | 已验证 | 完整 | 待核验 | [episode-30-business-management-prefix-registration-task-package.md](../../episodes/module-3-data-and-resolution/episode-30-business-management-prefix-registration-task-package.md) | 2026-07-28 | 结构、1359.0 字符当量（5.66–6.18 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；当前申请入口、界面、字段、账号、系统承载与托管规则待核验且未进入当前性口播主张；技术图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 31 | 递归解析：一次查询怎样逐级找到企业数据 | 已验证 | 完整 | 待核验 | [episode-31-recursive-resolution-query-flow-task-package.md](../../episodes/module-3-data-and-resolution/episode-31-recursive-resolution-query-flow-task-package.md) | 2026-07-28 | 结构、1371.5 字符当量（5.71–6.23 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；协议版本、缓存细节和当前部署拓扑待核验且未作当前性断言；八步/缓存技术图限定 source-based redraw/synthesis，M001–M002 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 32 | 标识创新应用的端到端业务闭环 | 已验证 | 完整 | 不适用 | [episode-32-identifier-application-end-to-end-business-loop-task-package.md](../../episodes/module-3-data-and-resolution/episode-32-identifier-application-end-to-end-business-loop-task-package.md) | 2026-07-28 | 结构、1271.5 字符当量（5.30–5.78 分钟）、14 段 N001–N014 精确一次映射、证据覆盖与语义复核均通过；未引入协议、接口、字段或当前部署状态；闭环图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作；模块间解耦已人工核验 |
| 33 | 一维码与二维码：容量、识读和工业场景怎么取舍 | 已验证 | 完整 | 待核验 | [episode-33-one-dimensional-vs-qr-code-selection-task-package.md](../../episodes/module-4-identifier-carrier/episode-33-one-dimensional-vs-qr-code-selection-task-package.md) | 2026-07-28 | 结构、1468.5 字符当量（6.12–6.67 分钟）、14 段 N001–N014 精确一次映射、4.1.1 一维码/二维码教材证据与语义复核均通过；具体码制标准和性能参数待核验且未进入当前性口播主张；比较图限定 source-based synthesis/redraw，M001–M003 标记 illustrative，禁止可读/可扫描码承载真实数据或虚构参数；模块间解耦已人工核验，未启动下游制作 |
| 34 | RFID 如何实现非接触识别与批量读取 | 已验证 | 完整 | 不适用 | [episode-34-rfid-contactless-batch-reading-task-package.md](../../episodes/module-4-identifier-carrier/episode-34-rfid-contactless-batch-reading-task-package.md) | 2026-07-28 | 结构、1330.0 字符当量（5.54–6.05 分钟）、14 段 N001–N014 精确一次映射、4.1.1 RFID 正文与图 4-2 证据及语义复核均通过；4.1.2 仅用于选型相邻边界；频段、协议、距离、数量、速率、天线/设备内部结构未核验且未进入口播；RFID 读写机制/批量识别图限定 source-based synthesis/redraw，M001–M002 illustrative；模块间解耦已人工核验，未启动下游制作 |
| 35 | 标识载体选型：材质、工艺、环境与成本 | 已验证 | 完整 | 不适用 | [episode-35-identifier-carrier-selection-material-process-environment-cost-task-package.md](../../episodes/module-4-identifier-carrier/episode-35-identifier-carrier-selection-material-process-environment-cost-task-package.md) | 2026-07-28 | 结构、1483.0 字符当量（6.18–6.74 分钟）、14 段 N001–N014 精确一次映射、4.1.2 选型正文与 4.1.3 相邻设计边界、图 4-3 至图 4-6 证据及语义复核均通过；材质/工艺/环境/成本只保留教材定性关系，成本金额、工艺后可读率、材料牌号、设备兼容矩阵和环境阈值未核验且未进入口播；M001–M003 标记 illustrative，M004–M009 限定 source-based synthesis/redraw；模块间解耦已人工核验，未启动下游制作 |
| 36 | 标识载体设计：尺寸、位置、耐久与信息层级 | 已验证 | 完整 | 不适用 | [episode-36-identification-carrier-design-task-package.md](../../episodes/module-4-identifier-carrier/episode-36-identification-carrier-design-task-package.md) | 2026-07-28 | 结构、1365.0 字符当量（5.69–6.20 分钟）、14 段 N001–N014 精确一次映射、4.1.3 标识载体设计定义/附着物材质与位置/营销防伪与关键信息层级/图 4-7 圆形与长方形布局证据及语义复核均通过；教材未提供尺寸、位置坐标、材料牌号、耐久试验、环境等级、字段清单或软件版本，未进入口播；M001–M003 标记 illustrative，M004–M010 限定教材图或 source-based synthesis/redraw，禁止虚构标准数值和设备规格；模块间解耦已人工核验，未启动下游制作 |
| 37 | 主动标识载体与 UICC：为什么能主动、安全地联网 | 已验证 | 完整 | 待核验 | [episode-37-active-identifier-uicc-task-package.md](../../episodes/module-4-identifier-carrier/episode-37-active-identifier-uicc-task-package.md) | 2026-07-28 | 结构、1359.5 字符当量（5.66–6.18 分钟）、14 段 N001–N014 精确一次映射、4.2.1 主动标识载体定义/四项特征、图 4-17 与图 4-18 UICC 卡应用证据及语义复核均通过；教材定义版本、UICC 实现接口与安全细节待核验且未进入当前性口播主张；主动载体/UICC 架构图限定 source-based synthesis/redraw，M001 标记 illustrative；模块间解耦已人工核验，未启动下游制作 |
| 38 | 通信模组与工业互联网终端怎样承载工业 ID | 已验证 | 完整 | 待核验 | [episode-38-communication-modules-industrial-terminals-task-package.md](../../episodes/module-4-identifier-carrier/episode-38-communication-modules-industrial-terminals-task-package.md) | 2026-07-28 | 结构、1414.5 字符当量（5.89–6.43 分钟）、14 段 N001–N014 精确一次映射、4.2.1 通信模组与工业互联网终端正文第 59–138 行及图 4-19/4-20 语义证据均通过；教材图原始像素、通信制式/频段/协议、接口电气细节、芯片/厂商参数和当前部署状态待核验且未进入口播；M001–M003、M008 标记 illustrative，M004–M007、M009 限定 source-based synthesis/redraw；模块间解耦已人工核验，未启动下游制作 |
| 39 | 主动标识如何完成注册与数据上报 | 已验证 | 完整 | 不适用 | [episode-39-active-identifier-registration-reporting-task-package.md](../../episodes/module-4-identifier-carrier/episode-39-active-identifier-registration-reporting-task-package.md) | 2026-07-28 | 结构、1302.0 字符当量（5.42–5.92 分钟）、12 段 N001–N012 精确一次映射、4.2.2 主动标识注册/数据上报/查询解析证据与语义复核均通过；具体接口字段、协议、密钥、账号、部署拓扑和当前实现未进入口播；M001 标记 illustrative，M002–M008 限定 source-based synthesis/redraw；模块间解耦已人工核验，未启动下游制作 |
| 40 | 主动标识服务架构：终端、载体与平台如何协作 | 已验证 | 完整 | 待核验 | [episode-40-active-identifier-service-architecture-task-package.md](../../episodes/module-4-identifier-carrier/episode-40-active-identifier-service-architecture-task-package.md) | 2026-07-28 | 结构、1418.5 字符当量（5.91–6.45 分钟）、14 段 N001–N014 精确一次映射、4.2.3 服务架构证据与语义复核均通过；教材平台/协议版本未标注，未作当前部署断言；技术图限定 source-based redraw/synthesis，M001 标记 illustrative；模块间解耦已人工核验，未启动下游制作 |
| 41 | SM1 与 SM2 在主动标识安全中的不同角色 | 已验证 | 完整 | 不适用 | [episode-41-sm1-sm2-active-identifier-security-roles-task-package.md](../../episodes/module-4-identifier-carrier/episode-41-sm1-sm2-active-identifier-security-roles-task-package.md) | 2026-07-28 | 结构、1472.0 字符当量（6.13–6.69 分钟）、12 段 N001–N012 精确一次映射、4.2.3 SM1/SM2 角色证据与语义复核均通过；未扩展算法推导、密钥、接口或当前标准状态；M001 标记 illustrative，M002–M008 限定 source-based synthesis/redraw；模块间解耦已人工核验，未启动下游制作 |
| 42 | 主动标识适合哪些行业场景 | 已验证 | 完整 | 待核验 | [episode-42-active-identifier-industry-scenarios-task-package.md](../../episodes/module-4-identifier-carrier/episode-42-active-identifier-industry-scenarios-task-package.md) | 2026-07-28 | 结构、1465.0 字符当量（6.10–6.66 分钟）、14 段 N001–N014 精确一次映射、4.2.3 热力/燃气/装备制造/智能模具/数控机床五类行业场景证据与语义复核均通过；教材部署量与行动计划目标属于动态叙述，版本/当前性待核验且未进入口播或图表；M001/M005/M006 标记 illustrative，M002–M004/M007–M009 限定 source-based synthesis/redraw，禁止虚构部署量、政策目标、企业现状或安全性能数字；模块间解耦已人工核验，未启动下游制作 |
| 43 | 二级节点怎么建：牵头主体与部署模式 | 已验证 | 完整 | 待核验 | [episode-43-secondary-node-leadership-deployment-models-task-package.md](../../episodes/module-5-node-construction-operation/episode-43-secondary-node-leadership-deployment-models-task-package.md) | 2026-07-20 | 结构、1416.0 字符当量（5.90–6.44 分钟）、14 段 N001–N014 精确一次映射、5.1.1 建设主体与部署模式证据及语义复核均通过；教材引用 2021 年导则，当前适用性与审批/运行机构状态未核验且未进入口播；M001–M004 标记 illustrative，M005–M007 限定 source-based synthesis/redraw；未启动下游制作 |
| 44 | 二级节点建设的技术底线：数据、接口与性能 | 已验证 | 完整 | 待核验 | [episode-44-secondary-node-technical-baseline-task-package.md](../../episodes/module-5-node-construction-operation/episode-44-secondary-node-technical-baseline-task-package.md) | 2026-07-20 | 结构、1600.0 字符当量（6.67–7.27 分钟）、14 段 N001–N014 精确一次映射、5.1.1 数据管理/接口/性能/部署证据及语义复核均通过；教材引用《工业互联网标识解析二级节点建设导则（2021年）》，3倍峰值、1万QPS、2–3倍带宽冗余、99.99%可用性和协议要求的当前适用版本待核验，未作当前强制阈值断言；M001 标记 illustrative，M002–M009 限定 source-based synthesis/redraw，禁止虚构字段、协议版本、架构组件、标准版本或当前指标；未启动下游制作 |
| 45 | 二级节点如何持续运营：服务、人员与报告机制 | 已验证 | 完整 | 待核验 | [episode-45-secondary-node-operations-service-personnel-reporting-task-package.md](../../episodes/module-5-node-construction-operation/episode-45-secondary-node-operations-service-personnel-reporting-task-package.md) | 2026-07-20 | 结构、1349.5 字符当量（5.62–6.13 分钟）、14 段 N001–N014 精确一次映射、5.1.2 运营/服务/人员/报备教材证据与语义复核均通过；AII/CAICT 岗位文件、AII2022 建议版本、当前报备入口与制度适用性待核验，未作现行机构、SLA、报告模板、岗位数量或指标阈值断言；M001–M003 标记 illustrative，M004–M008 限定 source-based redraw/synthesis；未启动下游制作 |
| 46 | 二级节点安全保障的六个层面 | 已验证 | 完整 | 待核验 | [episode-46-secondary-node-security-six-layers-task-package.md](../../episodes/module-5-node-construction-operation/episode-46-secondary-node-security-six-layers-task-package.md) | 2026-07-20 | 结构、1608.0 字符当量（6.70–7.31 分钟）、14 段 N001–N014 精确一次映射、5.1.2 六层安全保障（基础设施、网络、应用、数据、安全管理、物理和环境）证据及语义复核均通过；教材引用《工业互联网标识解析二级节点建设导则（2021年）》，法规/等级保护/标准版本/主管部门检查口径未核验且未作当前合规断言；物理和环境层限定自建机房前提；M001/M002/M007 标记 illustrative，M003–M006/M008–M009 限定 source-based synthesis/redraw；未启动下游制作 |
| 47 | 企业节点的五项核心功能 | 已验证 | 完整 | 待核验 | [episode-47-enterprise-node-five-core-functions-task-package.md](../../episodes/module-5-node-construction-operation/episode-47-enterprise-node-five-core-functions-task-package.md) | 2026-07-20 | 结构、1534.5 字符当量（6.39–6.97 分钟）、14 段 N001–N014 精确一次映射、5.2.1 五项功能正文证据与语义复核均通过；运行监测相关标准编号/版本待核验且未作当前有效性断言；五项功能总图限定 source-based synthesis/redraw，M001 illustrative；未启动下游制作 |
| 48 | 企业节点数据如何同步与治理 | 已验证 | 完整 | 待核验 | [episode-48-enterprise-node-data-sync-governance-task-package.md](../../episodes/module-5-node-construction-operation/episode-48-enterprise-node-data-sync-governance-task-package.md) | 2026-07-20 | 结构、1535.5 字符当量（6.40–6.98 分钟）、14 段 N001–N014 精确一次映射、5.2.2 企业节点数据管理与六类同步教材证据及语义复核均通过；对接协议、技术要求、同步字段/频率/冲突规则/质量指标和当前产品能力未核验且未进入当前性口播主张；数据治理流程图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 49 | IDHub 企业节点产品架构 | 已验证 | 完整 | 待核验 | [episode-49-idhub-enterprise-node-product-architecture-task-package.md](../../episodes/module-5-node-construction-operation/episode-49-idhub-enterprise-node-product-architecture-task-package.md) | 2026-07-20 | 结构、1517.0 字符当量（6.32–6.90 分钟）、14 段 N001–N014 精确一次映射、5.2.3 IDHub 文字及图 5-1/5-2 原始像素证据与语义复核均通过；产品版本、授权状态、组件清单、接口、部署数量和当前能力未核验且未进入当前性口播主张；IDHub 架构图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 50 | 自建还是托管：企业节点建设模式怎么选 | 已验证 | 完整 | 待核验 | [episode-50-enterprise-node-build-mode-selection-task-package.md](../../episodes/module-5-node-construction-operation/episode-50-enterprise-node-build-mode-selection-task-package.md) | 2026-07-20 | 结构、1715.5 字符当量（7.15–7.80 分钟）、14 段 N001–N014 精确一次映射、5.2.3 自建/托管模式正文与图 5-3 证据及语义复核均通过；IDHub 当前版本、服务边界、审核规则、成本、SLA、合规结论和容量/性能阈值未核验且未进入当前性口播主张；自建/托管比较图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 51 | 企业前缀申请：从准备信息到完成校验 | 已验证 | 完整 | 待核验 | [episode-51-enterprise-prefix-application-preparation-validation-task-package.md](../../episodes/module-5-node-construction-operation/episode-51-enterprise-prefix-application-preparation-validation-task-package.md) | 2026-07-20 | 结构、1366.0 字符当量（5.69–6.21 分钟纯讲述；预计成片 6.19–7.11 分钟）、14 段 N001–N014 精确一次映射、5.2.3 企业前缀申请方式与任务实施步骤（1）–（2）、图 5-4–5-6 证据及语义复核均通过；当前入口、字段、账号、审核时限、接口和标准版本待核验且未进入口播或技术图；M001/M007 标记 illustrative，M002–M006 限定 source-based synthesis/redraw；未启动下游制作 |

## 5. 更新规则

1. 每次只启动一个明确集号的任务包；不得批量把多集同时标为进行中。
2. 开始读取该集证据时，将状态改为“证据准备”；不能仅因创建了空文件而改变状态。
3. 每次状态变更必须以任务包中已完成的前序阶段为依据，不得跳过状态机阶段。
4. 只有结构验证、讲稿时长、讲稿 ID 映射、证据覆盖和语义复核全部通过后，才可标为“已验证”。
5. 标为“已验证”时，必须同时填写任务包相对路径和最后验证日期。
6. 动态核验列使用“未检查 / 不适用 / 待核验 / 已核验 / 来源冲突”；“来源冲突”应同步将任务包状态设为“阻塞”。
7. 证据状态使用“未检查 / 准备中 / 完整 / 部分 / 缺失”；“部分”或“缺失”必须在备注中说明影响。
8. 修改课程架构中的集号或标题后，应先同步本表，再继续制作新的单集任务包。
9. 任务包验证失败时保持“待验证”或回退到对应阶段，不得保留“已验证”。
10. 本表不记录讲稿正文、分镜正文、接口密钥、Token、账号或其他敏感信息。

## 6. 变更记录

| 日期 | 变更 | 结果 |
|---|---|---|
| 2026-07-19 | 根据确认版课程架构初始化 51 集进度台账 | 51 集均为“未开始” |
| 2026-07-19 | 完成并验证第 01 集任务包 | 第 01 集改为“已验证”；50 集仍为“未开始” |
| 2026-07-19 | 完成并验证第 02 集任务包 | 第 02 集改为“已验证”；累计已验证 2 集，49 集仍为“未开始” |
| 2026-07-19 | 完成并验证第 04 集任务包 | 第 04 集改为“已验证”；累计已验证 3 集，48 集仍为“未开始” |
| 2026-07-19 | 完成并验证第 03 集任务包 | 第 03 集改为“已验证”；累计已验证 4 集，47 集仍为“未开始” |
| 2026-07-19 | 完成并验证第 05 集任务包 | 第 05 集改为“已验证”；累计已验证 5 集，46 集仍为“未开始” |
| 2026-07-19 | 完成并验证第 06 集任务包 | 第 06 集改为“已验证”；累计已验证 6 集，45 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 09 集任务包 | 第 09 集改为“已验证”；累计已验证 7 集，44 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 08 集任务包 | 第 08 集改为“已验证”；累计已验证 8 集，43 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 07 集任务包 | 第 07 集改为“已验证”；累计已验证 9 集，42 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 10 集任务包 | 第 10 集改为“已验证”；累计已验证 10 集，41 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 11 集任务包 | 第 11 集改为“已验证”；累计已验证 11 集，40 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 12 集任务包 | 第 12 集改为“已验证”；累计已验证 12 集，39 集仍为“未开始” |
| 2026-07-20 | 完成并验证第 14 集任务包 | 第 14 集改为“已验证”；累计已验证 13 集，38 集仍为“未开始”；动态核验不适用，五项编码原则和媒体提示词已登记 |
| 2026-07-20 | 完成并验证第 15 集任务包 | 第 15 集改为“已验证”；累计已验证 14 集，37 集仍为“未开始”；证据完整，动态核验待补充，VAA 现行授权/导则/标准版本未进入口播主张 |
| 2026-07-20 | 完成并验证第 13 集任务包 | 第 13 集改为“已验证”；累计已验证 15 集，36 集仍为“未开始”；证据完整，动态核验待补充，连接器能力、节点/规范和接口版本未进入当前性口播主张 |
| 2026-07-20 | 完成并验证第 17 集任务包 | 第 17 集改为“已验证”；OID 树状命名、根分支、教材示例路径和唯一性边界已覆盖；组织/分支管理现行状态待核验且未进入当前性口播主张；图片提示词及技术图 source-based redraw/synthesis 约束已登记 |
| 2026-07-20 | 完成并验证第 16 集任务包 | 第 16 集改为“已验证”；累计已验证 16 集，35 集仍为“未开始”；Handle 教材证据完整，DONA/MPA、中国 MPA 与 `86.` 前缀现行状态待核验，未启动下游制作 |
| 2026-07-20 | 完成并验证第 18 集任务包 | 第 18 集改为“已验证”；Ecode 的 V/NSI/MD 三段结构、教材标准时间线和图 2-6/表 2-1 示例边界已覆盖；GB/T 31866 现行版本、NSI 分配及 MD 细则待核验且未进入当前性口播主张；未启动下游制作 |
| 2026-07-20 | 完成并验证第 19 集任务包 | 第 19 集改为“已验证”；GS1/GTIN 教材定位、GTIN 三段示例、表 2-1 五体系场景矩阵和兼容选型边界已覆盖；GS1 现行规则、授权关系与前缀分配待核验且未进入当前性口播主张；技术图限定 source-based redraw/synthesis，M001/M006 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 20 集任务包 | 第 20 集改为“已验证”；2.2.1–2.2.2 前缀/后缀结构、字段责任、规则设计流程和教材图 2-8/2-9 示例边界已覆盖；教材标准现行性、行业字段细则、注册/接口待核验且未进入当前性口播主张；技术图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 21 集任务包 | 第 21 集改为“已验证”；工业大数据定义、三类来源、一般/工业特征、正文处理链与价值方向已覆盖；图 3-1 引用资产语义不匹配，未作流程证据；技术图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 22 集任务包 | 第 22 集改为“已验证”；主数据、业务数据、元数据与数据字典的四问边界已覆盖；教材口径冲突例项和个人样式示例值已排除；技术图限定 source-based synthesis/redraw，M001–M003 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 23 集任务包 | 第 23 集改为“已验证”；产线内、工厂内部、企业层级、产业链、跨行业五层共享范围，标准/管理双支柱及图 3-3 六步关系已覆盖；具体交换标准和制度版本待核验且未进入当前性口播主张；技术图限定 source-based synthesis/redraw，M001–M003 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 24 集任务包 | 第 24 集改为“已验证”；数据要素定义、数据形态与特性、对象身份/解析寻址、跨环节记录关联及治理边界已覆盖；政策计划、当前制度、节点中间件、字段/接口待核验且未进入当前性口播主张；数据要素—标识关系图限定 source-based synthesis/redraw，M001–M002 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 26 集任务包 | 第 26 集改为“已验证”；3.1.4 OpenAPI 的接口角色、HTTP 方法、UTF-8、认证头、请求/响应结构和参数边界已覆盖；接口版本、路径、字段、响应和 Token 时效待核验且未进入当前性口播主张；技术图限定 source-based redraw/synthesis，M001–M002 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 25 集任务包 | 第 25 集改为“已验证”；3.1.3 的 DO/IDO、标识编码/解析记录/对象数据三要素、属性/事件分类，以及任务实施的发动机属性和六项元数据定义维度已覆盖；标识数据模型白皮书版本未标注，未作当前版本主张；图 3-5/3-6 限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 27 集任务包 | 第 27 集改为“已验证”；3.1.4 Apifox 定位、授权环境、调试模式、Token 脱敏、请求头、schema 装配、响应核对和可审计证据链已覆盖；当前界面、接口路径、字段、响应、认证方式和 Token 时效待核验，未复用教材公网 IP、账号、Token 或截图；M001 标记 illustrative，M002–M008 限定 source-based redraw/synthesis；未启动下游制作 |
| 2026-07-20 | 完成并验证第 28 集任务包 | 第 28 集改为“已验证”；3.2.1 顶级节点与 3.2.3 企业节点的体系定位、对接关系、教材图 3-18/3-22 和职责边界已覆盖；顶级节点数量/城市/布局、企业系统组合、规范和接口版本待核验且未进入当前性口播主张；节点图限定 source-based redraw/synthesis，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 29 集任务包 | 第 29 集改为“已验证”；3.2.2 二级节点承上启下定位、公共服务平台、规范管理、行业型/综合型分类、管理/功能/应用/安全四体系、SNMS/IDIS 语义级关系和应用支撑已覆盖；《建设导则》当前版本、节点组件数量/部署拓扑、接口协议、性能与安全指标待核验且未进入当前性口播主张；技术图限定 source-based redraw/synthesis，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 30 集任务包 | 第 30 集改为“已验证”；3.2.4 BMS/SNMS/ENMS 上行/下行前缀申请、审核分配及托管/自建责任边界已覆盖；当前申请入口、界面、字段、账号、系统承载和托管规则待核验且未进入当前性口播主张；技术图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 31 集任务包 | 第 31 集改为“已验证”；3.2.5 八步递归查询、两次地址返回、企业应用数据回传及缓存作用已覆盖；协议版本、缓存 TTL/失效/一致性细节和当前部署拓扑待核验且未进入当前性口播主张；八步请求流与缓存关系图限定 source-based redraw/synthesis，M001–M002 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 34 集任务包 | 第 34 集改为“已验证”；4.1.1 RFID 非接触识别、标签/读写器/计算机系统三组件、双向读写、批量识别与风险边界已覆盖；4.1.2 仅登记为选型相邻边界；频段、协议、距离、数量、速率、天线/设备内部结构未核验且未进入口播；RFID 读写机制/批量识别图限定 source-based synthesis/redraw，M001–M002 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 32 集任务包 | 第 32 集改为“已验证”；3.2.6 编码→注册→请求→解析→返回五步闭环及标识编码/解析系统/标识数据三项基础要素已覆盖；动态核验不适用，未引入协议、接口、字段或当前部署状态；闭环图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 39 集任务包 | 第 39 集改为“已验证”；4.2.2 预置身份→首次认证→企业节点向二级节点申请注册→标识回写→再次认证→安全上报→解析查询闭环已覆盖；1421.0 字符当量、12 段 N001–N012 精确一次映射；CA、平台、中间件和协议当前实现未作现状断言；M001 标记 illustrative，M002–M008 限定 source-based redraw/synthesis；未启动下游制作 |
| 2026-07-20 | 完成并验证第 33 集任务包 | 第 33 集改为“已验证”；4.1.1 一维码/二维码的共同被动载体边界、结构方向、定性容量、逐件识读和生产/物料/质量/维护场景选择已覆盖；具体码制标准和性能参数待核验且未进入当前性口播主张；比较图限定 source-based synthesis/redraw，M001–M003 标记 illustrative，禁止可读/可扫描码承载真实数据或虚构参数；未启动下游制作 |
| 2026-07-20 | 完成并验证第 35 集任务包 | 第 35 集改为“已验证”；4.1.2 被动标识载体选型、材质/工艺/环境/成本约束、图 4-3 至图 4-6 变化与工艺后识读验证路径已覆盖；4.1.3 尺寸/位置/版式设计保留为第 36 集边界；成本金额、工艺后可读率、材料牌号、设备兼容矩阵和环境阈值未核验且未进入口播；M001–M003 illustrative，M004–M009 source-based synthesis/redraw；未启动下游制作 |
| 2026-07-20 | 完成并验证第 36 集任务包 | 第 36 集改为“已验证”；4.1.3 一体化设计、载体与附着物大小关系/布局/功能/美观、材质与张贴位置、营销防伪和关键信息层级、图 4-7 圆形与长方形布局示例已覆盖；尺寸、位置坐标、材料牌号、耐久试验、环境等级、字段清单和软件版本未由教材提供且未进入口播；M001–M003 illustrative，M004–M010 source-based synthesis/redraw 或教材图；未启动下游制作 |
| 2026-07-20 | 完成并验证第 37 集任务包 | 第 37 集改为“已验证”；4.2.1 主动标识载体定义、嵌入/联网/安全区域/工业环境四项特征、UICC 卡应用边界及图 4-17/4-18 证据已覆盖；教材定义版本、UICC 实现接口、芯片结构、频段、密码算法和部署量待核验且未进入当前性口播主张；主动载体/UICC 图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 38 集任务包 | 第 38 集改为“已验证”；4.2.1 通信模组与工业互联网终端的承载角色、模组三单元/终端五模块、工业 ID 锚定关系及图 4-19/4-20 语义证据已覆盖；通信制式、频段、协议、接口电气细节、芯片/厂商参数和当前部署状态待核验且未进入口播；技术图限定 source-based synthesis/redraw，生成候选标 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 40 集任务包 | 第 40 集改为“已验证”；4.2.3 主动标识服务架构的终端设备层、主动标识载体、安全认证服务、标识服务平台、业务云平台和国家顶级节点关系已覆盖；教材平台/协议版本未标注，未作当前部署断言；技术图限定 source-based redraw/synthesis，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 41 集任务包 | 第 41 集改为“已验证”；4.2.3 SM1/SM2 的数据保护与身份/会话协作角色已覆盖；1584.5 字符当量、12 段 N001–N012 精确一次映射；算法推导、密钥、接口、协议参数和当前标准状态未进入口播；M001 标记 illustrative，M002–M008 限定 source-based synthesis/redraw；未启动下游制作 |
| 2026-07-20 | 完成并验证第 42 集任务包 | 第 42 集改为“已验证”；4.2.3 热力、燃气、装备制造、智能模具、数控机床五类场景的对象—载体—应用动作比较已覆盖；1559.5 字符当量、14 段 N001–N014 精确一次映射；部署量与行动计划目标动态状态待核验且未进入口播/图表；M001/M005/M006 illustrative，M002–M004/M007–M009 source-based synthesis/redraw；未启动下游制作 |
| 2026-07-20 | 完成并验证第 43 集任务包 | 第 43 集改为“已验证”；5.1.1 建设主体（单企业牵头/多企业协作共建、独立法人责任）与部署模式（自建/委托）证据完整；1416.0 字符当量（5.90–6.44 分钟）、14 段 N001–N014 精确一次映射；2021 年导则当前适用性、审批/运行机构状态未核验且未作当前性断言；M001–M004 illustrative，M005–M007 source-based synthesis/redraw；未启动下游制作 |
| 2026-07-20 | 完成并验证第 44 集任务包 | 第 44 集改为“已验证”；5.1.1 数据管理、国家顶级/递归/企业/注册管理机构接口、性能典型指标、扩容与自建/委托部署证据完整；1600.0 字符当量（6.67–7.27 分钟）、14 段 N001–N014 精确一次映射；2021 年导则当前适用性和阈值/协议版本待核验且未作当前强制断言；M001 illustrative，M002–M009 source-based synthesis/redraw；未启动下游制作 |
| 2026-07-20 | 完成并验证第 45 集任务包 | 第 45 集改为“已验证”；5.1.2 运营、服务、人员与月度报备机制证据完整，动态状态待核验；未启动下游制作 |
| 2026-07-20 | 完成并验证第 46 集任务包 | 第 46 集改为“已验证”；5.1.2 六层安全保障证据完整，1608.0 字符当量（6.70–7.31 分钟）、14 段 N001–N014 精确一次映射；法规/等级保护/标准版本/主管部门检查口径待核验且未作当前合规断言；自建机房物理和环境层前提、source-based synthesis/redraw 与 illustrative 媒体约束已登记；未启动下游制作 |
| 2026-07-20 | 完成并验证第 47 集任务包 | 第 47 集改为“已验证”；5.2.1 标识注册、标识解析、业务管理、数据管理、运行监测五项功能及其关系证据完整；1534.5 字符当量（6.39–6.97 分钟）、14 段 N001–N014 精确一次映射；运行监测标准编号/版本待核验且未作当前有效性断言；M001 标记 illustrative，M002–M007 限定 source-based synthesis/redraw；未启动下游制作 |
| 2026-07-20 | 完成并验证第 48 集任务包 | 第 48 集改为“已验证”；5.2.2 标识注册管理、业务数据管理、元数据及元数据库、注册/统计/元数据/主数据/运行监测/业务数据六类同步证据完整；1535.5 字符当量（6.40–6.98 分钟）、14 段 N001–N014 精确一次映射；对接协议、技术要求、同步字段/频率/冲突规则/质量指标和当前产品能力未核验且未作当前性断言；数据治理流程图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 49 集任务包 | 第 49 集改为“已验证”；5.2.3 IDHub 社区版/标准版定位、IDLink 数据连接、标识内核和应用集成工具包三层架构证据完整；1517.0 字符当量（6.32–6.90 分钟）、14 段 N001–N014 精确一次映射；产品版本、授权状态、组件清单、接口、部署数量和当前能力未核验且未进入当前性口播主张；图 5-1/5-2 仅作原始证据核对，架构图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 50 集任务包 | 第 50 集改为“已验证”；5.2.3 自建/托管建设模式的资源前提、服务承载、申请/审核/部署动作与图 5-3 两条流程证据完整；1715.5 字符当量（7.15–7.80 分钟）、14 段 N001–N014 精确一次映射；IDHub 当前版本、服务边界、审核规则、成本、SLA、合规结论和容量/性能阈值未核验且未进入当前性口播主张；比较图限定 source-based synthesis/redraw，M001 标记 illustrative；未启动下游制作 |
| 2026-07-20 | 完成并验证第 51 集任务包 | 第 51 集改为“已验证”；5.2.3 企业前缀申请渠道、账号前置、单位/法人/联系人信息准备、自编码前缀一致性、提交与管理员审核证据完整；1366.0 字符当量（5.69–6.21 分钟纯讲述；预计成片 6.19–7.11 分钟）、14 段 N001–N014 精确一次映射；当前入口、字段、账号、审核时限、接口和标准版本待核验且未进入口播或技术图；申请准备/信息校验图限定 source-based synthesis/redraw，M001/M007 标记 illustrative；未启动下游制作 |
| 2026-07-21 | 完成第 13–51 集全部任务包并统一复核进度台账 | 51 集均为“已验证”；0 集未开始；每集任务包均通过结构、讲稿时长、N-ID 精确映射、证据覆盖与语义复核；图片媒体生成提示词已写入各任务包；未启动任何下游 slide、HTML、图片、音频、字幕或视频制作 |
| 2026-07-28 | 完成模块四第 33–42 集“模块间解耦”改造并重新导出口播派生物 | 10 集跨模块集号引用降为 0，模块内递进保持；第 33、37、38 集登记最小必要内联受控例外，第 42 集在模块四内部闭合且不预告其他模块；136 个 N 段均在 B 表中精确映射一次。仓库缺少任务包声明的三个同名验证器，未沿用或伪造 PASS，改用 `work/count_narration_equivalent.py` 复算并人工核验；修改前文件已备份至 `backups/module-4-decoupling-prechange-20260728/`；未启动下游媒体制作 |
| 2026-07-28 | 完成模块五第 43–51 集“模块间解耦”改造并重新导出口播派生物 | 9 集可改教学字段、讲稿、分镜和制作约束中的跨模块集号引用降为 0，模块内第 43→51 集递进保持；第 43、47、48、51 集登记不超过 3 句的最小必要内联受控例外，第 51 集在模块五与全课边界内闭合；126 个 N 段在 B 表和 7.1 映射中均精确一次。5 条 E001 来源定位按证据台账不可修改规则保留历史集号范围，仅作证据溯源、不构成学习依赖。仓库缺少任务包声明的三个同名验证器，未沿用或伪造 PASS，改用 `work/count_narration_equivalent.py` 复算并人工核验；修改前 19 个文件已备份至 `backups/module-5-decoupling-prechange-20260728/`；未启动下游媒体制作 |
| 2026-07-28 | 完成模块二第 14–20 集“模块间解耦”改造并重新导出口播派生物 | 7 集可改字段跨模块集号引用降为 0，第 14→20 集教学递进保持；第 14 集登记 1 句最小必要背景受控例外，第 20 集在模块二内闭合；98 个 N 段在 B 表中精确一次映射。历史验证器脚本在仓库中不存在，未沿用或伪造 PASS，改用 `work/count_narration_equivalent.py` 复算并人工核验；修改前文件纳入 `backups/module-2-3-decoupling-prechange-20260728/`；未启动下游媒体制作 |
| 2026-07-28 | 完成模块三第 21–32 集“模块间解耦”改造并重新导出口播派生物 | 12 集可改字段跨模块集号引用降为 0，第 21→32 集教学递进保持；第 21、25、28、32 集登记不超过 3 句的最小必要背景受控例外，第 32 集在模块三内闭合且不预告其他模块；166 个 N 段在 B 表中精确一次映射，第 26 集历史 B 表映射错位已与既有 7.1 声明同步。第 28、29 集排除范围与第 28、30、32 集 E001 历史来源定位按规则原样保留，仅作证据/边界记录；历史验证器脚本不存在，改用现有计数脚本与人工核验；修改前文件纳入同一备份目录；未启动下游媒体制作 |
| 2026-07-28 | 完成模块一第 01–13 集“模块间解耦”改造并重新导出口播派生物 | 13 集可改字段跨模块集号引用降为 0，第 01→13 集教学递进保持；模块一无需跨模块背景内联，第 01 集可冷启动，第 13 集在模块一内部闭合且不预告其他模块；173 个 N 段在 B 表和 7.1 中均精确一次。第 06、07、10 集各 1 条 E001 历史来源定位按证据台账不可修改规则保留跨模块集号，仅作证据溯源、不构成学习依赖。仓库缺少任务包声明的三个同名验证器，未沿用或伪造 PASS，改用 `work/count_narration_equivalent.py` 复算并人工核验；修复 `work/extract_narration.py` 对 `## 6.1` 的误截断后，13 个派生稿均与任务包完整第 6 节一致；修改前 28 个文件已备份至 `backups/module-1-decoupling-prechange-20260728/`；未启动下游媒体制作 |


