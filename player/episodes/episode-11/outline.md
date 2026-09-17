# Video Outline

<!-- GLOBAL:metadata:BEGIN -->
> **编译状态**：awaiting-checkpoint-plan
> **主题**：pending（Checkpoint Plan 待选）
> **正文时长**：约 8 分 5 秒
> **章节**：17
> **Base scenes**：17
> **Accent frames**：4
> **Custom scene candidates**：0
> **Narration beats**：53
<!-- GLOBAL:metadata:END -->

## 整集视觉调度

<!-- GLOBAL:schedule:BEGIN -->
| A-page | Base scene | Recipe | Steps | Duration |
|---|---|---|---:|---:|
| A001 | S-A001 · 药房收货台核验一盒药品的持续构图 | issue-cards-with-image | 3 | ~19s |
| A002 | S-A002 · 沿同一水平轴展开的供应链角色链持续构图 | time-anchor-opening | 3 | ~27s |
| A003 | S-A003 · 左右两栏对照加底部判断的持续构图 | split-compare-with-thesis | 4 | ~38s |
| A004 | S-A004 · 三张等权困难卡并列的持续构图 | parallel-cards-self-contained | 4 | ~31s |
| A005 | S-A005 · 约束与协同条件折向排布的持续构图 | condition-key-goal | 4 | ~35s |
| A006 | S-A006 · 赋码条到解析条单向推进的持续构图 | linear-steps-with-takeaway | 2 | ~26s |
| A007 | S-A007 · 左右两栏加中部判据条的对照持续构图 | split-compare-with-pivot | 3 | ~37s |
| A008 | S-A008 · 层叠文字带加侧栏短卡的持续构图 | layered-bands-with-side-notes | 3 | ~22s |
| A009 | S-A009 · 关联组围合共享锚点的持续构图 | common-anchor-association-groups | 2 | ~20s |
| A010 | S-A010 · 同一锚点标签贯穿五条阶段带的持续构图 | lifecycle-identity-continuity | 5 | ~30s |
| A011 | S-A011 · 主图与图侧洞察短条分栏的持续构图 | image-with-insight-rail | 2 | ~14s |
| A012 | S-A012 · 步骤条单向推进到终端结果的持续构图 | linear-steps-to-result | 3 | ~33s |
| A013 | S-A013 · 入口卡与机制卡左右并列的持续构图 | parallel-cards-with-takeaway | 2 | ~18s |
| A014 | S-A014 · 未变项与改变项左右对照的持续构图 | split-compare-with-thesis | 5 | ~48s |
| A015 | S-A015 · 回扣收货台主图与编号总结带的持续构图 | image-with-summary-rail | 2 | ~19s |
| A016 | S-A016 · 主图与阅读注释条并列的持续构图 | image-with-reading-notes | 4 | ~45s |
| A017 | S-A017 · 主图与洞察短条对置收束的持续构图 | image-with-insight-rail | 2 | ~23s |
<!-- GLOBAL:schedule:END -->

## 0. cover — 封面（1 silent step · fixed 15s）

<!-- CHAPTER:A001:BEGIN tx=cb3ae1fbb609052a -->
## 1. pharmacy-verification — 药房收货核验（3 steps · ~19s）

**A-page / Chapter**：`A001`
**基础场景**：`S-A001 · 药房收货台核验一盒药品的持续构图`
**页面配方**：`issue-cards-with-image`
**核心判断**：认出一盒药品只是追踪的开始。
**结构指纹**：`scene-image | context | issue-cards | takeaway`
**语义关系**：核验前提引出一串追问，追问收束到追查去向
**关系机制**：`premise-to-question` — 收货场景与核验语境持续在场，问题卡逐条出现后把视觉重心交给收束追问
**关系保真**：`R001` 由核验动作与问题卡之间的上下阅读顺序承载；`R002` 由问题卡向收束追问逐条汇聚的排列承载
**持续元素**：标题、收货台场景图、核验语境条、问题卡区、收束判断区
**内容槽位**：`headline` ← `S001`；`scene-image` ← `M001`；`context` ← `U001`；`issue-cards` ← `U002`；`takeaway` ← `U003`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 场景：药房收货区工作人员核验一盒药品 —— `S002` / `M001`
- 追问一：这盒药由谁生产、经过哪一段仓储和物流 —— `S003`
- 追问二：出现异常时向哪里追查 —— `S004`
- 护栏：不把核验表现为已显示批次结论或患者信息（`C001`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 收货现场的核验动作 | `S-A001 · verification-scene-set` (~5s) | 建立标题、收货台场景图与核验语境条；问题卡区先留空 |
| 2 | 追问生产与流转环节 | `S-A001 · trace-questions-open` (~10s) | 保持场景图与语境条，在问题卡区依口播补入"谁生产"与"经过哪些环节"两张追问卡 |
| 3 | 追问最终落到追查去向 | `S-A001 · questions-converged` (~4s) | 保持已建立内容，收束区点亮"向谁追查"，完成问题卡向收束判断的汇聚 |

