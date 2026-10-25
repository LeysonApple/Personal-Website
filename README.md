# Leyson. — 交互设计作品集

梁宇森 Leyson · 广州美术学院 工业设计（智能交互方向）· 2023–2027

> 我做让人“少做一点”的交互。

## 页面
| 页面 | 文件 |
| --- | --- |
| 主页 | `index.html` |
| 作品选择 | `work.html` |
| SIFT 详情 | `projects/sift.html` |
| 片刻 Picto 详情 | `projects/picto.html` |
| Focenda 专序 详情 | `projects/focenda.html` |

每个项目页按 **问题 → 判断 → 设计 → 结果** 展开，顶部有项目信息（Role / Team / Timeline / Platform / Tools）和可吸顶的本页目录，底部有上一个 / 下一个项目导航。

## 作品集文件
- `files/Leyson-Portfolio-Short.pdf` 投递版（30 页）
- `files/Leyson-Portfolio-Full.pdf` 完整版（68 页）

PPT 源文件不放进仓库（`.gitignore` 已忽略 `*.pptx`）。

## 本地预览
纯静态网站，无需构建依赖：
```bash
python3 -m http.server 8000   # 打开 http://localhost:8000
```

## 修改页面
页面由 `tools/` 下的 Python 模板生成（共享 head、导航、页脚和项目切换）。**改模板，再重新生成，不要只改生成出来的 HTML：**
```bash
python3 tools/build.py
```
- 生成时会自动给图片补 `width` / `height`、`loading="lazy"`，并在有同名 `.webp` 时包一层 `<picture>`（JPG 兜底）。
- 新增图片后运行 `python3 tools/optimize_assets.py`（需要 Pillow）：压缩 JPG（宽图最长 1600px，长截图 760px，目标 ≤ 200 KB）并生成 WebP。
- 样式在 `assets/css/style.css`（顶部是字号、间距、颜色 token），交互在 `assets/js/main.js`（原生 JS，无依赖）。
- 字体为 WOFF2 子集（Bricolage Grotesque 可变字体，Latin；Silkscreen 像素字体）。中文使用系统字体。

## 个人标志
“Leyson.” 后面的那个点就是我的标志（也是“少做一点”的那一点）。主页上点击它可以换颜色，全站同步并记住选择。favicon 为 `assets/img/favicon.svg`。像素小狗只属于 Picto 项目本身。

## 部署（GitHub Pages）
仓库根目录即站点根目录，已包含 `.nojekyll`。

1. 仓库 Settings → Pages
2. Source 选 **Deploy from a branch**，Branch 选 **`main`** / **`/ (root)`**，保存
3. 约 1 分钟后站点在 `https://leysonapple.github.io/Personal-Website/`

页面里的 canonical / Open Graph 链接按上面的地址生成（`tools/build.py` 里的 `SITE`）；如果改用自定义域名，记得同步修改后重新生成。
