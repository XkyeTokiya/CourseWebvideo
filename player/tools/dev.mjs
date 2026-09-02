import { spawn } from "node:child_process";
import process from "node:process";

const forwarded = process.argv.slice(2);
if (forwarded[0] === "--") forwarded.shift();

const child = spawn("vite", forwarded, {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
child.on("error", (error) => {
  console.error(`无法启动 Vite：${error.message}`);
  process.exit(1);
});
