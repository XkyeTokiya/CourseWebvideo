import { spawn } from "node:child_process";
import { access, mkdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

function spawnCaptured(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
      windowsHide: true,
      ...options,
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => { stdout += chunk; });
    child.stderr?.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited with ${signal ?? code}: ${stderr.trim() || stdout.trim()}`));
    });
  });
}

async function findPowerShellShim(command) {
  if (process.platform !== "win32") return null;
  let result;
  try { result = await spawnCaptured("where.exe", [command]); }
  catch { return null; }
  for (const candidate of result.stdout.split(/\r?\n/).filter(Boolean)) {
    const shim = candidate.replace(/\.cmd$/i, ".ps1");
    try { await access(shim); return shim; }
    catch { /* try next candidate */ }
  }
  return null;
}

export async function runCommand(command, args, options = {}) {
  try { return await spawnCaptured(command, args, options); }
  catch (original) {
    const shim = await findPowerShellShim(command);
    if (!shim) throw original;
    const powershell = `${process.env.SystemRoot || "C:\\Windows"}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;
    return spawnCaptured(powershell, [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      shim,
      ...args,
    ], options);
  }
}

export async function commandAvailable(command, args = ["--version"]) {
  try { await runCommand(command, args); return true; }
  catch { return false; }
}

export async function writeAtomically(outPath, writer) {
  await mkdir(path.dirname(outPath), { recursive: true });
  const temp = `${outPath}.part-${process.pid}`;
  await rm(temp, { force: true });
  try {
    await writer(temp);
    const result = await stat(temp);
    if (result.size === 0) throw new Error("provider produced an empty audio file");
    await rm(outPath, { force: true });
    await rename(temp, outPath);
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
}
