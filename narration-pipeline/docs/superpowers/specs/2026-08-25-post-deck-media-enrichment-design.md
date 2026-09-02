# A 页面图片配额与成品页后置填充设计规范

> **已被取代（2026-08-25）**：图片配额与媒体需求已从 A-page v4 移至独立 `courseplay-visual-rough/v1`。本文件仅保留 v3 历史设计背景，不再是活跃生产规范。

## 1. Summary

将现有 A 页面媒体试验升级为明确的图片生产契约：

- A JSON 在 PPT 制作前决定哪些页面必须使用图片；
- 图片页数量严格等于全部 A 页面数量的三分之一并向上取整；
- 每个图片页恰好声明一项独立媒体需求；
- 同一媒体需求和同一实际图片均不得跨页复用；
- 严格多数图片使用实景摄影风格 AI 图；
- 必要时允许使用教材原图，但禁止任何重绘、替代图或 AI 重建；
- A JSON 只规定图片页、图片类型和宽泛用途，不规定详细画面内容；
- PPT 页面结构完成后，后置媒体 Agent 才生成、选择和填入实际图片；
- 不设置图片 fallback。必选图片无法完成时，媒体阶段失败并报告缺口。

该变更破坏现有 `courseplay-a-page/v2` 的媒体字段语义，正式实施时升级为：

```text
courseplay-a-page/v3
```

## 2. Goals

本规范解决两个同时存在的问题：

1. 图片安排过晚时，媒体 Agent 容易给过多页面配图；
2. 图片安排过早且过细时，A JSON 又会退化成图片分镜，限制下游视觉表达。

目标状态是：A JSON 只控制图片数量和图片页归属，成品页后置媒体阶段控制实际图片内容与落位。

本课程是通识型、介绍型课程。图片主要用于建立真实场景、吸引注意和提供必要教材证据，不承担完整解释抽象技术关系的责任。

## 3. Terminology

- **A 页面**：`pages` 数组中的一项；一条 A 严格对应一页。
- **图片页**：`media_refs` 恰好包含一个 M ID 的 A 页面。
- **非图片页**：`media_refs=[]` 的 A 页面。
- **媒体需求**：A JSON `media_catalog` 中的一项，描述待完成图片的类型和宽泛用途，不代表实际图片文件。
- **实际图片**：PPT 页面完成后，由后置媒体 Agent 生成或取得的具体资产。
- **教材原图**：教材中已经存在并能定位到原始资产的图片。
- **重绘**：依据教材图或其他来源图重新创建、简化、风格化、合成或 AI 重建其节点、文字、层级、连线或结构。

## 4. Authority

### 4.1 继续有效的权威信息

- 批准口播与 Nx 无损契约；
- A 页面顺序、教学职责和时间；
- `must_visible`、`protected_relations`、事实证据、术语和结论边界；
- 教材原图的来源归属与资产定位信息。

### 4.2 不再具有图片分配权的信息

- 冻结任务包中的旧 M ID；
- 原 B 表中的媒体列；
- 初始 Media Plan 的重绘、合成图、替代图和 fallback；
- `visual_form`；
- 某一页面关系复杂度或 `must_visible` 项目数量。

初始任务包 Media Plan 只作为历史生成记录保留。A 页面编译器不得复制其媒体形式、M ID、重绘要求或图片先后关系。

## 5. Fixed Workflow

```text
批准口播
→ 编译 A 页面语义
→ A 编译器选择图片页并创建媒体需求
→ canonical v3 validation
→ 发布正式 A JSON
→ 制作完整 PPT 页面结构和图片容纳区域
→ 后置媒体 Agent 生成或取得唯一实际图片
→ 将图片填入已完成页面
→ 最终视觉验收与媒体报告
```

这里的“PPT 页面完成”表示：文字、结构、基础关系、排版和图片容纳区域已经确定，但实际图片尚未填入。

PPT 制作器不得自行增加或删除图片页。后置媒体 Agent 也不得改变 A JSON 已确定的图片页数量与归属。

## 6. A-page v3 Public Contract

### 6.1 Root structure

