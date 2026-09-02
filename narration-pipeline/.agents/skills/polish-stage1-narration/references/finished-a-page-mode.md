# 成品 A-page 润色模式

本模式的源与派生关系固定为：

```text
episode-XX-a-page.json / pages[*].nx
                  │  按 pages 数组顺序逐字符拼接
                  ▼
        approved-spoken-text.txt
```

`approved-spoken-text.txt` 是 `pages[*].nx` 的派生镜像，不是第二份独立编辑源。JSON 内既有的页间空白属于相邻 `nx`，拼接时不得自行插入、删除或规范化空白。

## 一、写入前预检

1. 完整读取 A-page JSON 与批准母版。
2. 确认：
   - `schema_version == "courseplay-a-page/v4"`；
   - `document_kind == "production"`；
   - `approved_text` 的文件名与实际同步目标一致；
   - `pages` 非空，每页 `a_id`、`nx` 唯一且非空；
   - 当前 `"".join(pages[*].nx)` 与批准母版逐字符一致。
3. 对每页同时阅读 `nx`、`teaching_purpose`、`single_message`、`must_visible`、`protected_relations`、`entry_condition` 与 `exit_condition`，判断建议是否能保持页面语义不变。

最后一项不一致时，展示首个差异位置和受影响 `a_id`，先请用户决定是否以 A-page 为准修复漂移；不得直接进入润色写入。

## 二、诊断清单

位置使用 `A001` 这类稳定页 ID，必要时附页内短引文。每条建议必须能独立确认。不要把跨页重排、增删事实、改变结论或页面职责包装成语言润色。

## 三、确认后的唯一写入顺序

1. 只改用户确认的 `pages[*].nx`；保留原页面顺序和页间空白归属。
2. 检查修改后的 Nx 仍由该页全部语义字段和证据支持。若不支持，撤回该条并报告。
3. 运行同步脚本，机械重算各页 `timing.char_equivalent`、`min_seconds`、`target_seconds`、`max_seconds`，并用 Nx 拼接结果覆盖批准母版。脚本保留既有 `short_page_reason`：

   ```powershell
   python .agents/skills/polish-stage1-narration/scripts/sync_finished_narration.py `
     --a-page ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json `
     --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt `
     --write
   ```

4. 立即用 `--check` 做无写入复核：

   ```powershell
   python .agents/skills/polish-stage1-narration/scripts/sync_finished_narration.py `
     --a-page ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json `
     --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt `
     --check
   ```

5. 找到与当前 A-page 对应的唯一 work-only `episode-XX-b-to-a-compile-trace.json`。要求其 `episode_id` 匹配，且 `page_document` 指向当前正式 A-page；从其 `source_task_package` 取得冻结任务包路径。若候选不唯一，不要猜选。
6. 重新运行 canonical validator，并覆盖正式 validation 报告：

   ```powershell
   python .agents/skills/rewrite-course-narration/scripts/verify_compilation.py `
     --validation-profile a-page-v4 `
     --task-package episodes/<module>/episode-XX-...-task-package.md `
     --compile-trace ..\.tmp\narration-pipeline\<task>\episode-XX/episode-XX-b-to-a-compile-trace.json `
     --approved-text ..\player\episodes\episode-XX\inputs/approved-spoken-text.txt `
     --compiled-json ..\player\episodes\episode-XX\inputs/episode-XX-a-page.json `
     --output ..\player\episodes\episode-XX\inputs/episode-XX-a-page-validation.json
   ```

7. 完成条件：同步脚本 `--check` 通过；正式报告 `failures=[]`、`compile_coverage.coverage_passed=true`，且报告中的批准稿与 A-page SHA-256 对应当前磁盘文件；人工复核全部确认项。

## 四、不得自动联动的内容

- 不因 Nx 语言润色而自动改写 `single_message`、必见语义、受保护关系、证据目录或 visual rough。
- 不修改冻结任务包和 compile trace。
- 若 Nx-only 修改会让上述语义字段失真，停止该条修改；这属于重新编译或成套语义更新，不属于本模式。