（合并：三连追问共享"一串问题"引子，中间拍承载问题链主干；末拍独立承载收束追问，保留 R002 的同步点）

**本章素材需求**：
- ⚠️ `M001`：药房收货区现实语境图（photorealistic_ai，待提供）
<!-- CHAPTER:A001:END -->

<!-- CHAPTER:A002:BEGIN tx=0cda0bddb976194b -->
## 2. chain-roles — 链条上的角色（3 steps · ~27s）

**A-page / Chapter**：`A002`
**基础场景**：`S-A002 · 沿同一水平轴展开的供应链角色链持续构图`
**页面配方**：`time-anchor-opening`
**核心判断**：参与者越多，记录越分散。
**结构指纹**：`time-anchor | context-line | scene-image | records`
**语义关系**：角色沿链条顺序交接，各段记录随后归位
**关系机制**：`ordered-progression` — 角色条沿同一水平轴依次落位，落位后全部保留，不产生上下级关系
**关系保真**：`R003` 由两段角色条沿同一水平轴依次排布承载；`R004` 由角色条与记录说明之间的从属层级承载
**持续元素**：标题、角色链条、药厂与仓储物流语境图、记录说明区
**内容槽位**：`headline` ← `S005`；`time-anchor` ← `U004`；`context-line` ← `U005`；`scene-image` ← `M002`；`records` ← `U006`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 上游三段：原材料供应商、生产商、物流商依次承担一段 —— `S006`
- 下游三段：经销商、零售商、药店和医院把药送到使用者 —— `S007`
- 记录：每个角色都有自己的业务系统和记录 —— `S008`
- 护栏：不把主体清单画成上下级关系（`C002`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 先看这盒药背后有多少角色 | `S-A002 · role-question-raised` (~6s) | 建立标题与空置的水平角色轴，提出"多少角色"的引导 |
| 2 | 五段角色依次报出职责 | `S-A002 · role-chain-laid-out` (~14s) | 保持角色轴，在本步内从上游到下游依次落位角色条并补一句职责；完成后全链等权保留 |
| 3 | 每个角色都留下记录 | `S-A002 · records-attributed` (~7s) | 保持全链，在链条下方记录区补入"各有业务系统、各留记录"的说明 |

（合并：五段角色是同一条链上的连续点名，拆开会让链条出现半截状态，故一拍内依次落位）

**本章素材需求**：
- ⚠️ `M002`：药厂与仓储物流现实语境图（photorealistic_ai，待提供）
<!-- CHAPTER:A002:END -->

<!-- CHAPTER:A003:BEGIN tx=df5407c7d6eaf464 -->
## 3. records-unrecognized — 记录很多却不互认（4 steps · ~38s）

**A-page / Chapter**：`A003`
**基础场景**：`S-A003 · 左右两栏对照加底部判断的持续构图`
**页面配方**：`split-compare-with-thesis`
**核心判断**：有记录不等于信息互相认识。
**结构指纹**：`left | right | medium | bottom-thesis`
**语义关系**：记录清楚与互不认识的对照，收束到数据孤岛
**关系机制**：`compare-and-reweight` — 左右两栏持续并列，中部口径说明把对照收束到底部孤岛判断
**关系保真**：`R005` 由左右两栏的并列高度与共同标题承载；`R006` 由中部口径说明向底部判断的单向收束承载
**持续元素**：标题、左栏记录清单、右栏互认缺口、中部口径条、底部判断条
**内容槽位**：`headline` ← `S009`；`left` ← `U007`；`right` ← `U008`；`medium` 与 `bottom-thesis` ← `U009`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 左栏素材：原料批次、生产工单、运输单据、销售流水各记各的 —— `S010`
- 右栏素材：彼此之间缺少一个共同的依据 —— `S011`
- 口径：编码规则、数据口径和系统接口不一致 —— `S012`
- 结果：上下游信息不易关联，形成数据孤岛 —— `S013`
- 护栏：不写成完全没有信息化（`C003`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 提出对照命题 | `S-A003 · compare-frame-open` (~4s) | 建立标题与空置的左右两栏骨架，亮出"有记录不等于互相认识"的命题 |
| 2 | 四类记录各自成立 | `S-A003 · records-listed` (~11s) | 保持骨架，在左栏依次补入四类记录条目 |
| 3 | 缺少共同依据 | `S-A003 · recognition-missing` (~6s) | 保持左栏，在右栏补入互认缺口说明，两栏并列高度成立 |
| 4 | 口径不一致汇聚成孤岛 | `S-A003 · islands-formed` (~16s) | 保持两栏，在中部口径条补入三类不一致，并向底部判断条收束出数据孤岛结论 |

