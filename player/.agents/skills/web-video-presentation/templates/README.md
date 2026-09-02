# Historical Standalone Template

These files are preserved only to explain the pre-Studio standalone presentation runtime. They are not a scaffold for this repository and must not be copied into `episodes/<id>/`.

Create new instances from the repository root with:

```powershell
pnpm episode:new -- --id <episode-id> --title "<title>" --theme <theme-id>
```

The active shared runtime lives in `src/shared/presentation-runtime/`; the active Studio contract is defined by the repository `CLAUDE.md` and this Skill's `SKILL.md`.
