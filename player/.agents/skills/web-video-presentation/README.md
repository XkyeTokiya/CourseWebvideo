# Web Video Presentation Skill

A workflow skill for turning articles and narration scripts into click-driven 16:9 web-video episodes that play inside this repository's **Web Video Studio**.

## Runtime Contract

This skill does not create standalone Vite applications. Every new episode belongs to the root Studio and shares its runtime, routes, themes, audio loader, and dependency graph.

```text
/                 Studio library
/play/<episode>   Episode player
episodes/<id>/    One episode's content and chapter code
```

Create an episode only from the repository root:

```powershell
pnpm episode:new -- --id episode-xx --title "Episode title" --theme newsroom
pnpm dev
```

Do not create an episode-level `package.json`, lockfile, `node_modules`, `vite.config.ts`, or development server. Do not use `scripts/scaffold.sh`; it is retained only as a migration guard for older installations.

## Workflow

1. Read the source article and produce `script.md` and `outline.md` together.
2. Stop at Checkpoint Plan and align script, outline, theme, assets, and development mode.
3. Create `episodes/<id>/` with `pnpm episode:new`.
4. Build chapter one in the main thread and wait for approval.
5. Build later chapters in the approved mode.
6. Stop at Checkpoint Audio, extract `narrations.ts`, then synthesize only after the user confirms the segments.
7. Record from `/play/<id>/?auto=1` when audio is available.

The authoritative implementation workflow is [SKILL.md](./SKILL.md). Read formal references only when their phase applies:

- [SCRIPT-STYLE.md](./references/SCRIPT-STYLE.md)
- [OUTLINE-FORMAT.md](./references/OUTLINE-FORMAT.md)
- [CHAPTER-CRAFT.md](./references/CHAPTER-CRAFT.md)
- [THEMES.md](./references/THEMES.md)
- [AUDIO.md](./references/AUDIO.md)
- [RECORDING.md](./references/RECORDING.md)

## Episode Contract

```text
episodes/<id>/
├── project.json
├── article.md
├── script.md
├── outline.md
├── audio-segments.json
├── media/audio/<chapter>/<step>.mp3
└── src/
    ├── entry.tsx
    ├── data/cover.json
    └── chapters/<NN>-<id>/
        ├── <Chapter>.tsx
        ├── <Chapter>.css
        └── narrations.ts
```

`project.json.theme` is the only theme source. `src/entry.tsx` exports `id`, `title`, and `CHAPTERS`. `narrations.ts` is the sole source of step count and audio text.

A step is a narration-to-implementation handoff unit. Consecutive steps in one visual group reuse the same main composition. In Courseplay, each base-scene step maps to a chapter-local semantic state, and adjacent steps may reuse that state. A new composition is reserved for an actual relationship or spatial-structure change.

## Themes

Themes live in `themes/<id>/` and require both `theme.json` and `tokens.css`. Studio discovers them at build time and injects the theme selected in `project.json.theme` at playback.

All 22 bundled themes provide the standard palette and font token contract. New chapters use standard tokens such as `--surface`, `--text`, `--text-mute`, and `--accent`. The shared runtime maps legacy `--stage-*` variables only to keep extracted older chapters working.

See [THEMES.md](./references/THEMES.md) for theme authoring and validation.

## Audio and Recording

Run audio commands from the repository root:

```powershell
pnpm audio:extract -- --episode <episode-id>
pnpm audio:providers
pnpm audio:synthesize -- --episode <episode-id> --provider minimax
```

Node providers live in root `tools/tts-providers/` and export `check()` and `synthesize()`. Do not add shell providers to an episode.

For recording, run `pnpm dev`, use the URL it prints, and open:

```text
/play/<episode-id>/?auto=1
```

## Validation

For episode or runtime changes:

```powershell
pnpm run episode:check
pnpm run typecheck
pnpm run lint
pnpm run build
```

After changing `narrations.ts`, also run:

```powershell
pnpm audio:extract -- --episode <episode-id>
```

## Historical Resources

`templates/` contains the pre-Studio standalone runtime for historical reference only. It is not a production template and must not be copied into new episodes. `output/` and `.archive/` are also historical materials, not Studio inputs.
