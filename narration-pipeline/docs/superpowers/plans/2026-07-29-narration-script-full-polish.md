# 51 集口播稿整体润色 Implementation Plan

> **状态：已废止，禁止执行。** 本计划基于直接修改 `outputs/narration-scripts` 的旧目录模型，与 2026-07-29 已确认的三目录权威关系冲突。待 `docs/superpowers/specs/2026-07-29-narration-polish-execution-skill-design.md` 通过复审后另行生成替代实施计划。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保持 51 集全部 N 段结构不变的前提下，逐篇整体润色口播正文，使其成为自然、连贯、面向学习者的讲解，并让正文不再出现“教材”字样。

**Architecture:** 以单集为最小编辑与复核单位，以模块为批次推进。执行前建立不可变基线，模块完成后进行局部校验，五个模块全部完成后进行全量结构、范围、字数与内容边界验收；只修改 N 段正文，不使用全局替换。

**Tech Stack:** UTF-8 Markdown、PowerShell 7、人工逐篇语义润色、正则结构校验、SHA-256 范围校验。

## Global Constraints

- 仅修改 `outputs/narration-scripts` 下每份 Markdown 从 `[N001]` 到最后一个 `[Nxxx]` 的连续口播正文。
- 保持每集全部 N 段的数量、编号、顺序和段落边界不变。
- 不修改标题、集号、模块、来源任务包、讲稿段落数、分隔线、时长估算、视觉留白、操作留白及其他制作备注。
- 对正文进行整篇润色，不得只修改包含“教材”的单句，也不得使用全局查找替换。
- 保留原稿的教学目标、知识顺序、事实、定义、案例、数字、条件、结论和证据边界。
- 不增加未经现有资料支持的新知识；案例结果不得扩大为行业平均、普遍结果、项目承诺或当前状态。
- 最终 N 段正文中“教材”出现次数为 0。
- 不同步修改任务包、课件、字幕、画面脚本或其他产物。
- 这些输出文件当前未纳入版本跟踪；未经用户另行授权，不执行 `git add` 或 `git commit`。

---

### Task 1: 建立 51 集结构与范围基线

**Files:**
- Read: `outputs/narration-scripts/**/*.md`
- Create during execution only: `C:/tmp/narration-polish-baseline.json`
- Modify: none

**Interfaces:**
- Consumes: 51 份原始口播 Markdown。
- Produces: 每个文件的 N 编号序列、N 段前后非正文 SHA-256、正文字符数、正文数字表达和“教材”次数基线。

- [ ] **Step 1: 确认文件总数、集号连续性和文件唯一性**

Run:

```powershell
$root = 'D:\00-workspace\006-couseplay\outputs\narration-scripts'
$files = Get-ChildItem -LiteralPath $root -Recurse -File -Filter '*-narration.md'
$episodes = $files | ForEach-Object {
  if ($_.Name -notmatch '^episode-(\d{2})-') { throw "无法识别集号：$($_.FullName)" }
  [int]$Matches[1]
}
"FILES=$($files.Count)"
"EPISODES=$(($episodes | Sort-Object) -join ',')"
if ($files.Count -ne 51) { throw "期望 51 个文件，实际 $($files.Count)" }
if ((Compare-Object (1..51) ($episodes | Sort-Object)).Count -ne 0) { throw '集号不是 01–51 的完整序列' }
```

Expected: `FILES=51`，集号为连续的 `1,2,...,51`，命令无异常。

- [ ] **Step 2: 提取每份文稿的正文边界并生成基线**

Run:

