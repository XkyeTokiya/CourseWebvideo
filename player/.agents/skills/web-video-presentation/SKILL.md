---
name: web-video-presentation
description: 将正式 Courseplay A-page v6 与 visual rough v4 制作为 Web Video Studio 中可播放、可录屏的 16:9 课程章节。仅支持 Courseplay 流程：Phase 1 runner 编译 script/outline，Checkpoint Plan 对齐，逐章开发，可选音频与录屏。
---

# Courseplay Web Video Presentation

本 Skill 只处理 Courseplay 正式生产输入。不接受普通文章、自由口播稿或独立网页
演示项目，也不创建独立 Vite 应用。播放器、主题、音频和路由均复用 `player/` 的
共享运行时。

## 唯一流程

```text
episodes/<episode-id>/inputs/ 正式输入
  → Phase 1: init → commit-chapter(Axxx) → finalize
  → script.md + outline.md
  → Checkpoint Plan
  → 第 1 章完整实现并由用户验收
  → 第 2~N 章按已选模式开发
  → Checkpoint Audio
  → 可选 TTS
  → 录屏
```

工作目录固定为 `player/`。不得创建旁路状态、独立 package、锁文件、Vite 配置、
开发服务器或另一套播放器。

## Episode 契约

```text
episodes/<episode-id>/
├── project.json
├── inputs/
│   ├── approved-spoken-text.txt
│   ├── <episode-id>-a-page.json
│   └── <episode-id>-visual-rough.md
├── script.md
├── outline.md
├── .handoffs/<Axxx>.json
├── audio-segments.json
├── media/audio/<chapter>/<step>.mp3
└── src/
    ├── entry.tsx
    ├── data/cover.json
    └── chapters/<NN>-<id>/
        ├── <Chapter>.tsx
        ├── <Chapter>.css
        └── narrations.ts
```

`inputs/` 是只读消费边界。`script.md` 与 `outline.md` 是 Phase 1 唯一持久状态；
`.handoffs/` 是可重建缓存。Phase 2 创建 `narrations.ts` 后，它成为运行时 step 数和
TTS 文本的唯一真相源。

## 分阶段必读

| 阶段 | 必读 |
|---|---|
| Phase 1 | `references/OUTLINE-FORMAT.md`、`references/COURSEPLAY-BOUND-MODE.md`、`references/COURSEPLAY-STATE-MECHANISMS.md` |
| 单章实现 | `references/CHAPTER-CRAFT.md`、当前主题、当前章 outline 与正式输入；可选当前 handoff |
| 主题选择或制作 | `references/THEMES.md` |
| 音频 | `references/AUDIO.md` |
| 录屏 | `references/RECORDING.md` |

显式生成 handoff 时另读 `docs/courseplay-handoff-v4-author-contract.md` 与 canonical
example；只有失败时读取错误索引。不要把工具实现当作者规则。

## Phase 1：Courseplay 内容编译

### 正式输入门禁

以下条件必须全部成立，否则 fail-fast：

- 文件位于 `episodes/<id>/inputs/`；
- A-page 为 `courseplay-a-page/v6`、`document_kind: production`；
- visual rough 为 `courseplay-visual-rough/v4`、`document_kind: production`、
  `status: approved`；
- episode、A-page 顺序、rough 来源文件及 SHA-256 一致；
- 每页 `a_id` 唯一且 `nx` 非空；
- 声明 `approved_text` 时，全部 `nx` 顺序拼接与批准稿一致。

不得从上游任务包、`.tmp`、归档、旧 episode 或根级重复文件补齐输入。

### Runner

```powershell
pnpm courseplay:phase1 -- preflight --episode <episode-id>
pnpm courseplay:phase1 -- init --episode <episode-id>
pnpm courseplay:phase1 -- commit-chapter --episode <episode-id> --a-page A001 --script <candidate> --outline <candidate>
pnpm courseplay:phase1 -- finalize --episode <episode-id>
```

`init` 只根据 `pages[]` 与 `a_id` 创建确定性外壳。文件不存在时创建；已有合法
Courseplay 模块化产物时恢复；其他既有内容拒绝覆盖。

逐 A-page 编译：

1. 从当前页不可改写的 `nx` 按语义焦点切成 Beat。
2. 从 Beat、screen guidance 与 visual rough presentation 派生当前 outline section。
3. 自检 nx 无损、Beat/step 一一对应、稳定 ID 和受保护关系完整。
4. 用一次 `commit-chapter` 原子提交内容对。

