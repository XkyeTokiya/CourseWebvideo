# Tooling & Environment

- Shell on this Windows machine is cmd.exe, not PowerShell or POSIX sh — use cmd syntax (`move /Y`, `dir /B`, `&`); PowerShell cmdlets (`Move-Item`, `$env:`) and sh constructs (`mv -f`, `tail`) fail. Confidence: 0.9
- write_file is restricted to the workspace — writing to OS temp/scratchpad paths silently fails; write drafts to an in-workspace temp filename (e.g., `*.new.md`) next to the target, validate, then atomically move onto the official path. Confidence: 0.9
