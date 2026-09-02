# 音频合成

统一 Studio 从每个章节的 `narrations.ts` 按 step 提取口播，并将 MP3 写入：

```text
episodes/<episode-id>/media/audio/<chapter-id>/<step>.mp3
```

`narrations.ts` 仍是 step 数与口播文本的唯一真相源。空字符串表示 silent step，不合成音频；封面由 `stepDurationsMs: [15000]` 固定保留 15 秒。

## 标准流程

在工作区根目录执行：

```powershell
pnpm audio:extract -- --episode <episode-id>
```

检查生成的：

```text
episodes/<episode-id>/audio-segments.json
```

结构：

```json
[
  { "chapter": "hook", "step": 1, "text": "...", "audio": "hook/1.mp3" }
]
```

用户确认文本和切分后，再进行合成。

## Provider

列出可用 Node provider：

```powershell
pnpm audio:providers
```

内置：

| Provider | 默认 | 环境 |
|---|---:|---|
| `minimax` | 是 | 安装 `mmx-cli`，执行 `mmx auth login --api-key ...` |
| `edge` | 否 | 安装 `edge-tts`；免费、无需 API Key |
| `cosyvoice` | 否 | 设置 `DASHSCOPE_API_KEY`，可使用复刻音色 |
| `openai` | 否 | 设置 `OPENAI_API_KEY`；可选 `OPENAI_BASE_URL`、`OPENAI_TTS_MODEL` |

只检查 provider 是否可用，不产生音频：

```powershell
pnpm audio:synthesize -- --episode <episode-id> --provider minimax --check
pnpm audio:synthesize -- --episode <episode-id> --provider edge --check
pnpm audio:synthesize -- --episode <episode-id> --provider cosyvoice --check
pnpm audio:synthesize -- --episode <episode-id> --provider openai --check
```

合成：

```powershell
# 默认 MiniMax，已有非空 MP3 自动跳过
pnpm audio:synthesize -- --episode <episode-id>

# OpenAI
pnpm audio:synthesize -- --episode <episode-id> --provider openai

# Edge TTS（免费；默认 zh-CN-XiaoxiaoNeural）
python -m pip install edge-tts
pnpm audio:synthesize -- --episode <episode-id> --provider edge

# DashScope CosyVoice（支持 --voice 传复刻音色）
$env:DASHSCOPE_API_KEY = "sk-xxxxx"
pnpm audio:synthesize -- --episode <episode-id> --provider cosyvoice

# 指定音色
pnpm audio:synthesize -- --episode <episode-id> --voice <voice-id>

# 强制重合成
pnpm audio:synthesize -- --episode <episode-id> --force

# 不调用 provider，只预览计划；或只合成前 3 段试音
pnpm audio:synthesize -- --episode <episode-id> --provider edge --dry-run
pnpm audio:synthesize -- --episode <episode-id> --provider edge --limit 3
```

Runner 保持原行为：串行请求、断点续合、逐段进度、失败汇总。provider 写入临时文件，成功且文件非空后才原子替换最终 MP3，失败不会留下半个音频。

## Node provider 契约

Provider 位于根级：

```text
tools/tts-providers/<id>.mjs
```

必须导出：

```js
export async function check() {
  // 缺 CLI、认证或环境变量时 throw
}

export async function synthesize({ text, outPath, voice }) {
  // 写出非空 MP3；失败时 throw
}
```

可选：

```js
export const id = "provider-id";
export const defaultVoice = "voice-id";
```

详见根级 `docs/tts-providers.md`。不再创建或调用 `scripts/tts-providers/*.sh`。

新增或修改 provider、音频 runner 或相关工具后，必须运行：

```powershell
pnpm run test:tools
pnpm run typecheck
pnpm run lint
pnpm run build
```

同时执行一个真实或本地模拟正例，以及缺环境、缺认证或 provider 失败的对应
负例。任何测试、请求或认证失败都必须如实报告，不得以已有 MP3 冒充本次成功。

## 运行时播放

共享旧运行时保持原三种模式：

| 模式 | 触发 | 行为 |
|---|---|---|
| Manual | 默认 | 不播音频，手动推进 |
| Audio | `?audio=1` 或按 `M` | 进入 step 自动播放，手动推进 |
| Auto | `?auto=1` 或继续按 `M` | 播完 + 200ms 后自动推进 |

Auto 首次按 Space 或点击 gate 解锁；首次 Space 只启动播放，不推进当前 step，
因此封面会按 `stepDurationsMs` 完整停留。生产构建通过 Vite 资源映射加载 `episodes/*/media/audio/**/*.mp3`；缺失音频继续按 `max(1500ms, 字数 × 250ms)` 回退。

## 故障处理

- `audio-segments.json not found`：先运行 `pnpm audio:extract -- --episode <id>`。
- `TTS provider 'X' not found`：运行 `pnpm audio:providers`。
- `mmx CLI not found`：`npm install -g mmx-cli`。
- `mmx is not authenticated`：运行 `mmx auth login --api-key ...`。
- `edge-tts is not available`：运行 `python -m pip install edge-tts`。
- `DASHSCOPE_API_KEY is not set`：设置环境变量后使用 `cosyvoice` provider。
- CosyVoice 音色与模型不匹配：同时检查 `--voice` 与 `DASHSCOPE_TTS_MODEL`。
- `OPENAI_API_KEY is not set`：设置环境变量后再执行。
- 中途失败：直接重跑；已有非空 MP3 会跳过。
- 不具备 provider 条件：明确告知用户并暂时跳过，不得假装合成成功。
