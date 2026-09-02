import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import * as cosyvoice from "../tts-providers/cosyvoice.mjs";
import * as edge from "../tts-providers/edge.mjs";
import * as minimax from "../tts-providers/minimax.mjs";
import { runCommand } from "../tts-providers/shared.mjs";
import * as openai from "../tts-providers/openai.mjs";

function listen(server) {
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server.address())));
}
function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

test("openai provider rejects a missing key", async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  await assert.rejects(openai.check(), /OPENAI_API_KEY is not set/);
  if (previous === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = previous;
});

test("openai provider sends the contract payload and writes atomically", async () => {
  let payload;
  let authorization;
  const server = createServer(async (request, response) => {
    authorization = request.headers.authorization;
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    response.writeHead(200, { "content-type": "audio/mpeg" });
    response.end(Buffer.from("ID3mock-mp3"));
  });
  const address = await listen(server);
  const dir = await mkdtemp(path.join(tmpdir(), "webvideo-tts-"));
  const outPath = path.join(dir, "chapter", "1.mp3");
  const previous = {
    key: process.env.OPENAI_API_KEY,
    base: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_TTS_MODEL,
  };
  process.env.OPENAI_API_KEY = "test-key";
  process.env.OPENAI_BASE_URL = `http://127.0.0.1:${address.port}/v1`;
  process.env.OPENAI_TTS_MODEL = "test-model";
  try {
    await openai.check();
    await openai.synthesize({ text: "测试口播", outPath, voice: "nova" });
    assert.equal(authorization, "Bearer test-key");
    assert.deepEqual(payload, {
      model: "test-model",
      input: "测试口播",
      voice: "nova",
      response_format: "mp3",
    });
    assert.equal((await readFile(outPath)).toString(), "ID3mock-mp3");
  } finally {
    await close(server);
    await rm(dir, { recursive: true, force: true });
    if (previous.key === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previous.key;
    if (previous.base === undefined) delete process.env.OPENAI_BASE_URL; else process.env.OPENAI_BASE_URL = previous.base;
    if (previous.model === undefined) delete process.env.OPENAI_TTS_MODEL; else process.env.OPENAI_TTS_MODEL = previous.model;
  }
});

test("edge provider preserves the source kit's default Chinese voice and rate", () => {
  const previous = process.env.EDGE_TTS_RATE;
  delete process.env.EDGE_TTS_RATE;
  try {
    assert.deepEqual(edge.buildArgs({ text: "测试口播", outPath: "1.mp3", voice: "" }), [
      "--text", "测试口播",
      "--voice", "zh-CN-XiaoxiaoNeural",
      "--rate", "+5%",
      "--write-media", "1.mp3",
    ]);
  } finally {
    if (previous === undefined) delete process.env.EDGE_TTS_RATE;
    else process.env.EDGE_TTS_RATE = previous;
  }
});

test("cosyvoice provider rejects a missing key", async () => {
  const previous = process.env.DASHSCOPE_API_KEY;
  delete process.env.DASHSCOPE_API_KEY;
  try { await assert.rejects(cosyvoice.check(), /DASHSCOPE_API_KEY is not set/); }
  finally {
    if (previous === undefined) delete process.env.DASHSCOPE_API_KEY;
    else process.env.DASHSCOPE_API_KEY = previous;
  }
});

test("cosyvoice provider rejects an unsupported sample rate", () => {
  const previous = process.env.DASHSCOPE_TTS_SAMPLE_RATE;
  process.env.DASHSCOPE_TTS_SAMPLE_RATE = "12345";
  try {
    assert.throws(
      () => cosyvoice.buildRequest({ text: "test", voice: "longanhuan" }),
      /DASHSCOPE_TTS_SAMPLE_RATE must be one of/,
    );
  } finally {
    if (previous === undefined) delete process.env.DASHSCOPE_TTS_SAMPLE_RATE;
    else process.env.DASHSCOPE_TTS_SAMPLE_RATE = previous;
  }
});

test("cosyvoice provider requests an MP3 and downloads it atomically", async () => {
  let payload;
  let authorization;
  const server = createServer(async (request, response) => {
    if (request.url === "/audio.mp3") {
      response.writeHead(200, { "content-type": "audio/mpeg" });
      response.end(Buffer.from("ID3cosyvoice-mock"));
      return;
    }
    authorization = request.headers.authorization;
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const address = server.address();
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      request_id: "test-request",
      output: { audio: { url: `http://127.0.0.1:${address.port}/audio.mp3` } },
    }));
  });
  const address = await listen(server);
  const dir = await mkdtemp(path.join(tmpdir(), "webvideo-cosyvoice-"));
  const outPath = path.join(dir, "chapter", "1.mp3");
  const names = [
    "DASHSCOPE_API_KEY", "DASHSCOPE_TTS_ENDPOINT", "DASHSCOPE_TTS_MODEL",
    "DASHSCOPE_TTS_RATE", "DASHSCOPE_TTS_PITCH", "DASHSCOPE_TTS_VOLUME",
    "DASHSCOPE_TTS_SAMPLE_RATE", "DASHSCOPE_TTS_LANGUAGE",
    "DASHSCOPE_TTS_INSTRUCTION", "DASHSCOPE_TTS_ENABLE_SSML",
  ];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  names.forEach((name) => delete process.env[name]);
  process.env.DASHSCOPE_API_KEY = "test-key";
  process.env.DASHSCOPE_TTS_ENDPOINT = `http://127.0.0.1:${address.port}/synthesize`;
  process.env.DASHSCOPE_TTS_MODEL = "cosyvoice-test";
  try {
    await cosyvoice.check();
    await cosyvoice.synthesize({ text: "测试口播", outPath, voice: "custom-voice" });
    assert.equal(authorization, "Bearer test-key");
    assert.deepEqual(payload, {
      model: "cosyvoice-test",
      input: {
        text: "测试口播",
        voice: "custom-voice",
        format: "mp3",
        sample_rate: 24000,
        volume: 50,
        rate: 1,
        pitch: 1,
      },
    });
    assert.equal((await readFile(outPath)).toString(), "ID3cosyvoice-mock");
  } finally {
    await close(server);
    await rm(dir, { recursive: true, force: true });
    names.forEach((name) => {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    });
  }
});

test("Windows npm PowerShell shims receive narration as one argument", { skip: process.platform !== "win32" }, async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "webvideo-shim-"));
  const previous = process.env.PATH;
  await writeFile(path.join(dir, "mocktts.cmd"), "@exit /b 1\r\n");
  await writeFile(path.join(dir, "mocktts.ps1"), "param([string]$Text) [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Text))\n");
  process.env.PATH = `${dir};${previous}`;
  try {
    const expected = "中文 & symbols | remain one argument";
    const result = await runCommand("mocktts", [expected]);
    assert.equal(Buffer.from(result.stdout.trim(), "base64").toString("utf8"), expected);
  } finally {
    process.env.PATH = previous;
    await rm(dir, { recursive: true, force: true });
  }
});

test("minimax provider reports a missing CLI", async () => {
  const previous = process.env.PATH;
  process.env.PATH = "";
  try { await assert.rejects(minimax.check(), /mmx CLI not found/); }
  finally { process.env.PATH = previous; }
});
