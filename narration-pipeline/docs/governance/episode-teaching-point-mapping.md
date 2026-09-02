# 计划.md 教学点 ↔ 51 集任务包 对应表

## 1. 文档定位

- 上游依据：[course-video-architecture.md](./course-video-architecture.md) 第 4 节“架构调整摘要”与第 5 节“全局分集责任映射”
- 状态依据：[course-video-progress.md](./course-video-progress.md) 第 4 节“分集进度”
- 教学点清单：[计划.md](./计划.md) 全文叶子条目
- 用途：按教学点定位应制作的集号，或按集号回溯其教材教学点归属。
- 边界：本表只做索引，不改变分集边界、来源范围或状态。分集标题与来源范围以课程架构为准；完成状态以进度台账为准；教学内容以教材和权威来源为准。

## 2. 对应关系汇总

- 教学点条目：56 条 = 计划.md 叶子条目 55 条 + 架构补录 1 条
- 对应集数：51 集，进度台账中全部为“已验证”
- 关系类型分布：
  - 一对一：35 条
  - 二合一：12 条
  - 一拆二：4 条
  - 四合一：4 条
  - 计划外补录：1 条

| 关系类型 | 含义 |
|---|---|
| 一对一 | 一个教学点对应一集 |
| 一拆二 | 一个教学点内容过载，拆成两集 |
| 二合一 / 四合一 | 多个教学点合并为一集，避免重复定义 |
| 计划外补录 | 计划.md 未列出，架构依据教材补回 |

## 3. 正向对应：教学点 → 集

### 模块一 工业互联网标识解析体系认知

#### 任务 1.1 工业互联网认知

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 1.1.1 | 工业互联网 | 第 01 集、第 02 集 | 工业互联网为何产生：从单点信息化到人机物互联<br>工业互联网如何形成数据闭环 | 一拆二 | E002：1.1.1“产生、理解”<br>E002：1.1.1“意义、体系构成、应用模式” | 原条目同时承担历史、定义、体系、现状与应用模式，按架构第 4 节拆为“产生与定义”和“体系与数据闭环” |
| 1.1.2 | 新型工业化 | 第 03 集 | 新型工业化为什么需要工业互联网 | 一对一 | E002：1.1.2 | — |
| 1.1.3 | 数字化转型 | 第 04 集 | 数字化转型的“连接—数据—智能”链条 | 一对一 | E002：1.1.3 | — |

#### 任务 1.2 标识解析认知

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 1.2.1 | 工业互联网标识解析体系 | 第 05 集、第 06 集 | 工业互联网标识：为什么“私码”难以跨企业<br>标识解析体系如何把编码变成可查询信息 | 一拆二 | E003：1.2.1“工业互联网标识”<br>E003：1.2.1“标识解析体系、层级” | 拆为“标识对象与唯一性”和“解析体系与层级”，避免一集同时讲标识与解析系统 |
| 1.2.2 | 工业互联网标识解析现状与政策 | 第 07 集 | 我国标识解析从建设走向规模应用 | 一对一 | E003：1.2.2 | 动态政策与稳定机制分离 |
| 1.2.3 | 工业互联网标识解析作用与意义 | 第 08 集 | 标识解析怎样贯通对象、环节与产业链 | 一对一 | E003：1.2.3 | — |

#### 任务 1.3 创新应用认知

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 1.3.1 | 发动机全生命周期管理 | 第 09 集 | 发动机全生命周期管理：把分散系统串成追溯链 | 一对一 | E004：1.3.1 | — |
| 1.3.2 | 基于主动标识的智能化生产管控 | 第 10 集 | 主动标识如何改变模具生产管控 | 一对一 | E004：1.3.2 | 主动载体完整机制归 37–40，本集只预告 |
| 1.3.3 | 基于标识解析的药品供应链协同 | 第 11 集 | 药品供应链协同：从唯一标识到全链数据 | 一对一 | E004：1.3.3 | — |
| 1.3.4 | 基于标识解析的产品精益化管理 | 第 12 集 | 汽车零部件精益管理：一物一码如何减少错装与串货 | 计划外补录 | E004：1.3.4 | 计划.md 漏列该教材条目，架构第 4 节据教材 1.3 补回；与 09 的边界是装配一致性与配件流转 |
| 1.3.5 | 基于工业软件连接器的异构数据共享 | 第 13 集 | 工业软件连接器：异构系统如何共享数据 | 一对一 | E004：1.3.5 | 不提前讲 OpenAPI 操作，归 26–27 |

### 模块二 标识编码

