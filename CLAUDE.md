# Courseplay Web Video Monorepo

本仓库以单一 Git 项目连接内容上游与 Web Video 播放器。本文是主 Agent 的完整治理入口；阶段字段、创作模板和错误码由对应 Skill 与作者契约定义。

## 工作入口与阅读规则

- 上游内容生产、上游开发和跨项目任务从仓库根目录开始。涉及上游时，必须完整阅读 [上游独有约束](narration-pipeline/CLAUDE.md)，不依赖进入子目录后自动加载。
- 下游开发从 `player/` 开始。主 Agent 必须完整阅读本文及 [Player 执行契约](player/CLAUDE.md)。明确受委派的下游 subagent 按 Player 文件的独立模式执行。
- 同一上下文中已完整读取且未变化的文件无需每轮重读；新上下文、文件变化或无法确认已读取时重新加载。任务进入新阶段时，补读该阶段必需材料。
- 委派下游任务时，明确身份、episode、修改范围、验收要求和已有用户批准；优先提供有界任务上下文，避免无必要地复制完整主会话。subagent 不自行替代主 Agent 作跨项目决策。
- 文档约定只控制主动阅读，不能阻止宿主自动加载父目录指令或继承会话；已加载的适用规则仍须遵守。

## 任务路由

下表路径相对仓库根目录。只加载当前任务需要的阶段；根目录工作不改变脚本的工作目录约定。

| 任务 | 必读入口 |
| --- | --- |
| 连续口播、批准口播、A-page v6 | `narration-pipeline/.agents/skills/rewrite-course-narration/SKILL.md` |
| Visual rough v4、视觉结构 | `narration-pipeline/.agents/skills/design-course-visual-rough/SKILL.md` |
| Stage 1 口播润色 | `narration-pipeline/.agents/skills/polish-stage1-narration/SKILL.md` |
| 中文表达自然度 | `narration-pipeline/.agents/skills/humanizer-zh/SKILL.md` |
| 下游章节、presentation、章节验收 | `player/CLAUDE.md` 与 `player/.agents/skills/web-video-presentation/SKILL.md` |
| 工具、共享运行时、配置维护 | 对应子项目 CLAUDE、受影响契约、实现与测试；涉及生产行为时补读对应 Skill |
| 文档维护 | 受影响文档及其规则来源；不因修改 Markdown 而启动完整生产流程 |
| 跨项目修改 | 两侧 CLAUDE 及实际受影响的阶段契约 |

开始使用 Skill 前完整阅读其 `SKILL.md`，按其指示读取必需 references、examples 和模板。生产作者不得通过实现推断公开创作规则；维护工具时可以检查实现与测试，但不能擅自改变生产契约。历史报告、taste 记录和 `.tmp` 不作为当前规则来源。用户点名的 Skill 必须使用；缺失时说明阻塞，不静默替换必需流程。

## 数据流与批准

```text
narration-pipeline/episodes/（冻结任务包）
  -> .tmp/work/narration-pipeline/<episode-id>/
  -> 人工批准与验证
  -> player/episodes/<episode-id>/inputs/
  -> Phase 1 计划 -> Checkpoint Plan
  -> 章节制作 -> 第 1 章完整版本验收
  -> Checkpoint Audio -> 音频、录屏与交付
```

- 任务包是只读事实源。下游只消费已发布的正式内容，不从任务包、过程文件或历史归档补齐语义，也不反向修复任务包。
- 批准连续口播、批准 visual rough、Checkpoint Plan、第 1 章完整版本验收、Checkpoint Audio 均由用户放行，不能由机器验证替代。已取得且仍适用于当前内容的批准无需重复请求。
- `inputs/` 包含三份正式内容及对应最终验证报告；报告是治理证据，不是章节创作素材或 Phase 1 运行依赖。具体发布清单由上游 CLAUDE 定义。
- 输入缺失、批准不一致或契约冲突时，报告具体文件和问题，在解决前不推进依赖该输入的阶段。

## 文件与输出位置

以下路径均相对仓库根目录：

| 路径 | 用途 |
| --- | --- |
| `.tmp/work/<领域>/<episode-id>/` | 过程文件；领域为 `player` 或 `narration-pipeline` |
| `.tmp/runtime/<service>/` | 服务日志、PID、watch 输出 |
| `.tmp/validation/<episode-id>/` | 临时验证报告、检查截图、试录 |
| `.tmp/tests/<task>/` | 临时测试夹具与备份；正式回归测试仍放各工具的 tests 目录 |
| `.tmp/archives/<archive-id>/` | 封存历史，不是生产输入 |
| `player/dist/` | 标准生产构建产物，布局由下游契约定义 |

Agent 手工创建的临时文件只放上述根级 `.tmp/` 分区，不新建子项目 `.tmp/`、`output/` 或在 `.tmp/` 顶层放文件；工具管理的构建缓存和发布暂存目录遵循工具实现。每期默认一个 work 目录，确有并行尝试才增加 `attempt-*`。正式录屏与成片写入任务指定的交付目录；未指定时先保存在本期 work 目录，并在交付时说明位置。

正式产物发布且确认无需恢复后，只清理本任务的 work 子树；不顺带清理其他任务或 runtime、validation、tests、archives。未经用户明确授权，不读取或解压 `.tmp/archives/`。

## 修改与 Git

- 单一 Git 根位于本目录。开始修改前确认状态，保留他人改动，只提交本任务明确修改的路径。
- 不提交 `.env`、凭据、令牌、依赖目录、构建产物、缓存、`.tmp/` 或旧归档；不能只依赖 gitignore 判断是否可提交。
- 按子项目要求执行与改动相关的验证。文档改动检查链接、路径、命令与规则一致性；跨项目路径修改还要检查两侧活跃 Skill、references、templates、脚本和配置中的旧路径，并运行受影响测试。历史记录允许保留已标注的旧路径。
