# Video Outline

<!-- GLOBAL:metadata:BEGIN -->
> **编译状态**：awaiting-checkpoint-plan
> **主题**：active-identification-note（主动标识工程笔记；Checkpoint Plan 已确认）
> **正文时长**：约 7 分 24 秒
> **章节**：10
> **Base scenes**：10
> **Accent frames**：0
> **Custom scene candidates**：0
> **Narration beats**：47
<!-- GLOBAL:metadata:END -->

## 整集视觉调度

<!-- GLOBAL:schedule:BEGIN -->
| A-page | Base scene | Recipe | Steps | Duration |
|---|---|---|---:|---:|
| A001 | S-A001 — 总装工位核对情境台：场景图与标题为底，核对锚区与风险行持续可读 | time-anchor-opening | 5 | ~54s |
| A002 | S-A004 — 记录层与局限层的上下分带：两条系统带等权，局限带在下方补齐，takeaway 收束 | layered-bands-with-side-notes | 5 | ~52s |
| A003 | S-A010 — 供应端失真归因卡组：三组卡片按流转次序推进，混乱类型并置，收拢到结论行 | parallel-cards-with-takeaway | 6 | ~57s |
| A004 | S-A017 — 教材原图读图台：关系原图持续在场，阅读顺序与要点注记在固定区域推进 | image-with-reading-notes | 5 | ~52s |
| A005 | S-A021 — 采集到结果线性步骤轨道：采集槽、两道校验槽、结果槽按序推进，轨道整体持续 | linear-steps-to-result | 5 | ~49s |
| A006 | S-A027 — 档案带与回查侧注的上下层级：档案带承载零部件与整车的对应，侧注承载回查路径 | layered-bands-with-side-notes | 3 | ~25s |
| A007 | S-A030 — 粒度与流转双卡加语境图：两张问题卡等权并置，配件语境图持续在场，takeaway 收束 | issue-cards-with-image | 3 | ~28s |
| A008 | S-A034 — 维修现场读图加摘要栏：维修语境图持续在场，核对与记录摘要栏逐栏累积，再延伸到追溯要点并收束 | image-with-summary-rail | 7 | ~60s |
| A009 | S-A041 — 证据卡与来源边界带：四张结果卡等权累积，适用范围标注与数字同屏，边界带收束 | evidence-cards-with-provenance-boundary | 4 | ~26s |
| A010 | S-A048 — 不变锚点与阶段职责对照：总装工位情境回访开场，四阶段链与各系统职责在固定区对照，收束到连续性判断 | lifecycle-identity-continuity | 4 | ~41s |
<!-- GLOBAL:schedule:END -->

## 0. cover — 封面（1 silent step · fixed 15s）

<!-- CHAPTER:A001:BEGIN tx=6d8d08ec97bc355d -->
## 1. opening-check — 开场情境页（5 steps · ~54s）

**A-page / Chapter**：`A001`
**基础场景**：`S-A001` — 总装工位核对情境台：场景图与标题为底，核对锚区与风险行持续可读
**页面配方**：`time-anchor-opening`
**核心判断**：错装、漏装和串货源于零部件身份在环节之间对不上，全集要解决的是身份跨环节不断线
**结构指纹**：`headline | time-anchor | context-line | scene-image`
**语义关系**：两项核对前提汇聚为跨环节主问题
**关系机制**：`premise-to-question` — 核对前提与风险在固定区域持续存在，视觉重心由现场情境逐步转移到主问题句
**持续元素**：headline（S001）、总装工位场景图（M001）、核对锚区（U001）、风险行（U002）
**内容槽位**：`headline` 承载 S001 论点标题；`time-anchor` 承载 U001 两项核对关系；`context-line` 承载 U002 三类风险；`scene-image` 承载 M001 总装工位情境
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 情境：总装工位上两件外观几乎一样的零部件同时送到同一工位 —— S001 · E010
- 核对关系：是不是当前订单要的零件、该不该装到眼前这辆车 —— S002 · G001
- 风险集合：错装、漏装、串货 —— S003 · G002
- 因果关系：核对失败引发三类风险 —— R001
- 护栏：保持通用匿名情境，不指向可识别企业、真实订单或事故记录（C001，不上屏，仅作构图边界）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 视频标题与开场导入 | `S-A001 · opening-established` (~7s) | 建立 headline 与总装工位场景图（M001），保持通用匿名情境 |
| 2 | 两件外观相近的零部件到场 | `S-A001 · parts-at-station` (~8s) | 保持 headline 与场景图，场景焦点推近到两件并排待核对的零部件 |
| 3 | 订单与车辆两项核对 | `S-A001 · checks-paired` (~15s) | 在 time-anchor 区并排建立两项核对关系（U001），前提就位 |
| 4 | 核对失败引发三类风险 | `S-A001 · risks-visible` (~9s) | context-line 区出现错装、漏装、串货（U002），R001 的因果指向成立；核对区保持 |
| 5 | 跨环节主问题 | `S-A001 · question-dominant` (~15s) | 核对与风险保持，视觉重心转移到主问题句，收束到“身份始终不断线” |
<!-- CHAPTER:A001:END -->