```powershell
$root = 'D:\00-workspace\006-couseplay\outputs\narration-scripts'
$baselinePath = 'C:\tmp\narration-polish-baseline.json'
$utf8 = [System.Text.UTF8Encoding]::new($false)
$sha = [System.Security.Cryptography.SHA256]::Create()
$records = Get-ChildItem -LiteralPath $root -Recurse -File -Filter '*-narration.md' | Sort-Object FullName | ForEach-Object {
  $text = [IO.File]::ReadAllText($_.FullName, $utf8)
  $first = [regex]::Match($text, '(?m)^\[N001\]\r?$')
  $tail = [regex]::Match($text, '(?m)^#{2,3}\s+6\.1\s+Narration Duration Estimate\r?$')
  if (-not $first.Success -or -not $tail.Success -or $tail.Index -le $first.Index) { throw "正文边界异常：$($_.FullName)" }
  $prefix = $text.Substring(0, $first.Index)
  $body = $text.Substring($first.Index, $tail.Index - $first.Index)
  $suffix = $text.Substring($tail.Index)
  $ids = [regex]::Matches($body, '(?m)^\[(N\d{3})\]\r?$') | ForEach-Object { $_.Groups[1].Value }
  [pscustomobject]@{
    path = $_.FullName
    ids = @($ids)
    prefixSha256 = [Convert]::ToHexString($sha.ComputeHash($utf8.GetBytes($prefix)))
    suffixSha256 = [Convert]::ToHexString($sha.ComputeHash($utf8.GetBytes($suffix)))
    bodyLength = $body.Length
    textbookCount = ([regex]::Matches($body, '教材')).Count
    numericTokens = @([regex]::Matches($body, '(?<![A-Za-z])(?:\d+(?:\.\d+)?%?|\d{4}[—-]\d{4})') | ForEach-Object { $_.Value })
  }
}
$records | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $baselinePath -Encoding UTF8
"BASELINE=$baselinePath"
"FILES=$($records.Count)"
"BODY_TEXTBOOK_TOTAL=$(($records.textbookCount | Measure-Object -Sum).Sum)"
```

Expected: `FILES=51`；基线文件成功写入；正文“教材”总数应小于此前全文件统计的 422，因为制作备注不在正文范围内。

- [ ] **Step 3: 人工确认三类高风险表达的改写策略**

检查至少以下原句类型并记录在执行笔记中：

```text
来源引入：教材用航空发动机说明这种变化。
证据限制：教材没有给出接口字段、协议和时序，本集只保留业务语义。
案例数据：教材对该主动标识模具案例给出量化结果……
```

Expected: 分别采用“直接引入案例”“自然限定讲解范围”“明确案例归属并保留统计边界”的策略，不为三类句式设定统一替换词。

---

### Task 2: 整体润色模块一（第 01–13 集）

