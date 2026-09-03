# Player 生产构建资源布局

## 目标

51 期内容不能依赖 `dist/assets/` 中的一组平铺哈希文件。生产构建必须保留内容哈希缓存能力，同时能够从路径直接判断资源类型、所属 episode 和章节，并能机器校验文件是否缺失或被替换。

## 源文件边界

源文件继续跟随 episode 管理，不为适配构建产物而迁移：

```text
episodes/<episode-id>/
  media/audio/<chapter>/<step>.mp3
  media/<kind>/...
  src/chapters/<chapter>/assets/<image>
```

章节组件继续使用静态 `import`，音频继续通过共享 runtime 解析。Vite 会把最终 URL 写入代码，因此业务代码不依赖具体哈希文件名。

## 生产产物

```text
dist/
  index.html
  assets/
    scripts/                         # 共享入口与公共 chunk
    styles/                          # CSS
    fonts/                           # 字体
    media/                           # 非 episode 通用媒体
    episodes/<episode-id>/scripts/  # episode 独立 JS chunk
  media/episodes/<episode-id>/
    audio/<chapter>/<name>-<hash>.mp3
    images/<chapter>/<name>-<hash>.<ext>
    <kind>/...                        # 其他 episode 媒体
  media/shared/<kind>/                # Vite 按字节去重后的跨期共享媒体
  manifests/
    assets.json                      # 路径、归属、大小、SHA-256、源文件
  .vite/manifest.json                # Vite 模块到产物映射
```

哈希用于不可变缓存与覆盖保护；episode、媒体类型和章节目录用于隔离、审计、选择性上传与故障定位。字节完全相同且被 Vite 合并的跨期资源进入显式共享池，清单会记录它的全部 episode owner，避免任意归属到某一期。每次构建由 Vite 清理并重建 `dist/`，不能在该目录手工维护媒体。

## 构建门禁

`pnpm build` 会在写出前拒绝：

- episode 媒体落入其他 episode 或 `assets/` 根目录；
- 跨 episode 合并的媒体未进入 `media/shared/`；
- 包含 `..` 的输出逃逸路径。

完整构建会自动执行产物审计，也可以单独复查已有 `dist/`：

```powershell
pnpm build:inspect
```

该命令重新计算清单内每个文件的字节数和 SHA-256，拒绝清单外文件，并检查 `assets/` 根目录不存在平铺媒体。部署系统应把 `dist/` 视为一个不可拆分版本；如需按期上传，除 `media/episodes/<episode-id>/` 外，还必须根据清单带上该期引用的 `media/shared/` 文件，并同时发布本次构建的 JS/CSS 和两份 manifest。

## 扩展规则

- 新音频必须进入 `media/audio/<chapter>/`，不能放在 episode 根目录。
- 章节图片优先进入该章节的 `assets/`，避免跨章节隐式依赖。
- 多期真正共享的媒体才放共享源码区，并在构建后进入 `assets/media/`；不要通过复制到多个 episode 假装共享。
- 不要取消内容哈希。稳定业务标识由源目录和 `manifests/assets.json` 提供，浏览器 URL 仍应保持内容寻址。
