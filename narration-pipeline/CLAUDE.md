# Narration Pipeline 上游约束

上游任务从仓库根目录开始，先遵守 [根 CLAUDE.md](../CLAUDE.md)。本文只补充上游独有约束。下列路径相对仓库根目录；现有 Skill 内的相对命令默认从 `narration-pipeline/` 执行，不要直接在根目录照抄。

## 事实源与创作

- `narration-pipeline/episodes/<module>/episode-XX-...-task-package.md` 是唯一原始事实源，只读；不得为通过验证而修改或替代任务包。
- 口播与 A-page 入口为 `.agents/skills/rewrite-course-narration/SKILL.md`，视觉粗设入口为 `.agents/skills/design-course-visual-rough/SKILL.md`（两者相对本文件目录）。
- 用户明确批准连续口播后，才能生成 `approved-spoken-text.txt` 并进入 A-page 编译；visual rough 通过验证并经用户审阅后才能由 `draft` 转为 `approved`。
- 创作按 [A-page v6 作者契约](.agents/skills/rewrite-course-narration/references/a-page-v6-author-contract.md)、[visual rough v4 作者契约](.agents/skills/design-course-visual-rough/references/visual-rough-v4-author-contract.md) 及各自 Skill 指定的示例、模板和 recipe 执行。实现不作为作者规则来源；工具维护可检查实现与测试。

## 产物与发布

过程文件放在 `.tmp/work/narration-pipeline/<episode-id>/`：Brief、草稿、compile trace、候选 rough。trace 无未解决项且对应验证通过后，按阶段发布到 `player/episodes/<episode-id>/inputs/`：

| 类别 | 文件 | 发布要求 |
| --- | --- | --- |
| 正式内容 | `approved-spoken-text.txt` | 用户批准的连续口播 |
| 正式内容 | `episode-XX-a-page.json` | A-page v6，验证通过 |
| 正式内容 | `episode-XX-visual-rough.md` | visual rough v4，验证通过且 approved |
| 治理证据 | `episode-XX-a-page-validation.json` | 随对应 A-page 发布的最终通过报告 |
| 治理证据 | `episode-XX-visual-rough-validation.json` | 随对应 rough 发布的最终通过报告 |

最终报告必须与所发布版本对应并保存在 inputs；中间或失败报告写入 `.tmp/validation/<episode-id>/`。报告不属于章节创作事实源，也不是 Phase 1 runner 的运行依赖。三份正式内容齐备后才能交给下游 Phase 1。compile trace 不发布；不额外发布 `narration-units.json`、`narration-bindings.json`。下游可选 handoff 不是上游发布门禁。

可用 `scripts/publish_handoff.py` 复制已经批准且验证通过的文件。以下示例从仓库根目录执行，先将 `episode-XX` 替换为目标期次：

```sh
python narration-pipeline/scripts/publish_handoff.py --episode episode-XX --source-dir .tmp/work/narration-pipeline/episode-XX --player-root player --dry-run
```

确认待发布清单及前置条件后，移除 `--dry-run` 执行复制。该工具只复制源目录中存在的白名单文件，并替换目标同名文件；不验证批准、完整性或报告结果，也不保证整套文件的事务性更新。复制成功不能代替验收。若产物已按阶段写入 inputs，直接核对已发布版本，无需再次复制。

## 修改与验证

内容修改调用对应作者契约中的黑盒验证入口。Skill 或工具修改运行对应测试；以下命令从仓库根目录执行（系统只提供 `python3` 时替换命令名）：

```sh
python -m unittest discover -s narration-pipeline/.agents/skills/rewrite-course-narration/tests -p "test_*.py" -v
python -m unittest discover -s narration-pipeline/.agents/skills/design-course-visual-rough/tests -p "test_*.py" -v
python -m unittest discover -s narration-pipeline/.agents/skills/polish-stage1-narration/tests -p "test_*.py" -v
```

只运行受改动影响的测试组。路径迁移时，用 `rg -n --hidden -F '实际旧路径' narration-pipeline/.agents narration-pipeline/.commandcode narration-pipeline/scripts player/.agents player/tools` 检查活跃入口，并补查本次涉及的其他配置；搜索无匹配时退出码 1 属正常结果。历史报告可保留旧路径，但必须标为历史，不能作为当前入口。
