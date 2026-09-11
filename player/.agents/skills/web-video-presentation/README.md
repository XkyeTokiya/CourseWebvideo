# Courseplay Web Video Presentation Skill

This skill exclusively turns approved Courseplay inputs into 16:9 chapters for the shared
Web Video Studio. Generic articles, free-form narration, and standalone Vite projects are
not supported. The repository's existing Studio episode scaffolding remains available.

## Production flow

1. For a new episode directory, run
   `pnpm episode:new -- --id <episode-id> --title "<title>" --theme <theme-id>`.
2. Preflight A-page v6, visual rough v4, and approved narration from
   `episodes/<id>/inputs/`.
3. Run `courseplay:phase1` through `init → commit-chapter → finalize`; `script.md` and
   `outline.md` are the only persistent Phase 1 state.
4. Stop at Checkpoint Plan to confirm script, visual plan, theme, assets, and build mode.
5. Build chapter one in the main thread and wait for approval before later chapters.
6. Stop at Checkpoint Audio before optional TTS, then record through the shared Studio.

See [SKILL.md](./SKILL.md) for the authoritative workflow. Run every command from
`player/`. Never create episode-level packages, lockfiles, Vite configs, development
servers, or a second player runtime.

`templates/` is retained as historical standalone compatibility material; new episodes use
the repository-level `player/templates/episode/` scaffold and shared Studio runtime.
