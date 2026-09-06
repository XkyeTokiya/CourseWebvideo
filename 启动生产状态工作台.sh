#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
STATUS_DIR="$ROOT/production-status"
SERVICE="$STATUS_DIR/production-status-server.mjs"
URL_PATH="/production-status/dashboard.html"

if [[ ! -d "$STATUS_DIR/episodes" ]]; then
  echo "未找到状态数据目录：$STATUS_DIR" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "未找到 Node.js，请先安装 Node.js。" >&2
  exit 1
fi

health_matches() {
  local port="$1"
  EXPECTED_ROOT="$ROOT" EXPECTED_STATUS_DIR="$STATUS_DIR" HEALTH_PORT="$port" node --input-type=module <<'NODE'
const expectedRoot = process.env.EXPECTED_ROOT;
const expectedStatusDir = process.env.EXPECTED_STATUS_DIR;
const port = process.env.HEALTH_PORT;
try {
  const response = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1000) });
  const body = await response.json();
  const normalize = value => String(value ?? '').replace(/[\\/]$/, '');
  process.exit(
    response.ok &&
    body.service === 'coursewebvideo-production-status' &&
    normalize(body.root) === normalize(expectedRoot) &&
    normalize(body.statusDir) === normalize(expectedStatusDir)
      ? 0
      : 1,
  );
} catch {
  process.exit(1);
}
NODE
}

port_is_occupied() {
  local port="$1"
  HEALTH_PORT="$port" node --input-type=module <<'NODE'
import net from 'node:net';
const port = Number(process.env.HEALTH_PORT);
const socket = net.createConnection({ host: '127.0.0.1', port });
socket.setTimeout(500, () => { socket.destroy(); process.exit(1); });
socket.once('connect', () => { socket.destroy(); process.exit(0); });
socket.once('error', () => process.exit(1));
NODE
}

start_service() {
  local port="$1"
  local log_dir="$ROOT/.tmp"
  mkdir -p "$log_dir"
  nohup node "$SERVICE" --root "$ROOT" --status-dir "$STATUS_DIR" --port "$port" \
    >"$log_dir/production-status-server-$port.log" 2>&1 &
  disown || true
}

PORT=''
for candidate in 8765 8766 8767 8768; do
  if health_matches "$candidate"; then
    PORT="$candidate"
    echo "已复用已有生产状态服务：端口 $PORT"
    break
  fi

  if port_is_occupied "$candidate"; then
    continue
  fi

  start_service "$candidate"
  for _ in {1..20}; do
    if health_matches "$candidate"; then
      PORT="$candidate"
      break 2
    fi
    sleep 0.25
  done
done

if [[ -z "$PORT" ]]; then
  echo "无法启动生产状态服务，请检查端口 8765-8768 或日志：$ROOT/.tmp/production-status-server-*.log" >&2
  exit 1
fi

URL="http://127.0.0.1:$PORT$URL_PATH"
echo "生产状态工作台：$URL"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 &
else
  echo "未检测到可用的浏览器打开命令，请手动访问上述地址。"
fi
