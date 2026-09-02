---
schema_version: courseplay-page-recipe/v1
recipe_id: lifecycle-identity-continuity
status: active
content_group_min: 3
content_group_max: 4
media_mode: forbidden
is_logic_diagram: false
slot_contract: headline | invariant-anchor | ordered-stages | stage-purpose | continuity-judgment
downstream_layouts: stage-strip | grouped-sequence
definition_sha256: bb2079c9d446f39dbb8b8ad98ca1a97778edd852a49c8170bf2d6ea889920e05
---

# 用途

用于同一对象或身份跨越多个有序阶段且保持连续的页面。阶段可以产生不同记录、承担不同作用或形成不同业务用途，但页面重点是“阶段变化、身份不变”，不是前一步导致后一步。

# 正例

先单独给出一次稳定身份锚点，再用无连线的阶段带完整列出四至七个阶段微项；阶段微项属于内容组内部结构，采用一致语法说明各自产生的记录或作用。stage-purpose 只说明跨阶段记录为何需要被共同理解，不虚构新增业务价值。continuity-judgment 明确变量与不变量，允许独立收束，但稳定身份和跨阶段关系必须已经由标题、内容组、共享标签、分组或包含关系表达。

# 反例

不要使用时间轴里程碑、进度状态、流程箭头、贯穿脊柱、长线或回流线；不要把阶段写成互相导致的动作步骤，不要把最后阶段伪装成 terminal-result，也不要为适配固定卡数合并或裁掉源 A-page 的生命周期阶段。具有真实末态的查询过程应继续使用线性步骤配方。
