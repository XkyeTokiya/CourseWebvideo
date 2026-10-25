# CourseWebvideo 项目制作状态汇报

核查日期：2026 年 10 月 24 日（Asia/Singapore）  
核查对象：当前本地工作区，含已提交文件、未提交修改及未跟踪产物。  
当前分支：`codex/ep21-51-narration-drafts`；HEAD：`b680148`。

## 1. 当前结论

**项目已有较完整的内容基础，网页制作主要覆盖 EP01–17、EP19–20、EP35–36；最近的恢复点是 EP20 收尾、EP18 补做，以及 EP21–32 视觉粗设审核。音频和成片交付明显落后于页面实现。**

目前不能用一个“总体完成率”概括进度：任务包验证、正式输入、页面实现、音频和成片分别处在不同阶段。`progress.completed = total` 只表示项目登记的章节进度，不能视为整集交付完成。

| 核查口径 | 当前结果 | 含义 |
| --- | ---: | --- |
| 冻结任务包 | 51 集 | 历史台账登记全部已验证；本次未重跑任务包语义验证 |
| 正式输入五件套文件齐备 | 22 集 | EP01–20、EP35–36；仅说明文件齐备，非本次重新批准 |
| 已有 script + outline | 22 集 | 同上；计划文件存在不等于人工放行记录齐备 |
| 已有网页播放入口 | 21 集 / 51 集（41.2%） | EP01–17、EP19–20、EP35–36；未逐页重新验收画面 |
| `project.json` 标记 ready | 2 集 | EP06、EP35；不是成片发布证明 |
| `project.json` 标记 in-progress | 19 集 | 已有入口，其余制作及验收状态需分别看 |
| `project.json` 标记 planned | 30 集 | EP18、EP21–34、EP37–51 |
| 本地存在 MP3 | 11 集，共 391 个文件 | EP01–10、EP35；未试听、未逐段核验时长及同步 |
| 本次核查范围内视频文件 | 0 个 | 在 episodes、活跃 work、validation 中未找到 mp4/webm/mov/mkv；不代表其他位置没有成片 |

正式输入五件套指批准口播、A-page、visual rough，以及对应的两份最终验证报告。主要依据为各集的 `project.json`、`inputs/`、计划文件、`src/entry.tsx` 和媒体文件。

## 2. 分批制作状态

| 期次 | 目前做到哪里 | 恢复时的主要事项 |
| --- | --- | --- |
| EP01–10 | 均有页面入口、计划和 MP3；EP06 标记 ready，其余多为 in-progress | 核对现版页面与音频、历史批准和最终录制状态 |
| EP11–17 | 页面入口与计划存在，项目登记章节进度均到总数；没有 MP3 | 先确认当前页面验收，再进入音频检查点 |
| EP18 | 正式输入齐备；11 页计划已落盘；无页面入口 | 查验已有 Checkpoint Plan 批准依据，再从首章制作接续 |
| EP19 | 登记 11/11；封面和 A001–A011 已接入；无 MP3 | 整集复验及音频准备 |
| EP20 | 工作区登记 11/11；最后一章尚未提交；A009 原图缺失；无 MP3 | 最接近可收尾的一集，详见下一节 |
| EP21–32 | 每集已有正式目录中的口播、A-page 和 A-page 报告；视觉粗设仍为 work 草稿 | 审核 rough、核对批准依据后发布；再进入 Phase 1 |
| EP33–34 | 有口播草稿、润色与审查过程文件；无正式 inputs、计划、页面入口 | 恢复口播审定，随后编译 A-page 和视觉粗设 |
| EP35 | 页面、计划、MP3 存在，标记 ready | 核对最终验收和录制交付记录 |
| EP36 | 页面与计划存在，登记 13/13；无 MP3 | 页面复验与音频准备 |
| EP37–51 | 有口播草稿及润色审查记录；无正式 inputs、计划、页面入口 | 逐集恢复口播审核，优先处理内容问题记录 |

## 3. EP18–20 的具体恢复点

### EP20：章节代码齐备，仍有明确缺项