#### 任务 2.1 标识编码认知

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 2.1.1 | 标识编码体系认知 | 第 14 集 | 好的标识编码必须满足哪些原则 | 一对一 | E005：2.1.1 | 只讲五项编码原则，不介绍具体体系 |
| 2.1.2 | 标识编码类型 · VAA 编码 | 第 15 集 | VAA 编码：从发码机构到企业内部编码 | 一对一 | E005：2.1.2“VAA” | — |
| 2.1.2 | 标识编码类型 · Handle 编码 | 第 16 集 | Handle 编码：前缀、后缀与分布式解析 | 一对一 | E005：2.1.2“Handle” | — |
| 2.1.2 | 标识编码类型 · OID 编码 | 第 17 集 | OID 编码：树状命名如何保证唯一性 | 一对一 | E005：2.1.2“OID” | — |
| 2.1.2 | 标识编码类型 · Ecode 编码 | 第 18 集 | Ecode 编码：版本、体系标识与主码 | 一对一 | E005：2.1.2“Ecode” | — |
| 2.1.2 | 标识编码类型 · GS1 编码 | 第 19 集 | GS1 与五类编码体系怎么选 | 一对一 | E005：2.1.2“GS1、标准对比” | 第 19 集在 GS1 结构之外另行承担五类体系的选型对比，架构据此不再单设综述集 |

#### 任务 2.2 标识编码规则设计

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 2.2.1 | 标识编码构成 | 第 20 集 | 从前缀到后缀：设计一套可落地的编码规则 | 二合一 | E006：2.2.1–2.2.2 | 与 2.2.2 合并为一个完整设计问题 |
| 2.2.2 | 标识编码规范 | 第 20 集 | 从前缀到后缀：设计一套可落地的编码规则 | 二合一 | E006：2.2.1–2.2.2 | 同上 |

### 模块三 标识数据管理

#### 任务 3.1 标识数据建模

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 3.1.1 | 工业数据认知 · 工业大数据 | 第 21 集 | 工业大数据从哪里来、怎样产生价值 | 一对一 | E007：3.1.1“工业大数据” | — |
| 3.1.1 | 工业数据认知 · 工业主数据与主数据管理 | 第 22 集 | 主数据、业务数据、元数据与数据字典的边界 | 四合一 | E007：3.1.1 其余内容 | 架构第 4 节：四个条目反复定义同一批概念，合并为一集边界课 |
| 3.1.1 | 工业数据认知 · 元数据与元数据管理 | 第 22 集 | 主数据、业务数据、元数据与数据字典的边界 | 四合一 | E007：3.1.1 其余内容 | 同上 |
| 3.1.1 | 工业数据认知 · 概念区分：元数据、数据字典 | 第 22 集 | 主数据、业务数据、元数据与数据字典的边界 | 四合一 | E007：3.1.1 其余内容 | 同上 |
| 3.1.1 | 工业数据认知 · 概念区分：元数据、业务数据、主数据 | 第 22 集 | 主数据、业务数据、元数据与数据字典的边界 | 四合一 | E007：3.1.1 其余内容 | 同上 |
| 3.1.2 | 数据共享与数据要素 · 数据共享 | 第 23 集 | 工业数据共享如何跨越产线、工厂与产业链 | 一对一 | E007：3.1.2“数据共享” | — |
| 3.1.2 | 数据共享与数据要素 · 数据要素 | 第 24 集 | 数据要素为什么需要标识体系 | 二合一 | E007：3.1.2“数据要素、标识体系与数据要素” | 与“标识体系与数据要素”合并，避免两集重复讲价值释放 |
| 3.1.2 | 数据共享与数据要素 · 标识体系与数据要素 | 第 24 集 | 数据要素为什么需要标识体系 | 二合一 | E007：3.1.2“数据要素、标识体系与数据要素” | 同上 |
| 3.1.3 | 标识数据模型 | 第 25 集 | 标识数据模型：从数字对象到属性与事件 | 一对一 | E007：3.1.3；任务实施“属性、元数据定义” | 并入教材任务实施的属性与元数据定义 |
| 3.1.4 | 标识互操作工具集 · 二级节点 OpenAPI | 第 26 集 | 二级节点 OpenAPI：一次请求包含什么 | 一对一 | E007：3.1.4“OpenAPI” | 机制与实操拆开，见架构第 4 节 |
| 3.1.4 | 标识互操作工具集 · Apifox 简介 | 第 27 集 | 用 Apifox 调试标识数据模板接口 | 一对一 | E007：3.1.4“Apifox”；任务实施“接口方式” | 并入教材任务实施“接口方式”，只在授权测试环境演示 |