候选文件不得含 runner marker。章节提交后不整份覆盖正式文件。恢复只使用
`status` / `resume` 定位最小失效章；A-page 集合或顺序变化必须显式迁移。

`finalize` 验证全部章节并生成 metadata、视觉调度和素材汇总，将状态设为
`awaiting-checkpoint-plan`。语义或视觉问题只重提被定位章节。

### Courseplay 视觉语义

- narration beat = step；只由批准 `nx` 的语义边界决定。
- 每个 A-page 默认一个持续 base-scene。
- semantic state 描述每拍结束时的稳定画面；相邻 step 可以复用同一 state。
- relationship mechanism 表达顺序、并列、对照、汇聚、定义或读图，不决定 step 数。
- accent-frame 只用于值得独立停顿的核心判断，保持低成本。
- custom-scene 必须写明必要性，以 `proposed` 进入 Checkpoint Plan。
- 不得从 G/U、槽位、recipe 或时长反推 Beat/state 数。

## Checkpoint Plan：必须暂停

完成 Phase 1 后，一次对齐：

1. `script.md` 是否保持批准口播与合理 Beat；
2. `outline.md` 的持续构图、状态、强调页与 custom-scene；
3. 明确选择主题，并写入 outline metadata 与 `project.json.theme`；
4. 真素材、placeholder 与缺失项；
5. 开发模式：A 逐章确认（默认）、B 首章后顺序完成、C 首章后并行。

同时报告 Base scenes、Accent frames、Custom scenes 与 Narration beats。不得把
narration beat 数称为页面数。custom-scene 未获用户确认不得进入实现。

## Phase 2：章节开发

### 第 1 章是强制锚点

第 1 章由主线程完成可直接验收的完整版本，包括节奏、视觉、真实素材或明确
placeholder。完成并通过检查后必须停下等待用户验收；不得先批量开发后续章节。

### 后续章节

- 模式 A：每章完成后等待验收。
- 模式 B：主线程顺序完成后统一验收。
- 模式 C：按用户指定并行数交给 subagent；每个 subagent 只改本章与实例入口。

handoff 是可选上下文包：

```powershell
pnpm courseplay:handoff -- --episode <episode-id> --a-page <Axxx>
```

不生成 handoff 时，也只能从已通过 preflight 的正式输入提供等价的当前章节切片。

### 单章硬规则

- 综合 guidance、当前 A beats 与 presentation 进行三源创作。
- 每章必须包含实际视觉演示，禁止纯文字或逐句字幕式 PPT。
- 连续 step 默认复用 SceneFrame、媒体区和主要 DOM，只改变必要状态。
- `narrations.ts` 逐 Beat 复制批准文本，不得改写或重新切分。
- 颜色与字体使用主题 token；禁止假数据、假 logo、emoji 和紫粉渐变套路。
- 缺失素材用明确 placeholder。
- 每章独立目录和 CSS 前缀，不跨章 import，不修改共享运行时。
- 动画时长不得超过对应 step 的口播时长。

完整实现决策和完工自检以 `references/CHAPTER-CRAFT.md` 为准。

最低验证：

```powershell
pnpm episode:check
pnpm typecheck
pnpm lint
```

改动 `narrations.ts` 后追加 `pnpm audio:extract -- --episode <id>`；完整章节、主题或
共享运行时改动追加 `pnpm build`。增加、删除或重排 step 后还要检查持久化游标；
只有旧游标确实可能越界且用户授权时才递增共享 storage key 版本。

## Checkpoint Audio：必须暂停

全部章节验收后询问是否合成音频。用户确认后：

```powershell
pnpm audio:extract -- --episode <episode-id>
pnpm audio:synthesize -- --episode <episode-id> --provider <minimax|edge|cosyvoice|openai>
```

先让用户核对 `audio-segments.json`，再合成。输出固定到
`media/audio/<chapter>/<step>.mp3`。

## 录屏

- 已合成音频：打开 `/play/<episode-id>/?auto=1`，按 SPACE 后一镜到底录制。
- 无音频：Manual 模式点击推进，后期配音。

## 修改与验证原则

- Repair the smallest invalidated scope。
- 正式 inputs 只读；不反向修改上游事实源。
- 自检发现问题后先修正，再汇报完成。
- 默认 self review；只有用户明确要求或风险明确时才使用 independent reviewer。
- 不保存 review receipt、PASS 状态、`state.json`、narration unit/binding sidecar。
