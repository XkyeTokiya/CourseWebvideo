# 交互与授权
- 用户以简体中文交流,始终用中文回复;任务进行中收到提问或质询时先直接回答,再按答复继续。Confidence: 0.95
- 用户明确说“暂停任务”时只简短确认并说明状态已保留,立即停止且不再调用任何工具,直到用户明确要求继续。Confidence: 0.95
- 用户整体放权只覆盖当前已授权阶段内的判断,不允许跨过制作流程的硬 checkpoint;未获放行不得自行推进后续阶段或并行制作。Confidence: 0.95
- 输出保持短促并及时交付可继承的磁盘成果;长文件分段落盘,不把多章推导或超长报告囤在一次思考或一次写入中。Confidence: 0.9

# 事实与修改边界
- 当前用户指令决定本次任务授权;批准输入、当前仓库契约与校验器决定文件格式和运行事实;Taste 表达用户偏好,不虚构或替代事实源。两侧冲突时列出依据并等用户裁决。Confidence: 0.95
- 上游任务包、正式 inputs、已批准文案与已完工冻结工件只读;不得从历史 episode、过程目录或个人记忆补事实,不得为迁就下游实现改写批准来源。Confidence: 0.95
- 发现非本任务或非本会话改动时先用 diff 定性来源,完整保留并与本次范围隔离;不擅自回滚、代改或混入提交。Confidence: 0.9
- Bug、工具失败或流程异常先给证据支撑的根因诊断,区分工件、工具、环境与基线问题;被事实纠正时撤回错误结论并基于新证据重算。Confidence: 0.9
- 规则、流程、设计或多文件改动先确认精确范围与方案;获准后严格执行,任何超出方案的优化都必须显式提出,不得静默扩张。Confidence: 0.9

# 制作流程硬节点
- Courseplay Phase 1 只接受正式 inputs 中通过 preflight 的 A-page v6+visual rough v4;runner 从 A-page 初始化正式 script/outline 外壳,每章一次提交内容对并自动生成全局区;主题与 custom 候选留到唯一 Checkpoint Plan,禁止整份覆盖。Confidence: 0.95
- Checkpoint Plan 未确认不得进入章节开发;主题必须明确,开发模式未指定时采用逐章确认的 Mode A,不得自行启用 subagent 制作。Confidence: 0.95
- Phase 2 第一章必须由主线程完成可验收的完整版本;代码级检查通过后停下等待用户视觉验收,未获“继续”不得制作后续章。Confidence: 0.95
- 后续章节严格按已选 Mode A/B/C 推进;每个授权验收点都要停,模式切换、并发数和批次范围只按用户当前指令调整。Confidence: 0.9
- 全部网页章节完成后停在 Checkpoint Audio;音频合成是逐实例授权项,单次授权不外推,未获授权不得自动合成或进入录屏。Confidence: 0.95

# 强制选读路由
- 涉及制作或文件修改时先实际读取当前目录与上级 CLAUDE;涉及网页视频再读 `web-video-presentation` Skill。涉及验证、Git、工作区异常、恢复任务或 subagent 时,动手前还必须读取 [workflow/taste.md](workflow/taste.md),不能只凭会话记忆,并向用户说明实际读取范围与当前阶段。Confidence: 0.95
- 新建或接续 Courseplay、检查正式输入、生成或修订 script/outline 时,动手前必须读取 [courseplay-planning/taste.md](courseplay-planning/taste.md)。Confidence: 0.95
- 制作或修订章节 TSX/CSS/narrations 时,动手前必须读取 [courseplay-chapter/taste.md](courseplay-chapter/taste.md) 与 [visual-design/taste.md](visual-design/taste.md),并同时读取 workflow 分包。Confidence: 0.95
- 处理视觉反馈时读取 [交互/taste.md](交互/taste.md) 与 visual-design 分包;出现 shell、浏览器、dev server、TTS 或跨平台问题时先识别当前环境,再读取 [environment/taste.md](environment/taste.md)。Confidence: 0.9
- 修改 `.commandcode/taste` 前必须读取 [taste-maint/taste.md](taste-maint/taste.md);只讨论或审计 Taste 时不得顺带推进 episode 制作。Confidence: 0.95

# Taste 维护
- 只有本文件直接注入上下文,其他分包均为选读;遗漏会造成越权、破坏事实源或跨 checkpoint 的规则必须留在本文件,不能只沉入分包。Confidence: 0.95
- Taste 只保留可迁移、可执行且会影响未来任务的偏好;单集事故、旧协商过程、实例数值和已由契约或测试完整保证的事实不得长期占用活跃上下文。Confidence: 0.9
