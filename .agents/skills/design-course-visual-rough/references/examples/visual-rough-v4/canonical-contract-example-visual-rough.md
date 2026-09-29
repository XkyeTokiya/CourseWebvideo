---
schema_version: courseplay-visual-rough/v4
document_kind: candidate
episode_id: canonical-contract-example
source_a_page: canonical-contract-example-a-page.json
source_a_page_sha256: 32172be2d2de25c6bdaef8e29b3f0079c060bf78b889b35e9829f66531a9d4bc
status: draft
image_required_page_fraction: 1/3
logic_diagram_page_limit: 0
---

# Canonical visual rough v4 example

## A001｜锚点页

- **内容角色**：提出问题
- **页面配方**：`central-question`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U001 <- G001 + G002`
2. `U002 <- G001`

### 页面骨架

- `headline <- S001`
- `body <- U001`
- `question <- U002`

### 关系保真

- `[R001]`：由同一主区域的并列层级承载

## A002｜职责页

- **内容角色**：职责对照
- **页面配方**：`issue-cards-with-image`
- **论点标题**：`S004`
- **辅助句**：`none`
- **媒体需求**：`M001 / photorealistic_ai`
- **媒体作用**：`生成现场语境`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U003 <- G003`
2. `U004 <- G003`
3. `U005 <- G004`

### 页面骨架

- `headline <- S004`
- `issues <- U003`
- `context <- U005`
- `takeaway <- U004`
- `image <- M001`

### 关系保真

- `[R002]`：由左右职责卡的边界排列承载

## A003｜原图页

- **内容角色**：教材读图
- **页面配方**：`image-with-reading-notes`
- **论点标题**：`S007`
- **辅助句**：`none`
- **媒体需求**：`M002 / textbook_original`
- **媒体作用**：`完整保留教材证据`
- **教材证据**：`E002`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U006 <- G005 + G006`
2. `U007 <- G006`

### 页面骨架

- `headline <- S007`
- `image <- M002`
- `reading-order <- U006`
- `key-points <- U007`

### 关系保真

- `[R003]`：由原图外的阅读顺序说明承载

## A004｜记录页

- **内容角色**：并列整理
- **页面配方**：`parallel-cards-self-contained`
- **论点标题**：`S010`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U008 <- G007`
2. `U009 <- G008`
3. `U010 <- G009`

### 页面骨架

- `headline <- S010`
- `left <- U008`
- `middle <- U009`
- `right <- U010`

### 关系保真

none

## A005｜场景页

- **内容角色**：语境固定
- **页面配方**：`time-anchor-opening`
- **论点标题**：`S014`
- **辅助句**：`none`
- **媒体需求**：`M003 / photorealistic_ai`
- **媒体作用**：`提供现场落点`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U011 <- G010 + G011`
2. `U012 <- G010`

### 页面骨架

- `headline <- S014`
- `time-anchor <- U011`
- `context-line <- U012`
- `scene-image <- M003`

### 关系保真

- `[R004]`：由时间标签与现场图的上下分层承载

## A006｜判据页

- **内容角色**：条件比较
- **页面配方**：`split-compare-with-pivot`
- **论点标题**：`S017`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U013 <- G012`
2. `U014 <- G013`

### 页面骨架

- `headline <- S017`
- `left <- U013`
- `pivot <- U014`
- `right <- U013`

### 关系保真

- `[R005]`：由中部判据槽位承载

## A007｜步骤页

- **内容角色**：顺序收束
- **页面配方**：`linear-steps-with-takeaway`
- **论点标题**：`S020`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U015 <- G014 + G015`
2. `U016 <- G015`
3. `U017 <- G016`

### 页面骨架

- `headline <- S020`
- `steps <- U015`
- `support <- U016`
- `takeaway <- U017`

### 关系保真

none