#### 任务 3.2 标识注册与解析

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 3.2.1 | 顶级节点 | 第 28 集 | 顶级节点与企业节点分别负责什么 | 二合一 | E008：3.2.1、3.2.3 | 与 3.2.3 合并，以端到端位置对照理解 |
| 3.2.2 | 二级节点 | 第 29 集 | 二级节点为什么是承上启下的公共服务平台 | 一对一 | E008：3.2.2 | 内容密度高，单独成集；建设运营留到 43–46 |
| 3.2.3 | 企业节点 | 第 28 集 | 顶级节点与企业节点分别负责什么 | 二合一 | E008：3.2.1、3.2.3 | 同 3.2.1；企业节点建设与运营另见 47–51 |
| 3.2.4 | 标识业务管理系统 | 第 30 集 | 三级业务管理系统如何完成前缀申请与注册 | 一对一 | E008：3.2.4 | BMS、SNMS、ENMS 交互组成一条完整流程 |
| 3.2.5 | 标识递归解析 | 第 31 集 | 递归解析：一次查询怎样逐级找到企业数据 | 一对一 | E008：3.2.5 | 八步请求流；注册流程不重复 |
| 3.2.6 | 标识业务流程 | 第 32 集 | 标识创新应用的端到端业务闭环 | 一对一 | E008：3.2.6 | 以编码→注册→请求→解析→返回收束模块 |

### 模块四 标识载体

#### 任务 4.1 被动标识载体

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 4.1.1 | 被动标识载体 · 条形码 | 第 33 集 | 一维码与二维码：容量、识读和工业场景怎么取舍 | 二合一 | E009：4.1.1“条形码、二维码” | 架构第 4 节：一维码与二维码必须对照理解，合并可减少重复定义 |
| 4.1.1 | 被动标识载体 · 二维码 | 第 33 集 | 一维码与二维码：容量、识读和工业场景怎么取舍 | 二合一 | E009：4.1.1“条形码、二维码” | 同上 |
| 4.1.1 | 被动标识载体 · 射频识别 | 第 34 集 | RFID 如何实现非接触识别与批量读取 | 一对一 | E009：4.1.1“射频识别” | 保留为独立机制集；不等同于主动标识载体 |
| 4.1.2 | 标识载体选型 | 第 35 集 | 标识载体选型：材质、工艺、环境与成本 | 一对一 | E009：4.1.2 | — |
| 4.1.3 | 标识载体设计 | 第 36 集 | 标识载体设计：尺寸、位置、耐久与信息层级 | 一对一 | E009：4.1.3 | — |

#### 任务 4.2 主动标识载体

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 4.2.1 | 主动标识载体（定义）· 通用集成电路卡 UICC | 第 37 集 | 主动标识载体与 UICC：为什么能主动、安全地联网 | 一对一 | E010：4.2.1“定义、UICC” | 4.2.1 的载体定义与首类载体组合成集，先建立主动/被动边界 |
| 4.2.1 | 主动标识载体 · 通信模组 | 第 38 集 | 通信模组与工业互联网终端怎样承载工业 ID | 二合一 | E010：4.2.1“通信模组、终端” | 与工业互联网终端硬件关系紧密，合并成集 |
| 4.2.1 | 主动标识载体 · 工业互联网终端 | 第 38 集 | 通信模组与工业互联网终端怎样承载工业 ID | 二合一 | E010：4.2.1“通信模组、终端” | 同上 |
| 4.2.2 | 主动标识注册流程 | 第 39 集 | 主动标识如何完成注册与数据上报 | 一对一 | E010：4.2.2 | 注册、认证、回写、上报与查询构成完整流程 |
| 4.2.3 | 主动标识载体服务架构（本体） | 第 40 集 | 主动标识服务架构：终端、载体与平台如何协作 | 一对一 | E010：4.2.3“服务架构” | 聚焦分层、通信、安全认证与业务云关系 |
| 4.2.3 | 服务架构 · 国密算法（1）SM1 加密算法 | 第 41 集 | SM1 与 SM2 在主动标识安全中的不同角色 | 二合一 | E010：4.2.3“国密算法” | 架构第 4 节：合并为“角色边界”比较集，只讲架构职责，不扩展为密码学课程 |
| 4.2.3 | 服务架构 · 国密算法（2）SM2 加密算法 | 第 41 集 | SM1 与 SM2 在主动标识安全中的不同角色 | 二合一 | E010：4.2.3“国密算法” | 同上 |
| 4.2.3 | 服务架构 · 主动标识行业应用 | 第 42 集 | 主动标识适合哪些行业场景 | 一对一 | E010：4.2.3“行业应用” | 以跨行业选择逻辑收束，不重复案例 10 |