<!-- CHAPTER:A002:BEGIN tx=7bef6fed8d2e7beb -->
## 2. existing-systems — 既有系统页（5 steps · ~52s）

**A-page / Chapter**：`A002`
**基础场景**：`S-A004` — 记录层与局限层的上下分带：两条系统带等权，局限带在下方补齐，takeaway 收束
**页面配方**：`layered-bands-with-side-notes`
**核心判断**：系统有记录不等于单件身份连续
**结构指纹**：`headline | ordered-bands | ordered-bands | takeaway`
**语义关系**：既有系统提供采集记录，局限导致身份链断裂
**关系机制**：`records-to-gap` — 记录带先立、局限带承接（R002），局限带指向结论行（R003），骨架保持上下分带
**持续元素**：headline（S004）、两条系统带（U003）、局限带（U004）、takeaway（U005）
**内容槽位**：`headline` 承载 S004 论点标题；`ordered-bands` 上带承载 U003 的 QTS 与 MES 职责，下带承载 U004 的采集局限与质量码损毁；`takeaway` 承载 U005 判断（S009 方向）
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 系统 1：质量追踪系统（Quality Tracking System，QTS），追踪质量相关信息 —— S005 · G003
- 系统 2：制造执行系统（MES），管生产执行环节信息 —— S006 · G003
- 局限：采集不够及时、不够准确；质量码经仓储、运输、装卸可能磨花、脱落 —— S007 · S008 · G004
- 结论：有记录不等于身份链连续 —— S009 · G005
- 关系：记录层提供采集记录（R002），局限导致身份链断点（R003）
- 护栏：不展开既有系统的完整功能、接口与内部架构（C003，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 先看工厂里原本有什么 | `S-A004 · workshop-context` (~4s) | 建立 headline 与上下分带骨架，记录带为空槽待补 |
| 2 | QTS 职责 | `S-A004 · qts-band-in` (~14s) | 记录带出现第一条 QTS 职责带（U003），headline 保持 |
| 3 | MES 职责 | `S-A004 · systems-equal` (~7s) | MES 带补齐（U003），两条带等权共存，不产生选中项 |
| 4 | 采集局限与质量码损毁 | `S-A004 · limits-visible` (~15s) | 下带补齐采集及时性与准确率局限、质量码磨花脱落（U004）；R002“提供采集记录”的承接成立 |
| 5 | 身份链会断 | `S-A004 · chain-break-takeaway` (~12s) | takeaway 行出现（U005），R003 承接成立；两条带保持，收束为判断 |
<!-- CHAPTER:A002:END -->

<!-- CHAPTER:A003:BEGIN tx=6cad81a0210bc98b -->
## 3. supply-side-drift — 断裂归因页（6 steps · ~57s）

