# Courseplay page-recipe v2 contract

每份配方是一个 Markdown 文件，schema 为 `courseplay-page-recipe/v2`。内容范围字段只有 `content_unit_min` 和 `content_unit_max`，只统计 visual rough v4 的 U，不统计 G、S、卡片、槽位或 recipe ID。

状态为 `experimental|active|restricted|deprecated|blocked`。新 draft 可用 experimental/active，approved 只用 active 或具体 restricted 配方。restricted 只用于模板化逻辑图；若注册表没有具体 restricted 配方，逻辑图必须为零。

`media_mode` 为 required 或 forbidden；`slot_contract` 与 `downstream_layouts` 是竖线分隔的稳定 ID。非逻辑配方不得声明 flow-diagram、arch-diagram 或 mindmap。激活结构由 `definition_sha256` 冻结。
