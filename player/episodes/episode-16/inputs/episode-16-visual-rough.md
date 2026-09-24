---
schema_version: courseplay-visual-rough/v4
document_kind: production
episode_id: episode-16
source_a_page: episode-16-a-page.json
source_a_page_sha256: cfcd77b95bb3d46b823dd5f72d7fe7fba3d39ef95a6130c273739c06601ae4e6
status: approved
image_required_page_fraction: 1/3
logic_diagram_page_limit: 0
---

# Episode 16 视觉粗设（Handle 编码：前缀、后缀与分布式解析）

## A001｜开头提问页

- **内容角色**：提出主问题
- **页面配方**：`time-anchor-opening`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`M001 / photorealistic_ai`
- **媒体作用**：提供跨环节流转的现场语境，承载同一对象的身份问题
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U001 <- G001`
2. `U002 <- G002`
3. `U003 <- G001 + G002`

### 页面骨架

- `headline <- S001`
- `time-anchor <- U001`
- `context-line <- U002`
- `scene-image <- M001`

### 关系保真

- `[R001]`：由情境单元到问题单元的上下分层承载

## A002｜体系框架页

- **内容角色**：建立体系认识
- **页面配方**：`common-anchor-association-groups`
- **论点标题**：`S005`
- **辅助句**：`S004`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U004 <- G003`
2. `U005 <- G004`
3. `U006 <- G003 + G004`

### 页面骨架

- `headline <- S005`
- `shared-anchor <- U004`
- `association-groups <- U005`
- `support-note <- U006`
- `scope-boundary <- U006`

### 关系保真

- `[R002]`：由同一锚点区的围合排布承载

## A003｜治理入口页

- **内容角色**：解释分配关系
- **页面配方**：`scope-responsibility-ledger`
- **论点标题**：`S008`
- **辅助句**：`S007`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U007 <- G005`
2. `U008 <- G006`
3. `U009 <- G005 + G006`

### 页面骨架

- `headline <- S008`
- `common-condition <- U007`
- `responsibility-rows <- U008`
- `duty-column <- U009`
- `boundary-column <- U009`

### 关系保真

- `[R003]`：由上下层级的阅读顺序承载

## A004｜治理分工页

- **内容角色**：说明职责层次
- **页面配方**：`image-with-reading-notes`
- **论点标题**：`S011`
- **辅助句**：`S010`
- **媒体需求**：`M002 / photorealistic_ai`
- **媒体作用**：呈现上下两级职责在同一现场语境中的落点
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U010 <- G007`
2. `U011 <- G008`
3. `U012 <- G007 + G008`

### 页面骨架

- `headline <- S011`
- `image <- M002`
- `reading-order <- U010`
- `key-points <- U011`
- `takeaway <- U012`

### 关系保真

none

## A005｜国家语境页

- **内容角色**：说明分配语境
- **页面配方**：`layered-bands-with-side-notes`
- **论点标题**：`S014`
- **辅助句**：`S013`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U013 <- G009`
2. `U014 <- G010`
3. `U015 <- G009 + G010`

### 页面骨架

- `headline <- S014`
- `ordered-bands <- U013`
- `side-notes <- U014`
- `boundary <- U015`
- `takeaway <- U015`

### 关系保真

- `[R004]`：由两级职责条的纵向排布承载

## A006｜前后缀结构页

- **内容角色**：拆解两部分职责
- **页面配方**：`split-compare-with-pivot`
- **论点标题**：`S017`
- **辅助句**：`S016`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U016 <- G011`
2. `U017 <- G012`
3. `U018 <- G011 + G012`

### 页面骨架

- `headline <- S017`
- `left <- U016`
- `pivot <- U017`
- `right <- U018`

### 关系保真

- `[R005]`：由左侧结构位的标注承载
- `[R006]`：由右侧结构位的标注承载

## A007｜前缀分层页