**Files:**
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-01-industrial-internet-origins-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-02-industrial-internet-data-loop-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-03-new-industrialization-industrial-internet-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-04-digital-transformation-chain-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-05-industrial-internet-identifier-private-code-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-06-identifier-resolution-system-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-07-china-identifier-scale-application-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-08-identifier-resolution-connectivity-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-09-engine-lifecycle-traceability-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-10-active-identifier-mold-control-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-11-pharmaceutical-supply-chain-collaboration-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-12-automotive-parts-lean-management-narration.md`
- Modify: `outputs/narration-scripts/module-1-system-cognition/episode-13-industrial-software-connectors-narration.md`

**Interfaces:**
- Consumes: Task 1 的基线与润色边界。
- Produces: 第 01–13 集自然、连贯且正文不含“教材”的完整讲稿。

- [ ] **Step 1: 逐篇通读并标注每个 N 段的叙事功能**

对每集在内存笔记中依次识别：开场问题、概念解释、机制展开、案例证据、适用边界、总结与下集转场。不得先搜索“教材”再局部改句。

Expected: 每个 N 段都能用一个明确叙事功能概括，且相邻段落逻辑可连续复述。

- [ ] **Step 2: 在原 N 段内完成整篇润色**

执行规则：保留全部 `[Nxxx]` 标记及段落边界；围绕每段叙事功能重写句间衔接；将来源提示融入事实、案例或范围限定；保留所有事实和限制条件。

Expected: 13 集均完成全文级润色，不存在仅对命中句机械换词的痕迹。

- [ ] **Step 3: 逐集朗读式复核**

对每集从 `[N001]` 连续读到最后一段，重点检查开场承诺是否在结尾回应、段首连接是否重复、定义是否突然出现、案例是否缺少归属、结尾转场是否自然。

Expected: 无连续使用同一过渡语、无元叙事式来源提示、无上下段断裂。

- [ ] **Step 4: 运行模块一局部校验**

Run:

```powershell
$module = 'D:\00-workspace\006-couseplay\outputs\narration-scripts\module-1-system-cognition'
$files = Get-ChildItem -LiteralPath $module -File -Filter '*-narration.md'
$bodyHits = foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $body = [regex]::Match($text, '(?ms)^\[N001\].*?(?=^#{2,3}\s+6\.1\s+Narration Duration Estimate)').Value
  if (-not $body) { throw "正文边界异常：$($file.FullName)" }
  if ($body.Contains('教材')) { $file.FullName }
}
"FILES=$($files.Count)"
"BODY_HIT_FILES=$(@($bodyHits).Count)"
```

Expected: `FILES=13`，`BODY_HIT_FILES=0`。

---

### Task 3: 整体润色模块二（第 14–20 集）

**Files:**
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-14-identifier-coding-principles-narration.md`
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-15-vaa-coding-from-issuer-to-enterprise-narration.md`
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-16-handle-prefix-suffix-distributed-resolution-narration.md`
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-17-oid-tree-naming-narration.md`
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-18-ecode-version-system-master-narration.md`
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-19-gs1-five-coding-systems-selection-narration.md`
- Modify: `outputs/narration-scripts/module-2-identifier-coding/episode-20-prefix-suffix-coding-rule-design-narration.md`

**Interfaces:**
- Consumes: Task 1 的基线与 Task 2 已验证的表达标准。
- Produces: 第 14–20 集自然、连贯且正文不含“教材”的完整讲稿。

- [ ] **Step 1: 逐篇通读并梳理编码体系的比较维度**

Expected: 每集的规则主体、编码层级、结构示例、适用条件与选择边界均被明确识别，避免润色后混淆 VAA、Handle、OID、Ecode 与 GS1。

- [ ] **Step 2: 在原 N 段结构内整体润色 7 集正文**

Expected: 专有名词、代码示例、前缀/后缀关系和规则条件保持原意；来源提示改为自然讲解。

- [ ] **Step 3: 逐集复核术语与例子的前后一致性**

Expected: 同一术语不被随意换成近义词；示例字符、层级方向和选择条件未改变。

- [ ] **Step 4: 运行模块二局部校验**

Run:

```powershell
$module = 'D:\00-workspace\006-couseplay\outputs\narration-scripts\module-2-identifier-coding'
$files = Get-ChildItem -LiteralPath $module -File -Filter '*-narration.md'
$bodyHits = foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $body = [regex]::Match($text, '(?ms)^\[N001\].*?(?=^#{2,3}\s+6\.1\s+Narration Duration Estimate)').Value
  if (-not $body) { throw "正文边界异常：$($file.FullName)" }
  if ($body.Contains('教材')) { $file.FullName }
}
"FILES=$($files.Count)"
"BODY_HIT_FILES=$(@($bodyHits).Count)"
```

Expected: `FILES=7`，`BODY_HIT_FILES=0`。

---

### Task 4: 整体润色模块三（第 21–32 集）

**Files:**
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-21-industrial-big-data-value-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-22-industrial-data-concept-boundaries-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-23-industrial-data-sharing-levels-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-24-data-elements-identifier-system-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-25-identifier-data-model-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-26-secondary-node-openapi-request-structure-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-27-apifox-template-interface-debug-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-28-top-level-and-enterprise-node-roles-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-29-secondary-node-public-service-platform-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-30-business-management-prefix-registration-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-31-recursive-resolution-query-flow-narration.md`
- Modify: `outputs/narration-scripts/module-3-data-and-resolution/episode-32-identifier-application-end-to-end-business-loop-narration.md`

**Interfaces:**
- Consumes: Task 1 的基线与前两个模块的表达标准。
- Produces: 第 21–32 集自然、连贯且正文不含“教材”的完整讲稿。

- [ ] **Step 1: 逐篇通读并区分概念讲解、接口操作和业务流程**

Expected: 不把概念性说明润色成具体操作承诺，也不把 Apifox/OpenAPI 操作步骤泛化为抽象描述。

- [ ] **Step 2: 在原 N 段结构内整体润色 12 集正文**

Expected: 请求结构、角色分工、注册与递归解析顺序、端到端业务链保持不变。

- [ ] **Step 3: 复核协议、字段、节点角色与流程顺序**

Expected: 未新增资料未给出的接口字段、协议时序、返回结果或自动化能力。

- [ ] **Step 4: 运行模块三局部校验**

Run:

```powershell
$module = 'D:\00-workspace\006-couseplay\outputs\narration-scripts\module-3-data-and-resolution'
$files = Get-ChildItem -LiteralPath $module -File -Filter '*-narration.md'
$bodyHits = foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $body = [regex]::Match($text, '(?ms)^\[N001\].*?(?=^#{2,3}\s+6\.1\s+Narration Duration Estimate)').Value
  if (-not $body) { throw "正文边界异常：$($file.FullName)" }
  if ($body.Contains('教材')) { $file.FullName }
}
"FILES=$($files.Count)"
"BODY_HIT_FILES=$(@($bodyHits).Count)"
```

Expected: `FILES=12`，`BODY_HIT_FILES=0`。

---

### Task 5: 整体润色模块四（第 33–42 集）