- [项目状态](../player/episodes/episode-20/project.json)为 `in-progress`、11/11，当前章 `11-a011`。
- [播放入口](../player/episodes/episode-20/src/entry.tsx)已注册封面及 A001–A011，共 12 个章节目录；11/11 的统计不含封面。
- 最近提交 `b680148` 于 **2026-10-02 20:18（+08:00）**完成 A010。A011 的组件、样式和 narrations 已在工作区落盘，入口、进度及音频分段也已更新，但尚未提交。
- [A009 页面](../player/episodes/episode-20/src/chapters/09-a009/A009Chapter.tsx)仍显示“教材图 2-9 / 原图待接入”，对应 M004；这是尚未完成的实际画面内容。
- [音频分段](../player/episodes/episode-20/audio-segments.json)已存在，但本期没有 MP3。分段中的路径不是已生成音频的证明。
- A-page 最终报告登记 11 页、目标正文 415 秒、零 errors/failures；rough 报告为 approved。该时长为上游目标，不能当作实际成片时长。

建议接续顺序：保留并核验 A011 → 接入 M004 教材原图 → 整集视觉与口播同步复验 → 核实已有批准 → 音频分段确认、合成与录制。

### EP18：计划已编译，页面尚未开工

[script](../player/episodes/episode-18/script.md) 和 [outline](../player/episodes/episode-18/outline.md)已包含 A001–A011；outline 登记 `awaiting-checkpoint-plan`，主题仍为 pending，34 个 narration beats，正文约 5 分 5 秒。

`project.json` 仍为 planned、0/0，且没有 `src/entry.tsx`。因此应从计划审核依据与主题选择恢复，不能把它算作已制作网页实例，也无需先重写整套上游内容。

### EP19：网页已接入，尚未形成音频

项目登记 11/11，已有封面及 11 个正文页和音频分段文件，未找到 MP3。其 outline 同样保留 `awaiting-checkpoint-plan`；这与页面已经实现的事实并存，说明计划元数据或批准证据需要核对。不能仅凭旧字段断定用户从未批准，也不能凭已有实现补记批准。

## 4. EP21–51 上游内容状态

### EP21–32 已推进到视觉粗设草稿

12 集 `inputs/` 各有三份文件：`approved-spoken-text.txt`、A-page JSON、A-page 最终验证报告。报告均登记零 errors/failures；本次重新计算了批准口播和 A-page 的 SHA-256，均与报告记录一致。

每集的 rough 在 `.tmp/work/narration-pipeline/episode-XX/episode-XX-visual-rough.md`；验证报告在 `.tmp/validation/episode-XX/episode-XX-visual-rough-validation.json`。12 份报告均为 **draft、零 errors/failures**，本次核对 rough 文件哈希也全部一致。

这些 rough 尚未以 approved 正式版本及最终报告发布到 `inputs/`。所以这批的准确状态是“口播及 A-page 已落盘，rough 草稿通过已有机器检查，待审核与发布”，尚未具备下游要求的完整输入。

### EP33–34、EP37–51 仍停在口播草稿阶段

这 17 集已有 Brief、连续口播稿、润色及审查文件，但没有正式 `inputs/`。旧批次记录涵盖 EP21–34、EP37–51 共 29 集，不能把批次记录中的“润色通过”理解为整集批准。

需要注意的历史记录差异：

- 批次 README 仍写“未生成 A-page、视觉粗设”，已落后于 EP21–32 的实际文件；本汇报优先采用文件现状。
- 历史 post-polish 报告中 EP24、EP43、EP44、EP46 为 `blocked_by_content`。其中 EP24 现在已有正式口播和 A-page，说明后续已继续推进；本次未找到足以完整解释旧问题如何处置的批准链，故将其列为待核实项，而非直接宣布当前仍阻塞。
- EP44 的人工决策记录说明修改过草稿，导致旧审查哈希绑定失效；恢复该集时需针对现版核验，不能沿用旧结论。
- EP33 的审查虽然标记 `polish_passed`，仍保留内容义务缺口记录。“润色通过”与“内容完整”是两种口径。
- EP45 的任务包勘误文件已存在但尚未跟踪；恢复时应连同原任务包一起检查，避免遗漏既有更正。

