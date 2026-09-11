# Courseplay Phase 1 runner

`courseplay-phase1.mjs` 只负责防止内容缺失，不判断文案是否精彩或画面是否足够好。
正式 `script.md` 与 `outline.md` 是唯一持久状态；不存在旁路 `state.json`、review
receipt、临时 script blocks 或人工维护的全局状态。

## 最小流程

```text
init
  → commit-chapter A001
  → commit-chapter A002
  → ...
  → finalize
  → Checkpoint Plan
```

每章只提交一次 script + outline 内容对。7 个 A-page 的正常路径是 9 次 runner
调用：1 次 `init`、7 次 `commit-chapter`、1 次 `finalize`。`status` 与 `resume`
仅用于诊断或中断恢复，不属于正常路径。

```bash
pnpm courseplay:phase1 -- init --episode episode-07
pnpm courseplay:phase1 -- commit-chapter --episode episode-07 --a-page A001 \
  --script <script-candidate.md> --outline <outline-candidate.md>
pnpm courseplay:phase1 -- finalize --episode episode-07
```

诊断：

```bash
pnpm courseplay:phase1 -- status --episode episode-07
pnpm courseplay:phase1 -- resume --episode episode-07
pnpm courseplay:phase1 -- preflight --episode episode-07
```

## 必需文件

Phase 1 只消费：

- `episodes/<id>/project.json`
- `episodes/<id>/inputs/<id>-a-page.json`
- `episodes/<id>/inputs/<id>-visual-rough.md`
- A-page 声明的 `approved_text`（如有）
- `episodes/<id>/script.md`
- `episodes/<id>/outline.md`

A-page / visual rough validation report 可以作为上游审计证据保留，但不是 runner
运行依赖。Phase 1 不读取 `narrations.ts`；它在 Phase 2 才产生。

完整 preflight 由 `init`、`resume`、`finalize` 执行，核对版本、批准状态、episode、
A-page 顺序、rough 来源摘要与批准口播。`commit-chapter` 只读取当前提交所需的
A-page 与 visual rough，并验证候选内容，不重复项目级 preflight。`status` 只读取
A-page 与两份正式产物，因此上游输入暂时不可用时仍可定位恢复点。

## 初始化与唯一状态

`init` 从 A-page `pages[]` 确定性创建两份模块化正式外壳。若 `episode:new` 留下的
`script.md` / `outline.md` 仍与仓库原始模板一致，runner 会迁移；已有非模板内容
则以 `PHASE1_ARTIFACT_CONFLICT` 停止，不覆盖。

每章在两份正式文件中都有稳定边界：

```markdown
<!-- CHAPTER:A001:BEGIN tx=pending -->
<!-- CHAPTER-CONTENT: pending -->
<!-- CHAPTER:A001:END -->
```

`tx` 只是 script / outline 内容对的一致性令牌，不是输入摘要或审查状态。提交时
先原子写 outline，再原子写 script；若进程在两次写入之间终止，两个 `tx` 不一致，
`status` 会把该章报告为 `incomplete`。重新提交这一章即可恢复，其他章节保持不变。

outline 还包含 `metadata`、`schedule`、`materials` 三个稳定边界。它们没有
pending/ready/stale 状态；任一章节重提时内容自动恢复为待生成，`finalize` 再从
已提交章节确定性生成。

## 候选内容契约

Script 候选：

```markdown
## A001 · 标题

第一拍批准口播

---

第二拍批准口播
```

非空 Beat 顺序拼接必须与当前 A-page `nx` 一致。批准口播不得改写。

Outline 候选必须是一个完整章节 section，并满足：

- 标题序号和 `A-page / Chapter` 与当前页一致；
- step 行从 1 连续编号，数量等于 script Beat 数；
- 所有受保护关系 ID 均出现；S/U/R/M 引用属于当前 A-page / rough；
- `额外复杂场景` 为 `none` 或 `proposed`，最终取舍留给 Checkpoint Plan。

候选文件不能包含 runner marker。Agent 在临时位置创作候选即可；候选不是持久
状态，成功提交后可以删除。

## Finalize

`finalize` 要求每章 script / outline 都存在且拥有相同 `tx`，重新验证无损 nx、
Beat/step 和稳定引用，然后自动生成 metadata、视觉调度与素材汇总，并用 handoff
v4 对每章做最终结构校验。成功后 outline 的编译状态变为
`awaiting-checkpoint-plan`。

语气、钩子、视觉美感和相邻章节差异由 Agent 在提交前/最终确认时自行判断；它们
不是 runner 状态，也不生成 PASS 收据。发现质量问题时只重提受影响章节。

## 诊断码

| 代码 | 含义 |
|---|---|
| `PHASE1_INPUT_MISSING` | 必需输入、正式产物或候选不存在/无法解析 |
| `PHASE1_VERSION_PAIR` | 不是 A-page v6 + visual rough v4 |
| `PHASE1_SOURCE_INTEGRITY` | episode、rough 来源摘要或批准口播不一致 |
| `PHASE1_INPUT_NOT_APPROVED` | 输入不是 production / approved |
| `PHASE1_PAGE_SEQUENCE` | 页集合、顺序、候选序号不一致 |
| `PHASE1_NX_MISMATCH` | Script Beat 无法无损还原当前 nx |
| `PHASE1_ARTIFACT_CONFLICT` | 现有正式文件不是 Courseplay 模块化格式，或候选含 marker |
| `PHASE1_BEAT_STEP_MISMATCH` | Beat 与 step 数/编号不一致 |
| `PHASE1_REFERENCE_UNKNOWN` | 丢失受保护关系或引用未知稳定 ID |
| `PHASE1_INCOMPLETE` | 仍有未提交或事务不一致章节 |
| `PHASE1_TOOL_DEFECT` | 未登记的 runner 异常 |

## Git 协作

正式输入、runner 变更和生成产物都通过普通 branch / PR 评审；marker 内不保存 Git
提交号或输入摘要。若批准输入在 PR 中变更，先让 preflight 明确报出差异，再在同一
分支显式重提受影响章节。A-page 集合或顺序变化属于结构迁移，runner 会 fail-fast，
不得静默覆盖现有正式产物。
