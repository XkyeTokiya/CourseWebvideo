# Anchor: equal-group（并列等权持续场景）

用于多个卡片或槽位在语义上平级、最终必须保持等权的章节。它与
`list-reveal` 的关键区别是：出现顺序不代表阶段顺序，也不留下当前选中项。

```markdown
**语义关系**：并列等权
**关系机制**：`equal-weight-accumulation` — 内容可依次进入，完成后全部等权

| Step | Narration focus | Scene · Semantic state | 本步场景指令 |
|---|---|---|---|
| 1 | 四类系统已经存在 | `S-A005 · systems-equal` | 建立四个固定槽位，在本 step 内依次补齐卡片；完成后全部等权 |
| 2 | 各自完成局部任务 | `S-A005 · systems-equal` | 保持同一 state，在原卡片内补充职责，不产生 active 卡 |
| 3 | 局部有效不等于整体互联 | `S-A005 · systems-with-takeaway` | 保持四卡等权，加入共同判断 |
```

这里的前三步来自假设口播，不是固定数量。核心正例是 step 1 与 step 2 重复
引用 `systems-equal`。

实现中用 semantic state 控制“是否已有共同判断”，而不是用 `step` 计算当前卡片。
如果需要在一个 step 内依次出现四张卡，只把这个顺序当作该 beat 内的呈现编排；
稳定画面仍是四卡等权。
