# OBS Browser Source capture

OBS should load the dedicated `/obs/:episodeId` route instead of the Studio or
the normal `/play` preview route. The route renders only the 1920×1080 stage:
no studio shell, browser chrome, progress bar, playback controls, or desktop
content can enter the capture.

## URL contract

```text
http://127.0.0.1:5174/obs/episode-01
```

The route always starts at the cover, automatically plays every chapter of the
current instance in order, and stops on the final step. There is intentionally
no chapter-range parameter in the OBS contract; selecting a partial range is a
test or editing concern, not a recording-mode concern.

For EP1's complete instance:

```text
/obs/episode-01
```

## OBS Browser Source settings

- URL: use the route above
- Width: `1920`
- Height: `1080`
- FPS: `30`
- Enable **Control audio via OBS** so page audio is recorded from the Browser
  Source itself rather than from the desktop mix
- Keep **Shutdown source when not visible** disabled during a recording
- Refresh the Browser Source when the scene becomes active if the same scene is
  reused for multiple takes

The page emits `webvideo:obs-capture` lifecycle events and mirrors the current
state to `html[data-obs-capture-state]`. The states are `loading`, `ready`,
`playing`, and `completed`; these are the integration points for the future
OBS WebSocket start/stop controller.
