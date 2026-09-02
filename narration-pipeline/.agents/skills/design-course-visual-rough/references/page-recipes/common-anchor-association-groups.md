---
schema_version: courseplay-page-recipe/v1
recipe_id: common-anchor-association-groups
status: active
content_group_min: 3
content_group_max: 4
media_mode: forbidden
is_logic_diagram: false
slot_contract: headline | shared-anchor | association-groups | support-note | scope-boundary
downstream_layouts: anchor-cluster | grouped-cards
definition_sha256: bbb6de8362c19eef5530eecc36be3657bba2e6372f04a68e7072609e30fe5df5
---

# 用途

用于多个记录、信息或资源都依赖同一个对象、编码或身份锚点才能成立的页面。阅读必须先确认 shared-anchor，再理解关联项、必要的支撑语义和作用范围；关联项并非彼此独立的普通并列要点。

# 正例

shared-anchor 明确所有关联项共同指向的对象、身份或编码，association-groups 通过围合、邻近或共享标签表达三至五个微项的共同归属。只有源 A-page 确有平台、机制或角色支撑语义时才填写 support-note，否则写 `none`。scope-boundary 说明锚点、平台或关联机制不承担什么，并保持正常阅读层级。主体内完成收束，默认不设置独立 takeaway。

# 反例

不要画中心圆点加放射线、星状辐射、网络图、思维导图、数据流或系统拓扑；不要让关联项脱离锚点后仍像普通独立卡片，也不要把平台支撑、对象身份和数据存储混成同一个视觉层级。超过五个关联微项时应先分组，不得无限增加卡片或缩小文字。真正等权独立的要点应使用并列卡，存在阶段连续关系时应使用生命周期配方。