v3 在 v2 的 A 页面、证据、Nx 和时间契约基础上，重新定义媒体部分：

```json
{
  "schema_version": "courseplay-a-page/v3",
  "document_kind": "production",
  "episode_id": "episode-04",
  "approved_text": "approved-spoken-text.txt",
  "timing_model": {},
  "image_policy": {
    "required_page_fraction": "1/3",
    "rounding": "ceil",
    "images_per_selected_page": 1,
    "allow_reuse": false,
    "photorealistic_ai_majority": true,
    "assignment_stage": "a-page-compile",
    "asset_resolution_stage": "post-deck"
  },
  "evidence_catalog": [],
  "media_catalog": [],
  "pages": []
}
```

`image_policy` 的字段和值均为固定常量，不接受单集覆盖。

### 6.2 Media requirement

`media_catalog` 中每项只允许以下结构：

```json
{
  "media_id": "M001",
  "media_type": "photorealistic_ai",
  "evidence_refs": [],
  "purpose": "增强工业生产现场的场景感"
}
```

教材原图示例：

```json
{
  "media_id": "M002",
  "media_type": "textbook_original",
  "evidence_refs": ["E006"],
  "purpose": "展示教材中的架构原图"
}
```

约束：

- `media_type` 只能是 `photorealistic_ai` 或 `textbook_original`；
- `photorealistic_ai` 的 `evidence_refs` 必须为空，因为它不是事实证据；
- `textbook_original` 的 `evidence_refs` 必须非空并解析到同一 JSON 中的教材原图证据；
- `purpose` 只写一句宽泛视觉用途，不描述人物数量、设备类型、动作、镜头、构图、光线、颜色或具体物件；
- M ID 从 M001 连续编号；
- 不允许 `fallback`、`protected_meaning`、`aspect_ratio`、图片提示词、文件路径、asset hash、坐标或裁切参数；
- 不允许 `source-based redraw`、`source-based synthesis` 或其他重绘/合成类型。

### 6.3 Page media reference

每页继续使用 `media_refs`：

```json
{
  "a_id": "A001",
  "media_refs": ["M001"]
}
```

或者：

```json
{
  "a_id": "A002",
  "media_refs": []
}
```

不允许一页引用两个或更多 M ID。

## 7. Hard Allocation Rules

设 A 页面总数为 `N`，强制图片页数量为 `Q`：

```text
Q = ceil(N / 3)
```

等价整数算法：

```text
Q = (N + 2) // 3
```

必须同时满足：

1. 恰好 `Q` 个页面的 `media_refs` 长度为 1；
2. 其余 `N-Q` 个页面的 `media_refs=[]`；
3. `media_catalog` 恰好包含 `Q` 项；
4. 每项媒体需求恰好被一个页面引用；
5. 同一个 M ID 不得被两个页面引用；
6. 不允许未被引用的媒体需求；
7. 不允许页面引用目录中不存在的 M ID；
8. `photorealistic_ai` 数量必须严格大于 `Q/2`；
9. `textbook_original` 数量可以为零，但不得破坏 AI 图片的严格多数；
10. 不设置单集例外、短缺理由或 fallback。

示例：

| A 页数 N | 图片页 Q | 实景 AI 图最少数量 | 教材原图最多数量 |
|---:|---:|---:|---:|
| 8 | 3 | 2 | 1 |
| 10 | 4 | 3 | 1 |
| 11 | 4 | 3 | 1 |
| 15 | 5 | 3 | 2 |

## 8. Page Selection Rules

图片页数量是硬约束，具体页面由 A 编译器根据教学作用选择，不按固定页码间隔机械分配。

优先考虑：

1. 需要建立真实生产或业务场景的页面；
2. 有必要直接展示教材原图的页面；
3. 适合用新的真实场景增强章节转折或总结的页面。

不应仅因为以下原因选择图片页：

- `visual_form` 是 `process`、`causal`、`comparison` 或 `hierarchy`；
- 页面包含多个 `must_visible` 项；
- 页面关系复杂；
- 旧任务包为该段配置过媒体；
- 页面存在空白区域。

