---
schema_version: courseplay-page-recipe/v1
recipe_id: evidence-cards-with-provenance-boundary
status: active
content_group_min: 3
content_group_max: 4
media_mode: forbidden
is_logic_diagram: false
slot_contract: headline | provenance-band | evidence-cards | evidence-gap | inference-boundary
downstream_layouts: evidence-grid | card-ledger
definition_sha256: 86c530b117722dd7f0c6f71541bca3bca9224bb3404fbffa1589e6c969604dab
---

# 用途

用于一组数字、政策目标或案例结果必须与来源、对象、时期、目标或实绩状态、统计缺口和不可外推边界共同阅读的页面。证据身份是理解数据的前提，不是可缩成角注的装饰说明。

# 正例

provenance-band 先说明来源、对象、时期和目标或实绩身份中的必要项；evidence-cards 并列呈现三至五项同口径证据，卡片数量不机械等同于内容组数量。源材料存在统计周期、样本、方法或口径缺失时，evidence-gap 以正常阅读层级呈现；没有缺口时写 `none`。inference-boundary 明确不能推出的结论或适用范围。全页不再增加泛化价值 takeaway。

# 反例

不要把政策目标画成已完成仪表盘，不要虚构比例轴、趋势、排名、样本、统计精度或完成度，不要把证据缺口和推断边界缩成脚注或低对比度小字，也不要只在 takeaway 中补写必须 V/R。没有来源或推断边界要求的普通等权要点应继续使用并列卡，单一政策年份或场景锚点应使用时间锚点配方。
