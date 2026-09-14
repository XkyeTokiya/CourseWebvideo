# Player 图片主题与教学语义审计

核查范围：`player/episodes/` 下 51 个实例。  
核查口径：正式 `inputs`、`outline.md`、章节源码和 `src` 素材；源码中的 inline SVG、卡片和 CSS 示意不计为正式图片。  
状态说明：`正式` = 已有可用非占位图片；`占位` = 已有图片槽位或占位图，但正式素材未提供；`缺失` = 已声明图片需求但没有素材。

## 总结

- 已建立下游图片规格的实例：`episode-01`～`episode-10`、`episode-35`、`episode-36`，共 12 个。
- 图片需求共 50 张：正式 10 张、占位 21 张、缺失 19 张。
- 因此仍需正式补齐或替换的图片共 40 张。
- 当前已有正式非占位图片的实例是 `episode-01`（3 张）、`episode-04`（1 张）、`episode-05`（1 张）、`episode-06`（1 张）和 `episode-09`（4 张）；`episode-01` 仍有 1 个 `textbook_original` 槽位未就位。
- 判定口径补充：`photorealistic_ai` 项以“是否已有可供成片的实景 AI 图”为准；`textbook_original` 项必须有教材原图及其来源标记，任何重绘、近似替身或 AI 复刻都计为 `占位`，即使文件已入 `assets/` 且在屏上可见。
- `episode-11`～`episode-34`、`episode-37`～`episode-51` 在 player 下尚未建立实例级图片规格；其中 `episode-18`～`episode-34` 的上游任务包另有 130 条媒体规划，但尚未下发到 player。

## episode-01

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A002 / `anchor-2012` | 2012 年前后的工业现场 | `photorealistic_ai` | 正式 | 将概念锚点落到工业时代语境，不承担历史证据。 |
| M002 | A003 / `engine-data-path` | 航空发动机运行与维护 | `photorealistic_ai` | 正式 | 具体化“采集数据—分析—预测性维护”的工程协作过程。 |
| M003 | A007 / `two-paths-meet` | 教材图 1-1“工业互联网的产生” | `textbook_original` | 占位 | 说明互联网向产业延伸与工业数智化在 2012 年前后汇合。 |
| M004 | A011 / `enter-the-process` | 工业协同工作现场 | `photorealistic_ai` | 正式 | 收束到人、机器、数据进入真实工业过程并服务行动。 |

> 就位说明：M001 / M002 / M004 已由用户提供实景 AI 图并入章节 `assets/`；按项目负责人要求，屏上图注已删除“AI 生成示意图”类声明，各章只保留场景描述行。
> M003 槽位当前为一张“互联网发展演进时间轴”参考示意图，**不是教材图 1-1 原图**，屏上保留“待替换为教材图 1-1 原图”一行与 `data-pending="true"` 标记，仍待替换为教材原图。
>
> M003 处置结论：**保留现有标注式占位**，不改为 `episode-09` 的无图注做法。三条依据：
>
> 1. `episode-01/outline.md` 第 358 行 `素材清单` 对 M003 的硬约束是“教材图 1-1 完整原图（`textbook_original`，必须为教材原图；**不得用 AI 图、描摹或重绘图冒充**）”。槽内现图是一张独立的“互联网发展演进时间轴”参考示意图，不是教材图 1-1 的描摹或重绘，因此不构成“冒充”；而**恰好是那两行图注在结构性阻断“冒充”**——去掉图注（改为 `episode-09/03-fragmented-records` 的无图注做法）会把一张非教材图放进教材图槽位且不做任何说明，直接触碰 outline 的禁止项。
> 2. `data-pending="true"` 是可检索的替换标记，现与图注中“待替换为教材图 1-1 原图”一行成对；替换教材原图时一并删除，对应关系已写在 `TwoPathsMeet.tsx` 注释与 `TwoPathsMeet.css` 中。
> 3. 屏上明示占位身份有既定先例（`episode-03` 6 章的 `制造现场 · 占位图`），本条属既有约定的严格一侧，不需要向 `episode-09` 的弱侧对齐。仓库内 `占位图/` 素材库与教材图 1-1 原图当前均不存在，替换条件确实未具备。
>
> `outline.md` 的 `素材清单` 仍保持 `待提供 / placeholder` 且本次未改动（该段由 runner 管理，含 `GLOBAL-CONTENT` 标记）。

