---
schema_version: courseplay-page-recipe/v1
recipe_id: scope-responsibility-ledger
status: active
content_group_min: 3
content_group_max: 4
media_mode: forbidden
is_logic_diagram: false
slot_contract: headline | common-condition | responsibility-rows | duty-column | boundary-column
downstream_layouts: responsibility-ledger | banded-table
definition_sha256: b5b735457484b830645aa5800577846ed4041e59bffdd2be0f7da48e60aedf37
---

# 用途

用于按主体、事项或机制逐行核对职责、保留范围和排除边界的页面。台账的核心是逐行映射，不是由大到小的层级关系；行组之外可以保留一个所有行共同成立的条件。

# 正例

先给出不与第一行职责重复的 common-condition，再以 responsibility-rows 组织核对单位。duty-column 写明负责什么；只有排除说明而没有正向职责时可以写 `none`，不得填充无源内容。boundary-column 写明不替代、不自动保证或不负责什么，但不要求每行都有排除项。每行至少有一个有效职责或边界，允许不对称行；主体读完即可收束，不强制 takeaway。

# 反例

不要虚构一一对应、空槽、组织架构、权限等级、审批关系、制度表或能力塔；不要用大量破折号填表，也不要增加跨行箭头、贯穿线或复杂矩阵标记。只有由大到小的简单层级应使用有序层带，只有两个角色的职责差异应使用两栏对照，不存在逐行可核对关系时不得强行制作台账。
