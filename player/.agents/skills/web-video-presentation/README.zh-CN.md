# Web Video Presentation Skill

将文章或口播稿制作成点击驱动的 16:9 网页视频实例，并在本仓库的 **Web Video Studio** 内统一播放与录屏。

## 运行时契约

本 Skill 不再创建独立 Vite 项目。每个新实例都属于根级 Studio，共享播放器运行时、路由、主题、音频加载器和依赖图。

```text
/                 Studio 实例库
/play/<episode>   实例播放器
episodes/<id>/    单个实例的内容与章节代码
```

只允许在仓库根目录创建实例：

```powershell
pnpm episode:new -- --id episode-xx --title "实例标题" --theme newsroom
pnpm dev
```

不得在实例内创建 `package.json`、锁文件、`node_modules`、`vite.config.ts` 或独立开发服务器。不要运行 `scripts/scaffold.sh`，它仅作为旧安装方式的迁移拦截器保留。

## 工作流

1. 阅读原稿，并在同一次工作中产出 `script.md` 与 `outline.md`。
2. 在 Checkpoint Plan 对齐稿子、outline、主题、素材和开发模式。
3. 通过 `pnpm episode:new` 创建 `episodes/<id>/`。
4. 由主线程完成第 1 章，等待用户验收。
5. 按已确认模式开发后续章节。
6. 在 Checkpoint Audio 停止，先提取 `narrations.ts`，用户确认 segments 后才合成。
7. 音频就绪时使用 `/play/<id>/?auto=1` 录制。

正式生产流程以 [SKILL.md](./SKILL.md) 为准。各阶段按需读取：

- [SCRIPT-STYLE.md](./references/SCRIPT-STYLE.md)
- [OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md)
- [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md)
- [THEMES.md](./references/THEMES.md)
- [AUDIO.md](./references/AUDIO.md)
- [RECORDING.md](./references/RECORDING.md)

## 实例契约

```text
episodes/<id>/
├── project.json
├── article.md
├── script.md
├── outline.md
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

`project.json.theme` 是主题唯一来源。`src/entry.tsx` 导出 `id`、`title` 与 `CHAPTERS`。`narrations.ts` 是 step 数和音频文本的唯一真相源。

step 是口播与页面状态单位，不等于一张新页面。同一视觉步组内的连续 step 必须复用主构图，只更新局部状态；内容关系或空间组织真正变化时才切换主构图。

## 主题

主题位于 `themes/<id>/`，必须同时包含 `theme.json` 与 `tokens.css`。Studio 在构建期发现主题，并在播放时按 `project.json.theme` 动态注入。

内置 22 套主题都提供标准调色板与字体 token。新章节使用 `--surface`、`--text`、`--text-mute`、`--accent` 等标准 token。共享运行时仅为已抽取旧章节兼容 `--stage-*` 变量，新章节不得把它们作为 API。

主题创作和验证见 [THEMES.md](./references/THEMES.md)。

## 音频与录屏

在仓库根目录运行：

```powershell
pnpm audio:extract -- --episode <episode-id>
pnpm audio:providers
pnpm audio:synthesize -- --episode <episode-id> --provider minimax
# 也可使用 edge（免费）、cosyvoice（DashScope）或 openai
```

Node provider 位于`player/tools/tts-providers/`，必须导出 `check()` 与 `synthesize()`。实例中不得再添加 shell provider。

录屏时运行 `pnpm dev`，使用命令实际输出的站点 URL，并打开：

```text
/play/<episode-id>/?auto=1
```

## 验证

实例或共享运行时改动后执行：

```powershell
pnpm run episode:check
pnpm run typecheck
pnpm run lint
pnpm run build
```

改动 `narrations.ts` 后还要运行：

```powershell
pnpm audio:extract -- --episode <episode-id>
```

## 历史资源

`templates/` 保留的是 Studio 之前的独立运行时，只能用于理解历史实现，不能复制到新实例。`output/` 与 `.archive/` 同样只作为历史资料，不是 Studio 输入。