**A-page / Chapter**：`A003`
**基础场景**：`S-A010` — 供应端失真归因卡组：三组卡片按流转次序推进，混乱类型并置，收拢到结论行
**页面配方**：`parallel-cards-with-takeaway`
**核心判断**：缺少稳定唯一的身份锚点是串货与难追溯的根源
**结构指纹**：`headline | parallel-cards | parallel-cards | parallel-cards | takeaway`
**语义关系**：供应端失真经流转递进、叠加为两类混乱，共同指向根因
**关系机制**：`supply-side-accumulation` — 卡组按“私有标识→流转失真→混乱类型”次序累积（R004、R005），最后收拢到结论行（R006），卡片完成后保持等权不轮播
**持续元素**：headline（S010）、三组归因卡（U006、U007、U008）、takeaway（U009）
**内容槽位**：`headline` 承载 S010 论点标题；`parallel-cards` 依次承载 U006 私有标识、U007 覆盖丢失与采集出错、U008 一物多码与一码多物；`takeaway` 承载 U009 身份锚点结论
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 私有标识：各家供应商用自己的一套标识 —— S011 · G006
- 流转失真：标识被覆盖、弄丢、损毁到读不出来；入厂采集出错 —— S012 · S013 · G007
- 混乱类型：一物多码（同一对象记录难以合并）、一码多物（对象边界混乱） —— S014 · S015 · G008
- 根因：缺少稳定、唯一、可跨环节关联的身份锚点 —— S016 · G009
- 关系：经物流链失真（R004）、叠加恶化（R005）、共同指向根因（R006）
- 护栏：不新增伪造、盗用、恶意篡改或监管违法等未支持的原因（C004，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 问题从供应端开始积累 | `S-A010 · supply-stage-set` (~4s) | 建立 headline 与卡组骨架，首张卡片空槽待补 |
| 2 | 各家供应商的私有标识 | `S-A010 · private-labels-card` (~12s) | 私有标识卡成立（U006），headline 保持 |
| 3 | 流转失真与入厂采集出错 | `S-A010 · damage-error-cards` (~13s) | 损伤卡与采集错误卡补齐（U007），R004 的递进次序成立 |
| 4 | 一物多码 | `S-A010 · multi-code-card` (~10s) | 一物多码卡成立（U008），R005 的并置开始；已有卡片保持 |
| 5 | 一码多物 | `S-A010 · mixed-object-cards` (~7s) | 一码多物卡补齐（U008），两类混乱并置完成 |
| 6 | 病根是缺少身份锚点 | `S-A010 · anchor-missing-takeaway` (~11s) | 卡组收拢到 takeaway 结论行（U009），R006 成立；卡片保持等权 |
<!-- CHAPTER:A003:END -->

<!-- CHAPTER:A004:BEGIN tx=220cc287358fbde1 -->
## 4. one-item-one-code — 平台读图页（5 steps · ~52s）

**A-page / Chapter**：`A004`
**基础场景**：`S-A017` — 教材原图读图台：关系原图持续在场，阅读顺序与要点注记在固定区域推进
**页面配方**：`image-with-reading-notes`
**核心判断**：本体唯一标识让各环节记录围绕同一对象关联
**结构指纹**：`headline | image | reading-order | key-points`
**语义关系**：锚点建立后按序赋码，协作各方围绕标识衔接
**关系机制**：`persistent-media-reading` — 教材原图（M002）持续在场不反复卸载，阅读顺序承载锚点到赋码（R007），key-points 区承载协作组并回指锚点（R008）
**持续元素**：headline（S017）、教材原图（M002）、阅读顺序区（U010）、要点区（U011）
**内容槽位**：`headline` 承载 S017 论点标题；`image` 承载 M002 教材关系原图（完整保留，不得重绘或描摹替代）；`reading-order` 承载 U010 平台锚点与两步赋码；`key-points` 承载 U011 五方协作
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 平台：一件一码精益化管理平台 —— S018 · G010
- 赋码路径：供应商先获取编码，再打刻或打印到零部件本体 —— S019 · G011
- 协作各方：二级节点、供应商、主机厂、修理厂、质量追溯系统围绕零部件标识建立业务联系 —— S020 · G012 · E007
- 教材原图：教材图 1-13 基于标识解析的精益化管理 —— M002 · E007
- 关系：获取编码后完成赋码（R007），协作组围绕标识协作（R008）
- 护栏：不推断打刻工艺细节、编码内容、校验字段、系统接口或数据存储位置；平台不呈现为吞并全部业务数据的中心存储（C005 · C006，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 设问与平台答案 | `S-A017 · question-to-platform` (~8s) | 建立 headline 与教材原图（M002）在场，reading-order 区立起平台锚点（U010 起点），设问句由锚点接住 |
| 2 | 两步赋码顺序 | `S-A017 · coding-steps` (~10s) | reading-order 显示“获取编码→本体打刻/打印”的两步顺序（U010），R007 承载 |
| 3 | 本体分不开的身份 | `S-A017 · identity-bound` (~7s) | 锚点说明补齐“跟本体分不开的身份”，原图与已读要点保持 |
| 4 | 不是塞数据，先解决身份 | `S-A017 · boundary-noted` (~14s) | 注记区补充边界说明：先让零部件有明确身份、记录围绕它关联（U010） |
| 5 | 五方围绕标识协作 | `S-A017 · collaboration-mapped` (~13s) | key-points 区列出二级节点、供应商、主机厂、修理厂、质量追溯系统（U011），R008 回指锚点卡 |
<!-- CHAPTER:A004:END -->

