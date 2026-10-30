# 精品设计参考

这份实例按用户选择的顺序收录 ep06 / ep35 的五个正文范例：06-03、06-02、35-09、35-10、35-11。共 17 个口播节拍，无封面。

## 观看与阅读

在 `player/` 运行 `pnpm dev`，打开实际端口的 `/play/episode-design-reference`。左右键推进或回退，数字键 `1`–`5` 跳到对应章节，`Home` 回到开头；播放器会恢复上次进度。

后续制作可先观看整集，再按当前内容关系读取对应章节的组件和样式，不必通读两期全集。范例展示画面构成与状态推进的方法；具体内容仍以当前项目的口播、信息和素材为准。

| 顺序与来源 | 范例 | 可参考的画面行为 |
| --- | --- | --- |
| 1 · 06-03 | [解析到底做什么](src/chapters/01-ep06-what-resolution-does/WhatResolutionDoes.tsx) · [样式](src/chapters/01-ep06-what-resolution-does/WhatResolutionDoes.css) | 共享锚点持续，对象和可能结果落位，末步通过对照解释边界 |
| 2 · 06-02 | [身份键与挂载的信息](src/chapters/02-ep06-identity-key/IdentityKey.tsx) · [样式](src/chapters/02-ep06-identity-key/IdentityKey.css) | 实景图片与关系图持续，右侧定义、关联信息和稳定性原因依次进入 |
| 3 · 35-09 | [真实路线验证](src/chapters/03-ep35-route-validation/RouteValidation.tsx) · [样式](src/chapters/03-ep35-route-validation/RouteValidation.css) | 真实步骤带和路径同步推进，末步展开判断分支与结论 |
| 4 · 35-10 | [现场决策顺序](src/chapters/04-ep35-decision-ledger/DecisionLedger.tsx) · [样式](src/chapters/04-ep35-decision-ledger/DecisionLedger.css) | 四行台账逐步落位，理由列和最后的判断一起形成可回查结构 |
| 5 · 35-11 | [选型收束](src/chapters/05-ep35-selection-conclusion/SelectionConclusion.tsx) · [样式](src/chapters/05-ep35-selection-conclusion/SelectionConclusion.css) | 两类结局对照持续，重心转向总结与三个判断问题 |

## 内容与边界

章节从所选原章独立复制，保留主要构图、演示与状态推进；在不改变画面的地方简化了部分状态代码，并将可等价替换的主题变量改为标准 token。实例沿用 `active-identification-note` 主题及共享播放器，06-02 使用源章 M002 图片。台账的理由列是回查提示，不是实际现场记录。

为了独立观看，06-03 首句由“从身份键到这些信息”调整为“从身份键到关联信息”；35-11 将“回到开头那个零件”和“本期总结”调整为面向具体零件和选型总结的表述，画面中的对应文字同步调整。其余口播、节拍与语义保留。原口播见 [article.md](article.md)，当前节拍见 [script.md](script.md)，各步安排见 [outline.md](outline.md)。

本实例可供后续任务按需指定参考，尚未设为制作流程的默认强制参考；未合成音频、未录屏。实际 token 消耗是否降低仍需后续制作验证。
