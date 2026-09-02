# Baseline Observations — Why rewrite-course-narration exists

> 记录于 Skill 落地前（2026-08-09）。仅收录磁盘上已有的证据，不做新的 EP40 文稿质量判断，不重新审稿，不运行生成任务。

## 1. 流程失败证据（四个已发生的高代价问题）

### F1. 重型 Prompt / 状态契约膨胀

- 证据路径：`..\.tmp\narration-pipeline/2026-08-08/narration-rewrite-pipeline-v4/verify_prompt_pipeline_contract.py`
- 该验证器同时承担：Prompt 文案静态契约（`validate_rewrite_prompt` / `validate_compiler_prompt` / `validate_readme`）、Brief schema 校验（`validate_narration_brief`）、长度门禁（`validate_narration_length`）、SHA-256 冻结（`canonical_sha256`）、`source_b_disposition` 全量处置校验（`validate_compilation` :347-370）、四项模型自声明 `checks: true`（:372-380）。
- 交接文档 `SESSION-HANDOFF.md` 明确记录：用户倾向“不需要太工程化，不希望增加太多校验”，“这些重型自动化大多不必实现”。

### F2. 用户批准前已存在 stale canonical

- 证据路径：`..\.tmp\narration-pipeline/2026-08-08/narration-rewrite-pipeline-v4/pilot-ep40/canonical-spoken-text.txt`
- `SESSION-HANDOFF.md` 记录：“仍对应被否决旧稿，已过期，禁止用于 Stage 2”。
- 说明：该文件在用户批准之前就被生成，且在用户否决对应稿件后仍停留在生产路径根目录，容易被误认为已批准母版。

### F3. 失败 Stage 2 仍位于生产路径

- 证据路径：`..\.tmp\narration-pipeline/2026-08-08/narration-rewrite-pipeline-v4/pilot-ep40/stage2-bs-nx-compiled.json`
- `SESSION-HANDOFF.md` 记录：当前状态为 `RETURN_TO_REWRITE`，因 B08 跨集职责冲突而 fail-closed。
- 说明：一个未成功、未冻结的编译结果仍留在 pilot 根目录，可能被后续执行者误认为可续跑的产物。

### F4. 测试树存在未实现 RED

- 证据路径：`..\.tmp\narration-pipeline/2026-08-08/narration-rewrite-pipeline-v4/tests/test_prompt_pipeline_contract.py`
- 其中两项测试引用了验证器中不存在的错误码：
  - `test_rewrite_prompt_requires_learner_facing_boundary_conversion` 引用 `REWRITE_LEARNER_BOUNDARY_CONVERSION_MISSING`；
  - `test_rewrite_prompt_guards_unlicensed_strong_modal_claims` 引用 `REWRITE_STRONG_MODAL_GUARD_MISSING`。
- `verify_prompt_pipeline_contract.py` 的 `validate_rewrite_prompt`（:22-49）中没有对应实现，测试为确定性 RED。
- `SESSION-HANDOFF.md` 明确建议：走轻量路线时删除/回退这两项未完成测试，不继续扩大规则体系。

## 2. 现行口播入口的收敛结论

- 既有 N 稿处理链路及其历史产物已由仓库治理停用，不再作为任务选项、输入来源或回退路径。
- `rewrite-course-narration` 是唯一启用入口：从冻结任务包提炼 Brief → 隔离生成连续口播 → 人工批准 → 重建 Bs/Nx。
- 需要新口播时必须重新走完整流程，不继承旧 N 映射，不复用历史母版，也不恢复停用链路。

## 3. 执行前 git 状态（保护边界）

- 分支：`feature/narration-task-packages`
- `git status --short` 共 186 条变更，包含大量他人 staged 删除（`D`）、重命名（`R`）和未跟踪（`??`）内容，例如：
  - `D outputs/episode-01/...`（多份 HTML 与图片素材）
  - `R ..\.tmp\narration-pipeline/narration-polish-v1/baseline-sha256.json -> ..\.tmp\narration-pipeline/2026-08-06/narration-polish-v1/baseline-sha256.json`
  - `?? .hermes/`、`?? outputs/`、`?? ..\.tmp\narration-pipeline/2026-08-08/`
- `..\.tmp\narration-pipeline/2026-08-08/narration-rewrite-pipeline-v4/` 整体处于未跟踪状态（`??`），其中的删除操作（测试收敛、`__pycache__`、`_should-not-exist.txt`）无法从 git 恢复。
- 执行者承诺：不清理、不回滚、不归因任何既有 staged/untracked 内容；冻结任务包保持只读。

## 4. 执行边界（本 Skill 落地任务）

- 本次只创建新 Skill 并收敛历史区；不选择、不修改、不继续评审任何 EP40 候选稿。
- 不新增 runner、状态机、哈希冻结、自动 Stage 0 编译器、自动 Stage 2 求解器或一键流水线。
- 不修改冻结任务包或任何历史口播产物。
- 不提交、不推送。

## 5. RED 证据（任务 2，实现前首次运行）

命令：