## episode-02

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `open-loop-line` | 已联网但仍靠人工处理异常的产线 | `photorealistic_ai` | 缺失 | 建立“信息已上传、行动未返回”的开环问题。 |
| M002 | A004 / `platform-common-space` | 制造现场与跨岗位协同环境 | `photorealistic_ai` | 缺失 | 体现平台汇聚资源、组织数据能力并支撑协同。 |
| M003 | A011 / `upward-flow-open-loop` | 被集中观察但尚未改变的工业现场 | `photorealistic_ai` | 缺失 | 说明上行信息停在观察层，尚未形成闭环。 |
| M004 | A014 / `five-business-directions` | 柔性制造与跨环节协同现场 | `photorealistic_ai` | 缺失 | 把数据闭环落到五类业务方向。 |
| M005 | A015 / `closing-loop-summary` | 获得判断与反馈后的生产现场 | `photorealistic_ai` | 缺失 | 对照开篇，说明双向流接通后才可能持续优化。 |

## episode-03

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `more-tools-not-stronger` | 新增设备与信息系统的制造现场 | `photorealistic_ai` | 占位 | 区分工具数量增加与整体运行能力提升。 |
| M002 | A003 / `2002-mutual-promotion` | 2002 年工业生产历史语境 | `photorealistic_ai` | 占位 | 辅助理解信息化与工业化相互促进的历史起点。 |
| M003 | A008 / `connection-shared-awareness` | 人、机器、产品共同工作的现场 | `photorealistic_ai` | 占位 | 具体化工业要素连接与共同感知。 |
| M004 | A011 / `collaboration-within-authority` | 多主体围绕生产安排协作 | `photorealistic_ai` | 占位 | 说明跨主体协同必须受权限和责任边界约束。 |
| M005 | A013 / `shared-view-action` | 现场共同观察与行动 | `photorealistic_ai` | 占位 | 将共同视图落到共同判断和协同行动。 |
| M006 | A016 / `direction-support-recap` | 现代工业整体运行现场 | `photorealistic_ai` | 占位 | 收束连接、贯通、复用和协同是关键支撑，但不等同于新型工业化。 |

## episode-04

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `problem-scene` | 无品牌工厂设想现场 | `photorealistic_ai` | 占位 | 建立技术已部署但仍有人工搬运和信息等待的问题。 |
| M002 | A005 / `judgment-to-action` | 无品牌生产现场 | `photorealistic_ai` | 占位 | 体现数据形成判断并进入业务行动。 |
| M003 | A007 / `shared-carrier` | 教材图 1-3 共同承载架构 | `textbook_original` | 正式 | 说明装备、边缘、平台、软件等进入共同承载路径。 |

## episode-05

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `receiving-breakpoint` | 收货人员扫码核验包装标签 | `photorealistic_ai` | 占位 | 表现扫码成功但对象身份未跨企业到达。 |
| M002 | A005 / `digital-identity` | 产品、装备和制造设备共存的车间 | `photorealistic_ai` | 占位 | 具体化物理对象与数字身份的映射。 |
| M003 | A007 / `identity-across-stages` | 教材图 1-4 身份映射 | `textbook_original` | 正式 | 说明同一对象跨研发、生产、物流、销售等环节保持同一身份。 |
| M004 | A010 / `loopback-summary` | 完成核验后的收货区 | `photorealistic_ai` | 占位 | 回扣开场，收束私码与跨主体身份锚点的区别。 |

## episode-06

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `scan-and-questions` | 收货质检与扫码终端 | `photorealistic_ai` | 缺失 | 建立“身份已确认，信息查询才开始”的问题。 |
| M002 | A002 / `identity-key` | 被确认零部件特写 | `photorealistic_ai` | 缺失 | 说明编码是稳定身份键，信息挂载其下而非写入编码。 |
| M003 | A004 / `dns-analogy-limits` | 教材 DNS 类比图 1-5 | `textbook_original` | 正式 | 建立标识到解析映射的直觉并划清类比边界。 |
| M004 | A012 / `from-code-to-info` | 收货现场延续镜头 | `photorealistic_ai` | 缺失 | 将编码、查询、分层节点和结果重新落回业务现场。 |

## episode-07

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `site-question` | 产线扫码但业务尚未跟进 | `photorealistic_ai` | 缺失 | 说明解析可用不等于业务贯通。 |
| M002 | A006 / `scale-layers` | 生产与物流协同现场 | `photorealistic_ai` | 缺失 | 锚定业务流程、产业链主体、持续价值三层递进。 |
| M003 | A007 / `wrap-check` | 回扣开篇工业现场 | `photorealistic_ai` | 缺失 | 收束从建设能力到业务应用和持续服务。 |