<!-- CHAPTER:A005:BEGIN tx=886c205c97a121a0 -->
## 5. assembly-verification — 装配校验页（5 steps · ~49s）

**A-page / Chapter**：`A005`
**基础场景**：`S-A021` — 采集到结果线性步骤轨道：采集槽、两道校验槽、结果槽按序推进，轨道整体持续
**页面配方**：`linear-steps-to-result`
**核心判断**：两类校验让错误在装配之前暴露
**结构指纹**：`headline | steps | steps | terminal-result`
**语义关系**：实时采集供给两道校验，校验作用产生装配前结果
**关系机制**：`ordered-progression` — 采集→两道校验→结果按真实先后点亮（R009、R010），完成后各槽并排保持等权，不轮播
**持续元素**：headline（S021）、采集槽（U012）、两道校验槽（U013）、结果槽（U014）
**内容槽位**：`headline` 承载 S021 论点标题；`steps` 前段承载 U012 实时采集，后段承载 U013 订单一致性与产品一致性；`terminal-result` 承载 U014 暴露结果与前移边界
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 实时采集：每一件待装零件的信息 —— S022 · G013
- 订单一致性：核对是不是当前订单要的零件 —— S023 · G014
- 产品一致性：核对是不是当前装配对象上该装的零件 —— S024 · G014
- 结果：不一致在装配之前暴露，规避错装、漏装 —— S025 · G015
- 边界：检查位置由事后查找前移到装配关系建立之前 —— S026 · G015
- 关系：采集供给核对（R009），校验作用产生结果（R010）
- 护栏：不设计校验字段、阈值、报警界面或任何自动阻断与责任判定动作（C007，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 身份进入生产环节 | `S-A021 · production-stage-set` (~5s) | 建立 headline 与步骤轨道骨架，采集槽空置待补 |
| 2 | 实时采集与订单一致性 | `S-A021 · order-check-in` (~12s) | 采集槽显示实时采集（U012），第一道订单一致性槽点亮（U013）；R009 供给关系成立 |
| 3 | 产品一致性补齐 | `S-A021 · product-check-paired` (~6s) | 第二道产品一致性槽点亮（U013），两道核对等权并排 |
| 4 | 不一致提前暴露 | `S-A021 · result-exposed` (~12s) | terminal-result 显示装配前暴露、规避错装漏装（U014），R010 承接成立 |
| 5 | 检查位置前移的边界 | `S-A021 · shift-boundary-noted` (~14s) | 结果槽补充“事后查找→装配之前”的位置变化说明（U014）；轨道各槽保持 |
<!-- CHAPTER:A005:END -->

<!-- CHAPTER:A006:BEGIN tx=4fd01dfa03704476 -->
## 6. install-archive — 装机档案页（3 steps · ~25s）