- **内容角色**：解释分级细化
- **页面配方**：`layered-bands-with-side-notes`
- **论点标题**：`S020`
- **辅助句**：`S019`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U019 <- G013`
2. `U020 <- G014`
3. `U021 <- G013 + G014`

### 页面骨架

- `headline <- S020`
- `ordered-bands <- U019`
- `side-notes <- U020`
- `boundary <- U021`
- `takeaway <- U021`

### 关系保真

- `[R007]`：由同一行内自左向右的分段排布承载

## A008｜后缀对象页

- **内容角色**：说明对象区分
- **页面配方**：`image-with-insight-rail`
- **论点标题**：`S023`
- **辅助句**：`S022`
- **媒体需求**：`M003 / photorealistic_ai`
- **媒体作用**：呈现企业内部多个独立对象与其中一个被核验的关系
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U022 <- G015`
2. `U023 <- G016`
3. `U024 <- G015 + G016`

### 页面骨架

- `headline <- S023`
- `image <- M003`
- `insight-rail <- U022`

### 关系保真

- `[R008]`：由对象单元与信息容器之间的引线标注承载

## A009｜完整示例页

- **内容角色**：读出完整标识
- **页面配方**：`image-with-reading-notes`
- **论点标题**：`S026`
- **辅助句**：`S025`
- **媒体需求**：`M004 / textbook_original`
- **媒体作用**：完整保留示例结构、前后缀与层级标注，供逐段读取
- **教材证据**：`E007`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U025 <- G017`
2. `U026 <- G018`
3. `U027 <- G017 + G018`

### 页面骨架

- `headline <- S026`
- `image <- M004`
- `reading-order <- U025`
- `key-points <- U026`
- `takeaway <- U027`

### 关系保真

- `[R009]`：由分段拼接的横向顺序承载

## A010｜分布式信息页

- **内容角色**：解释访问关系
- **页面配方**：`image-with-summary-rail`
- **论点标题**：`S029`
- **辅助句**：`S028`
- **媒体需求**：`M005 / textbook_original`
- **媒体作用**：完整保留示例结构与前后缀标注，供信息关联逐段读取
- **教材证据**：`E007`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U028 <- G019`
2. `U029 <- G020`
3. `U030 <- G019 + G020`

### 页面骨架

- `headline <- S029`
- `image <- M005`
- `summary-rail <- U028`
- `final-judgment <- U029`

### 关系保真

- `[R010]`：由标识节点指向多个信息容器的关联边承载

## A011｜共同入口页

- **内容角色**：说明入口与保存位置
- **页面配方**：`linear-steps-to-result`
- **论点标题**：`S032`
- **辅助句**：`S031`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U031 <- G021`
2. `U032 <- G022`
3. `U033 <- G021 + G022`

### 页面骨架

- `headline <- S032`
- `steps <- U031`
- `terminal-result <- U032`

### 关系保真

none

## A012｜三问检查页

- **内容角色**：收束职责分工
- **页面配方**：`condition-key-goal`
- **论点标题**：`S035`
- **辅助句**：`S034`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U034 <- G023`
2. `U035 <- G024`
3. `U036 <- G023 + G024`

### 页面骨架

- `headline <- S035`
- `condition <- U034`
- `key <- U035`
- `goal <- U036`
- `takeaway <- U036`

### 关系保真

- `[R011]`：由三个并列问句的等权排布承载

## A013｜收束回扣页

- **内容角色**：回到开场对象
- **页面配方**：`split-compare-with-thesis`
- **论点标题**：`S038`
- **辅助句**：`S037`
- **媒体需求**：`none`
- **媒体作用**：none
- **教材证据**：`none`
- **逻辑图**：no
- **逻辑图理由**：none

### 视觉内容单元

1. `U037 <- G025`
2. `U038 <- G026`
3. `U039 <- G025 + G026`

### 页面骨架

- `headline <- S038`
- `left <- U037`
- `right <- U038`
- `bottom-thesis <- U039`

### 关系保真

- `[R012]`：由底部统一结论条承载
