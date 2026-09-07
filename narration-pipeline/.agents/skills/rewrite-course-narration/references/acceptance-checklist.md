# A-page v6 验收入口

详细生产规则只有 [A-page v6 作者契约卡](a-page-v6-author-contract.md)；本页只保留发布流程。

1. 确认用户已批准连续稿，且正式 `nx` 来自该批准稿。
2. 使用现有 `verify_compilation.py` 黑盒入口，输入批准稿、A-page、冻结任务包和 work trace。
3. 报告必须通过且 trace 无未解决项；正式报告只发布汇总、完整性哈希、覆盖结果和结构化 failures/errors。
4. 通过后发布 `approved-spoken-text.txt`、`episode-XX-a-page.json` 和 `episode-XX-a-page-validation.json`；trace 不发布。

```bash
python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py \
  --validation-profile a-page-v6 \
  --task-package episodes/<module>/episode-XX-...-task-package.md \
  --compile-trace ../.tmp/narration-pipeline/<task>/episode-XX/episode-XX-b-to-a-compile-trace.json \
  --approved-text ../player/episodes/episode-XX/inputs/approved-spoken-text.txt \
  --compiled-json ../player/episodes/episode-XX/inputs/episode-XX-a-page.json \
  --output ../player/episodes/episode-XX/inputs/episode-XX-a-page-validation.json
```

失败时按 [error index](error-catalog.json) 局部查码；错误索引未覆盖的失败报告为工具缺陷，不读取 validator/parser 实现。