### 模块五 标识解析体系运维

#### 任务 5.1 二级节点建设与运维

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 5.1.1 | 二级节点建设 | 第 43 集、第 44 集 | 二级节点怎么建：牵头主体与部署模式<br>二级节点建设的技术底线：数据、接口与性能 | 一拆二 | E011：5.1.1“建设模式、部署模式”<br>E011：5.1.1“数据、接口、性能” | 架构第 4 节：建设要求密集，拆为“牵头主体与部署模式”和“数据、接口与性能” |
| 5.1.2 | 二级节点运营 | 第 45 集、第 46 集 | 二级节点如何持续运营：服务、人员与报告机制<br>二级节点安全保障的六个层面 | 一拆二 | E011：5.1.2“运营、服务、人员”<br>E011：5.1.2“安全保障” | 拆为“服务、人员与报告机制”和“安全保障六层”，避免安全维度被压缩 |

#### 任务 5.2 企业节点建设与运维

| 教学点 | 教学点名称 | 集号 | 分集标题 | 关系 | 架构来源范围 | 说明 |
|---|---|---|---|---|---|---|
| 5.2.1 | 企业节点功能体系 | 第 47 集 | 企业节点的五项核心功能 | 一对一 | E012：5.2.1 | — |
| 5.2.2 | 企业节点数据管理 | 第 48 集 | 企业节点数据如何同步与治理 | 一对一 | E012：5.2.2 | 不重复第 22–25 集的数据概念定义 |
| 5.2.3 | 企业节点运营管理 · IDHub | 第 49 集 | IDHub 企业节点产品架构 | 一对一 | E012：5.2.3“IDHub” | 产品能力与通用企业节点概念分离 |
| 5.2.3 | 企业节点运营管理 · 企业节点建设模式 | 第 50 集 | 自建还是托管：企业节点建设模式怎么选 | 一对一 | E012：5.2.3“建设模式” | — |
| 5.2.3 | 企业节点运营管理 · 企业前缀申请方式 | 第 51 集 | 企业前缀申请：从准备信息到完成校验 | 一对一 | E012：5.2.3“企业前缀申请方式” | 课程以可验证接入入口收束 |

## 4. 反向索引：集 → 教学点