过程记录入口：[批次说明](../.tmp/work/narration-pipeline/batch-ep21-51/README.md)、[人工决策](../.tmp/work/narration-pipeline/batch-ep21-51/human-decisions.md)、[剩余问题](../.tmp/work/narration-pipeline/batch-ep21-51/post-polish-findings.md)。这些文件为本机过程记录，不替代正式输入和用户批准。

## 5. 工作区与记录一致性

本次开始核查时，工作区已有 **37 个已跟踪文件被修改、40 个未跟踪文件，共 77 个路径**：

| 类别 | 数量 | 内容 |
| --- | ---: | --- |
| 已修改生产提示词与索引 | 34 | 总模板、批次 README、32 份单集提示词；记录有 10 月 13 日阶段 12/17 约束更新 |
| 已修改 EP20 文件 | 3 | project、entry、audio-segments |
| 未跟踪 EP20 文件 | 3 | A011 组件、样式、narrations |
| 未跟踪 EP21–32 文件 | 36 | 每集口播、A-page、验证报告各一份 |
| 未跟踪 EP45 文件 | 1 | 任务包勘误 |

HEAD 停在 10 月 2 日不代表此后没有工作；10 月 6 日的决策记录、10 月 13 日的提示词更新及未跟踪输入都没有体现在最新提交时间中。当前分支名称也不能替代产物核查。

另有三类容易误导恢复判断的记录：

1. `docs/production-prompts/README.md` 的原始筛选清单包含 EP18–20，实际 EP19–20 已进入制作，EP18 已有计划。执行提示词时仍需先查真实状态。
2. `player/src/catalog/generated.ts` 仍把 EP20 登记为 planned、0/0；当前 App 从 `catalog/projects.ts` 动态读取各集 project，未发现主应用导入该旧生成清单。它是陈旧快照，不作为本报告的进度依据。
3. 本机 `.local-status/` 工作台只提供辅助视图，人工记录覆盖不全，部分旧记录与现有音频文件状态不同。缺少记录不等于没有批准，存在旧记录也不能证明当前版本已验收。

本次保留所有已有修改，没有创建分支、提交或发布，也没有改写制作状态与批准记录。

## 6. 本次检查结果及边界

| 检查 | 结果 |
| --- | --- |
| `pnpm episode:check` | 通过：51 个实例，30 个 planned 无入口警告；与实际待制作数量一致 |
| `pnpm typecheck` | 通过 |
| `pnpm lint` | 原始命令退出 0；仅覆盖共享 src 与 tools，不包含 episodes。首次终端输出压缩解析异常，已用原始输出复核 |
| EP21–32 口播、A-page 哈希 | 与各自正式验证报告一致 |
| EP21–32 rough 草稿哈希 | 与各自临时验证报告一致；报告状态均为 draft |
| 页面视觉、MP3 试听、录制成片 | 本次未逐项验收 |
| 完整生产构建及工具回归测试 | 本次未执行；不能据上述检查声称完整交付通过 |

核查未读取历史 archives，也未检查仓库外交付目录或远端分支状态。因此视频数量、批准证据和交付状态都以本地已检查范围为限。任务包中法规、标准等事实本次没有重新联网核验。

## 7. 建议的恢复顺序

1. **先收尾 EP20。** 它已具备全部章节代码，明确缺项是 A009 教材原图、整集验收与音频。先核对 A011 未提交内容，最容易形成一个完整的恢复样本。
2. **补齐 EP18。** 保留已编译的计划，核实有效批准与主题后开始首章，补上 EP18–20 中的页面缺口。
3. **单独推进音频与录制。** EP11–17、EP19–20、EP36 共 10 集已有页面入口但没有 MP3，可按页面确认结果进入音频检查点。EP01–10、EP35 则先核对已有音频，避免重复合成。
4. **审核 EP21–32 的 rough。** 先解决批准依据与旧内容问题记录的对应关系，再发布完整正式输入，逐集进入 Phase 1。
5. **恢复 EP33–34、EP37–51 的口播审定。** 优先处理 EP43、EP44、EP46 的历史内容问题、EP33 的义务缺口及 EP45 勘误，随后再编译下游产物。