**Files:**
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-33-one-dimensional-vs-qr-code-selection-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-34-rfid-contactless-batch-reading-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-35-identifier-carrier-selection-material-process-environment-cost-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-36-identification-carrier-design-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-37-active-identifier-uicc-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-38-communication-modules-industrial-terminals-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-39-active-identifier-registration-reporting-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-40-active-identifier-service-architecture-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-41-sm1-sm2-active-identifier-security-roles-narration.md`
- Modify: `outputs/narration-scripts/module-4-identifier-carrier/episode-42-active-identifier-industry-scenarios-narration.md`

**Interfaces:**
- Consumes: Task 1 的基线与前三个模块的表达标准。
- Produces: 第 33–42 集自然、连贯且正文不含“教材”的完整讲稿。

- [ ] **Step 1: 逐篇通读并梳理载体、通信、安全与场景边界**

Expected: 一维码、二维码、RFID、UICC、通信模组、主动标识与密码算法各自承担的角色清晰。

- [ ] **Step 2: 在原 N 段结构内整体润色 10 集正文**

Expected: 不把载体能力夸大成平台能力，不把加密通信表述成无条件安全保证。

- [ ] **Step 3: 复核技术能力与适用条件**

Expected: 读取方式、环境约束、成本维度、注册上报关系及 SM1/SM2 角色保持准确。

- [ ] **Step 4: 运行模块四局部校验**

Run:

```powershell
$module = 'D:\00-workspace\006-couseplay\outputs\narration-scripts\module-4-identifier-carrier'
$files = Get-ChildItem -LiteralPath $module -File -Filter '*-narration.md'
$bodyHits = foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $body = [regex]::Match($text, '(?ms)^\[N001\].*?(?=^#{2,3}\s+6\.1\s+Narration Duration Estimate)').Value
  if (-not $body) { throw "正文边界异常：$($file.FullName)" }
  if ($body.Contains('教材')) { $file.FullName }
}
"FILES=$($files.Count)"
"BODY_HIT_FILES=$(@($bodyHits).Count)"
```

Expected: `FILES=10`，`BODY_HIT_FILES=0`。

---

### Task 6: 整体润色模块五（第 43–51 集）

**Files:**
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-43-secondary-node-leadership-deployment-models-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-44-secondary-node-technical-baseline-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-45-secondary-node-operations-service-personnel-reporting-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-46-secondary-node-security-six-layers-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-47-enterprise-node-five-core-functions-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-48-enterprise-node-data-sync-governance-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-49-idhub-enterprise-node-product-architecture-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-50-enterprise-node-build-mode-selection-narration.md`
- Modify: `outputs/narration-scripts/module-5-node-construction-operation/episode-51-enterprise-prefix-application-preparation-validation-narration.md`

**Interfaces:**
- Consumes: Task 1 的基线与前四个模块的表达标准。
- Produces: 第 43–51 集自然、连贯且正文不含“教材”的完整讲稿。

- [ ] **Step 1: 逐篇通读并区分建设要求、运维职责、产品能力与申请流程**

Expected: 领导模式、技术基线、安全层次、企业节点能力、IDHub 架构、建设模式和前缀申请准备不互相混淆。

- [ ] **Step 2: 在原 N 段结构内整体润色 9 集正文**

Expected: 规范性要求与建议性表达保持原有强度；产品案例不扩大为通用标准。

- [ ] **Step 3: 复核角色、责任、条件和流程顺序**

Expected: 人员报送、安全责任、数据同步治理与申请校验条件均未遗漏。

- [ ] **Step 4: 运行模块五局部校验**

Run:

```powershell
$module = 'D:\00-workspace\006-couseplay\outputs\narration-scripts\module-5-node-construction-operation'
$files = Get-ChildItem -LiteralPath $module -File -Filter '*-narration.md'
$bodyHits = foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  $body = [regex]::Match($text, '(?ms)^\[N001\].*?(?=^#{2,3}\s+6\.1\s+Narration Duration Estimate)').Value
  if (-not $body) { throw "正文边界异常：$($file.FullName)" }
  if ($body.Contains('教材')) { $file.FullName }
}
"FILES=$($files.Count)"
"BODY_HIT_FILES=$(@($bodyHits).Count)"
```

Expected: `FILES=9`，`BODY_HIT_FILES=0`。

---

### Task 7: 执行全量结构与修改范围验收

**Files:**
- Read: `C:/tmp/narration-polish-baseline.json`
- Read: `outputs/narration-scripts/**/*.md`
- Modify: none

