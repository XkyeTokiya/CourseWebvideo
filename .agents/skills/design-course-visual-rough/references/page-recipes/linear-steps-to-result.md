---
schema_version: courseplay-page-recipe/v2
recipe_id: linear-steps-to-result
status: active
content_unit_min: 3
content_unit_max: 4
media_mode: forbidden
is_logic_diagram: false
slot_contract: headline | steps | terminal-result
downstream_layouts: process-steps
definition_sha256: c1fa3ca2ba57ced1963319f84ba61bfaea18f7fedb851eafcbb4774cb3078caa
---

# 用途

用三到四个单向步骤解释过程，并让最后一个真实步骤或状态直接承担结果，不设置步骤之外的总结条。

# 正例

步骤从左到右阅读，最多使用三个短方向提示；terminal-result 仍位于同一序列中，是前序动作实际产生的末步或状态，也是阅读终点。

# 反例

不要把“实现价值”“形成协同”等无源泛化句伪装成末步，不要在 terminal-result 后增加 takeaway，也不要把最后一步连回起点或增加分支。
