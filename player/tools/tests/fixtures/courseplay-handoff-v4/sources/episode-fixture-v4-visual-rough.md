---
schema_version: courseplay-visual-rough/v4
document_kind: candidate
episode_id: episode-fixture-v4
source_a_page: episode-fixture-v4-a-page.json
source_a_page_sha256: 950fc5df831798068aa4a04e2c7fb58fc90f73671acb1cc22a2ecdf4ba9bc003
status: draft
image_required_page_fraction: 1/3
logic_diagram_page_limit: 2
---

# Synthetic v4 visual rough

## A001｜组合与复用

- **内容角色**：问题与判断
- **页面配方**：`issue-cards-with-image`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`M001 / photorealistic_ai`
- **媒体作用**：建立合成场景
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U001 <- G001 + G002`
2. `U002 <- G003`
3. `U003 <- G001 + G003`

### 页面骨架

- `headline <- S001`
- `body <- U001`
- `side <- U002`
- `takeaway <- U003`
- `image <- M001`

### 关系保真

- `[R001]`：由 body 内的对照排列承载

## A002｜单源拆分

- **内容角色**：拆分解释
- **页面配方**：`central-question`
- **论点标题**：`S005`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U004 <- G004`
2. `U005 <- G004`

### 页面骨架

- `headline <- S005`
- `body <- U004`
- `takeaway <- U005`

### 关系保真

- none

## A003｜汇总规则

- **内容角色**：结论
- **页面配方**：`parallel-cards-with-takeaway`
- **论点标题**：`S007`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U006 <- G005`
2. `U007 <- G006`
3. `U008 <- G005 + G006`

### 页面骨架

- `headline <- S007`
- `left <- U006`
- `right <- U007`
- `takeaway <- U008`

### 关系保真

- none