（合并：引入句"供应链很长、参与方又多"与数据孤岛因果同属一个推进单元，故末拍承载两句口播）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A003:END -->

<!-- CHAPTER:A004:BEGIN tx=0956aa22b5e0d623 -->
## 4. three-breaks — 三个断点（4 steps · ~31s）

**A-page / Chapter**：`A004`
**基础场景**：`S-A004 · 三张等权困难卡并列的持续构图`
**页面配方**：`parallel-cards-self-contained`
**核心判断**：系统独立、流向不清、对象难定。
**结构指纹**：`parallel-cards | card-two | card-three`
**语义关系**：并列呈现的因果链
**关系机制**：`equal-weight-accumulation` — 三张等权卡按相邻顺序补齐，卡间相邻顺序承载递进因果，完成后不留当前选中项
**关系保真**：`R007` 由系统独立与流向不清两张卡的相邻顺序承载；`R008` 由流向说明与对象确认卡的同列延续承载
**持续元素**：标题、三张困难卡
**内容槽位**：`headline` ← `S014`；`parallel-cards` ← `U010`；`card-two` ← `U011`；`card-three` ← `U012`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 卡一：生产、包装、仓储、物流系统各管一段 —— `S015`
- 卡二：跨主体的流向信息连不起来 —— `S016`
- 卡三：安全事件时难以确定对象和环节 —— `S017`
- 护栏：不把三类困难写成监管判断或行业统计（`C004`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 割裂带来三方面困难 | `S-A004 · difficulties-framed` (~3s) | 建立标题与三张等权空卡 |
| 2 | 系统各管一段 | `S-A004 · siloed-systems-shown` (~7s) | 第一张卡补入系统独立的说明 |
| 3 | 流向看不清楚 | `S-A004 · flow-opaque-shown` (~9s) | 保持卡一，第二张卡补入流向不清的说明 |
| 4 | 出事时定位困难 | `S-A004 · object-pin-hard-shown` (~12s) | 保持前两卡，第三张卡补入"对象与环节都难确定"的说明；三卡等权收齐 |

（合并：药品种类复杂与安全事件定位难共同服务卡三，两句并成一拍）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A004:END -->

<!-- CHAPTER:A005:BEGIN tx=6356b173be3866d0 -->
## 5. beyond-connection — 对接之外的条件（4 steps · ~35s）

**A-page / Chapter**：`A005`
**基础场景**：`S-A005 · 约束与协同条件折向排布的持续构图`
**页面配方**：`condition-key-goal`
**核心判断**：共享不只看接口，还看约束和协同条件。
**结构指纹**：`condition | key | goal`
**语义关系**：两类约束并列后转向协同条件
**关系机制**：`compare-and-reweight` — 约束两侧持续并列，随后视觉权重折向协同条件卡，最终停在对接与对齐的落差上
**关系保真**：`R009` 由约束卡与外部条件卡的左右并列承载；`R010` 由约束卡向协同条件卡的折向排布承载
**持续元素**：标题、约束卡、外部条件卡、协同条件卡
**内容槽位**：`headline` ← `S018`；`condition` ← `U013`；`key` ← `U014`；`goal` 与 `takeaway` ← `U015`
**可见标题**：`保留`
**强调页**：`K-A005-01`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 约束一：数据安全与隐私保护的限制 —— `S019`
- 约束二：需求波动、突发事件与外部不确定性 —— `S020`
- 协同条件：信任机制、信息共享平台、标准化流程、利益分配机制 —— `S021`（exact 用法，逐项保留）
- 护栏：不把四项协同条件做成制度清单或认证标志（`C005`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 抛出"共享就行了吗" | `S-A005 · sharing-question-posed` (~7s) | 建立标题与设问主导的画面，条件区留空 |
| 2 | 两类约束同时存在 | `S-A005 · constraints-paired` (~12s) | 保持设问，约束卡与外部条件卡左右并列补齐 |
| 3 | 协同需要四个条件 | `S-A005 · cooperation-conditions-settled` (~11s) | 保持约束两卡，折向补入四项协同条件卡 |
| 4 | 对接容易对齐难 | `K-A005-01 · accent` (~5s) | 切换到低成本全屏强调页，只承载"系统可以对接，利益和信任不容易对齐"的核心句 |

（合并：设问与转折"也没有这么简单"同属一个认知单元，并成一拍；accent 取舍：末句是本页独立成立的判断，收束"对接之外还差什么"的整段讨论，适合全屏停顿）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A005:END -->

<!-- CHAPTER:A006:BEGIN tx=47675006d093f375 -->
## 6. encode-and-resolve — 编码与解析各做什么（2 steps · ~26s）

