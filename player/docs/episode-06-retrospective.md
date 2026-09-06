# Episode 06 制作过程问题复盘

> 日期：2026-09-06 · 主题：episode-06（标识解析体系与层级）制作中实际发生并处置过的问题。
> 背景：12 正文章 = 第 1 章（主线程）+ 11 章（subagent 并行，1 章/agent 三波）。与 [episode-35-retrospective.md](episode-35-retrospective.md)（沉淀"为什么效果好"）互补，本文只沉淀"什么坏了、为什么坏、怎么修"，全部条目为本集实际发生且验证过的事实，不含构想。

## 一、并行派发首轮全军覆没（写盘前截断）

**现象**：按 ep35 模式（每 agent 2 章）派发 5 个 agent，全部以
`[sub-agent stopped early: the run errored]` 告终——其中 4 个时长精确停在
~1601946ms（≈26.7 分钟，疑似单 agent 运行时时长上限），1 个跑满 ~49 分钟但
"completed but returned no output"。磁盘盘点 11 章零产物，单 agent 已消耗
0.53M–1.08M tokens。

**根因**：单 agent 负载（2 章）+ 必读集过大（CHAPTER-CRAFT 全文 + 2 份参考
文档 + theme tokens + outline 块 + 风格锚），agent 在读与设计思考阶段耗尽运行
时预算，未进入写盘。ep35"每 agent 2 章"成立的前提是当时未触顶；负载叠加后
同一形态不再安全。

**处置**（重派后 11/11 章交付，单 agent 1.1M–1.9M tokens、9–50 分钟，零结构返工）：

1. 改 **1 章/agent**，三波（4+4+3）派发——派发粒度的第一约束是"运行时时长
   上限内能写完"，不是"上下文装得下"；
2. 砍掉 2 份次级参考文档（BOUND-MODE / STATE-MECHANISMS 的关键条款已转录进
   prompt 硬规则，不靠 agent 回读）；
3. prompt 增加执行纪律条款：**开写即落盘、推导与落盘交错、长文件哨兵分段
   写入、不在思考里完成整章设计再动笔**；
4. 波次改后台运行，主线程在波间注册已交付章、跑 narrations 对账，不空等。

**可复用结论**：重派时先改批次规模、再改 prompt 措辞；无论批次大小，
"开写即落盘"纪律必须写进派发 prompt；agent 被截断后先盘点磁盘产物再定
重派范围（本轮零产物，显式声明从零）。

## 二、第 8 章内容落位后消失（基态 opacity:0 + backwards 无 to 帧）

**现象**：用户验收报障——第 8 章除标题与"再往体系上方看"外没有任何内容，
且换步也不出现。

**根因**（CSS 基态缺陷，非结构问题）：

- `.gn-band-core > * { opacity: 0 }` 本意是"待落位"骨架槽的基态，但选择器
  无差别命中了已落位的全球带内容；
- 三处内容级联动画（gn-rise）只用 `backwards` 填充，keyframes 又没有显式
  `to` 帧——动画结束后计算样式回落到基态 `opacity: 0`，内容入场闪现一次
  即消失；层带框架则停在骨架态 0.45 透明度；
- 同模式潜伏在国家带与侧栏级联，拍 2/拍 3 同样复现。

**修复**（commit 201477c）：六处落位态规则补 `opacity: 1`（两带框架、两带
内容级联、侧栏框架与级联）；国家带级联选择器收窄到 `.gn-band-national`
本体，避免换步时误重触发全球带动画。骨架态与状态门控结构不动。

**跨章自查**：同模式（基态 opacity:0 + backwards 无 to 帧）机械扫描 ch2–12，
仅 ch8 中招；ch10 的 `fr-lock-pop`/`fr-seg-lit` 均为显式 to 帧 + forwards、
`.fr-note` 为 transition 落位，安全。

**机制规则**（一行版）：入场动画的"停留终态"必须显式存在，三选一——

1. 基态可见 + `backwards`（进章即播元素）；
2. 基态 `opacity: 0` + `forwards` + keyframes 显式 `to` 帧（状态门控元素）；
3. transition 到落位态（`.is-on` 规则里写 `opacity: 1`）。

基态 `opacity: 0` + `backwards` 且无 to 帧 = 演完即消失，验收必炸。

## 三、本机占位图素材库缺失

**现象**：分包记录的本地占位图素材库 `player/占位图/16-9/` 与 `4-3/` 在本
制作环境不存在（该目录不入 Git，属机器本地状态；本会话在 Linux 环境）。

**处置**：用户在 Checkpoint Plan 选"使用占位图"后，按 CHAPTER-CRAFT 的
fallback 用轻量占位卡（比例框 + M 编号短标签 + 一行说明）承载 M001–M004；
M003（教材原图）占位卡显式标注"教材原图占位"，防 AI 图/描摹冒充原始证据。
素材就位后复制进 `episodes/<id>/src/chapters/<chapter>/assets/` 原位替换。

**可复用结论**：素材目录属机器本地状态，跨环境制作先盘点素材库存在性；
checkpoint 上把"素材从哪来"落成明确选项，缺库时降级路径（占位卡）提前
写进 outline 素材清单。

## 四、验证机制实际拦截的问题（并行模式的对账实证）

- **outline 数值自检脚本**拦住第 10 章三方不一致：标题 2 steps / 步表 3 行 /
  script 2 拍（拍切分口径残留）。按 script 口径合并步 1/2 并改写偏离注记，
  复跑全绿——拍数权威是 script 的 `---` 分拍，outline 表格必须逐字对齐。
- **完工自检**拦住第 1 章"✓"文本符号（emoji 化指纹）与对应死样式
  `.sq-tick`，按"删元素删整块"清理。
- **narrations 对账脚本**（12 章 narrations 逐字 == script 拍、拼接 == 各页
  nx）与红线 grep（hex/setTimeout/states.indexOf/跨章 import）全 PASS——
  11 个并行 agent 交付零音画错位、零红线违例。

**可复用结论**：并行模式下三层对账（script↔nx、outline↔script、
narrations↔script）加红线 grep 是主线程收口的最小动作集，成本极低且
本轮两次真实拦截（ch1 符号、ch10 计数）；agent 自检上限（一次 typecheck）
之外的结构性核验必须集中主线程。

## 五、环境与治理面（简要）

- 本会话运行在 Linux/bash：分包中的 Windows 条款（cmd.exe、PowerShell
  专用工具、占位图库路径、playwright bash wrapper）不适用；多行提交信息
  用 bash heredoc 正常。
- dev server 端口顺延（5173 被占→5174）：空日志 ≠ 静默退出，以任务日志 +
  端口响应确认实际端口再交付预览 URL。
- entry.tsx 并行写冲突预防：agent 一律不注册章节，主线程按波次注册，
  11 章零冲突、零"未落盘 import"事故。
- 工作区既有他人/前会话改动（inputs 刷新、production-status 同步输出、
  taste 学习记录）按 provenance 分账：制作提交（d2965a8/ed26372/201477c）
  未混入，统一在复盘后按类分笔入库。

