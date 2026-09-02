# Courseplay 统一仓库完整任务流程与使用说明

> 适用范围：统一仓库 `D:/00-workspace/005-coursewebvideo` 下的两个工作边界；另外两个同名旧仓库属于 Agent 禁访目录。  
> 核定日期：2026-08-25。
> 本文负责跨仓库导航；进入具体任务后，仍以目标仓库的 `CLAUDE.md` 和仓库级 Skill 为执行权威。

## 1. 先记住：只有两个活跃仓库

| 仓库 | 状态 | 职责 | 主要输入 | 主要输出 |
|---|---|---|---|---|
| `005-coursewebvideo/narration-pipeline` | **活跃，上游、唯一任务包权威** | 冻结任务包、整篇口播重写、A-page v6 screen guidance、visual rough v3 | 本仓库 `episodes/**/episode-XX-*-task-package.md` | `../.tmp/narration-pipeline/` 中的 Brief/草稿/trace/待审粗设；`../player/episodes/episode-XX/inputs/` 中的正式语义 handoff 与已批准视觉粗设 |
| `005-coursewebvideo/player` | **活跃，下游 Web Video Studio** | Outline 投影、compact handoff、章节制作、审查与录屏 | 上游批准产物的根级输入镜像；Phase 2 只读当前 A packet | 最终章节、网页视频及审查产物 |
| `006-couseplay` | **已停用，Agent 禁访** | 不参与现行流程 | 禁止访问 | 禁止访问 |
| `006-couseplay-ep02` | **已停用，Agent 禁访** | 不参与现行流程 | 禁止访问 | 禁止访问 |

### 禁止误路由

- 口播、任务包、Brief、A 页面编译：进入 `005-coursewebvideo/narration-pipeline`。
- 下游生产任务进入 `005-coursewebvideo/player`，重新读取其 `CLAUDE.md` 与 `web-video-presentation` Skill；不得在上游实现页面、播放器或渲染。
- 润色流程已停用；不得读取或调用 `polish-course-narration`，不得把历史原稿、polished 目录或润色产物作为生产输入。
- 下游仓库中的 `episodes/` 是生产实例，不是任务包事实源；不得从中回推、修复或替代上游冻结任务包。
- 任何 Agent 均不得访问 `D:/00-workspace/006-couseplay/` 和 `D:/00-workspace/006-couseplay-ep02/`，包括列目录、搜索、读取、Git 检查、复制和参考产物。
- `PROJECT-DIARY.md`、`禁止任何 AI Agent 阅读.zip` 等受禁令保护的文件不得读取。

## 2. 总体数据流

```text
上游唯一权威任务包（只读）
                                ↓
                              Brief
                                ↓
                           隔离连续稿
                                ↓ 人工批准门 A
          ../.tmp/narration-pipeline/<任务>/episode-XX/批准母版、A 页面候选与 trace
                                ↓
           ../player/episodes/episode-XX/inputs/v6 guidance + 已批准 rough v3 及验证报告
                                ↓
       下游根级输入镜像 → script/现有 Outline → compact handoff v3
                                ↓
        三源章节创作 → reviewer → Web Video 成品
```

任务包始终是只读基线。任何流程发现任务包错漏，只记录异常并上报；不得为让下游通过而修补、重写或覆盖任务包。

## 3. 开工前的强制预检

### 3.1 确认仓库和分支

```powershell
cd D:/00-workspace/005-coursewebvideo/narration-pipeline
git branch --show-current
git status --short

cd D:/00-workspace/005-coursewebvideo/player
git branch --show-current
git status --short
```

预期活跃分支：

- 上游：`feature/narration-task-packages`
- 下游：进入 `005-coursewebvideo/player` 后，以实时 Git 状态为准，不预设分支。

保留所有无关工作区修改；不要把 `.gateway.env`、凭据、受保护 zip 或他人文件纳入提交。

### 3.2 锁定唯一任务包来源

所有任务只使用以下路径中的对应单期文件：

```text
D:/00-workspace/005-coursewebvideo/narration-pipeline/episodes/<module>/episode-XX-...-task-package.md
```

冻结任务包继续只从上游 `episodes/` 只读定位且不复制到 `../player/episodes/<episode-id>/inputs/`。下游 `episodes/` 只承载同步输入镜像、当前 Outline、handoff 与章节实例，不得作为任务包回退来源；正式 A JSON 自包含 E 目录，下游不得读取任务包或 work trace 补齐语义。

### 3.3 读取权威入口

上游任务：

1. `005-coursewebvideo/narration-pipeline/CLAUDE.md`
2. 当前期任务包全文
3. `.agents/skills/rewrite-course-narration/SKILL.md`

下游任务：