| 集号 | 分集标题 | 计划.md 教学点 | 所属任务 | 关系 | 主类型 | 动态核验 | 任务包 | 口播稿 |
|---:|---|---|---|---|---|---|---|---|
| 01 | 工业互联网为何产生：从单点信息化到人机物互联 | 1.1.1 工业互联网 | 任务 1.1 工业互联网认知 | 一拆二 | Concept boundary | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-01-industrial-internet-origins-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md) |
| 02 | 工业互联网如何形成数据闭环 | 1.1.1 工业互联网 | 任务 1.1 工业互联网认知 | 一拆二 | System mechanism | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-02-industrial-internet-data-loop-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-02-industrial-internet-data-loop-narration.md) |
| 03 | 新型工业化为什么需要工业互联网 | 1.1.2 新型工业化 | 任务 1.1 工业互联网认知 | 一对一 | Policy and development | 已核验 | [任务包](../../episodes/module-1-system-cognition/episode-03-new-industrialization-industrial-internet-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-03-new-industrialization-industrial-internet-narration.md) |
| 04 | 数字化转型的“连接—数据—智能”链条 | 1.1.3 数字化转型 | 任务 1.1 工业互联网认知 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-1-system-cognition/episode-04-digital-transformation-chain-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-04-digital-transformation-chain-narration.md) |
| 05 | 工业互联网标识：为什么“私码”难以跨企业 | 1.2.1 工业互联网标识解析体系 | 任务 1.2 标识解析认知 | 一拆二 | Concept boundary | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-05-industrial-internet-identifier-private-code-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-05-industrial-internet-identifier-private-code-narration.md) |
| 06 | 标识解析体系如何把编码变成可查询信息 | 1.2.1 工业互联网标识解析体系 | 任务 1.2 标识解析认知 | 一拆二 | System mechanism | 待核验 | [任务包](../../episodes/module-1-system-cognition/episode-06-identifier-resolution-system-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-06-identifier-resolution-system-narration.md) |
| 07 | 我国标识解析从建设走向规模应用 | 1.2.2 工业互联网标识解析现状与政策 | 任务 1.2 标识解析认知 | 一对一 | Policy and development | 已核验 | [任务包](../../episodes/module-1-system-cognition/episode-07-china-identifier-scale-application-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-07-china-identifier-scale-application-narration.md) |
| 08 | 标识解析怎样贯通对象、环节与产业链 | 1.2.3 工业互联网标识解析作用与意义 | 任务 1.2 标识解析认知 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-1-system-cognition/episode-08-identifier-resolution-connectivity-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-08-identifier-resolution-connectivity-narration.md) |
| 09 | 发动机全生命周期管理：把分散系统串成追溯链 | 1.3.1 发动机全生命周期管理 | 任务 1.3 创新应用认知 | 一对一 | Enterprise case | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-09-engine-lifecycle-traceability-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-09-engine-lifecycle-traceability-narration.md) |
| 10 | 主动标识如何改变模具生产管控 | 1.3.2 基于主动标识的智能化生产管控 | 任务 1.3 创新应用认知 | 一对一 | Enterprise case | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-10-active-identifier-mold-control-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-10-active-identifier-mold-control-narration.md) |
| 11 | 药品供应链协同：从唯一标识到全链数据 | 1.3.3 基于标识解析的药品供应链协同 | 任务 1.3 创新应用认知 | 一对一 | Enterprise case | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-11-pharmaceutical-supply-chain-collaboration-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-11-pharmaceutical-supply-chain-collaboration-narration.md) |
| 12 | 汽车零部件精益管理：一物一码如何减少错装与串货 | 1.3.4 基于标识解析的产品精益化管理 | 任务 1.3 创新应用认知 | 计划外补录 | Enterprise case | 不适用 | [任务包](../../episodes/module-1-system-cognition/episode-12-automotive-parts-lean-management-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-12-automotive-parts-lean-management-narration.md) |
| 13 | 工业软件连接器：异构系统如何共享数据 | 1.3.5 基于工业软件连接器的异构数据共享 | 任务 1.3 创新应用认知 | 一对一 | Enterprise case | 待核验 | [任务包](../../episodes/module-1-system-cognition/episode-13-industrial-software-connectors-task-package.md) | [口播稿](../../outputs/narration-scripts/module-1-system-cognition/episode-13-industrial-software-connectors-narration.md) |
| 14 | 好的标识编码必须满足哪些原则 | 2.1.1 标识编码体系认知 | 任务 2.1 标识编码认知 | 一对一 | Design explanation | 不适用 | [任务包](../../episodes/module-2-identifier-coding/episode-14-identifier-coding-principles-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-14-identifier-coding-principles-narration.md) |
| 15 | VAA 编码：从发码机构到企业内部编码 | 2.1.2 标识编码类型 · VAA 编码 | 任务 2.1 标识编码认知 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-2-identifier-coding/episode-15-vaa-coding-from-issuer-to-enterprise-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-15-vaa-coding-from-issuer-to-enterprise-narration.md) |
| 16 | Handle 编码：前缀、后缀与分布式解析 | 2.1.2 标识编码类型 · Handle 编码 | 任务 2.1 标识编码认知 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-2-identifier-coding/episode-16-handle-prefix-suffix-distributed-resolution-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-16-handle-prefix-suffix-distributed-resolution-narration.md) |
| 17 | OID 编码：树状命名如何保证唯一性 | 2.1.2 标识编码类型 · OID 编码 | 任务 2.1 标识编码认知 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-2-identifier-coding/episode-17-oid-tree-naming-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-17-oid-tree-naming-narration.md) |
| 18 | Ecode 编码：版本、体系标识与主码 | 2.1.2 标识编码类型 · Ecode 编码 | 任务 2.1 标识编码认知 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-2-identifier-coding/episode-18-ecode-version-system-master-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-18-ecode-version-system-master-narration.md) |
| 19 | GS1 与五类编码体系怎么选 | 2.1.2 标识编码类型 · GS1 编码 | 任务 2.1 标识编码认知 | 一对一 | Comparison and selection | 待核验 | [任务包](../../episodes/module-2-identifier-coding/episode-19-gs1-five-coding-systems-selection-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-19-gs1-five-coding-systems-selection-narration.md) |
| 20 | 从前缀到后缀：设计一套可落地的编码规则 | 2.2.1 标识编码构成；2.2.2 标识编码规范 | 任务 2.2 标识编码规则设计 | 二合一 | Design explanation | 待核验 | [任务包](../../episodes/module-2-identifier-coding/episode-20-prefix-suffix-coding-rule-design-task-package.md) | [口播稿](../../outputs/narration-scripts/module-2-identifier-coding/episode-20-prefix-suffix-coding-rule-design-narration.md) |
| 21 | 工业大数据从哪里来、怎样产生价值 | 3.1.1 工业数据认知 · 工业大数据 | 任务 3.1 标识数据建模 | 一对一 | System mechanism | 不适用 | [任务包](../../episodes/module-3-data-and-resolution/episode-21-industrial-big-data-value-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-21-industrial-big-data-value-narration.md) |
| 22 | 主数据、业务数据、元数据与数据字典的边界 | 3.1.1 工业数据认知 · 工业主数据与主数据管理；3.1.1 工业数据认知 · 元数据与元数据管理；3.1.1 工业数据认知 · 概念区分：元数据、数据字典；3.1.1 工业数据认知 · 概念区分：元数据、业务数据、主数据 | 任务 3.1 标识数据建模 | 四合一 | Concept boundary | 不适用 | [任务包](../../episodes/module-3-data-and-resolution/episode-22-industrial-data-concept-boundaries-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-22-industrial-data-concept-boundaries-narration.md) |
| 23 | 工业数据共享如何跨越产线、工厂与产业链 | 3.1.2 数据共享与数据要素 · 数据共享 | 任务 3.1 标识数据建模 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-23-industrial-data-sharing-levels-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-23-industrial-data-sharing-levels-narration.md) |
| 24 | 数据要素为什么需要标识体系 | 3.1.2 数据共享与数据要素 · 数据要素；3.1.2 数据共享与数据要素 · 标识体系与数据要素 | 任务 3.1 标识数据建模 | 二合一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-24-data-elements-identifier-system-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-24-data-elements-identifier-system-narration.md) |
| 25 | 标识数据模型：从数字对象到属性与事件 | 3.1.3 标识数据模型 | 任务 3.1 标识数据建模 | 一对一 | Design explanation | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-25-identifier-data-model-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-25-identifier-data-model-narration.md) |
| 26 | 二级节点 OpenAPI：一次请求包含什么 | 3.1.4 标识互操作工具集 · 二级节点 OpenAPI | 任务 3.1 标识数据建模 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-26-secondary-node-openapi-request-structure-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-26-secondary-node-openapi-request-structure-narration.md) |
| 27 | 用 Apifox 调试标识数据模板接口 | 3.1.4 标识互操作工具集 · Apifox 简介 | 任务 3.1 标识数据建模 | 一对一 | Operational demonstration | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-27-apifox-template-interface-debug-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-27-apifox-template-interface-debug-narration.md) |
| 28 | 顶级节点与企业节点分别负责什么 | 3.2.1 顶级节点；3.2.3 企业节点 | 任务 3.2 标识注册与解析 | 二合一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-28-top-level-and-enterprise-node-roles-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-28-top-level-and-enterprise-node-roles-narration.md) |
| 29 | 二级节点为什么是承上启下的公共服务平台 | 3.2.2 二级节点 | 任务 3.2 标识注册与解析 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-29-secondary-node-public-service-platform-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-29-secondary-node-public-service-platform-narration.md) |
| 30 | 三级业务管理系统如何完成前缀申请与注册 | 3.2.4 标识业务管理系统 | 任务 3.2 标识注册与解析 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-30-business-management-prefix-registration-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-30-business-management-prefix-registration-narration.md) |
| 31 | 递归解析：一次查询怎样逐级找到企业数据 | 3.2.5 标识递归解析 | 任务 3.2 标识注册与解析 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-3-data-and-resolution/episode-31-recursive-resolution-query-flow-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-31-recursive-resolution-query-flow-narration.md) |
| 32 | 标识创新应用的端到端业务闭环 | 3.2.6 标识业务流程 | 任务 3.2 标识注册与解析 | 一对一 | System mechanism | 不适用 | [任务包](../../episodes/module-3-data-and-resolution/episode-32-identifier-application-end-to-end-business-loop-task-package.md) | [口播稿](../../outputs/narration-scripts/module-3-data-and-resolution/episode-32-identifier-application-end-to-end-business-loop-narration.md) |
| 33 | 一维码与二维码：容量、识读和工业场景怎么取舍 | 4.1.1 被动标识载体 · 条形码；4.1.1 被动标识载体 · 二维码 | 任务 4.1 被动标识载体 | 二合一 | Comparison and selection | 待核验 | [任务包](../../episodes/module-4-identifier-carrier/episode-33-one-dimensional-vs-qr-code-selection-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-33-one-dimensional-vs-qr-code-selection-narration.md) |
| 34 | RFID 如何实现非接触识别与批量读取 | 4.1.1 被动标识载体 · 射频识别 | 任务 4.1 被动标识载体 | 一对一 | System mechanism | 不适用 | [任务包](../../episodes/module-4-identifier-carrier/episode-34-rfid-contactless-batch-reading-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-34-rfid-contactless-batch-reading-narration.md) |
| 35 | 标识载体选型：材质、工艺、环境与成本 | 4.1.2 标识载体选型 | 任务 4.1 被动标识载体 | 一对一 | Comparison and selection | 不适用 | [任务包](../../episodes/module-4-identifier-carrier/episode-35-identifier-carrier-selection-material-process-environment-cost-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-35-identifier-carrier-selection-material-process-environment-cost-narration.md) |
| 36 | 标识载体设计：尺寸、位置、耐久与信息层级 | 4.1.3 标识载体设计 | 任务 4.1 被动标识载体 | 一对一 | Design explanation | 不适用 | [任务包](../../episodes/module-4-identifier-carrier/episode-36-identification-carrier-design-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-36-identification-carrier-design-narration.md) |
| 37 | 主动标识载体与 UICC：为什么能主动、安全地联网 | 4.2.1 主动标识载体（定义）· 通用集成电路卡 UICC | 任务 4.2 主动标识载体 | 一对一 | Concept boundary | 待核验 | [任务包](../../episodes/module-4-identifier-carrier/episode-37-active-identifier-uicc-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-37-active-identifier-uicc-narration.md) |
| 38 | 通信模组与工业互联网终端怎样承载工业 ID | 4.2.1 主动标识载体 · 通信模组；4.2.1 主动标识载体 · 工业互联网终端 | 任务 4.2 主动标识载体 | 二合一 | System mechanism | 待核验 | [任务包](../../episodes/module-4-identifier-carrier/episode-38-communication-modules-industrial-terminals-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-38-communication-modules-industrial-terminals-narration.md) |
| 39 | 主动标识如何完成注册与数据上报 | 4.2.2 主动标识注册流程 | 任务 4.2 主动标识载体 | 一对一 | System mechanism | 不适用 | [任务包](../../episodes/module-4-identifier-carrier/episode-39-active-identifier-registration-reporting-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-39-active-identifier-registration-reporting-narration.md) |
| 40 | 主动标识服务架构：终端、载体与平台如何协作 | 4.2.3 主动标识载体服务架构（本体） | 任务 4.2 主动标识载体 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-4-identifier-carrier/episode-40-active-identifier-service-architecture-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-40-active-identifier-service-architecture-narration.md) |
| 41 | SM1 与 SM2 在主动标识安全中的不同角色 | 4.2.3 服务架构 · 国密算法（1）SM1 加密算法；4.2.3 服务架构 · 国密算法（2）SM2 加密算法 | 任务 4.2 主动标识载体 | 二合一 | Concept boundary | 不适用 | [任务包](../../episodes/module-4-identifier-carrier/episode-41-sm1-sm2-active-identifier-security-roles-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-41-sm1-sm2-active-identifier-security-roles-narration.md) |
| 42 | 主动标识适合哪些行业场景 | 4.2.3 服务架构 · 主动标识行业应用 | 任务 4.2 主动标识载体 | 一对一 | Comparison and selection | 待核验 | [任务包](../../episodes/module-4-identifier-carrier/episode-42-active-identifier-industry-scenarios-task-package.md) | [口播稿](../../outputs/narration-scripts/module-4-identifier-carrier/episode-42-active-identifier-industry-scenarios-narration.md) |
| 43 | 二级节点怎么建：牵头主体与部署模式 | 5.1.1 二级节点建设 | 任务 5.1 二级节点建设与运维 | 一拆二 | Construction and operations | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-43-secondary-node-leadership-deployment-models-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-43-secondary-node-leadership-deployment-models-narration.md) |
| 44 | 二级节点建设的技术底线：数据、接口与性能 | 5.1.1 二级节点建设 | 任务 5.1 二级节点建设与运维 | 一拆二 | Construction and operations | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-44-secondary-node-technical-baseline-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-44-secondary-node-technical-baseline-narration.md) |
| 45 | 二级节点如何持续运营：服务、人员与报告机制 | 5.1.2 二级节点运营 | 任务 5.1 二级节点建设与运维 | 一拆二 | Construction and operations | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-45-secondary-node-operations-service-personnel-reporting-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-45-secondary-node-operations-service-personnel-reporting-narration.md) |
| 46 | 二级节点安全保障的六个层面 | 5.1.2 二级节点运营 | 任务 5.1 二级节点建设与运维 | 一拆二 | Construction and operations | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-46-secondary-node-security-six-layers-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-46-secondary-node-security-six-layers-narration.md) |
| 47 | 企业节点的五项核心功能 | 5.2.1 企业节点功能体系 | 任务 5.2 企业节点建设与运维 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-47-enterprise-node-five-core-functions-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-47-enterprise-node-five-core-functions-narration.md) |
| 48 | 企业节点数据如何同步与治理 | 5.2.2 企业节点数据管理 | 任务 5.2 企业节点建设与运维 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-48-enterprise-node-data-sync-governance-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-48-enterprise-node-data-sync-governance-narration.md) |
| 49 | IDHub 企业节点产品架构 | 5.2.3 企业节点运营管理 · IDHub | 任务 5.2 企业节点建设与运维 | 一对一 | System mechanism | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-49-idhub-enterprise-node-product-architecture-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-49-idhub-enterprise-node-product-architecture-narration.md) |
| 50 | 自建还是托管：企业节点建设模式怎么选 | 5.2.3 企业节点运营管理 · 企业节点建设模式 | 任务 5.2 企业节点建设与运维 | 一对一 | Comparison and selection | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-50-enterprise-node-build-mode-selection-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-50-enterprise-node-build-mode-selection-narration.md) |
| 51 | 企业前缀申请：从准备信息到完成校验 | 5.2.3 企业节点运营管理 · 企业前缀申请方式 | 任务 5.2 企业节点建设与运维 | 一对一 | Operational demonstration | 待核验 | [任务包](../../episodes/module-5-node-construction-operation/episode-51-enterprise-prefix-application-preparation-validation-task-package.md) | [口播稿](../../outputs/narration-scripts/module-5-node-construction-operation/episode-51-enterprise-prefix-application-preparation-validation-narration.md) |

