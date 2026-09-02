---
schema_version: courseplay-visual-rough/v3
document_kind: production
episode_id: episode-04
source_a_page: episode-04-a-page.json
source_a_page_sha256: 654469DCDE1734BC82DE05DCA4388F357F4B45860188A1C03115A625BAA3B1D0
status: draft
image_required_page_fraction: 1/3
logic_diagram_page_limit: 2
---

# EP04 视觉粗设

## 1. 单集视觉策略

- **受众与目的**：帮助通识课学习者建立“技术部署不等于转型完成”的判断，并沿连接、数据、智能、行动理解业务价值。
- **默认载体**：问题场景、分组卡片、单向步骤、左右对照和教材原图读图提示。
- **图片策略**：8 页需要 3 个图片页；A001 使用 `M001` / `photorealistic_ai`，A005 使用 `M002` / `photorealistic_ai`，A007 使用 `M003` / `textbook_original`。实际媒体在页面结构完成后解析。
- **逻辑图策略**：0 页；本集的顺序、对照和层级关系均由已注册的非逻辑配方承载。
- **内部信息**：A/S/G/R/M/E/C ID 仅供核对，不进入学习者可见页面。

## 2. 逐页视觉粗设

## A001｜问题场景

- **内容角色**：问题引入与情境锚定
- **页面配方**：`time-anchor-opening`
- **论点标题**：`S001`
- **辅助句**：`none`
- **媒体需求**：`M001` / `photorealistic_ai`
- **媒体作用**：建立无品牌工厂的设想现场；图片只承担情境，不承担技术细节或证据。
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G001`
2. `G002`

### 页面骨架

- `headline <- none`
- `time-anchor <- none`
- `context-line <- G001`
- `context-line <- G002`
- `scene-image <- M001`

### 关系保真

- none

## A002｜转型边界

- **内容角色**：概念边界与持续性
- **页面配方**：`layered-bands-with-side-notes`
- **论点标题**：`S005`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G003`
2. `G004`
3. `G005`

### 页面骨架

- `headline <- none`
- `ordered-bands <- G003`
- `ordered-bands <- G004`
- `side-notes <- G005`
- `boundary <- none`
- `takeaway <- none`

### 关系保真

- none

## A003｜连接先行

- **内容角色**：连接职责与数据能力的边界
- **页面配方**：`linear-steps-to-result`
- **论点标题**：`S010`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G006`
2. `G007`
3. `G008`

### 页面骨架

- `headline <- none`
- `steps <- G006`
- `steps <- G007`
- `terminal-result <- G008`

### 关系保真

- [R001]：G006 的连接前提先于 G008 的数据能力结果，关系由单向顺序承载。

## A004｜数据成证据

- **内容角色**：数据来源、分析用途与问题关联
- **页面配方**：`parallel-cards-self-contained`
- **论点标题**：`S014`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G009`
2. `G010`
3. `G011`

### 页面骨架

- `headline <- none`
- `parallel-cards <- G009`
- `parallel-cards <- G010`
- `parallel-cards <- G011`

### 关系保真

- none

## A005｜判断落行动

- **内容角色**：智能处理、业务判断与行动落点
- **页面配方**：`image-with-insight-rail`
- **论点标题**：`S019`
- **辅助句**：`none`
- **媒体需求**：`M002` / `photorealistic_ai`
- **媒体作用**：提供无品牌生产现场语境；图侧内容承担判断与行动的阅读线索。
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G012`
2. `G013`

### 页面骨架

- `headline <- none`
- `image <- M002`
- `insight-rail <- G012`
- `insight-rail <- G013`

### 关系保真

- [R002]：G012 的处理与判断区域承接前页形成的证据，关系由处理顺序和前后页衔接承载。
- [R003]：G012 的判断线索先于 G013 的行动线索，关系由阅读顺序和两组分工承载。

## A006｜断链反例

- **内容角色**：依赖关系的反例比较
- **页面配方**：`split-compare-with-pivot`
- **论点标题**：`S024`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G014`
2. `G015`

### 页面骨架

- `headline <- none`
- `left <- G014`
- `pivot <- none`
- `right <- G015`

### 关系保真

- [R004]：G014 与 G015 对照不同断点，G015 内部的完整链条承担判断支点，关系由对照和顺序承载。

## A007｜共同承载

- **内容角色**：教材架构对照与读图
- **页面配方**：`image-with-reading-notes`
- **论点标题**：`S028`
- **辅助句**：`none`
- **媒体需求**：`M003` / `textbook_original`
- **媒体作用**：先以教材图 1-3 建立原图归属，再由图外读图提示分别承接传统侧与新方向。
- **教材证据**：`E006`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G016`
2. `G017`

### 页面骨架

- `headline <- none`
- `image <- M003`
- `reading-order <- G016`
- `key-points <- G017`
- `takeaway <- none`

### 关系保真

- [R005]：G016 先呈现传统承载方式，再在同一读图区域呈现其局限，关系由同侧分组承载。
- [R006]：G017 将新方向与四个构筑维度并置，关系由同组阅读承载。
- [R007]：G016 到 G017 的阅读顺序从传统问题转向共同承载方向，不建立两组清单的一一对应。

## A008｜价值收束

- **内容角色**：业务价值、持续改进与下一集入口
- **页面配方**：`parallel-cards-with-takeaway`
- **论点标题**：`S033`
- **辅助句**：`none`
- **媒体需求**：`none`
- **媒体作用**：`none`
- **教材证据**：`none`
- **逻辑图**：`no`
- **逻辑图理由**：`none`

### 上屏内容组

1. `G018`
2. `G019`
3. `G020`

### 页面骨架

- `headline <- none`
- `parallel-cards <- G018`
- `parallel-cards <- G019`
- `takeaway <- G020`

### 关系保真

- [R008]：G020 的单向步骤把行动结果接入下一轮改进，关系由步骤顺序和 takeaway 收束承载。
- [R009]：G020 的后段从企业内部改进转向跨企业疑问，关系由阅读终点承载。

### 编译边界

- `S/G/M` 只做 ID 绑定；本文件不复制 A-page `guidance_text`。
- 每个 G 至少在 rough 中被考虑一次；这只证明 rough 完整，不产生下游逐 G 落屏义务。
- 标题 S 表示页面判断方向，不强制建立独立标题区。
- `C` 不绑定到任何可见槽位。