1. `D:/00-workspace/005-coursewebvideo/player/CLAUDE.md`
2. `.agents/skills/web-video-presentation/SKILL.md`
3. Phase 2 章节制作只读当前 `.handoffs/<Axxx>.json`、目标代码和 Skill 指定的最小 references，不读取任务包或完整上游源补齐内容。

## 4. 上游使用方式

### 4.1 唯一路径：整篇重写并编译 A 页面

口播处理不再进行流程选择。只允许使用 `rewrite-course-narration`；润色 Skill、脚本、原始口播目录和 polished 目录均不读取、不调用。

#### 阶段 1：提炼 Brief

- 输入：当前期冻结任务包，只读。
- 输出：`narration-brief.json`。
- Brief 不得复制旧口播，不得携带旧 N/B 编号、原 B 数量/边界或旧映射。

#### 阶段 2：隔离生成连续稿

- 唯一输入：`narration-brief.json` + `templates/stage1-short-prompt.md`。
- 禁止输入：任务包、旧稿、原 B 表、冲突台账、长 Prompt。
- 输出：无 Nx、A 页面和分隔线的自然连续口播草稿。

#### 阶段 3：人工批准门 A

按三条线审读：

1. 内容：事实、限定语、必要内容和相邻期边界；
2. 语言：能否直接说出口；
3. 叙事：开场问题、正文推进和结尾收束。

只有用户明确批准后，才能生成唯一 `approved-spoken-text.txt`。批准前不得切 Nx 或生成 A 页面。

#### 阶段 4：A-page v6 screen guidance 编译

- 一条 A 严格对应一页；每页有且仅有一个连续非空 Nx，`concat(pages[*].nx)` 必须与批准母版逐字符一致。
- 先按页面认知任务切 A；B、旧图片安排和视觉形式都不能反向决定 A 数量。
- 正式 JSON 自包含 E 目录，不包含 B ID、B 映射、B 时长、旧包装层、M 目录或任何视觉字段。
- `courseplay-a-page/v6` 冻结 Nx、教学语义、证据、关系、时间和 screen guidance；`reference` 不产生逐 S 落屏义务，`exact` 只锁定必须逐字可见的原子。页面配方、图片页、媒体类型与逻辑图资格由后续 `courseplay-visual-rough/v3` 承担。
- 编译期覆盖记录写入 work-only trace；trace 不属于 handoff。

单期过程产物放入独立 `work/<日期或任务名>/episode-XX/`，例如：

```text
  narration-brief.json
  stage1-continuous-draft.md
  episode-XX-b-to-a-compile-trace.json
  其他批准、审读与编译过程记录
```

`../.tmp/narration-pipeline/` 不是跨仓库正式输入。通过人工批准与完整验收后，发布到：

```text
../player/episodes/episode-XX/inputs/
  approved-spoken-text.txt
  episode-XX-a-page.json
  episode-XX-a-page-validation.json
  episode-XX-visual-rough.md                # 仅人工批准后
  episode-XX-visual-rough-validation.json
```

#### 阶段 5：机械验证 + 人工验收

```powershell
python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py `
  --validation-profile a-page-v6 `
  --task-package episodes/<module>/episode-XX-...-task-package.md `
  --compile-trace work/<task>/episode-XX/episode-XX-b-to-a-compile-trace.json `
  --approved-text ../player/episodes/episode-XX/inputs/approved-spoken-text.txt `
  --compiled-json ../player/episodes/episode-XX/inputs/episode-XX-a-page.json `
  --output ../player/episodes/episode-XX/inputs/episode-XX-a-page-validation.json
```

机械报告必须 `coverage_passed=true` 且 `failures=[]`；再人工确认：

1. 原 B 的必要职责和受保护信息无遗漏；
2. 每页 A 的必见语义与关系真正支撑对应 Nx；
3. 事实和相邻主题无越界；
4. exact 保持原子化。

满足后，语义层可发布批准稿、production A 页面 JSON 和当前验证报告。A 验证报告不包含视觉或媒体聚合。

#### 阶段 6：视觉粗设与人工批准门

- 视觉粗设读取已发布的 v6 A-page，使用 visual rough v3；G 只规划语义区域，不成为下游 UI section 或逐 G 落屏义务。媒体配额、关系载体与配方规则继承 v2。
- 页面配方唯一权威源为 `.agents/skills/design-course-visual-rough/references/page-recipes/*.md`。用户可复制模板或使用 `manage_recipes.py new` 新增 experimental 配方；正常 Agent 只能读取，不得新增、改写或激活配方。
- 新草稿只使用 active 配方。需要缺失配方时停止并报告“页面配方缺口”；deprecated 不进入新草稿，blocked 在任何当前验证中失败。
- 逻辑图只能使用具体、模板化、`is_logic_diagram=true` 的 restricted 配方，必须给出必要性理由并取得人工批准；全篇绝对上限两页，默认零页。宽泛 `logic-diagram` 被 blocked。
- 候选粗设先保存在 `../.tmp/narration-pipeline/<任务>/episode-XX/` 且 `status=draft`。只有用户明确批准后才能改为 `approved` 并发布到 `../player/episodes/episode-XX/inputs/`。
- 视觉粗设通过 `visual-rough-v3` 校验后再发布；实际媒体仍在下游章节结构中按既有流程就位。