在满足教学作用的前提下，图片页应分散在全片，不应全部集中在相邻页面。该条属于人工质量检查，不作为机械失败条件。

## 9. Image Content Boundary

### 9.1 Photorealistic AI

- 采用实景摄影风格；
- 主要承担场景建立、注意力吸引和视觉氛围；
- 不要求逐项呈现页面的所有对象、节点、数据类别或动作；
- 在 A JSON 中不生成详细提示词；
- 必须视为 `illustrative`，不得冒充真实企业、教材照片或事实证据；
- 不主动加入可被误认为课程事实的品牌、企业名称、统计数字、标准编号或软件界面；
- 不得与页面的基本场景明显矛盾。

### 9.2 Textbook original

- 只能使用可定位的教材原始资产；
- 允许等比缩放、完整展示或引用原图局部视图；
- 不得修改原图中的节点、文字、层级和关系；
- 不得重新绘制、简化、风格化、合成替代或 AI 重建；
- 同一教材原图只能用于一个 A 页面。

### 9.3 Native page graphics

禁止重绘教材图，不等于禁止 PPT 使用原生文字、基础图标和简单关系线组织 A 页面语义。这些元素属于页面教学表达，不属于媒体图片，也不计入三分之一图片配额。

## 10. PPT and Post-deck Responsibilities

### 10.1 PPT production

PPT 制作器必须：

- 对 `media_refs` 非空页面设计一个图片容纳区域；
- 对 `media_refs=[]` 页面按无图片页面完成设计；
- 不自行增加、删除或移动媒体需求；
- 在没有实际图片时完成文字、结构和基础视觉关系；
- 不使用临时装饰图片冒充最终媒体资产。

### 10.2 Post-deck media Agent

媒体 Agent 必须同时读取：

1. 正式 A JSON；
2. 已完成结构的逐页 PPT 或等价可视成品；
3. 已授权的教材原图资产；
4. 本规范。

媒体 Agent 只能处理 `media_refs` 非空页面，并且：

- 根据 `media_type` 生成实景 AI 图或取得教材原图；
- 根据已完成页面的图片区域决定实际画幅和裁切；
- 不修改图片页归属和媒体类型；
- 不修改 `a_id`、Nx、页面顺序、时间和教学语义；
- 不以新的 M ID 代替无法完成的媒体需求；
- 无法完成时记录 `unresolved` 并停止最终发布。

## 11. No-reuse Definition

禁止复用需要在两个阶段分别验证：

### 11.1 A JSON

- 每个 M ID 只能出现在一个页面；
- 每个页面最多引用一个 M ID；
- 每个目录项必须恰好引用一次。

### 11.2 Actual assets

- 每个已完成资产计算 SHA-256；
- 不同 M ID 不得解析为相同 SHA-256；
- 对同一原图做不同裁切、缩放或压缩，仍视为同一图片，不得跨页使用；
- AI 图只有实际像素内容不同才视为不同资产，仅改文件名不算新图片。

因此，开场页和结尾回扣页如都被选为图片页，必须使用两张不同图片。

## 12. Post-deck Media Report

媒体阶段输出最终 PPT 或等价成品，并生成：

```json
{
  "schema_version": "courseplay-post-deck-media/v1",
  "document_kind": "production-validation",
  "episode_id": "episode-04",
  "input_a_page_sha256": "...",
  "input_deck_sha256": "...",
  "required_image_pages": 4,
  "completed_image_pages": 4,
  "media": [
    {
      "media_id": "M001",
      "a_id": "A001",
      "media_type": "photorealistic_ai",
      "status": "completed",
      "asset_locator": "...",
      "asset_sha256": "..."
    }
  ],
  "failures": []
}
```

约束：

- 每个正式 M ID 恰好有一条报告记录；
- `status` 只能是 `completed` 或 `unresolved`；
- `completed` 必须包含资产位置和 SHA-256；
- `unresolved` 不得填写伪造资产位置；
- 任一 `unresolved` 都必须进入 `failures`；
- 报告不得包含详细图片提示词或反向修改 A 页面语义。

