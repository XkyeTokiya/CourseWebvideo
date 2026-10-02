# 待制作 EP 生产提示词索引

基准：[production-stage-prompts.md](../production-stage-prompts.md)。生成日期：2026-09-30。

本批共 32 集：EP18–34、EP37–51。筛选依据为 `player/episodes/<episode-id>/project.json` 的 `status=planned`，并核对正式 inputs、script.md、outline.md 和 src/ 尚不存在；EP01–17、EP35–36 已有制作产物，不纳入本批。上游进度台账跟踪任务包验证，不用于判断 Player 是否已经制作。

每集文件包含 01、02、04、05、06、10、12、17 八个阶段的提示词。先执行 01 检查真实状态，再逐段使用；生成这些文档不等于授权批量执行制作、人工放行、发布或 Git 创建操作。

`${repoRoot}` 和 `${episodeBranch}` 在每段执行前按 Git 实际状态绑定，路径随复用的 worktree 改变，不固定到生成时的 main 工作树。当前单集或范围分支包含本集时必须原地复用；例如 EP25 在 `ep18-30`、`episode-18-30` 或 `codex/ep18-30` 上执行时，提交、push 和 PR 也继续使用该分支。任何创建本地分支（含远程跟踪）或 worktree 的操作都必须先停止请求用户明确确认。

本次生成时已有本地分支 `ep18-20`，可供 EP18–20 在阶段 01 核实并安全复用；这只是当前快照，不能代替执行时检查。EP37 已有一份临时 Brief，需先检查恢复点；其余本批 EP 在检查的两个 work 目录中没有过程文件。现有临时文件不代表通过验证或用户批准。

| EP | 标题 | 提示词 | 冻结任务包 |
| --- | --- | --- | --- |
| episode-18 | Ecode 编码：版本、体系标识与主码 | [episode-18.md](episode-18.md) | [任务包](../../narration-pipeline/episodes/module-2-identifier-coding/episode-18-ecode-version-system-master-task-package.md) |
| episode-19 | GS1 与五类编码体系怎么选 | [episode-19.md](episode-19.md) | [任务包](../../narration-pipeline/episodes/module-2-identifier-coding/episode-19-gs1-five-coding-systems-selection-task-package.md) |
| episode-20 | 从前缀到后缀：设计一套可落地的编码规则 | [episode-20.md](episode-20.md) | [任务包](../../narration-pipeline/episodes/module-2-identifier-coding/episode-20-prefix-suffix-coding-rule-design-task-package.md) |
| episode-21 | 工业大数据从哪里来、怎样产生价值 | [episode-21.md](episode-21.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-21-industrial-big-data-value-task-package.md) |
| episode-22 | 主数据、业务数据、元数据与数据字典的边界 | [episode-22.md](episode-22.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-22-industrial-data-concept-boundaries-task-package.md) |
| episode-23 | 工业数据共享如何跨越产线、工厂与产业链 | [episode-23.md](episode-23.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-23-industrial-data-sharing-levels-task-package.md) |
| episode-24 | 数据要素为什么需要标识体系 | [episode-24.md](episode-24.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-24-data-elements-identifier-system-task-package.md) |
| episode-25 | 标识数据模型：从数字对象到属性与事件 | [episode-25.md](episode-25.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-25-identifier-data-model-task-package.md) |
| episode-26 | 二级节点 OpenAPI：一次请求包含什么 | [episode-26.md](episode-26.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-26-secondary-node-openapi-request-structure-task-package.md) |
| episode-27 | 用 Apifox 调试标识数据模板接口 | [episode-27.md](episode-27.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-27-apifox-template-interface-debug-task-package.md) |
| episode-28 | 顶级节点与企业节点分别负责什么 | [episode-28.md](episode-28.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-28-top-level-and-enterprise-node-roles-task-package.md) |
| episode-29 | 二级节点为什么是承上启下的公共服务平台 | [episode-29.md](episode-29.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-29-secondary-node-public-service-platform-task-package.md) |
| episode-30 | 三级业务管理系统如何完成前缀申请与注册 | [episode-30.md](episode-30.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-30-business-management-prefix-registration-task-package.md) |
| episode-31 | 递归解析：一次查询怎样逐级找到企业数据 | [episode-31.md](episode-31.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-31-recursive-resolution-query-flow-task-package.md) |
| episode-32 | 标识创新应用的端到端业务闭环 | [episode-32.md](episode-32.md) | [任务包](../../narration-pipeline/episodes/module-3-data-and-resolution/episode-32-identifier-application-end-to-end-business-loop-task-package.md) |
| episode-33 | 一维码与二维码：容量、识读和工业场景怎么取舍 | [episode-33.md](episode-33.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-33-one-dimensional-vs-qr-code-selection-task-package.md) |
| episode-34 | RFID 如何实现非接触识别与批量读取 | [episode-34.md](episode-34.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-34-rfid-contactless-batch-reading-task-package.md) |
| episode-37 | 主动标识载体与 UICC：为什么能主动、安全地联网 | [episode-37.md](episode-37.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-37-active-identifier-uicc-task-package.md) |
| episode-38 | 通信模组与工业互联网终端怎样承载工业 ID | [episode-38.md](episode-38.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-38-communication-modules-industrial-terminals-task-package.md) |
| episode-39 | 主动标识如何完成注册与数据上报 | [episode-39.md](episode-39.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-39-active-identifier-registration-reporting-task-package.md) |
| episode-40 | 主动标识服务架构：终端、载体与平台如何协作 | [episode-40.md](episode-40.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-40-active-identifier-service-architecture-task-package.md) |
| episode-41 | SM1 与 SM2 在主动标识安全中的不同角色 | [episode-41.md](episode-41.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-41-sm1-sm2-active-identifier-security-roles-task-package.md) |
| episode-42 | 主动标识适合哪些行业场景 | [episode-42.md](episode-42.md) | [任务包](../../narration-pipeline/episodes/module-4-identifier-carrier/episode-42-active-identifier-industry-scenarios-task-package.md) |
| episode-43 | 二级节点怎么建：牵头主体与部署模式 | [episode-43.md](episode-43.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-43-secondary-node-leadership-deployment-models-task-package.md) |
| episode-44 | 二级节点建设的技术底线：数据、接口与性能 | [episode-44.md](episode-44.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-44-secondary-node-technical-baseline-task-package.md) |
| episode-45 | 二级节点如何持续运营：服务、人员与报告机制 | [episode-45.md](episode-45.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-45-secondary-node-operations-service-personnel-reporting-task-package.md) |
| episode-46 | 二级节点安全保障的六个层面 | [episode-46.md](episode-46.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-46-secondary-node-security-six-layers-task-package.md) |
| episode-47 | 企业节点的五项核心功能 | [episode-47.md](episode-47.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-47-enterprise-node-five-core-functions-task-package.md) |
| episode-48 | 企业节点数据如何同步与治理 | [episode-48.md](episode-48.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-48-enterprise-node-data-sync-governance-task-package.md) |
| episode-49 | IDHub 企业节点产品架构 | [episode-49.md](episode-49.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-49-idhub-enterprise-node-product-architecture-task-package.md) |
| episode-50 | 自建还是托管：企业节点建设模式怎么选 | [episode-50.md](episode-50.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-50-enterprise-node-build-mode-selection-task-package.md) |
| episode-51 | 企业前缀申请：从准备信息到完成校验 | [episode-51.md](episode-51.md) | [任务包](../../narration-pipeline/episodes/module-5-node-construction-operation/episode-51-enterprise-prefix-application-preparation-validation-task-package.md) |