## 4.1 模块目录

任务包与口播稿均按模块分置于各自目录下的同名子目录。

| 模块 | 集号范围 | 集数 | `episodes/` 子目录 | `outputs/narration-scripts/` 子目录 |
|---|---|---:|---|---|
| 模块一 工业互联网标识解析体系认知 | 01–13 | 13 | `module-1-system-cognition/` | `module-1-system-cognition/` |
| 模块二 标识编码 | 14–20 | 7 | `module-2-identifier-coding/` | `module-2-identifier-coding/` |
| 模块三 标识数据管理与注册解析 | 21–32 | 12 | `module-3-data-and-resolution/` | `module-3-data-and-resolution/` |
| 模块四 标识载体 | 33–42 | 10 | `module-4-identifier-carrier/` | `module-4-identifier-carrier/` |
| 模块五 标识解析体系建设与运营 | 43–51 | 9 | `module-5-node-construction-operation/` | `module-5-node-construction-operation/` |

## 5. 需要注意的偏差

1. **计划.md 漏列 1.3.4**。教材 1.3 含“基于标识解析的产品精益化管理”，计划.md 目录从 1.3.3 直接跳到 1.3.5。课程架构第 4 节已补回，对应第 12 集《汽车零部件精益管理：一物一码如何减少错装与串货》。以计划.md 为唯一目录会漏掉这一集。
2. **教学点与集不是等粒度**。计划.md 的 1.1.1、1.2.1、5.1.1、5.1.2 四条内容过载，各拆为两集；而 3.1.1 的四个概念条目、2.2.1–2.2.2、3.2.1 与 3.2.3、4.1.1 的条形码与二维码、4.2.1 的通信模组与终端、4.2.3 的 SM1 与 SM2 分别合并成集。按教学点数排课时会与实际集数不符。
3. **第 19 集承担额外职责**。除 GS1 编码本体外，它还负责五类编码体系的横向选型对比；该对比在计划.md 中没有独立条目，架构据此不另设综述集。
4. **两集含教材“任务实施”内容**。第 25 集并入 3.1 任务实施的属性与元数据定义，第 27 集并入 3.1 任务实施的接口方式；这两部分在计划.md 的知识点目录中不出现。
5. **动态核验尚未完成的集不能直接开工**。反向索引中标记“待核验”的 33 集，须按架构第 7 节门槛完成联网核验后再进入 PPT 制作；标记“已核验”“不适用”的集不受此限。
