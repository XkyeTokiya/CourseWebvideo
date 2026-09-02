---
schema_version: courseplay-visual-rough/v2
document_kind: candidate
episode_id: episode-09
source_a_page: episode-09-a-page-v5-slice.json
source_a_page_sha256: 2f5e113535347efd2a24b0523bc5586cbaf8bfd3fe95989c50133cea1e4840fc
status: draft
image_required_page_fraction: 1/3
logic_diagram_page_limit: 2
---

# EP09 视觉粗设 v2 候选切片

## 1. 单集视觉策略

- **受众与目的**：用稳定的 S/G ID 把上游 screen source 接入可审阅的页面配方。
- **默认载体**：注册配方、媒体槽位、内容组和关系载体。
- **图片策略**：A001 保留 M001；A008、A009 无媒体需求。
- **逻辑图策略**：本切片默认零页。
- **内部信息**：S/G/R/M/E/C ID 仅供核对，不上屏。

## 2. 逐页视觉粗设

## A001｜认出发动机之后

- **内容角色**：开篇教学情境
- **页面配方**：`issue-cards-with-image`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`M001` / `photorealistic_ai`
- **媒体作用**：建立售后扫描情境；不承载系统、数据或追溯关系。
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G001`

### 页面骨架

- `media-scene <- M001`
- `headline <- S001`
- `question-cards <- G001`
- `takeaway <- none`

### 关系保真

- `[R001]`：由媒体情境与标题的先后承载识别关系，不把标识画成数据容器。
- `[R002]`：由 G001 的共享对象与阅读顺序承载记录关联，不绘制虚构汇聚网络。

## A008｜改变的是查找方式

- **内容角色**：前后对照
- **页面配方**：`split-compare-with-thesis`
- **论点标题**：`S017`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G017`
2. `G018`

### 页面骨架

- `before <- G017`
- `after <- G018`
- `thesis <- S017`

### 关系保真

- `[R017]`：由 G018 内部的阅读顺序承载回查关系，不跨栏绘制回流线。
- `[R018]`：由 G018 内部的第二层顺序承载改进到质量的关系。
- `[R019]`：由 `thesis <- S017` 的收束位置承载关联能力与价值条件的区分。

## A009｜三项案例数字的证据边界

- **内容角色**：证据结果候选
- **页面配方**：`evidence-cards-with-provenance-boundary`
- **论点标题**：`S022`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G020`
2. `G021`

### 页面骨架

- `provenance <- G020`
- `results <- G021`
- `inference-boundary <- none`

### 关系保真

- `[R020]`：由 G020 先行、G021 后读的分组顺序承载案例归属。
- `[R021]`：由非可见 C020–C022 约束审核边界；C ID 不绑定任何可见槽位。