**Interfaces:**
- Consumes: Task 1 基线和 Task 2–6 的 51 集润色结果。
- Produces: 全量机器校验结果与人工终审结论。

- [ ] **Step 1: 校验 N 编号序列和非正文区域完全不变**

Run:

```powershell
$baseline = Get-Content -LiteralPath 'C:\tmp\narration-polish-baseline.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$utf8 = [System.Text.UTF8Encoding]::new($false)
$sha = [System.Security.Cryptography.SHA256]::Create()
$errors = foreach ($record in $baseline) {
  $text = [IO.File]::ReadAllText($record.path, $utf8)
  $first = [regex]::Match($text, '(?m)^\[N001\]\r?$')
  $tail = [regex]::Match($text, '(?m)^#{2,3}\s+6\.1\s+Narration Duration Estimate\r?$')
  if (-not $first.Success -or -not $tail.Success) { "BOUNDARY $($record.path)"; continue }
  $prefix = $text.Substring(0, $first.Index)
  $body = $text.Substring($first.Index, $tail.Index - $first.Index)
  $suffix = $text.Substring($tail.Index)
  $ids = @([regex]::Matches($body, '(?m)^\[(N\d{3})\]\r?$') | ForEach-Object { $_.Groups[1].Value })
  $prefixHash = [Convert]::ToHexString($sha.ComputeHash($utf8.GetBytes($prefix)))
  $suffixHash = [Convert]::ToHexString($sha.ComputeHash($utf8.GetBytes($suffix)))
  if (($ids -join ',') -ne ($record.ids -join ',')) { "IDS $($record.path)" }
  if ($prefixHash -ne $record.prefixSha256) { "PREFIX $($record.path)" }
  if ($suffixHash -ne $record.suffixSha256) { "SUFFIX $($record.path)" }
}
"ERRORS=$(@($errors).Count)"
$errors
```

Expected: `ERRORS=0`。

- [ ] **Step 2: 校验正文“教材”为零并报告字数变化**

Run:

```powershell
$baseline = Get-Content -LiteralPath 'C:\tmp\narration-polish-baseline.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$report = foreach ($record in $baseline) {
  $text = Get-Content -LiteralPath $record.path -Raw -Encoding UTF8
  $body = [regex]::Match($text, '(?ms)^\[N001\].*?(?=^#{2,3}\s+6\.1\s+Narration Duration Estimate)').Value
  $newLength = $body.Length
  [pscustomobject]@{
    Episode = [regex]::Match([IO.Path]::GetFileName($record.path), '^episode-(\d{2})-').Groups[1].Value
    TextbookCount = ([regex]::Matches($body, '教材')).Count
    OldLength = [int]$record.bodyLength
    NewLength = $newLength
    ChangePct = [math]::Round((($newLength - [int]$record.bodyLength) / [double]$record.bodyLength) * 100, 1)
  }
}
$report | Sort-Object Episode | Format-Table -AutoSize
"TOTAL_TEXTBOOK=$(($report.TextbookCount | Measure-Object -Sum).Sum)"
"OVER_15_PERCENT=$(@($report | Where-Object { [math]::Abs($_.ChangePct) -gt 15 }).Count)"
```

Expected: `TOTAL_TEXTBOOK=0`。任何 `ChangePct` 绝对值超过 15% 的单集必须重新通读，确认知识覆盖与讲解完整性；复核完成前不得交付。

- [ ] **Step 3: 对照基线复核数字表达**

逐集比较基线 `numericTokens` 与润色稿数字。允许因自然口播将阿拉伯数字转为中文读法，但每个变化都必须能对应到原数字且含义、单位、范围和案例归属不变。

Expected: 无数字丢失、数值变化、百分号含义变化、年份范围变化或案例数字外推。

- [ ] **Step 4: 进行跨模块人工终审**

每个模块至少选择“概念课、案例课、操作/流程课”各一集完整朗读；另外完整复核所有包含量化结果、安全结论、协议边界和产品案例的集数。

Expected: 过渡自然，没有“现有资料显示”等新的固定来源腔；课程事实与限定完整；N 段结构稳定。

- [ ] **Step 5: 输出验收摘要，不执行版本控制操作**

摘要必须包含：修改文件数、正文“教材”最终次数、N 结构错误数、非正文区域变化数、字数变化超过 15% 的复核结果、数字边界复核结果。

Expected: 51 个文件完成；正文“教材”0 次；N 结构错误 0；非正文区域变化 0；所有异常均已解释或修正。未经用户另行授权，不执行 `git add`、`git commit` 或推送。
