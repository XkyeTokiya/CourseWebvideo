# 任务包瘦身方案（Task Package Slimming Design）

- 日期：2026-08-07
- 状态：DRAFT_FOR_REVIEW
- 适用范围：51 集单集任务包（`episodes/<模块子目录>/episode-XX-…-task-package.md`）
- 上游依据：ep02 / ep23 / ep42 三集任务包全文、下游两轮消费方代码与技能文档、2026-08-07 只读核验子代理报告

## 1. 背景与链路

任务包是已冻结的制作基线。下游链路为：

```
任务包（冻结）→ 口播润色（outputs/narration-scripts-polished/）
              → B/N 重拆分与重映射（规划中）
              → HTML PPT 制作（classroom-html-ppt 技能）
```

本方案回答：在链路中，任务包哪些章节已无下游消费者，可以删除或压缩；哪些必须保留。结论经 2026-08-07 只读核验子代理逐条复核（11 条判定，8 条 CONFIRMED、2 条修正、1 条 PARTIAL），证据见各条目内 file:line。

## 2. 下游消费面（核验基线）

| 消费方 | 读取范围 |
|---|---|
| `validate_narration.py`（润色轮） | 不解析章节，仅对 51 包 + 51 稿做 SHA-256 冻结校验（`baseline-sha256.json`，102 项输入） |
| `scripts/task_package.py`（PPT 轮） | 架构状态行、package 状态行（§11「当前状态」兜底）、§3.2 证据表三列、§7 B 表、§8 媒体表三列、§6 `[Nxxx]` 块、activity_mode 文本模式 |
| `classroom-html-ppt/SKILL.md` + 契约 | mode 路由要求包内含 validation report；明令不得重推断 objective / narrative strategy / adjacent boundaries / protected facts |
| 治理文档（`course-video-progress.md`、模块解耦报告） | 引用 §7.1 作为权威映射基准（2026-07-28 解耦曾据 7.1 校正 B 表） |

## 3. 处置清单

### 3.1 删除（整章）

| 章节 | 依据 |
|---|---|
| §3.1 输入盘点与读取状态（I 表） | 全仓 0 消费；I00x 定位符仅被 §3.2 source_locator 列引用；缺口信息已在 §3.3 / §8 / §10 / §11 重复出现 |
| §5 Content Structure（movement 表） | movement ID（ep23 C01–C08）仅存在于本节自身；信息被 §7 B 表（叙事功能/时间/证据/讲稿 ID/揭示顺序/转场）+ §3.3 + §10 完整覆盖 |
| ep39 / ep41 / ep42 文末英文完成段 | 0 消费者；非单集独有 |

### 3.2 删除（字段级）

| 字段 | 依据 |
|---|---|
| §2 编排理由（ep23/ep42 名「保留/拆分理由」） | 全仓 0 消费；PPT 技能消费的是目标与边界结论而非拆分论证 |
| §4 选择依据 | 同上 |
| §3.2 read_status 列 | `task_package.py` 仅强制 evidence_id / content_identity / verification_status 三列 |

### 3.3 压缩（保留必需字段，删除过程叙事）

| 章节 | 保留 | 删除 |
|---|---|---|
| §11 Validation Report | 状态行（ep02 无 `Package status` 行，§11 状态行是其唯一解析来源，删则报 `missing package validation status`）；未解决缺口；动态核验 | 证据覆盖过程叙事、验证器结果（勿再引用已不存在的 `count_narration_equivalent.py`）、模块间解耦复核、人工语义复核、下游生产声明 |
| §10 阶段自限条款 | 其余全部约束（activity_mode 正则依赖「不得新增…」措辞） | 「本任务包阶段不得生成/下载/修改/复制任何下游资产」类条款（ep23 #14 完整、ep42 弱化版在 §8/§11、ep02 缺）——约束对象是任务包作者而非下游 |

### 3.4 保留（每轮硬输入）

§1 状态行/时长/内容类型、§2 其余字段、§3.2 证据台账主体、§3.3 事实边界、§4 其余字段、§6 口播母版 + 时长、§7 B 表、§8 媒体表 + 8.1/8.2 提示词、§9 视觉动效、§10 主体。

## 4. §7.1 校验器映射声明：保留（决议）

- 用户指定保留，作为后续 B/N 重拆分重映射轮的参考。
- 核验结论：§7.1 与 §7 表「讲稿 ID」列 + 表尾映射行**逐项相同，无独有数据**（无表外 N 段范围、无逐节拍规则）；脚本层 0 读取；但治理文档层有消费先例——`module-3-decoupling-report.md:56`、`module-4-decoupling-report.md:58` 记载 2026-07-28 解耦改造据 §7.1 校正 B 表错误。
- 结论：**保留**。代价是 §7.1 与 B 表构成双份映射，B/N 重映射轮必须同步维护两处；同时 ep42 的 §7 无「恰好映射一次」尾行，§11 压缩后 §7.1 成为 ep42 唯一显式映射清单，保留价值上升。
- 与其余删减项无依赖冲突：§7.1 不引用 §3.1 / §5 / §11。

