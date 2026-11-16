# episode-21 交付缺口记录

更新：2026-11-05

本文件诚实记录 EP21《工业大数据：从哪里来、怎样产生价值》当前的距离交付缺口，供后续会话接手时定位。它是状态记录，不是创作规则、素材依据或验收证据；状态变化后应更新或删除。

## 已核验

- 实例结构完整：`00-cover` + `01-a001`…`10-a010`，共 11 个场景，全部在 [entry.tsx](../episodes/episode-21/src/entry.tsx) 注册。
- 口播：30 个节拍，与 [audio-segments.json](../episodes/episode-21/audio-segments.json) 分段一致（a001 4 / a002 4 / a003 5 / a004 1 / a005 2 / a006 2 / a007 3 / a008 3 / a009 3 / a010 3）。
- `pnpm episode:check` 通过（52 个实例，27 个 warning 均来自 planned 实例缺少入口）；`pnpm typecheck` 通过；`pnpm lint` 0 warning 0 error。
- 2026-11-05 `pnpm build` 通过：496 个文件、52 个实例，已重建 `dist/`。
- 本轮补齐时间粒度差异，收窄来源覆盖与一次性统计的绝对判断，并同步正式输入、script、outline、相关章节与分段；A-page/visual rough 检查通过，三处相关画面已在播放器中查看。

## 缺口

1. **四张素材全部是占位图**。A001/A004/A007/A010 的 `m001.png`–`m004.png` 与 `占位图/16-9/M001.png`–`M004.png` 逐字节相同（sha256 一致），不是 outline 要求的现场图；页面在图注中写明“M00X · 现场图待提供”。另因构建按字节去重，四张图在 `dist/` 落在 `media/shared/images/`，不在 `media/episodes/episode-21/images/`。
2. **未合成音频**。`episodes/episode-21/` 下仍为 0 个 mp3；音频合成仍按既定 Checkpoint Audio 执行。[entry.tsx](../episodes/episode-21/src/entry.tsx) 与 [audio-segments.json](../episodes/episode-21/audio-segments.json) 的章节 ID 已对齐为 `01-a001` 等注册 ID，分段文本也已去除制作标签并与章节口播核对；这不代表音频已经合成或验收。
3. **`project.json` 与实际进度不一致**。[project.json](../episodes/episode-21/project.json) 仍为 `in-progress`、`completed 10/11`、`current 10-a010`，而 A010 已提交（`81e0f15`）并生成 `.handoffs/A010.json`。未擅自改状态，需人工确认后更新。
4. **outline 头部仍是编译前状态**。[outline.md](../episodes/episode-21/outline.md) 标记 `awaiting-checkpoint-plan`、主题 `pending`；该文件由 Phase 1 runner 管理，不手工改，需确认是补 runner 记录还是保留为历史。
5. **全片播放尚未验收**。本轮查看了 A001 第 3 拍、A003 第 5 拍和 A006 第 2 拍；11 个场景的完整前进、回退、直接跳转、刷新恢复没有本轮复核记录。各章此前的用户放行发生在会话中，仓库内没有对应凭据。
6. **检查覆盖不到章节代码**。`pnpm typecheck` 只包含 `src`，`pnpm lint` 只覆盖 `src` 与 `tools`，`episodes/` 的 TSX/CSS 只能靠 `pnpm build` 编译通过间接验证。
7. **提交未推送**。本记录提交后分支领先 origin 14 个提交，尚未推送。

## 仓库级相关缺口

- `episodes/episode-design-reference/` 因 `episode-*` 命名被播放器与 `episode:check` 当作第 52 个正式实例（状态 `ready`），界面上没有“参考实例”标记。
- [src/catalog/generated.ts](../src/catalog/generated.ts) 没有任何引用，且不包含参考实例，属遗留死代码。
- [reference-instance-css-reading-test.md](reference-instance-css-reading-test.md) 引用的最后状态截图位于 `../.tmp/validation/episode-design-reference/selection-20261028/overview.jpg`，未入库，`.tmp/` 清理后引用失效。
