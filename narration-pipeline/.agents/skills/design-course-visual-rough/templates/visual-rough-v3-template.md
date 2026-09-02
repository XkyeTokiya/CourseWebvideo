---
schema_version: courseplay-visual-rough/v3
document_kind: candidate
episode_id: episode-XX
source_a_page: episode-XX-a-page.json
source_a_page_sha256: <sha256>
status: draft
image_required_page_fraction: 1/3
logic_diagram_page_limit: 2
---

# EPXX 视觉粗设

## 1. 单集视觉策略

- **受众与目的**：<通识课学习者需要建立的基本认识>
- **默认载体**：<结构化文字、卡片、对照、步骤、图片等>
- **图片策略**：<Q 与所选页面；实际资产 post-deck 解析>
- **逻辑图策略**：<默认零页；必要时写明申请页>
- **内部信息**：A/S/G/R/M/E/C ID 仅供核对，不上屏。

## 2. 逐页视觉粗设

## A001｜<页面短名>

- **内容角色**：<内部角色说明>
- **页面配方**：`<registered-recipe-id>`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G001`
2. `G002`

### 页面骨架

- `content-region <- G001`
- `content-region <- G002`

### 关系保真

- `[R001]`：<关系如何由上述槽位、分组、顺序或对照承载；不得重复 guidance 文本>

### 编译边界

- `S/G/M` 只做 ID 绑定；本文件不得复制 A-page `guidance_text`。
- 每个 G 至少在 rough 中被考虑一次；这只证明 rough 完整，不产生下游逐 G 落屏义务。
- 标题 S 表示页面判断方向，不强制建立独立标题区。
- `C` 不得绑定到任何可见槽位。
