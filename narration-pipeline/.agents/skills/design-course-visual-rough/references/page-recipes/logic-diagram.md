---
schema_version: courseplay-page-recipe/v1
recipe_id: logic-diagram
status: blocked
content_group_min: 2
content_group_max: 4
media_mode: forbidden
is_logic_diagram: true
slot_contract: headline | bounded-geometry | takeaway | necessity-reason
downstream_layouts: flow-diagram | arch-diagram | mindmap
definition_sha256: 60c4246bf2afbf6189a5b41c438f98c59b16ee4eb9e7c434c66b9b3eb04133f6
---

# 用途

仅在同时存在分支、汇聚或非线性依赖，且卡片、对照、步骤和文字带会造成错误理解时使用受控逻辑图

# 正例

必须保留的分支或汇聚拓扑，有限节点、无交叉连线，并经过人工批准

# 反例

单一反馈关系使用线性步骤加结论；不要为回流外形申请逻辑图