## 13. Canonical Validation

### 13.1 A-page validation failures

v3 validator 至少新增：

- `IMAGE_PAGE_COUNT_MISMATCH`：图片页数不等于 `ceil(N/3)`；
- `IMAGE_REFS_PER_PAGE_INVALID`：单页引用超过一项媒体；
- `MEDIA_REQUIREMENT_COUNT_MISMATCH`：目录项数量不等于图片页数；
- `MEDIA_REUSED`：M ID 被跨页复用；
- `MEDIA_UNREFERENCED`：目录项未被页面引用；
- `MEDIA_TYPE_INVALID`：媒体类型不在两项枚举中；
- `AI_IMAGE_NOT_MAJORITY`：实景 AI 图未达到严格多数；
- `AI_EVIDENCE_REFS_FORBIDDEN`：AI 图声明事实证据引用；
- `TEXTBOOK_EVIDENCE_REQUIRED`：教材原图缺少可解析证据；
- `REDRAW_FORBIDDEN`：出现重绘、合成或替代图类型；
- `MEDIA_FALLBACK_FORBIDDEN`：出现 fallback；
- `MEDIA_DETAIL_FIELD_FORBIDDEN`：出现图片提示词、构图、坐标、文件路径或其他提前解析字段。

原有 A 编号、Nx 无损、callback、E 引用、时间和 B 泄漏检查继续有效。

### 13.2 Post-deck validation failures

- `REQUIRED_MEDIA_UNRESOLVED`：必选图片未完成；
- `ASSET_REUSED`：不同 M ID 解析为同一实际图片；
- `ASSET_HASH_MISSING`：完成记录缺少 SHA-256；
- `MEDIA_REPORT_COVERAGE_MISMATCH`：报告未覆盖全部正式 M ID；
- `MEDIA_TYPE_DRIFT`：实际媒体类型与 A JSON 不一致；
- `TEXTBOOK_REDRAW_DETECTED`：教材原图被替代或重建。

## 14. EP04 Acceptance Example

EP04 当前有 11 个 A 页面，因此：

```text
required_image_pages = ceil(11 / 3) = 4
media_catalog entries = 4
unique actual images = 4
photorealistic_ai >= 3
textbook_original <= 1
```

验收必须确认：

- 恰好 4 页 `media_refs` 非空；
- 每个非空 `media_refs` 只含一个不同 M ID；
- 其余 7 页 `media_refs=[]`；
- 4 个 M ID 从 M001 连续编号且全部恰好使用一次；
- 至少 3 项为 `photorealistic_ai`；
- 如使用教材图 1-3，只能作为唯一一页的 `textbook_original`；
- 无 fallback、重绘类型、详细图片提示词和旧任务包 M ID；
- Nx、A 编号、callback、时间和页面语义不因媒体分配而变化。

当前正式分配固定为 A001、A005、A008、A011；A008 使用教材图 1-3 原图，其余三页使用互不相同的实景 AI 图。

## 15. Migration and Implementation Status

- `courseplay-a-page/v3` 是唯一活跃生产路径；v2 schema、CLI profile、fixture 和正式产物已退出生产，不维护双版本。
- EP01–04 已一次性迁移；批准口播、A 数量、Nx、callback、时间和页面语义保持不变。
- 上游 canonical validator 已实现图片页配额、单页单图、连续 M、无复用/孤儿、AI 严格多数、教材原图证据与旧字段禁用检查。
- compile trace 已升级为 `courseplay-b-to-a-trace/v2`，只验收职责、证据与 A 顺序覆盖，不再承担媒体解析责任。
- post-deck 媒体报告仍是下游接口规范；本次不实现下游 validator，也不生成或填入实际图片。

## 16. Non-goals

本规范不：

- 定义 PPT 坐标、CSS、字号、模板或 renderer；
- 在 A JSON 中生成详细图片提示词；
- 生成、搜索、下载或插入实际图片；
- 修改冻结任务包；
- 允许媒体 Agent 自主增加图片页；
- 允许图片替代页面的文字、关系和教学结论；
- 为图片失败提供自动 fallback。
