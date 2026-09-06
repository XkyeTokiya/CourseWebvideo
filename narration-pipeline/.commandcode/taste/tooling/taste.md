# Tooling & Environment

- Shell syntax depends on which machine hosts the work: on the Windows box it is cmd.exe, not PowerShell or POSIX sh — use cmd syntax (`move /Y`, `dir /B`, `&`); PowerShell cmdlets (`Move-Item`, `$env:`) and sh constructs (`mv -f`, `tail`) fail there. But the 135-CourseWebvideo repo work runs on Linux/POSIX (/home/tokiya): `python3` heredocs (`<<'EOF'`), `&&` chains, `rm /tmp/...`, and `git -C` all succeed. Probe the environment before choosing syntax instead of assuming cmd.exe everywhere. Confidence: 0.85
- write_file is restricted to the workspace — writing to OS temp/scratchpad paths silently fails; write drafts to an in-workspace temp filename (e.g., `*.new.md`) next to the target, validate, then atomically move onto the official path. Confidence: 0.9
