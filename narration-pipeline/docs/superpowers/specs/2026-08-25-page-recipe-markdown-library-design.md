# Page recipe Markdown library v2

> 状态：活跃。适用于 `courseplay-visual-rough/v4`。

配方库继续采用“一份配方一个 Markdown”，但当前 schema 为 `courseplay-page-recipe/v2`。范围字段是 `content_unit_min/max`，只计算 rough 的视觉内容单元 U，不再根据 G、S、卡片数或 recipe ID 切换口径。

配方只约束结构槽位、允许的下游布局和媒体有无。G 的数量与边界属于 A-page screen guidance，不得为满足配方而修改。U 可合并多个 G，同一 G 也可进入多个 U。

逻辑图只能由具体、模板化的 restricted 配方启用。当前注册表没有此类配方，因此合法逻辑图数量为零；宽泛 `logic-diagram` 不再登记。

配方结构由 definition SHA-256 冻结，管理命令见 `design-course-visual-rough/SKILL.md`。生产 Agent 只读候选配方全文和公开 contract，不读取解析器实现推断规则。