**A-page / Chapter**：`A006`
**基础场景**：`S-A006 · 赋码条到解析条单向推进的持续构图`
**页面配方**：`linear-steps-with-takeaway`
**核心判断**：标识解析先解决对象的唯一身份与查询。
**结构指纹**：`steps | step-two | takeaway`
**语义关系**：赋码到解析的顺序收敛
**关系机制**：`ordered-progression` — 赋码条先落位，解析条随后收束，两步单向阅读后共同支撑结论
**关系保真**：`R011` 由赋码条到解析条的单向阅读顺序承载
**持续元素**：标题、两段步骤条、结论条
**内容槽位**：`headline` ← `S022`；`steps` ← `U016`；`step-two` ← `U017`；`takeaway` ← `U018`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 定位：工业互联网语境中的标识解析 —— `S022`
- 赋码：为物理实体和数字对象赋予全球唯一编码 —— `S023`
- 解析：找到编码对应的位置和相关信息 —— `S024`
- 护栏：不补充具体编码体系名称或节点层级架构（`C006`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 语境限定与基础问题 | `S-A006 · basic-problem-stated` (~13s) | 建立标题，亮出"最基础的一件事是唯一身份"的问题条 |
| 2 | 赋码再解析落到位 | `S-A006 · encode-resolve-shown` (~13s) | 在同一步内先点亮赋码条，再点亮解析条，两步与结论条最终稳定保留 |

（合并：语境限定句并入基础问题一拍；赋码与解析是同一句机制陈述的两个分句，一拍内依次点亮两段步骤条，避免半截机制状态）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A006:END -->

<!-- CHAPTER:A007:BEGIN tx=8381a2bda1022c5c -->
## 7. two-code-systems — 两套体系的关系（3 steps · ~37s）

**A-page / Chapter**：`A007`
**基础场景**：`S-A007 · 左右两栏加中部判据条的对照持续构图`
**页面配方**：`split-compare-with-pivot`
**核心判断**：编码体系不同，识别逻辑相通。
**结构指纹**：`left | pivot | right`
**语义关系**：两套体系对照后收束到相通逻辑
**关系机制**：`compare-and-reweight` — 左右两栏边界持续，中部判据条把对照收束为"先认对象、再关联信息"的共通点
**关系保真**：`R012` 由左右两栏的并列边界承载；`R013` 由中部判据条位于两栏之间的位置承载
**持续元素**：标题、药品追溯码栏、判据条、工业互联网标识栏
**内容槽位**：`headline` ← `S025`；`left` ← `U019`；`pivot` ← `U020`；`right` ← `U021`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 左栏：药品追溯码用于唯一标识药品销售包装单元 —— `S026`（exact 用法）
- 判据：与工业互联网标识不是同一套编码体系 —— `S027`（exact 用法）
- 右栏：两者都先识别对象，再关联信息 —— `S028`
- 护栏：不展开追溯码标准条款或监管要求（`C007`）；不出现任何具体编码样例（`C008`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 引入药品追溯码 | `S-A007 · trace-code-defined` (~11s) | 建立标题与左栏，补入药品追溯码的定位说明 |
| 2 | 不是一套但逻辑相通 | `S-A007 · two-systems-related` (~17s) | 保持左栏，中部判据条亮出"不是同一套"，右栏补入相通的识别逻辑 |
| 3 | 过渡回一盒药示例 | `S-A007 · two-systems-related` (~7s) | 保持两栏与判据条的稳定画面，作为向下一页示例的口播过渡；构图不变 |

（合并：语境引入句并入追溯码一拍；末拍是过渡句，复用稳定 state 作口播 checkpoint）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A007:END -->

<!-- CHAPTER:A008:BEGIN tx=d14468fd931f9aa2 -->
## 8. capability-boundary — 能力的边界（3 steps · ~22s）

**A-page / Chapter**：`A008`
**基础场景**：`S-A008 · 层叠文字带加侧栏短卡的持续构图`
**页面配方**：`layered-bands-with-side-notes`
**核心判断**：标识是钥匙，不是仓库，也不替代业务系统。
**结构指纹**：`ordered-bands | side-notes | boundary`
**语义关系**：逐层划定能力边界
**关系机制**：`cumulative-assembly` — 在固定带层内逐层补齐边界说明，最后收束到底部边界判断
**关系保真**：`R014` 由两条边界说明的上下并列承载；`R015` 由侧栏短卡与文字带的邻接承载
**持续元素**：标题、边界文字带、侧栏短卡、底部边界判断
**内容槽位**：`headline` ← `S029`；`ordered-bands` ← `U022`；`side-notes` ← `U023`；`boundary` 与 `takeaway` ← `U024`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 带一：不是把所有业务数据装进编码 —— `S030`
- 侧注：不替代生产、订单和销售系统 —— `S031`
- 边界：各主体原有的业务方式不变 —— `S032`
- 比喻：编码是一把钥匙，不是仓库 —— 口播展开（无独立指导条）
- 护栏：不把标识画成中心数据库或自动同步程序（`C009`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 钥匙不是仓库 | `S-A008 · key-not-warehouse-shown` (~9s) | 建立标题与第一条边界带，补入"装不进编码"与钥匙比喻 |
| 2 | 不替代业务系统 | `S-A008 · systems-not-replaced` (~8s) | 保持带一，在侧栏短卡补入生产、订单、销售系统不被替代 |
| 3 | 原有方式不变 | `S-A008 · business-unchanged-settled` (~5s) | 保持既有内容，底部边界判断条收束"原来怎么干活还是怎么干活" |

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A008:END -->

