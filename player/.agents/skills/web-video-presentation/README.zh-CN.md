# Courseplay Web Video Presentation Skill

本 Skill 只把正式 Courseplay 输入制作为 Web Video Studio 中的 16:9 课程章节。
普通文章、自由口播稿和独立 Vite 项目不在支持范围内；仓库现有的 Studio episode
脚手架继续保留。

## 正式流程

1. 新建 episode 目录时运行
   `pnpm episode:new -- --id <episode-id> --title "<标题>" --theme <主题-id>`。
2. 从 `episodes/<id>/inputs/` preflight A-page v6、visual rough v4 和批准口播。
3. 运行 `courseplay:phase1` 的 `init → commit-chapter → finalize`，生成唯一正式
   `script.md` 与 `outline.md`。
4. 在 Checkpoint Plan 对齐稿子、视觉计划、主题、素材和开发模式。
5. 主线程完成第 1 章并等待用户验收，再开发后续章节。
6. 在 Checkpoint Audio 决定是否生成 TTS；最后使用 Studio 录屏。

权威规则见 [SKILL.md](./SKILL.md)。Phase 1 读取
[OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md)、
[COURSEPLAY-BOUND-MODE.md](./references/COURSEPLAY-BOUND-MODE.md) 与
[COURSEPLAY-STATE-MECHANISMS.md](./references/COURSEPLAY-STATE-MECHANISMS.md)；
章节实现读取 [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md)。

所有命令从 `player/` 运行。不得创建 episode 级 package、锁文件、Vite 配置、
开发服务器或另一套播放器。

`templates/` 作为历史独立运行时兼容资料保留；新 episode 使用仓库级
`player/templates/episode/` 和共享 Studio 运行时。
