# EP21 Player 重新制作提示词

请在当前仓库重新制作 EP21《工业大数据：从哪里来、怎样产生价值》的 Player。目标是做出适合实际播放和验收的完整章节，而不是搭建示意骨架。

**现有状态与输入**

- 实例位于 `player/episodes/episode-21/`。之前的封面和 A001 页面实现已清理，`project.json` 已重置为 `planned`；实例目录仍然存在，不要重新运行 `episode:new` 或 Phase 1 `init` 来覆盖它。
- 保留并使用该目录下的 `script.md`、`outline.md` 和 `inputs/` 正式输入。现有输入是 Courseplay A-page v6、已批准的 visual rough v4 和批准口播；先从 `player/` 执行 `pnpm courseplay:phase1 -- preflight --episode episode-21` 和 `pnpm courseplay:phase1 -- status --episode episode-21`。若有错误，报告实际问题，不从旧代码或历史归档补造输入。
- 现有 outline 包含独立封面和 A001–A010，共 10 个正文场景、30 个口播节拍。遵循现有章节顺序、语义关系、素材要求和每步场景指令；`narrations.ts` 必须与已批准的口播及 `script.md` 逐 Beat 对齐。不要擅自改写正式输入、重编已有计划或手工改 runner 标记。

**制作规则与参考**

- 先阅读仓库根目录和 `player/` 的 `CLAUDE.md`，并按 `player/.agents/skills/web-video-presentation/SKILL.md` 及其指定的 Courseplay、章节制作材料执行。已有实例使用共享 Player 运行时，不要创建第二套播放器。
- 使用 `player/episodes/episode-design-reference/` 作为设计参考。先看它的 README 和五章可播放效果，再结合当前章节的内容关系，读取适合的参考章节 TSX 和 CSS；需要时可查看更多参考。学习持续构图、关系表达、节拍推进和视觉完成度，不照搬示例文字或把五章套成同一模板。为了保证设计质量，允许读取必要的 CSS，不必为了省 token 省略关键实现。
- 设计以 EP21 已批准的内容和 outline 为准。每个 A-page 按既定持续场景推进，让出现、保留、弱化、焦点变化和收束服务于内容；用主题 token 和合适的 CSS / SVG / 其他方式实现视觉演示，不为了复杂动画而堆砌图形。没有依据的数字、企业名称、界面或事实不要编造。
- 按 outline 核对 A001、A004、A007、A010 的素材需求；在 Checkpoint Plan 对齐素材方案。素材未就位时按确定的方案标明并使用占位，向我说明缺失项，不把占位图伪装成真实资料。封面按项目契约与 outline 单独制作；如使用封面内容库，先核对课程、模块和任务信息，不机械套用不相符的字段。

**执行与验收**

1. 当前 outline 标记为 `awaiting-checkpoint-plan`，`project.json` 中的 `active-identification-note` 是现有主题候选。若没有可核验的既有批准，先按 Skill 的 Checkpoint Plan 一次对齐稿子、outline、主题、素材方案和开发模式；已有适用批准则不重复询问。
2. 获得所需确认后，先由主线程完整制作封面和正文 A001，并预览 A001 全部四个节拍，检查前进、回退及画面和口播的对应。给我可打开的播放地址和验收重点，等待我验收 A001 后，再按确定的模式制作 A002–A010。
3. 章节实现后按项目要求检查和预览；`narrations.ts` 更新后执行 `pnpm audio:extract -- --episode episode-21`，核对分段文本。执行 `pnpm episode:check`、`pnpm typecheck`、`pnpm lint` 及适用的 `pnpm build`，并说明 lint 不覆盖章节源码。不要在未获得音频确认时合成音频或录屏。