<!-- CHAPTER:A009:BEGIN tx=34b85c3098dc08ad -->
## 9. shared-anchor — 共同指向从哪里来（2 steps · ~20s）

**A-page / Chapter**：`A009`
**基础场景**：`S-A009 · 关联组围合共享锚点的持续构图`
**页面配方**：`common-anchor-association-groups`
**核心判断**：记录的共同指向来自同一个对象标识。
**结构指纹**：`shared-anchor | association-groups | support-note`
**语义关系**：记录围绕同一对象围合汇聚
**关系机制**：`anchor-centric-association` — 共享锚点持续居中，不同主体的记录组围绕锚点逐组落位并保持邻近（按 rough 表达新命名的机制）
**关系保真**：`R016` 由关联项围合共享锚点的邻近关系承载
**持续元素**：标题、共享锚点、关联记录组、支撑说明
**内容槽位**：`headline` ← `S033`；`shared-anchor` ← `U025`；`association-groups` ← `U026`；`support-note` 与 `scope-boundary` ← `U027`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 锚点：这盒药成为需要被唯一识别的对象 —— `S034`
- 关联：围绕对象标识关联不同主体的记录 —— `S035`
- 护栏：不把关联画成数据集中搬运（`C010`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 记录有了共同指向 | `S-A009 · shared-direction-stated` (~5s) | 建立标题，亮出"共同指向"的命题条 |
| 2 | 围绕标识关联记录 | `S-A009 · anchor-with-associated-records` (~14s) | 在同一步内先立共享锚点，再让不同主体的记录组围绕锚点落位，最终围合稳定 |

（合并：锚点建立与记录关联是同一句应用逻辑的先后两个动作，一拍内依次呈现，避免出现"只有锚点没有关联"的半截状态）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A009:END -->

<!-- CHAPTER:A010:BEGIN tx=17c1a415afafb46b -->
## 10. five-stages — 阶段的铺开（5 steps · ~30s）

**A-page / Chapter**：`A010`
**基础场景**：`S-A010 · 同一锚点标签贯穿五条阶段带的持续构图`
**页面配方**：`lifecycle-identity-continuity`
**核心判断**：五个阶段各自留记录，指向同一盒药。
**结构指纹**：`invariant-anchor | ordered-stages | stage-purpose | continuity-judgment`
**语义关系**：顺序过程
**关系机制**：`ordered-progression` — 五条阶段带按真实先后点亮，已过阶段保持可见，阶段带之间不设连线
**关系保真**：`R017` 由同一锚点标签贯穿五条阶段带、且阶段带之间不设连线承载
**持续元素**：标题、贯穿锚点标签、五条阶段带
**内容槽位**：`headline` ← `S036`；`invariant-anchor` ← `U028`；`ordered-stages` ← `U029`；`stage-purpose` ← `U030`；`continuity-judgment` ← `U031`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 阶段一：原料进厂，来源与检验记录 —— `S037`
- 阶段二：生产加工，制造与包装记录 —— `S038`
- 阶段三：仓储物流，出入库与运输记录 —— `S039`
- 阶段四五：终端销售与市场消费，销售配送与末端观察 —— `S040`
- 护栏：五阶段是观察顺序，不是接口时序或实施步骤（`C011`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 拆出链条并点亮原料进厂 | `S-A010 · raw-material-recorded` (~10s) | 建立标题、贯穿锚点与五条空置阶段带，第一带点亮并补入来源与检验记录 |
| 2 | 生产加工留痕 | `S-A010 · production-recorded` (~4s) | 第一带转为已过态，第二带点亮并补入制造与包装记录 |
| 3 | 仓储物流留痕 | `S-A010 · warehousing-recorded` (~4s) | 前两带保持已过态，第三带点亮并补入出入库与运输记录 |
| 4 | 终端销售接入 | `S-A010 · retail-connected` (~6s) | 前三带保持，第四带点亮并补入销售与配送信息 |
| 5 | 市场消费收尾 | `S-A010 · consumption-observed` (~4s) | 前四带保持，第五带点亮为链条末端观察点，五带连续保留 |

（拆分依据：五阶段是真实顺序过程，每条阶段带点亮是可见里程碑，逐拍点亮承载播放控制价值；首拍把冒号引子并入阶段一）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A010:END -->

