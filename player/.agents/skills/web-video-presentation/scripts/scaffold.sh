#!/usr/bin/env bash
# Historical guard: standalone presentation scaffolding was removed when the
# repository adopted the root Web Video Studio architecture.
set -euo pipefail

cat >&2 <<'EOF'
This standalone scaffold is retired.

Create a Studio episode from the repository root instead:
  pnpm episode:new -- --id <episode-id> --title "<title>" --theme <theme-id>
  pnpm dev

New episodes must use episodes/<episode-id>/ and the shared runtime. Do not
create an independent package.json, vite.config.ts, node_modules, or Vite server.
EOF
exit 1
