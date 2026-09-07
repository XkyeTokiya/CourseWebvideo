# Environment
- 使用本分包前先根据当前路径、shell 和可用工具判断 Windows 或 Linux;平台专属命令、路径和故障经验只在对应环境生效,不得跨平台套用。Confidence: 0.95
- Windows 的 shell 命令按 cmd.exe 语义执行,PowerShell cmdlet 使用专用 PowerShell 工具;多行 Git 提交信息优先用多个 `-m` 或临时文件配合 `git commit -F`,不使用 bash heredoc。Confidence: 0.9
- Windows cmd 缺少常见 Unix 文本工具且 `findstr` 匹配中文可能静默失配;中文过滤、长输出摘要和文本计数改用 PowerShell 或 Node,不要把空匹配直接当作事实不存在。Confidence: 0.85
- 后台 dev server 日志为空时先检查任务状态并探测实际监听端口,Vite 可能顺延端口;确认所有候选端口均无响应后才判定退出,不得只凭空日志反复启动。Confidence: 0.8
- 临时脚本解析中文 Markdown 时先统一 CRLF/LF,正则尽量使用稳定 ASCII 锚点;脚本位于外部 scratchpad 时,仓库文件与模块使用已核实的绝对路径。Confidence: 0.85
- TTS provider 异常先检查显式 `--provider`、`--voice` 和残留环境变量;日志中的命令耗时不是音频时长,音频结果以实际文件、段数和媒体时长核验。Confidence: 0.85
- 只有用户明确授权 Agent 做浏览器视觉排查时才启动 dev server 或浏览器;进入页面后先核对持久化游标与实际 chapter/step,完成后关闭由本任务启动的浏览器和 server。Confidence: 0.95
