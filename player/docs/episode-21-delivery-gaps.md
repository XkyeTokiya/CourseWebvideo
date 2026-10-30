# episode-21 交付缺口记录

更新：2026-10-30

本文件诚实记录 EP21《工业大数据：从哪里来、怎样产生价值》当前的距离交付缺口，供后续会话接手时定位。它是状态记录，不是创作规则、素材依据或验收证据；状态变化后应更新或删除。

## 已核验

- 实例结构完整：`00-cover` + `01-a001`…`10-a010`，共 11 个场景，全部在 [entry.tsx](../episodes/episode-21/src/entry.tsx) 注册。
- 口播：30 个节拍，与 [audio-segments.json](../episodes/episode-21/audio-segments.json) 分段一致（a001 4 / a002 4 / a003 5 / a004 1 / a005 2 / a006 2 / a007 3 / a008 3 / a009 3 / a010 3）。
- `pnpm episode:check` 通过（52 个实例，28 个 warning 均来自 planned 实例缺少入口）；`pnpm typecheck` 通过；`pnpm lint` 0 warning 0 error。
- `pnpm build` 通过：494 个文件、52 个实例。本次已重建 `dist/`，此前 `dist/` 停留在 10-28，早于 A001、A004、A007、A010 的素材与 A010 实现。

## 缺口

1. **四张素材全部是占位图**。A001/A004/A007/A010 的 `m001.png`–`m004.png` 与 `占位图/16-9/M001.png`–`M004.png` 逐字节相同（sha256 一致），不是 outline 要求的现场图；页面在图注中写明“M00X · 现场图待提供”。另因构建按字节去重，四张图在 `dist/` 落在 `media/shared/images/`，不在 `media/episodes/episode-21/images/`。
2. **未合成音频**。`episodes/episode-21/` 下 0 个 mp3；脚本按契约需 Checkpoint Audio 放行后才可执行 `pnpm audio:synthesize -- --episode episode-21`。
3. **`project.json` 与实际进度不一致**。[project.json](../episodes/episode-21/project.json) 仍为 `in-progress`、`completed 10/11`、`current 10-a010`，而 A010 已提交（`81e0f15`）并生成 `.handoffs/A010.json`。未擅自改状态，需人工确认后更新。
4. **outline 头部仍是编译前状态**。[outline.md](../episodes/episode-21/outline.md) 标记 `awaiting-checkpoint-plan`、主题 `pending`；该文件由 Phase 1 runner 管理，不手工改，需确认是补 runner 记录还是保留为历史。
5. **本轮没有播放验收**。构建通过只说明编译与资源布局成立；11 个场景的逐步前进、回退、直接跳转、刷新恢复没有本轮复核记录。各章此前的用户放行发生在会话中，仓库内没有对应凭据。
6. **检查覆盖不到章节代码**。`pnpm typecheck` 只包含 `src`，`pnpm lint` 只覆盖 `src` 与 `tools`，`episodes/` 的 TSX/CSS 只能靠 `pnpm build` 编译通过间接验证。
7. **提交未推送**。本记录提交后分支领先 origin 14 个提交，尚未推送。

## 仓库级相关缺口

- `episodes/episode-design-reference/` 因 `episode-*` 命名被播放器与 `episode:check` 当作第 52 个正式实例（状态 `ready`），界面上没有“参考实例”标记。
- [src/catalog/generated.ts](../src/catalog/generated.ts) 没有任何引用，且不包含参考实例，属遗留死代码。
- [reference-instance-css-reading-test.md](reference-instance-css-reading-test.md) 引用的最后状态截图位于 `../.tmp/validation/episode-design-reference/selection-20261028/overview.jpg`，未入库，`.tmp/` 清理后引用失效。
