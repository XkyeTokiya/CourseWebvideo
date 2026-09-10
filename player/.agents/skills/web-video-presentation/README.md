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

1. Preflight the formal inputs; for Courseplay, initialize or safely migrate modular `script.md` and `outline.md` shells from A-page v6, then commit each chapter once as immutable `nx` → script beats → outline section.
2. Let the runner verify content completeness and generate metadata, schedule, and materials; make only a minimal semantic review, then stop at Checkpoint Plan to align script, outline, theme, custom-scene candidates, assets, and development mode.
3. Create `episodes/<id>/` with `pnpm episode:new` only when it does not already exist; never overwrite a non-template outline.
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

`project.json.theme` is the only runtime theme source. Committed script beats are the Phase 1 plan; after Phase 2 copies them verbatim, `narrations.ts` becomes the sole runtime source of step count and audio text. `src/entry.tsx` exports `id`, `title`, and `CHAPTERS`.

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