## 5. 已知问题与待办（本方案不处理，单独决策）

1. **ep42 activity_mode 实测为 `source-only` 而非 `forbidden`**：ep42 #8 措辞为「不得加入…」而非「不得新增…」，不命中 `task_package.py` 的 activity_mode 正则（`task_package.py:285-293`），PPT 轮会跳过 ep42 的 activity 检查。修复：ep42 #8 改为「不得新增…」措辞，或包内增加显式 `activity_mode: forbidden` 行。此为现存行为差异，与瘦身无关，但应在 PPT 轮前处理。
2. **章节命名不统一**：ep02 无「Package status」行、§7 无尾行映射；ep42 约束 #8 弱化；§2 小节名「编排理由」与「保留/拆分理由」并存。瘦身时建议顺手统一（仅措辞，不动结构）。
3. **§8.1 提示词表与解析器不兼容（2026-08-07 执行时发现并修复）**：含 `media_id`/`生成用途`/`完整提示词`/`负面约束` 表头的 §8.1 提示词表会被 `_parse_media` 误认成媒体计划表，抛出 `media table is missing ID or status columns`（瘦身前即存在，ep23/ep42 均如此）。修复：`scripts/task_package.py` 的媒体表识别增加状态列条件（仅含「证据状态」/「status」列的表才按媒体计划解析）。该修复是解析器侧改动，PPT 轮行为不变（媒体计划表仍按原逻辑解析）。
4. **执行记录（2026-08-07）**：瘦身脚本 `work/_slim_task_packages.py`（R1–R9 + R2b）+ 验证器 `work/_verify_slim.py` + I 引用清理脚本 `work/_inline_irefs.py` 已就绪。**最终状态：51/51 全部通过**（解析器 PARSE_OK、N/B/M/§7.1 与备份一致、M 状态枚举合法、`I\d{3}` 引用零残留）。执行与修复过程记录：
   - 3 个并行 subagent 执行 48 集（44 PASS / 6 FAIL），ep02/ep23/ep42 为样本自测（直接修改正式文件，流程上应使用副本——已记录为教训）；
   - 6 个 FAIL（ep07/21/22/25/35/49）逐个阅读处理：E 表 content_identity 误用媒体枚举（ep35 E012/E013、ep49 E008/E009 → 改 `primary-source fact`/`pedagogical analogy/scenario`）、M 表状态复合值 `source-based synthesis/redraw`（21 处 → 按图语义拆为 synthesis/redraw 单一值）、`verified supplemental source`（ep07 M003 → `verified local asset`）；
   - 全量扫描发现并修复的全局问题：B 表讲稿列名不统一（ep21/22/25「口播段落」、ep35「口播 ID」→「讲稿 ID」，解析器只认「讲稿 id」/narration）；7 个文件 §3.3/§8.2/§10/§11 文本中的 15 处 I 引用（§3.1 删除后悬空 → 内联为来源名称/角色）；19 个文件的 M 表 I 引用残留（R2b 仅在 §3.1 存在时执行，subagent 处理的文件未触发 → 用 `_inline_irefs.py` 从备份重建 imap 全量内联 26 处）；
   - 解析器侧修复（`task_package.py` +7 行）：媒体计划表识别要求含「证据状态」/「status」列，§8.1 提示词表不再被误解析（既有 bug，瘦身前即存在）；验证器 M_enum 用 `_canonical_media_status`（canonical 化后校验）并修复局部 import 吞 NameError 的问题。

## 6. 执行顺序与时序约束（2026-08-07 决策：瘦身先行）

1. **实际执行顺序（用户决策，2026-08-07）**：先瘦身、后润色。安全前提已由 verify 确认——瘦身只删审计/过程章节，**N 段（口播母版）、B 表、M 表、§7.1 逐字节未动**，润色内容基线完好。
2. `baseline-sha256.json` 对 51 包 + 51 稿的 SHA-256 冻结已因瘦身失效（51 个任务包哈希全部变化）；**待润色轮启动前重新生成快照**（旧快照另存 `.pre-slim`），恢复 `validate_narration.py` 运行。当前润色轮处于 `INPUT_CHANGED` 停摆状态（有意为之）。
3. 删减前已打包备份（`work/task-package-backup/task-packages-2026-08-07-ea5e7ee.zip`，51/51 哈希已验证），回退通道完好（git 未提交前可 `git checkout` 整批还原）。
4. 本次瘦身+修复作为一次独立、有记录的变更提交（含脚本、验证器、规格、design 文档、解析器修复）。
5. B/N 重映射轮与 PPT 轮消费瘦身后的包；PPT 轮最小可解析面在删减后完整（51/51 解析通过）。

## 7. 验证方式

- 删减后对任意一集运行 `python work/classroom-html-ppt-skill-revision/scripts/task_package.py`（解析器）确认无 `PackageParseError`。
- 全仓库 grep「校验器映射声明」「输入盘点」「C0\d」确认无悬空引用。
- 备份 zip 内 `MANIFEST.sha256` 与打包前文件逐一比对。