<!-- CHAPTER:A011:BEGIN tx=9bfec211dcfee5ff -->
## 11. division-unchanged — 分工没有改变（2 steps · ~14s）

**A-page / Chapter**：`A011`
**基础场景**：`S-A011 · 主图与图侧洞察短条分栏的持续构图`
**页面配方**：`image-with-insight-rail`
**核心判断**：分工不变，变的是记录的指向。
**结构指纹**：`image | insight-rail | rail-two | rail-three`
**语义关系**：转折
**关系机制**：`persistent-media-reading` — 主图持续，阅读焦点沿图侧短条下移，判断随短条推进
**关系保真**：`R018` 由图侧短条的上下顺序与主图的左右分栏承载
**持续元素**：标题、作业现场主图、洞察短条区
**内容槽位**：`headline` ← `S041`；`image` ← `M003`；`insight-rail` ← `U032`；`rail-two` ← `U033`；`rail-three` ← `U034`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 短条一：各阶段仍由相应主体完成业务 —— `S042`
- 短条二：标识让阶段记录指向同一个对象 —— `S043`
- 护栏：不把标识写成代替主体完成业务（`C012`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 主人没有变 | `S-A011 · owners-unchanged` (~7s) | 建立标题与主图，第一条短条亮出"各主体照常完成本阶段业务" |
| 2 | 变的是指向 | `S-A011 · records-repointed` (~7s) | 保持主图与短条一，下移点亮"记录指向同一个对象"的短条 |

**本章素材需求**：
- ⚠️ `M003`：各主体照常作业的现实语境图（photorealistic_ai，待提供）
<!-- CHAPTER:A011:END -->

<!-- CHAPTER:A012:BEGIN tx=1b005242a9f85c47 -->
## 12. traceable-path — 路径如何成立（3 steps · ~33s）

**A-page / Chapter**：`A012`
**基础场景**：`S-A012 · 步骤条单向推进到终端结果的持续构图`
**页面配方**：`linear-steps-to-result`
**核心判断**：互不相认的环节变成可追踪的对象路径。
**结构指纹**：`steps | step-two | terminal-result`
**语义关系**：顺序到结果
**关系机制**：`ordered-progression` — 可查询记录与对象路径两步单向推进，终端结果条承接定位与协同
**关系保真**：`R019` 由可查询记录向对象路径的单向步骤顺序承载；`R020` 由路径步与定位步之间的转向排布承载
**持续元素**：标题、两段步骤条、终端结果区
**内容槽位**：`headline` ← `S044`；`steps` ← `U035`；`step-two` ← `U036`；`terminal-result` ← `U037`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 起点：围绕同一标识的可查询记录 —— `S045`
- 形态：形成可追踪的对象路径 —— `S046`
- 终点：异常时先定位对象与记录，再组织协同 —— `S047`
- 护栏：不写成实时、无延迟或全自动（`C013`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 环节串成对象路径 | `S-A012 · object-path-formed` (~15s) | 建立标题，在同一步内先亮可查询记录步，再亮对象路径步 |
| 2 | 路径上可读三件事 | `S-A012 · path-readable` (~8s) | 保持路径，在路径沿线补入"从哪来、经过哪些阶段、处在哪类环节"的读取点 |
| 3 | 出事先定位再协同 | `S-A012 · locate-then-coordinate-shown` (~9s) | 保持路径，转向补入终端结果区：先定位对象与记录，再组织跨主体协同 |

（合并：转变句的两个分句同属一步机制陈述，一拍内先后点亮两段步骤条）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A012:END -->

<!-- CHAPTER:A013:BEGIN tx=56690ff11ee6564b -->
## 13. entry-vs-mechanism — 入口与机制分开（2 steps · ~18s）

**A-page / Chapter**：`A013`
**基础场景**：`S-A013 · 入口卡与机制卡左右并列的持续构图`
**页面配方**：`parallel-cards-with-takeaway`
**核心判断**：找得到记录，不等于用得可信。
**结构指纹**：`parallel-cards | card-two | takeaway`
**语义关系**：对照
**关系机制**：`compare-and-reweight` — 两卡左右并列边界持续，判断条收束"找得到不等于用得可信"
**关系保真**：`R021` 由入口卡与机制卡的左右并列边界承载
**持续元素**：标题、两张并列卡、判断条
**内容槽位**：`headline` ← `S048`；`parallel-cards` ← `U038`；`card-two` ← `U039`；`takeaway` ← `U040`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 卡一：标识解析提供查询入口，帮助定位对象和关联信息 —— `S049`
- 卡二：协同机制决定信息能否被可信使用 —— `S050`
- 护栏：不把查询入口写成信息使用权限（`C014`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 查询入口负责定位 | `S-A013 · entry-card-stated` (~9s) | 建立标题与并列骨架，左卡亮出"查询入口"的职责 |
| 2 | 可信使用靠协同机制 | `S-A013 · mechanism-card-stated` (~8s) | 保持左卡，右卡亮出协同机制及其授权、标准、流程依据 |