## 5. 下游使用方式（Web Video Studio）

### 5.1 状态

旧的 `courseplay-html-ppt` IR 生产链已归档；当前正式下游是根级 Web Video Studio 与 `web-video-presentation` Skill。

- 下游 episode 根目录中的 A-page、rough、script 和批准稿是上游批准产物的同步输入镜像；Phase 2 章节 consumer 只读当前 `.handoffs/<Axxx>.json`。
- 版本组合固定为 v4/v1→handoff v1、v5/v2→handoff v2、v6/v3→handoff v3；跨版本直接拒绝。
- v3 章节综合 `screen_guidance`、当前 A narration beats 与 presentation 创作最终上屏内容，不新增 `screenContent` IR，也不要求普通 S/G 逐项落屏。
- 当前 Outline 的标题层级、字段顺序、四列表格与生成方式保持不变。

### 5.2 页面生产

每章开工或返工前先生成并检查当前 A 的 compact handoff；章节按下游 Skill 实现、typecheck/lint/build，并由契约与视觉 reviewer 验收内容充分性、exact 可见性、事实边界、时序和静音终态。

## 6. 四主题版式扩展已停用

`add-courseplay-layout` 只扩展旧四主题模板系统，已随旧链归档。未来新增版式必须通过独立、明确批准的设计与接入任务完成，不套用旧 layout family 脚本。

## 7. 标准 handoff 清单

### 上游 → 下游

- [ ] 明确期号、模块和目标任务；
- [ ] 下游只同步上游正式批准产物，不读取任务包或 work trace；
- [ ] 未把下游 `episodes/` 当作任务包事实源；根级 episode 文件只作为同步输入镜像与当前生产实例；
- [ ] 上游任务包保持只读；
- [ ] 正式 handoff 固定来自上游 `../player/episodes/episode-XX/inputs/`，不消费带日期的 `work/<任务>/...`；
- [ ] 新生产 A-page 为 `courseplay-a-page/v6`，visual rough 为 v3，源 SHA-256 匹配；v4/v1 与 v5/v2 只服务冻结兼容对象；
- [ ] `approved-spoken-text.txt` 已获明确批准；
- [ ] A 页面验证报告由当前 output 批准稿/A JSON、权威任务包与 work trace 重新生成，且 `coverage_passed=true`、`failures=[]`；
- [ ] 四项人工语义检查（含 exact 原子性）已记录；
- [ ] 报告中的 episode、输入 SHA-256 与 trace SHA-256 匹配当前磁盘原始字节，且没有 B ID。

### IR → HTML（已随旧链归档）

- [ ] 旧 Slide/Scene IR HTML Renderer 与 `classroom-deck/v1` runtime 已于 2026-08-18 归档；本项不再作为活跃下游清单。

### 旧 IR → 旧 HTML（已随旧链归档）

- [ ] 旧 IR renderer、旧验收命令与旧审稿状态机不再运行；本项不限制当前 Web Video Studio。

## 8. 常见停止条件

遇到以下情况停止并报告，不猜测、不降级：

- 上游权威任务包状态不合格、不可读或与用户要求冲突；
- 流程要求读取下游 `episodes/`、润色遗留内容或任一停用仓库；
- 连续稿尚未明确批准；
- 编译期职责、事实边界或媒体支撑不清；
- A 页面报告包含 failures，或 trace 存在未解决项；
- layout/slot 未登记；
- 必要媒体缺失且无合法回退；
- 未获得下一状态的明确授权；
- 正式检查失败或报告不是当前产物；
- 输出不可写、浏览器环境异常无法排除。

## 9. 一句话任务路由

- “润色第 XX 期既有口播” → 润色流程已停用，不执行；如需生产新口播，改走整篇重写并重新取得用户批准。
- “第 XX 期整篇重写，批准后编译页面” → 上游 `rewrite-course-narration`。
- “把已验收 A-page 制作为页面/scene” → 下游 Web Video Studio，先生成当前 A compact handoff。
- “制作或修改第 XX 期 Web Video” → 下游 `web-video-presentation`，遵守版本路由与 packet-only Phase 2 边界。
- “进入验收” → 旧 HTML 验收链已归档；下游不运行旧验收命令。
- “四套主题新增同一种版式” → 旧四主题扩展已归档；需独立批准的新设计任务。
- “查看历史 ep01/ep02 做过什么” → 拒绝访问已停用目录；现行任务只在两个活跃仓库内完成。


