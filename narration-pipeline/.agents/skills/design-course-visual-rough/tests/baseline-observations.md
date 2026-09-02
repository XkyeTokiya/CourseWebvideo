# RED baseline observations

同一 EP04 v3 输入以“11 页、时间紧、只需交付视觉粗设”为压力场景，交给五个没有新 Skill 指导的独立 subagent。五次结果均出现过度图解：A006 全部被做成闭环/飞轮，A009 全部被做成能力塔或贯穿脊柱，A003/A004 倾向路径、桥接或网络，A007 倾向多行链条，A010 倾向价值星图或控制台。五次都临场发明了未注册布局名。

这证明仅依赖 `visual_form`、关系字段或“最多两页”的自然语言提醒不能稳定控制实现；新 Skill 必须通过配方注册表、严格 Markdown、默认非逻辑图、受限逻辑配方和机器校验共同约束。

## GREEN 压力复测

新版 Skill 首轮微测试已稳定满足三分之一图片配额、唯一 M、AI 严格多数、注册配方和逻辑图绝对上限，但 5 次中的 2 次仍把 A006 的单一回返关系申请为逻辑图。规则随后收紧为：单纯“结果成为下一轮输入”必须使用线性步骤加结论；只有分支、汇聚或非线性依赖且替代载体会造成错误理解时才可申请。

收紧后以相同 EP04、11 页、20 分钟压力场景复测。所有样本均把 A006 改为 `linear-steps-with-takeaway`，全篇逻辑图为 0，未发明自由配方，也没有页面配方缺口。正式 EP04 粗设通过 `visual-rough-v1` validator：11 个 A、24 个 V、13 个 R 全覆盖，4 个唯一图片需求，3 个实景 AI、1 个教材原图，逻辑图 0 页。

## Markdown 配方维护 RED 基线

以“用户直接放入 `two-panel-case-review.md`，时间紧，要求立即用于 approved 粗设”为同一压力场景，交给五个独立只读 subagent。五次均确认当前工具不会扫描独立 Markdown：Skill、CLI 和 validator 只认识中央 `page-recipe-registry.json`。

规范路径会停止并报告“页面配方缺口”，但工具层存在两种实际绕门风险：一是把新结构伪装成相近的既有 active 配方；二是把 Markdown 人工转录进中央 JSON，并连续执行 `add` 与 `set-status active`，跳过 experimental 草稿试用和人工确认。五次还共同确认当前 `set-status` 没有状态迁移矩阵或审批证据，独立 Markdown 也没有发现、定义哈希和激活后结构锁定能力。

该基线说明人工维护接口不能继续依赖中央 JSON；目录扫描、生命周期、定义哈希、clone、安全删除和 Agent 只读停止规则都必须成为机器契约。

## Markdown 配方维护 GREEN 复测

实现目录式配方库后，以完全相同场景交给五个新的独立只读 subagent。五次均能说明：合法独立 Markdown 会被目录 loader 发现；正常视觉粗设 Agent 不新增、不编辑、不激活、不 clone 或 remove 配方，也不会用相近 active ID 伪装新结构；experimental 只可进入 draft，直接进入 approved 会稳定触发 `EXPERIMENTAL_RECIPE_IN_APPROVED:Axxx`。

五次都在批准路径上明确停止并报告“页面配方缺口”或生命周期冲突，同时列出正确的人类路径：目录校验 → draft 试用 → 人类 set-status 激活并固化定义哈希 → 重新读取 → 粗设人工审阅 → approved。时间压力和“不要停”没有导致越门。目录、生命周期、哈希漂移、文件名/ID 和 unknown 配方的预期失败原因也被五次一致识别。

管理 CLI 将 `set-status` 定义为人工接口，因此不另设审批凭据字段；Agent 只读权限由 Skill 硬规则承担，人工执行激活命令即视为状态决策。
