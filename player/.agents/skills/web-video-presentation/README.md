# Courseplay Web Video Presentation Skill

This skill exclusively turns approved Courseplay inputs into 16:9 chapters for the shared
Web Video Studio. Generic articles, free-form narration, standalone Vite projects, and the
legacy scaffolding flow are not supported.

## Production flow

1. Preflight A-page v6, visual rough v4, and approved narration from
   `episodes/<id>/inputs/`.
2. Run `courseplay:phase1` through `init → commit-chapter → finalize`; `script.md` and
   `outline.md` are the only persistent Phase 1 state.
3. Stop at Checkpoint Plan to confirm script, visual plan, theme, assets, and build mode.
4. Build chapter one in the main thread and wait for approval before later chapters.
5. Stop at Checkpoint Audio before optional TTS, then record through the shared Studio.

See [SKILL.md](./SKILL.md) for the authoritative workflow. Run every command from
`player/`. Never create episode-level packages, lockfiles, Vite configs, development
servers, or a second player runtime.