**A-page / Chapter**：`A006`
**基础场景**：`S-A027` — 档案带与回查侧注的上下层级：档案带承载零部件与整车的对应，侧注承载回查路径
**页面配方**：`layered-bands-with-side-notes`
**核心判断**：装机档案让质量异常可围绕具体对象回查
**结构指纹**：`headline | ordered-bands | side-notes`
**语义关系**：装机档案支持质量异常回查
**关系机制**：`anchor-and-context` — 档案带作为持续锚点，回查语境在侧注区补充（R011），层级保持上下结构
**持续元素**：headline（S027）、档案带（U015）、回查侧注（U016）
**内容槽位**：`headline` 承载 S027 论点标题；`ordered-bands` 承载 U015 围绕同一标识的整车装机档案；`side-notes` 承载 U016 质量异常回查
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 档案：围绕同一标识建立整车装机档案，记录零部件与整车的进入关系 —— S028 · G016
- 回查：质量异常时围绕具体零部件和车辆回查，不在孤立记录间来回跳 —— S029 · G017
- 关系：档案带支持质量异常回查（R011）
- 护栏：不新增车型、车架号、时间、工位字段或可操作界面（C008，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 装配完成后身份继续起作用 | `S-A027 · archive-stage-set` (~4s) | 建立 headline 与档案带骨架，带内空槽待补 |
| 2 | 建立整车装机档案 | `S-A027 · archive-band-in` (~9s) | 档案带补齐“哪些零部件进入哪辆整车”的对应（U015） |
| 3 | 质量异常可回查 | `S-A027 · side-note-traceback` (~12s) | 侧注区出现围绕具体零部件和车辆的回查路径（U016），R011 支持关系成立；档案带保持 |
<!-- CHAPTER:A006:END -->

<!-- CHAPTER:A007:BEGIN tx=b2c8ff6b5088a389 -->
## 7. parts-single-item — 配件流转页（3 steps · ~28s）

**A-page / Chapter**：`A007`
**基础场景**：`S-A030` — 粒度与流转双卡加语境图：两张问题卡等权并置，配件语境图持续在场，takeaway 收束
**页面配方**：`issue-cards-with-image`
**核心判断**：单件流转让避免串货成为可执行的管理目标
**结构指纹**：`headline | issue-cards | issue-cards | image | takeaway`
**语义关系**：粒度细化支撑单件流转核验
**关系机制**：`equal-weight-accumulation` — 粒度卡与流转卡等权累积（R012 支撑排列），完成后不留选中项；语境图（M003）持续在场，takeaway 承载边界
**持续元素**：headline（S030）、两张问题卡（U017、U018）、配件语境图（M003）、takeaway（U019）
**内容槽位**：`headline` 承载 S030 论点标题；`issue-cards` 分别承载 U017 粒度细化与 U018 单件流转核验；`image` 承载 M003 配件仓储单件流转语境；`takeaway` 承载 U019 管理目标边界
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 粒度：管理颗粒度从“一批货”细化到“一件货” —— S031 · G018
- 流转：单件流转过程可核验，串货多一道实在约束 —— S032 · G019
- 边界：避免串货是管理目标，依赖每个环节正确采集、保住身份记录 —— S033 · G019
- 语境图：配件仓储单件流转现场 —— M003
- 关系：粒度细化支撑流转核验（R012）
- 护栏：不承诺绝对消除串货，不新增具体流向、库存或异常结论（C009，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 从一批货到一件货 | `S-A030 · granularity-card` (~8s) | 建立 headline 与配件语境图（M003），粒度卡成立（U017） |
| 2 | 单件流转可核验 | `S-A030 · flow-verifiable-card` (~9s) | 流转卡补齐（U018），R012 的支撑排列成立；两卡等权并置 |
| 3 | 管理目标与边界 | `S-A030 · management-boundary-takeaway` (~11s) | takeaway 行出现管理目标边界（U019）；卡片与语境图保持 |
<!-- CHAPTER:A007:END -->

<!-- CHAPTER:A008:BEGIN tx=70324b0808919715 -->
## 8. repair-traceback — 维修追溯页（7 steps · ~60s）

