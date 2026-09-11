# Courseplay Episode Contract

Studio 只扫描 `episodes/`；旧 `output/` 与 `.archive/` 不导入。共享封面内容库位于
`episodes/_shared/covers/`，不是 episode 实例。

```text
episodes/<id>/
├── project.json
├── script.md
├── outline.md
├── inputs/
│   ├── approved-spoken-text.txt       # Courseplay 声明 approved_text 时必有
│   ├── <episode-id>-a-page.json       # Courseplay 正式输入
│   └── <episode-id>-visual-rough.md    # Courseplay 正式输入
├── .handoffs/<Axxx>.json               # Courseplay 按需生成，Git 忽略
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

## 封面 JSON 来源

封面最终文件固定为 `episodes/<episode-id>/src/data/cover.json`。可以使用用户提供、
当前实例已有或 `episodes/_shared/covers/` 内容库中的对应 JSON；不得从其他 episode 或历史
`.archive/` 复制。组件读取 `course`、`module`、`task`、`point`、`lede`、`chips`
并忽略 `style`。

`project.json` 是 Agent 维护的短状态文件：

```json
{
  "id": "episode-02",
  "title": "工业互联网：产生与定义",
  "status": "in-progress",
  "theme": "active-identification-note",
  "progress": {
    "completed": 1,
    "total": 11,
    "current": "a001"
  },
  "updatedAt": "2026-08-26"
}
```

状态：

- `planned`：已立项，尚不要求可播放入口。
- `in-progress`：已有可播放章节，仍在制作或验收。
- `ready`：声明章节全部完成并通过检查。

`theme` 必须对应 `.agents/skills/web-video-presentation/themes/<id>/theme.json + tokens.css`。Studio 构建时发现全部完整主题，播放时只注入当前实例选定的 token。

`src/entry.tsx` 继续使用旧播放器契约：

```ts
export const id = "episode-02";
export const title = "标题";
export const CHAPTERS: ChapterDef[] = [/* ... */];
```

`narrations.ts` 仍是章节 step 数和口播文本的唯一真相源。一个 step 是口播与页面状态单位，不自动等于新视觉页面；连续 step 应按 outline 的视觉步组复用主构图。

音频通过根级 Node 工具生成到 `media/audio/`，运行时在开发与生产构建中自动解析，无需实例配置路径。

## Courseplay 正式输入与单章交接

Courseplay 章节可以直接使用明确的当前 A-page、批准口播、visual rough/页面指导、
outline 调度、主题和素材，也可以使用 handoff 生成紧凑输入。handoff 的固定路径、
输入语法、真实检查范围和失败处理只见 [handoff v4 作者契约卡](courseplay-handoff-v4-author-contract.md)、
[canonical example](examples/courseplay-handoff-v4/) 和失败时的 [error index](handoff-v4-error-catalog.json)。
显式调用时，路径、格式或版本错误由该命令报告，不升级为 Studio 构建或章节推进门禁；
不调用时，不要求 handoff 专用 Markdown 排版。

需要为章节开发生成隔离上下文时，可以生成交接包：

```powershell
pnpm courseplay:handoff -- --episode <episode-id> --a-page <Axxx>
```

`episodes/<episode-id>/.handoffs/<Axxx>.json` 可作为紧凑的 Phase 2 输入。v4 包只含当前 A 的准确 beats、`screen_guidance`、`presentation`、steps、关系、
护栏和素材片段；章节 Agent 还读取现行的
`CHAPTER-CRAFT.md`、`COURSEPLAY-BOUND-MODE.md`、`COURSEPLAY-STATE-MECHANISMS.md`、
目标代码及必要的第 1 章风格参考。使用该包时不必再把完整内容源加入章节上下文。

`.handoffs/` 是确定性派生缓存，不进入 `project.json`、catalog、Studio 构建或
Git 提交。