（合并："这两件事要分开看"是两卡对照的总起，并入卡一一拍）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A013:END -->

<!-- CHAPTER:A014:BEGIN tx=59822a07f34b594d -->
## 14. what-changes — 变化发生在哪里（5 steps · ~48s）

**A-page / Chapter**：`A014`
**基础场景**：`S-A014 · 未变项与改变项左右对照的持续构图`
**页面配方**：`split-compare-with-thesis`
**核心判断**：改变的不是参与者数量，而是识别方式。
**结构指纹**：`left | right | bottom-thesis`
**语义关系**：对照后收束
**关系机制**：`compare-and-reweight` — 左右对照持续，底部判断收束识别方式的变化，治理缺口留在画面内，最终判断交给强调页
**关系保真**：`R022` 由未变项与改变项的左右对照承载；`R023` 由过去与现在两栏之间的方式差异承载
**持续元素**：标题、对照两栏、底部判断条
**内容槽位**：`headline` ← `S051`；`left` ← `U041`；`right` ← `U043`；`bottom-thesis` ← `U042`
**可见标题**：`保留`
**强调页**：`K-A014-01`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 未变项：参与者数量没有改变 —— `S052`
- 改变项：改变的是识别同一对象的方式 —— `S053`（exact 用法）
- 方式差：过去靠反复确认，现在先定位再查记录 —— `S054`
- 护栏：不写成治理已经完成（`C015`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 回到开场问题作答 | `S-A014 · answer-framed` (~12s) | 建立标题与对照骨架，亮出"未变的是数量、变的是识别方式" |
| 2 | 过去靠反复确认 | `S-A014 · past-verification-shown` (~11s) | 保持骨架，左栏补入跨系统、跨企业、跨环节反复确认的旧方式 |
| 3 | 现在先定位再查记录 | `S-A014 · present-lookup-shown` (~10s) | 保持左栏，右栏补入统一识别与查询入口后的新方式 |
| 4 | 治理仍未完成 | `S-A014 · governance-open-shown` (~8s) | 保持对照，底部判断条补入授权、标准、流程、信任仍然必需 |
| 5 | 只是对齐的起点 | `K-A014-01 · accent` (~5s) | 切换到低成本全屏强调页，只承载"有了一套编码，只是有了一个可以对齐的起点" |

（拆分依据：过去与现在是 R023 的两栏对照，分号是强分隔，前后各成一拍；accent 取舍：末句是收束段的独立判断，全屏停顿承接四拍对照后的转折）

**本章素材需求**：
- 无外部媒体需求
<!-- CHAPTER:A014:END -->

<!-- CHAPTER:A015:BEGIN tx=e84906655af5544d -->
## 15. back-to-the-box — 回扣开场对象（2 steps · ~19s）

**A-page / Chapter**：`A015`
**基础场景**：`S-A015 · 回扣收货台主图与编号总结带的持续构图`
**页面配方**：`image-with-summary-rail`
**核心判断**：分工照旧，记录需要被认识。
**结构指纹**：`image | summary-rail | final-judgment | rail-two`
**语义关系**：回扣收束
**关系机制**：`persistent-media-reading` — 主图回扣开场，编号总结带逐条推进到最终判断
**关系保真**：`R024` 由主图与编号总结带的并列以及回扣关系的上下位置承载
**持续元素**：标题、收货台主图、编号总结带、最终判断
**内容槽位**：`headline` ← `S055`；`image` ← `M004`；`summary-rail` ← `U044`；`final-judgment` ← `U045`；`rail-two` ← `U046`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 对象：回到药房收货台上的那盒药 —— 主图 `M004` 承载
- 分工：原材料到药店医院各自负责一段 —— `S056`
- 判断：记录彼此不认识就形成孤岛、追溯困难 —— `S057`
- 护栏：不在总结处引入新的案例或主题（`C016`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 回到那盒药与分工 | `S-A015 · roles-recapped` (~14s) | 建立标题与收货台主图，编号总结带补入各主体分工 |
| 2 | 孤岛与追溯困难 | `S-A015 · island-recap-settled` (~6s) | 保持主图与总结带，最终判断区收束"记录不认识则孤岛与追溯困难" |

（合并：回扣句与角色分工句同属"回到开场"单元，并成一拍）

**本章素材需求**：
- ⚠️ `M004`：回扣开场的药品与收货台图（photorealistic_ai，待提供）
<!-- CHAPTER:A015:END -->

<!-- CHAPTER:A016:BEGIN tx=75916ce21c0fa5f2 -->
## 16. three-layer-recap — 三层关系复述（4 steps · ~45s）

