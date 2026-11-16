---
schema_version: courseplay-visual-rough/v4
document_kind: production
episode_id: episode-31
source_a_page: episode-31-a-page.json
source_a_page_sha256: 972c0fd2b0eaf99722ca4c95e6051056c71b1de774f8ff65f32862f98aa90237
status: approved
image_required_page_fraction: 1/3
logic_diagram_page_limit: 0
---

# Episode 31 visual rough v4 draft (10 pages)

## A001｜查询开场页

- **内容角色**：问题开场
- **页面配方**：`time-anchor-opening`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`M001 / photorealistic_ai`
- **媒体作用**：提供维护人员发起设备查询的现场语境
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U001 <- G001`
2. `U002 <- G002`

### 页面骨架

- `headline <- S001`
- `time-anchor <- U001`
- `context-line <- U002`
- `scene-image <- M001`

### 关系保真

- `[R001]`：由查询动作卡与主问题行的上下排布承载

## A002｜定义与入口页

- **内容角色**：定义三卡
- **页面配方**：`parallel-cards-self-contained`
- **论点标题**：`S005`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U003 <- G003`
2. `U004 <- G004`
3. `U005 <- G005`

### 页面骨架

- `headline <- S005`
- `definition-card <- U003`
- `effect-card <- U004`
- `entry-card <- U005`

### 关系保真

- `[R002]`：由定义卡到作用卡的推进位置承载
- `[R003]`：由入口卡与作用卡的上下支撑承载

## A003｜角色与缓存页

- **内容角色**：角色与分叉
- **页面配方**：`parallel-cards-with-takeaway`
- **论点标题**：`S010`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U006 <- G006`
2. `U007 <- G007`
3. `U008 <- G008`

### 页面骨架

- `headline <- S010`
- `role-card <- U006`
- `cache-card <- U007`
- `takeaway <- U008`

### 关系保真

- `[R004]`：由角色卡到缓存卡的推进位置承载
- `[R005]`：由命中收束与未命中继续的对照承载

## A004｜教材读图页

- **内容角色**：教材读图
- **页面配方**：`image-with-reading-notes`
- **论点标题**：`S015`
- **辅助句**：`none`
- **媒体需求**：`M002 / textbook_original`
- **媒体作用**：完整呈现教材图 3-25 的递归解析流程
- **教材证据**：`E008`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U009 <- G009 + G010`
2. `U010 <- G010`

### 页面骨架

- `headline <- S015`
- `image <- M002`
- `reading-order <- U009`
- `key-points <- U010`
- `takeaway <- none`

### 关系保真

- `[R006]`：由未命中前提与前三步说明的先后承载

## A005｜企业地址页

- **内容角色**：地址指引
- **页面配方**：`layered-bands-with-side-notes`
- **论点标题**：`S020`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U011 <- G011`
2. `U012 <- G012`

### 页面骨架

- `headline <- S020`
- `ordered-bands <- U011`
- `side-notes <- U012`
- `boundary <- none`
- `takeaway <- none`

### 关系保真

- `[R007]`：由二级查询带到企业地址侧栏卡的相对位置承载

## A006｜数据返回页

- **内容角色**：返回三步
- **页面配方**：`linear-steps-to-result`
- **论点标题**：`S023`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U013 <- G013`
2. `U014 <- G014`
3. `U015 <- G015`

### 页面骨架

- `headline <- S023`
- `steps <- U013`
- `steps-2 <- U014`
- `terminal-result <- U015`

### 关系保真

- `[R008]`：由企业查询步到数据回程步的推进次序承载
- `[R009]`：由回程步到缓存写入末态的位置承载

## A007｜机制价值页

- **内容角色**：价值对照
- **页面配方**：`parallel-cards-self-contained`
- **论点标题**：`S027`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U016 <- G016`
2. `U017 <- G017`
3. `U018 <- G017`

### 页面骨架

- `headline <- S027`
- `without-card <- U016`
- `with-card <- U017`
- `cache-gain-card <- U018`

### 关系保真

- `[R010]`：由没有/有两卡的对照承载

## A008｜入口页

- **内容角色**：多入口语境
- **页面配方**：`image-with-insight-rail`
- **论点标题**：`S031`
- **辅助句**：`none`
- **媒体需求**：`M003 / photorealistic_ai`
- **媒体作用**：提供工业现场经移动终端触发查询的语境
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U019 <- G018`
2. `U020 <- G019`

### 页面骨架

- `headline <- S031`
- `image <- M003`
- `insight-rail <- U019`
- `insight-rail-2 <- U020`

### 关系保真

- `[R011]`：由多入口卡汇入主线卡的排布承载

## A009｜三类返回页

- **内容角色**：返回对照
- **页面配方**：`parallel-cards-with-takeaway`
- **论点标题**：`S034`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U021 <- G020`
2. `U022 <- G021`
3. `U023 <- G022`

### 页面骨架

- `headline <- S034`
- `address-returns <- U021`
- `final-return <- U022`
- `takeaway <- U023`

### 关系保真

- `[R012]`：由地址返回与数据返回的划界对照承载

## A010｜总结页

- **内容角色**：总结收束
- **页面配方**：`image-with-summary-rail`
- **论点标题**：`S038`
- **辅助句**：`none`
- **媒体需求**：`M004 / photorealistic_ai`
- **媒体作用**：回到开场查询，提供收束落点
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 视觉内容单元

1. `U024 <- G023`
2. `U025 <- G024`
3. `U026 <- G025`

### 页面骨架

- `headline <- S038`
- `image <- M004`
- `summary-rail <- U024`
- `summary-rail-2 <- U025`
- `final-judgment <- U026`

### 关系保真

- `[R013]`：由分工条到逐级规律条的推进位置承载
- `[R014]`：由规律条到完整过程收束条的先后次序承载