## episode-08

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `onsite-question` | 设备检查、核验和检修现场 | `photorealistic_ai` | 缺失 | 表现对象已被认出，但异常仍无法直接定位。 |
| M002 | A004 / `anchor-not-container` | 设备本体与标识区域特写 | `photorealistic_ai` | 缺失 | 强调标识是对象锚点，不是数据容器。 |
| M003 | A007 / `industry-actors` | 跨主体实物交接与核验 | `photorealistic_ai` | 缺失 | 具体化各主体维护本地系统、围绕共同身份对齐。 |
| M004 | A009 / `return-onsite` | 回到同一对象的检修现场 | `photorealistic_ai` | 缺失 | 将对象、环节记录和主体查询三层机制接回实际工作。 |

## episode-09

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `after-scan` | 发动机售后服务现场 | `photorealistic_ai` | 正式 | 建立“认出发动机但无法自动接出完整追溯记录”的动机。 |
| M002 | A003 / `fragmented-records` | ERP、MES、WMS 分段记录的教材图 | `textbook_original` | 正式 | 直观看到记录分段、规范不一和共同线索缺失。 |
| M003 | A007 / `feedback-with-identity` | 发动机售后查询与反馈现场 | `photorealistic_ai` | 正式 | 表现身份随反馈回查装配、工艺、质量和物流记录。 |
| M004 | A010 / `reconnect-same-object` | 发动机售后业务回扣现场 | `photorealistic_ai` | 正式 | 收束系统分工、统一标识串联对象及后续治理要求。 |

> 就位说明：M001 / M003 / M004 是实景 AI 图（GPT-Image-2 生成、16:9 实拍质感），符合 `photorealistic_ai` 规格，计为 `正式`。
> M002 已替换为用户提供的教材图 1-8 原图（`34322-20260419032728-38w9098.png`），并按原比例完整呈现在 `assets/m002.png`；不再按重绘替身或占位计数。
>
> 待清理的标注缺陷（不影响上面状态判定，供后续成片前修）：
> 1. `01-after-scan`、`07-feedback-with-identity` 的屏上图注写作 `M001 · 售后服务现场（占位图）` 这类文案，把素材编号 M-ID 与“占位图”字样一并带上屏；但 M001 / M003 / M004 已是 `正式` 素材，该文案与素材状态不一致。

## episode-10

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `a001-offsite-context` | 外协模具交接现场 | `photorealistic_ai` | 缺失 | 锚定模具离厂后位置、模次、维护和合规状态不可见的问题。 |
| M002 | A004 / `a004-active-id-positioning` | 注塑机与模具生产现场 | `photorealistic_ai` | 缺失 | 说明主动标识让模具主动报告状态，而非增加被动扫描。 |
| M003 | A007 / `a007-condition-monitoring` | 模具维护与传感器采集现场 | `photorealistic_ai` | 缺失 | 体现异常状态采集、系统打通和安全考虑。 |
| M004 | A010 / `a010-full-circle` | 回到外协模具现场 | `photorealistic_ai` | 缺失 | 收束从分散记录到可追踪、可反馈、可管理的双向管控。 |

## episode-35

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `process-question` | 汽车零部件表面处理工位 | `photorealistic_ai` | 占位 | 让学习者理解“刚做好的码能读”不等于“工艺后仍能读”，选型必须围绕识读持续性展开。 |
| M002 | A003 / `object-constraint` | 曲面齿形金属零部件及可接近的读码表面 | `photorealistic_ai` | 占位 | 让学习者先观察曲率、材质、可用面积和设备视野，理解对象本身先决定载体能否成立。 |
| M003 | A004 / `process-rewrites-code` | 教材图 4-4：工艺前后码面状态对比 | `textbook_original` | 占位 | 让学习者看到工艺前后颜色、粗糙度、纹理、反光或涂层变化可能改变可读性。 |
| M004 | A006 / `damage-branch` | 油污、磨损、划伤作用下的识别载体特写 | `photorealistic_ai` | 占位 | 让学习者理解污染与损伤是逐步累积的读码风险，修复后仍需现场验证。 |

## episode-36