**A-page / Chapter**：`A008`
**基础场景**：`S-A034` — 维修现场读图加摘要栏：维修语境图持续在场，核对与记录摘要栏逐栏累积，再延伸到追溯要点并收束
**页面配方**：`image-with-summary-rail`
**核心判断**：标识提供核验与追溯入口，不替代责任判定
**结构指纹**：`headline | image | summary-rail | summary-rail | final-judgment`
**语义关系**：核对说明与记录摘要并列，再延伸回查生产侧
**关系机制**：`rail-cumulative-traceback` — summary-rail 按核对→真实性→边界逐栏累积（R013），随后焦点延伸到生产侧追溯要点（R014），final-judgment 收束；语境图（M004）全程持续不卸载
**持续元素**：headline（S034）、维修语境图（M004）、摘要栏（U020、U021）、final-judgment（U022）
**内容槽位**：`headline` 承载 S034 论点标题；`image` 承载 M004 维修核验现场语境；`summary-rail` 前栏承载 U020 核对与调档，后栏承载 U021 真实性判断与入口边界；`final-judgment` 承载 U022 追溯要点与数据依据边界
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 核对：围绕零部件的标识核对维修对象 —— S035 · G020
- 关联记录：调出装机档案、配件流转和质量记录 —— S036 · G021
- 真实性：维修真实性有依据，虚假索赔和说不清的争议减少 —— S037 · G021
- 边界：标识提供查询入口，不单独完成责任认定、索赔审批 —— S038 · G021
- 追溯：质量问题追溯到具体安装工位与对应供应商 —— S039 · G022 · E006
- 绩效：质量指标分析为供应商绩效评价提供参考 —— S040 · G022 · E006
- 语境图：维修核验现场 —— M004
- 关系：核对说明调取关联记录（R013），摘要栏延伸回查生产侧（R014）
- 护栏：不新增自动化的原因定位、供应商排名、评分公式、处罚结果或审批规则（C010，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 进入维修环节 | `S-A034 · repair-stage-set` (~3s) | 建立 headline 与维修语境图（M004），摘要栏空槽待补 |
| 2 | 核对对象并调取记录 | `S-A034 · verification-rail-open` (~11s) | 摘要栏第一栏出现核对维修对象与三类记录（U020），R013 并列承载开始 |
| 3 | 真实性有依据 | `S-A034 · authenticity-judged` (~10s) | 第二栏补齐真实性判断与索赔争议减少（U021）；第一栏与语境图保持 |
| 4 | 查询入口的边界 | `S-A034 · entry-not-authority` (~8s) | 栏内补充“查询入口、不单独完成责任认定”边界句（U021 · S038 方向） |
| 5 | 价值延伸回生产侧 | `S-A034 · traceback-pivot` (~5s) | 焦点转向生产侧追溯（R014 延伸开始），摘要栏保持可读 |
| 6 | 工位、供应商与绩效参考 | `S-A034 · traceback-mapped` (~12s) | 追溯要点列出安装工位、对应供应商与绩效评价参考（U022） |
| 7 | 数据依据不是自动裁决 | `S-A034 · evidence-not-verdict` (~11s) | final-judgment 收束“更可核对的数据依据，不是自动根因分析或处罚”（U022）；语境图与摘要栏保持 |
<!-- CHAPTER:A008:END -->

<!-- CHAPTER:A009:BEGIN tx=e141b681e12e4680 -->
## 9. case-results — 案例结果页（4 steps · ~26s）

**A-page / Chapter**：`A009`
**基础场景**：`S-A041` — 证据卡与来源边界带：四张结果卡等权累积，适用范围标注与数字同屏，边界带收束
**页面配方**：`evidence-cards-with-provenance-boundary`
**核心判断**：四项结果只在案例范围内成立
**结构指纹**：`headline | evidence-cards | provenance-band | inference-boundary`
**语义关系**：证据归属限定于案例范围
**关系机制**：`evidence-with-scope` — 四张证据卡按口播次序等权累积（U023），来源边界带从首拍起与数字同屏（U024 · S047 方向），inference-boundary 收束外推边界（R015）
**持续元素**：headline（S041）、证据卡组（U023）、来源边界带（U024）、inference-boundary（U025）
**内容槽位**：`headline` 承载 S041 论点标题；`evidence-cards` 承载 U023 四项结果；`provenance-band` 承载 U024 结果归属该案例；`inference-boundary` 承载 U025 适用范围与数字同屏的外推边界
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 结果一：零部件本体的永久标识，预计服务误判额降低 5000 万 —— S042 · G023
- 结果二：订单一致性提升到 100% —— S043 · G023
- 结果三：配件物流管理细化到单件，丢失和物料损耗减少 —— S044 · G023
- 结果四：服务准确性提高、客户等待变短、满意度明显提升 —— S045 · G023
- 归属：结果归属该案例，适用范围标注与数字同屏呈现 —— S046 · S047 · G024
- 关系：证据归属限定于案例范围（R015）
- 护栏：成效数字不外推为行业基准、当前状态或项目承诺，不虚构统计要素（C011，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 结果框架与误判额 5000 万 | `S-A041 · first-evidence-card` (~9s) | 建立 headline、provenance-band 与第一张证据卡（U023 起点），来源标注自首拍与数字同屏（U024） |
| 2 | 订单一致性 100% | `S-A041 · second-evidence-card` (~3s) | 第二张证据卡补齐（U023）；已出现的卡与边界带保持 |
| 3 | 配件细化到单件 | `S-A041 · third-evidence-card` (~6s) | 第三张证据卡补齐（U023）；卡组保持等权 |
| 4 | 服务与满意度收束到案例范围 | `S-A041 · results-scope-bounded` (~8s) | 第四张证据卡补齐，inference-boundary 出现（U025 · U024），R015 并置成立 |
<!-- CHAPTER:A009:END -->