以上是恢复建议，不构成新增制作、音频付费调用或人工放行授权。对已存在且仍有效的用户批准，应继续沿用，无需重复批准。

## 附录：逐集核查表

下表的“正文进度”来自 project 登记；五件套表示文件存在，MP3 表示本地文件数量。它们都不替代质量验收。标题从任务包标题读取，以避免 planned 项目的占位标题影响识别。

| EP | 标题 | 状态 | 正文进度 | 正式输入 | 计划 | 页面入口 | MP3 |
| --- | --- | --- | ---: | --- | --- | --- | ---: |
| [01](../player/episodes/episode-01/project.json) | 工业互联网为何产生：从单点信息化到人机物互联 | in-progress | 12/12 | 五件套 | 有 | 有 | 35 |
| [02](../player/episodes/episode-02/project.json) | 工业互联网如何形成数据闭环 | in-progress | 15/15 | 五件套 | 有 | 有 | 49 |
| [03](../player/episodes/episode-03/project.json) | 新型工业化为什么需要工业互联网 | in-progress | 16/16 | 五件套 | 有 | 有 | 49 |
| [04](../player/episodes/episode-04/project.json) | 数字化转型的“连接—数据—智能”链条 | in-progress | 8/8 | 五件套 | 有 | 有 | 21 |
| [05](../player/episodes/episode-05/project.json) | 工业互联网标识：为什么“私码”难以跨企业 | in-progress | 11/11 | 五件套 | 有 | 有 | 37 |
| [06](../player/episodes/episode-06/project.json) | 标识解析体系如何把编码变成可查询信息 | ready | 13/13 | 五件套 | 有 | 有 | 37 |
| [07](../player/episodes/episode-07/project.json) | 我国标识解析从建设走向规模应用 | in-progress | 8/8 | 五件套 | 有 | 有 | 25 |
| [08](../player/episodes/episode-08/project.json) | 标识解析怎样贯通对象、环节与产业链 | in-progress | 12/12 | 五件套 | 有 | 有 | 35 |
| [09](../player/episodes/episode-09/project.json) | 发动机全生命周期管理：把分散系统串成追溯链 | in-progress | 10/10 | 五件套 | 有 | 有 | 32 |
| [10](../player/episodes/episode-10/project.json) | 主动标识如何改变模具生产管控 | in-progress | 10/10 | 五件套 | 有 | 有 | 35 |
| [11](../player/episodes/episode-11/project.json) | 药品供应链协同：从唯一标识到全链数据 | in-progress | 17/17 | 五件套 | 有 | 有 | 0 |
| [12](../player/episodes/episode-12/project.json) | 汽车零部件精益管理：一物一码如何减少错装与串货 | in-progress | 10/10 | 五件套 | 有 | 有 | 0 |
| [13](../player/episodes/episode-13/project.json) | 工业软件连接器：异构系统如何共享数据 | in-progress | 14/14 | 五件套 | 有 | 有 | 0 |
| [14](../player/episodes/episode-14/project.json) | 好的标识编码必须满足哪些原则 | in-progress | 10/10 | 五件套 | 有 | 有 | 0 |
| [15](../player/episodes/episode-15/project.json) | VAA 编码：从发码机构到企业内部编码 | in-progress | 11/11 | 五件套 | 有 | 有 | 0 |
| [16](../player/episodes/episode-16/project.json) | Handle 编码：前缀、后缀与分布式解析 | in-progress | 13/13 | 五件套 | 有 | 有 | 0 |
| [17](../player/episodes/episode-17/project.json) | OID 编码：树状命名如何保证唯一性 | in-progress | 12/12 | 五件套 | 有 | 有 | 0 |
| [18](../player/episodes/episode-18/project.json) | Ecode 编码：版本、体系标识与主码 | planned | 0/0 | 五件套 | 有 | 无 | 0 |
| [19](../player/episodes/episode-19/project.json) | GS1 与五类编码体系怎么选 | in-progress | 11/11 | 五件套 | 有 | 有 | 0 |
| [20](../player/episodes/episode-20/project.json) | 从前缀到后缀：设计一套可落地的编码规则 | in-progress | 11/11 | 五件套 | 有 | 有 | 0 |
| [21](../player/episodes/episode-21/project.json) | 工业大数据从哪里来、怎样产生价值 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [22](../player/episodes/episode-22/project.json) | 主数据、业务数据、元数据与数据字典的边界 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [23](../player/episodes/episode-23/project.json) | 工业数据共享如何跨越产线、工厂与产业链 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [24](../player/episodes/episode-24/project.json) | 数据要素为什么需要标识体系 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [25](../player/episodes/episode-25/project.json) | 标识数据模型：从数字对象到属性与事件 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [26](../player/episodes/episode-26/project.json) | 二级节点 OpenAPI：一次请求包含什么 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [27](../player/episodes/episode-27/project.json) | 用 Apifox 调试标识数据模板接口 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [28](../player/episodes/episode-28/project.json) | 顶级节点与企业节点分别负责什么 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [29](../player/episodes/episode-29/project.json) | 二级节点为什么是承上启下的公共服务平台 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [30](../player/episodes/episode-30/project.json) | 三级业务管理系统如何完成前缀申请与注册 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [31](../player/episodes/episode-31/project.json) | 递归解析：一次查询怎样逐级找到企业数据 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [32](../player/episodes/episode-32/project.json) | 标识创新应用的端到端业务闭环 | planned | 0/0 | 口播+A-page+报告 | 无 | 无 | 0 |
| [33](../player/episodes/episode-33/project.json) | 一维码与二维码：容量、识读和工业场景怎么取舍 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [34](../player/episodes/episode-34/project.json) | RFID 如何实现非接触识别与批量读取 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [35](../player/episodes/episode-35/project.json) | 标识载体选型：材质、工艺、环境与成本 | ready | 12/12 | 五件套 | 有 | 有 | 36 |
| [36](../player/episodes/episode-36/project.json) | 标识载体设计：尺寸、位置、耐久与信息层级 | in-progress | 13/13 | 五件套 | 有 | 有 | 0 |
| [37](../player/episodes/episode-37/project.json) | 主动标识载体与 UICC：为什么能主动、安全地联网 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [38](../player/episodes/episode-38/project.json) | 通信模组与工业互联网终端怎样承载工业 ID | planned | 0/0 | 无 | 无 | 无 | 0 |
| [39](../player/episodes/episode-39/project.json) | 主动标识如何完成注册与数据上报 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [40](../player/episodes/episode-40/project.json) | 主动标识服务架构：终端、载体与平台如何协作 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [41](../player/episodes/episode-41/project.json) | SM1 与 SM2 在主动标识安全中的不同角色 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [42](../player/episodes/episode-42/project.json) | 主动标识适合哪些行业场景 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [43](../player/episodes/episode-43/project.json) | 二级节点怎么建：牵头主体与部署模式 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [44](../player/episodes/episode-44/project.json) | 二级节点建设的技术底线：数据、接口与性能 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [45](../player/episodes/episode-45/project.json) | 二级节点如何持续运营：服务、人员与报告机制 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [46](../player/episodes/episode-46/project.json) | 二级节点安全保障的六个层面 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [47](../player/episodes/episode-47/project.json) | 企业节点的五项核心功能 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [48](../player/episodes/episode-48/project.json) | 企业节点数据如何同步与治理 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [49](../player/episodes/episode-49/project.json) | IDHub 企业节点产品架构 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [50](../player/episodes/episode-50/project.json) | 自建还是托管：企业节点建设模式怎么选 | planned | 0/0 | 无 | 无 | 无 | 0 |
| [51](../player/episodes/episode-51/project.json) | 企业前缀申请：从准备信息到完成校验 | planned | 0/0 | 无 | 无 | 无 | 0 |