```bash
python -m unittest discover -s .agents/skills/rewrite-course-narration/tests -p "test_*.py" -v
```

结果：8 个测试全部 ERROR，失败原因均为**目标资产缺失**，不是导入、编码或路径错误：

- `test_skill_contract.py` 7 项：`FileNotFoundError: ...rewrite-course-narration\SKILL.md`（Skill 主文尚未创建）。
- `test_verify_compilation.py` 1 项：`unittest.loader._FailedTest`（`scripts/verify_compilation.py` 尚未创建，importlib 加载失败）。

该 RED 状态在创建 `SKILL.md`、`agents/openai.yaml`、`references/`、`templates/` 与 `scripts/verify_compilation.py` 后应转为 GREEN。

## 6. A 页面 v2 改造前压力基线（2026-08-25）

按 writing-skills 的压力测试要求，用现行 Skill 检查“批准母版不按原任务单元切页、开篇与回扣页复用辅助媒体”的场景。基线结论：

- Stage 2 明确把 A 解释为非页面 alignment step，并把“一 A 一页”列为废弃做法；下游无法把 A 直接作为页面制作主体。
- v1 正式结构强制输出 `source_b_ids`、`alignment_step_id`、`bs` 和 `steps`，正式验证报告也记录原 B 覆盖与按 B 的时长责任。
- episode-03 的 M003 在完整 Media Plan 中明确支持开篇和回扣，但旧规则只允许引用当前 B 表媒体列；开篇与回扣会触发 `MEDIA_NOT_FROM_SOURCE_B` / `MEDIA_SOURCE_EMPTY`，从而错误丢弃合法媒体。
- `visual_form` 被用作媒体资格门，且同一媒体在一个原 B 拆分出的多个 step 中只能挂一次，形成“主建图步”耦合。

这些失败分别由新的 Skill 契约测试、B 泄漏测试、E/M 自包含测试、trace 覆盖测试，以及 episode-03 的 M003 迁移验收转为 GREEN。

同一压力场景在改造完成后只读复测，5 项均通过：A 明确等于页面、B 只停留在编译 trace、正式 JSON/报告无 B ID、episode-03 的 M003 同时落在 A001 与回扣页 A013、`visual_form` 不参与媒体资格判断，且小于 8 秒页面触发默认合并门。

## A-page v3 图片配额 RED 基线（2026-08-25）

按 `writing-skills` 要求，修改当前 Skill 前先让隔离 subagent 只读取现行 v2 Skill、Stage 2 模板与 schema，并施加三项联合压力：11 个已稳定 A 页面、冻结 Media Plan 含 6 个可跨页复用 M、交付窗口只剩 20 分钟且负责人要求尽量复用旧计划。

现行 Skill 的实际决策是：

- 将旧 Media Plan 的 M001–M006 全量复制进正式 `media_catalog`；
- 允许 A001–A011 全部成为图片页，且允许单页引用多个 M；
- 明确允许同一 M 在开场、正文和回扣页跨页复用；
- 因 v2 schema 必填而保留 `fallback`、`protected_meaning`、`aspect_ratio`；
- 不为图片页配额、AI 图多数或媒体去重调整引用。

subagent 对目标逐项判定：11 页恰好 4 个图片页、每页最多一图、M 不跨页复用、AI 图严格多数、无 fallback/重绘类型均为“不满足”或“无法保证”。这构成 v3 Skill、schema 与 validator 的 RED 基线。

## A-page v3 图片配额 GREEN 压力复测（2026-08-25）

按相同压力场景完成 5 个无指导控制样本与 5 个读取新版 Skill/Stage 2 模板的隔离样本。所有样本均不修改文件。

### 无指导控制（5/5 失败）

- 图片页安排为 9、10 或 11 页，或直接沿用旧计划而不承诺固定数量；没有样本得到 4 页硬配额；
- 全部保留旧 6 个 M，并明确支持跨页复用；
- 全部保留 `source-based redraw`、`fallback`、`aspect_ratio` 等旧字段；
- 主要理由都是“20 分钟内降低返工风险”和“负责人要求尽量复用旧计划”。

### 新版 Skill（5/5 通过）

- 全部机械计算 `Q=ceil(11/3)=4`，明确其余 7 页必须 `media_refs=[]`；
- 全部要求恰好 4 个独立 M，按图片页顺序编号 `M001`–`M004`，每项只引用一次；
- 全部要求至少 3 个 `photorealistic_ai`；教材原图只有证据可解析时才允许 1 个，否则采用 4 个 AI；
- 全部拒绝读取或复制旧 Media Plan，拒绝跨页复用、`source-based redraw`、fallback、画幅和详细图片字段；
- 全部把实际图片生成或取得延后到 PPT 结构完成后的 `post-deck` 阶段；
- 全部明确时间压力与负责人偏好不能覆盖 v3 发布契约。

对照说明行为变化来自新版 Skill 的明确规则，而不是场景本身。配合 canonical validator 负例，三分之一配额、唯一 M、AI 严格多数与延后资产解析均已从 RED 转为 GREEN。