<!-- CHAPTER:A010:BEGIN tx=23c52732d1fa58bc -->
## 10. summary-anchor — 总结页（4 steps · ~41s）

**A-page / Chapter**：`A010`
**基础场景**：`S-A048` — 不变锚点与阶段职责对照：总装工位情境回访开场，四阶段链与各系统职责在固定区对照，收束到连续性判断
**页面配方**：`lifecycle-identity-continuity`
**核心判断**：先认准零部件再连准记录，精益管理才有可靠起点
**结构指纹**：`headline | invariant-anchor | ordered-stages | stage-purpose | continuity-judgment`
**语义关系**：共同身份连接零部件对象与各环节记录
**关系机制**：`invariant-anchor-continuity` — 不变锚点承载“同一个可关联身份”，阶段序列按供应→装配→配件流转→维修核验展示贯通（U026），职责区补充各系统分工并回指锚点（U027 · R016），continuity-judgment 收束
**持续元素**：headline（S048）、不变锚点与阶段序列（U026）、职责区（U027）、continuity-judgment（U028）
**内容槽位**：`headline` 承载 S048 论点标题；`invariant-anchor` 承载 U026 的同一身份锚点；`ordered-stages` 承载 U026 四阶段贯通；`stage-purpose` 承载 U027 各系统职责；`continuity-judgment` 承载 U028 最终判断
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（按 A-page 指导组织的画面信息池）：
- 不变锚点：同一件零部件从供应、装配、配件流转到维修核验保持同一个可关联身份 —— S049 · G025
- 各司其职：QTS 管质量追踪、MES 管生产执行、质量追溯系统管质量记录回查；唯一标识连接对象与记录 —— S050 · G026
- 收束判断：先认准零部件，再把跨环节记录连准，精益管理才有可靠起点 —— G025 + G026
- 回访：回到开场总装工位情境，形成首尾呼应（呼应开场情境，不引入相邻分集主题）
- 关系：共同身份连接对象与记录（R016）
- 护栏：收束不预告相邻分集或后续课程内容（C012，不上屏）

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 回到开头的总装工位 | `S-A048 · opening-revisited` (~4s) | 建立 headline 与总装工位情境回访构图，锚点区空槽待补 |
| 2 | 同一身份贯通四阶段 | `S-A048 · identity-continuous` (~14s) | invariant-anchor 立起“同一个可关联身份”，ordered-stages 依次呈现供应→装配→配件流转→维修核验（U026） |
| 3 | 各系统分工与连接 | `S-A048 · roles-anchored` (~14s) | stage-purpose 区列出 QTS、MES、质量追溯系统职责与唯一标识的连接作用（U027），R016 回指锚点；阶段链保持 |
| 4 | 先认准再连准 | `S-A048 · continuity-judged` (~9s) | continuity-judgment 收束最终判断（U028）；锚点、阶段链与职责区保持 |
<!-- CHAPTER:A010:END -->

## 素材清单

<!-- GLOBAL:materials:BEGIN -->
### A001

- `M001`：photorealistic_ai — 建立总装工位开场情境

### A004

- `M002`：textbook_original — 完整保留教材关系原图

### A007

- `M003`：photorealistic_ai — 建立配件仓储单件流转语境

### A008

- `M004`：photorealistic_ai — 建立维修核验现场语境
<!-- GLOBAL:materials:END -->