| M | 页面 / 章节 | 图片主题 | 类型 | 状态 | 教学语义 |
|---|---|---|---|---|---|
| M001 | A001 / `a001-opening-limited-space` | 工业设计台、零件和一小块可用附着区域 | `photorealistic_ai` | 占位 | 让学习者看到“做大装不上、做小看不清”的矛盾，理解载体必须和附着物一起设计。 |
| M002 | A005 / `a005-material-position` | 平面、弧面、包装边缘等不同附着形态 | `photorealistic_ai` | 占位 | 让学习者比较不同表面的接触条件，理解材质和张贴位置应随附着物共同决定。 |
| M003 | A007 / `a007-info-hierarchy` | 版式评审现场，人员比较标识布局 | `photorealistic_ai` | 占位 | 让学习者把“突出”理解为阅读顺序和信息层级，而不是把所有文字放大。 |
| M004 | A008 / `a008-round-rect-layouts` | 教材图 4-7：圆形与长方形版式 | `textbook_original` | 占位 | 说明两种版式都是汽车行业示例，服务营销和防伪，不代表优劣或通用尺寸答案。 |
| M005 | A011 / `a011-use-environment` | 可能被遮挡、靠近操作面的实际附着位置 | `photorealistic_ai` | 占位 | 让学习者把设计判断放回使用和维护现场，检查标签是否可见并与操作面相容。 |

## 尚未建立 player 图片规格的实例

以下实例当前均为 `planned`，没有 `inputs`、visual rough、章节源码或 player 图片素材：

- `episode-11`～`episode-34`
- `episode-37`～`episode-51`

其中 `episode-18`～`episode-34` 的 `narration-pipeline` 上游任务包有 130 条媒体规划，但这些是上游规划文本，不是 player 已下发的图片，也不计入上面的 50 张实例级图片需求。

## 占位素材的屏上标注约定

以下保留此前对占位素材屏上标注的约定基线；本轮已将 `episode-04/07`、`episode-05/07`、`episode-06/04`、`episode-09/03` 的教材原图槽位替换为正式原图，不再计入占位素材。

| 做法 | 实例 | 章数 | 说明 |
|---|---|---|---|
| 图注明示占位 | `episode-03` 全部 6 章（`制造现场 · 占位图`、`工业生产实景 · 占位图` 等） | 6 | 占位身份上屏，且图注**不带** M-ID |
| 图注明示占位 + 带 M-ID | `episode-09/01-after-scan`、`episode-09/07-feedback-with-identity` | 2 | `M001 · 售后服务现场（占位图）` 式文案，M-ID 上屏 |
| 图注只描述场景、不提占位 | `episode-04/05-judgment-to-action`（`判断与行动，落回这片现场`） | 1 | 占位身份只存在于 alt，屏上不提示 |
| 完全不渲染图注 | `episode-04` 01 / 07、`episode-05` 全部 3 章、`episode-09` 03 / 10 | 7 | 屏上无任何占位说明，只靠 alt 兜底 |

由此确定两条约定：

1. **占位身份可以上屏，且已有先例**（`episode-03` 的“制造现场 · 占位图”）。因此 `episode-01/07-two-paths-meet` 屏上保留“待替换为教材图 1-1 原图”属于既有约定的严格一侧，无需回退到“屏上不提示”。
2. **M-ID 不上屏**。`episode-09` 的 `M001 · 售后服务现场（占位图）` 式文案只此一家，不视为约定；`episode-01` 全部 4 张图的图注均不含 M-ID，保持现状。

因此 `episode-01` 的 4 张图接线**严格于** `episode-09`，不需要向 `episode-09` 对齐；`episode-09` 的标注缺陷已在上节记录，待其自身清理。

`episode-01` 4 张图的屏上图注现状（全部不含 M-ID，全部渲染 `<figcaption>`；“AI 生成示意图”与“非教材原图”类声明已按项目负责人要求删除）：

| 章节 | 屏上图注 |
|---|---|
| `02-anchor-2012` | 2012 年前后的工业现场 |
| `03-engine-data-path` | 航空发动机运行与维护 |
| `07-two-paths-meet` | 待替换为教材图 1-1 原图 |
| `11-enter-the-process` | 工业协同工作现场 |

`07-two-paths-meet` 保留的 `待替换为教材图 1-1 原图` 与 `data-pending="true"` 成对，替换教材原图时一并删除（该对应关系已写在 `TwoPathsMeet.tsx` 注释与 `TwoPathsMeet.css` 中）。

删除备查（原值）：`02-anchor-2012` 次行 `AI 生成示意图 · 非真实企业现场`、`03-engine-data-path` 次行 `AI 生成示意图 · 无真实品牌与可读参数`、`07-two-paths-meet` 首行 `参考示意图 · 非教材原图`、`11-enter-the-process` 次行 `AI 生成示意图 · 非真实企业现场`。各章图注均由两行收为一行；`<img>` 的 `alt` 属性不上屏，未作改动。
