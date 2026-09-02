# Narration Pipeline 控制面

本目录是 Courseplay 内容上游子项目。所有上游命令和 Skill 默认从 `narration-pipeline/` 目录执行；单仓库根目录的跨项目规则见 `../CLAUDE.md`。

## 目录契约

```text
episodes/<module>/episode-XX-...-task-package.md  # 唯一原始事实源，只读
docs/                                             # 生产、治理和历史说明
.agents/skills/                                   # 上游 Skill
.commandcode/                                     # 上游命令与 taste
../.tmp/narration-pipeline/<task>/episode-XX/     # 过程文件，不提交
../player/episodes/episode-XX/inputs/             # 唯一正式 handoff
```

本目录不再使用 `output/` 或仓库内 `work/`。批准稿、A-page、验证报告和 visual rough 必须发布到 `../player/episodes/<episode-id>/inputs/`；Brief、草稿、compile trace 和候选 rough 写入 `../.tmp/narration-pipeline/`。

## 生产边界

- 任务包保持只读，不为通过验证而修改或替代任务包。
- 新生产入口为 `rewrite-course-narration`，新视觉粗设入口为 `design-course-visual-rough`。
- `polish-course-narration` 与 `polish-stage1-narration` 仅在用户明确调用时可用，不属于默认生产链。
- 正式 handoff 通过人工批准和对应 validator 后才能发布到播放器 inputs。
- 播放器只消费 inputs，不读取任务包或 `.tmp` 补齐页面语义。

## 过程与发布

```text
冻结任务包
  -> ../.tmp/narration-pipeline/<task>/episode-XX/
  -> 人工批准与验证
  -> ../player/episodes/episode-XX/inputs/
```

验证报告可以直接写入目标 episode 的 `inputs/`；compile trace 必须留在 `.tmp`，不能发布到播放器。

## 修改与验证

活跃 Skill、references、templates、`.commandcode` 和 taste 必须使用上述路径。历史报告可保留旧路径，但需明确标注为历史事实，不得作为当前入口。修改任务包以外的 Skill 或脚本后，运行对应 Skill 测试；修改跨项目路径后，同时运行 pipeline 和 player 的路径残留检查。