**A-page / Chapter**：`A016`
**基础场景**：`S-A016 · 主图与阅读注释条并列的持续构图`
**页面配方**：`image-with-reading-notes`
**核心判断**：先有身份，再有入口，阶段记录才可关联。
**结构指纹**：`image | reading-order | key-points | takeaway`
**语义关系**：顺序复述后收束
**关系机制**：`persistent-media-reading` — 主图持续，阅读顺序沿注释条推进：身份条先于入口条，再收束到阶段说明
**关系保真**：`R025` 由身份条先于入口条的阅读顺序承载；`R026` 由入口条向阶段说明的相邻收束承载
**持续元素**：标题、语境主图、阅读注释条、要点区、收束判断
**内容槽位**：`headline` ← `S058`；`image` ← `M005`；`reading-order` ← `U047`；`key-points` ← `U048`；`takeaway` ← `U049`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 身份：为物理实体和数字对象建立唯一身份 —— `S059`
- 入口：提供查询与关联信息的入口 —— `S060`
- 阶段：五个阶段的记录围绕同一对象被查询 —— `S061`
- 区分：与药品追溯码体系不同、识别逻辑相通 —— 口播复述（无独立指导条）
- 护栏：不在收束处加入下一期主题（`C017`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 身份与入口 | `S-A016 · identity-entry-recapped` (~9s) | 建立标题与主图，按阅读顺序先亮身份条，再亮入口条 |
| 2 | 与追溯码区分开 | `S-A016 · code-distinction-recapped` (~16s) | 保持主图与既有条目，要点区补入"体系不同、逻辑相通"的区分说明 |
| 3 | 五个观察阶段 | `S-A016 · stages-recapped` (~10s) | 保持既有内容，注释区按序补入五阶段复述条 |
| 4 | 围绕对象可查询 | `S-A016 · coordination-basis-settled` (~9s) | 保持全部条目，收束判断亮出"围绕同一对象被查询和关联，协同就有基础" |

（拆分依据：五阶段列举与协同基础判断是分号分隔的两个单元，前者是复述、后者是本页收束判断）

**本章素材需求**：
- ⚠️ `M005`：从现场回到结构的语境落点图（photorealistic_ai，待提供）
<!-- CHAPTER:A016:END -->

<!-- CHAPTER:A017:BEGIN tx=28fd9122254417cb -->
## 17. beyond-technology — 技术之外的那一半（2 steps · ~23s）

**A-page / Chapter**：`A017`
**基础场景**：`S-A017 · 主图与洞察短条对置收束的持续构图`
**页面配方**：`image-with-insight-rail`
**核心判断**：技术认出对象，协同决定记录能否共享。
**结构指纹**：`image | insight-rail | rail-two | rail-three`
**语义关系**：对照后收束
**关系机制**：`persistent-media-reading` — 主图持续在场，技术与协同两条短条对置，收束到锚点判断
**关系保真**：`R027` 由技术说明与协同说明两条短条的对置承载；`R028` 由锚点条与全链说明条的上下收束承载
**持续元素**：标题、现场语境主图、洞察短条区
**内容槽位**：`headline` ← `S062`；`image` ← `M006`；`insight-rail` ← `U050`；`rail-two` ← `U051`；`rail-three` ← `U052`
**可见标题**：`保留`
**强调页**：`none`
**额外复杂场景**：`none`

**信息池**（主动设计的画面信息池，来源为 A-page 指导与 visual rough）：
- 短条一：技术解决认出同一个对象 —— `S063`
- 短条二：协同解决愿不愿意交出记录 —— `S064`
- 收束：唯一标识是关联的锚点 —— `S065`（exact 用法）
- 护栏：不在结尾预告相邻主题（`C018`）

**视觉步组**：
| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 共同规律一分为二 | `S-A017 · law-stated` (~9s) | 建立标题与主图，技术与协同两条短条对置亮出 |
| 2 | 锚点与运转条件 | `S-A017 · anchor-operation-settled` (~13s) | 保持对置短条，下移补入"锚点使全链可追踪；信任、标准和共享机制决定能否运转"的收束条 |

**本章素材需求**：
- ⚠️ `M006`：以现场语境收尾全篇的图（photorealistic_ai，待提供）
<!-- CHAPTER:A017:END -->

## 素材清单

<!-- GLOBAL:materials:BEGIN -->
### A001

- `M001`：photorealistic_ai — 提供药房收货区的现实语境

### A002

- `M002`：photorealistic_ai — 提供药厂与仓储物流的现实语境

### A011

- `M003`：photorealistic_ai — 提供各主体照常作业的现实语境

### A015

- `M004`：photorealistic_ai — 回扣开场的药品与收货台

### A016

- `M005`：photorealistic_ai — 提供从现场回到结构的语境落点

### A017

- `M006`：photorealistic_ai — 以现场语境收尾全篇
<!-- GLOBAL:materials:END -->
