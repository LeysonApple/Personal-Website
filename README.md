# Leyson. — 交互设计作品集

梁宇森 Leyson · 广州美术学院 工业设计（智能交互方向）· 2023–2027

> 把复杂的判断，变成清楚的一步。

## 页面
| 页面 | 文件 |
| --- | --- |
| 主页 | `index.html`（`tools/page_home.py`） |
| 作品 | `work.html`（`tools/page_work.py`） |
| 关于 | `about.html`（`tools/page_about.py`） |
| SIFT 详情 | `projects/sift.html` |
| 片刻 Picto 详情 | `projects/picto.html` |
| Focenda 专序 详情 | `projects/focenda.html` |
| CoBuddy 详情 | `projects/cobuddy.html` |

四个案例页共用同一个模板（`tools/build.py` 里的 `case_hero` / `facts` / `chapter` / `cuts` / `results` / `next_project`）：
标题 + 一句副标题 + 大封面 → 项目性质 / 我的角色 / 时间 / 工具 → 一分钟速览（3 行）→ 01 问题 / 02 关键判断 / 03 设计（每章标题即结论，正文 ≤ 80 字，大图 + 一行图注）→ 我删掉了什么（最多 3 行）→ 04 结果（数字卡 + 一句引语）→ 下一个项目。
项目封面在 `assets/img/cover-*.jpg/webp`（5:4）。

## 作品集文件
- `files/Leyson-Portfolio-Short.pdf` 投递版（33 页）
- `files/Leyson-Portfolio-Full.pdf` 完整版（68 页）
- `files/Leyson-Resume.pdf` 简历（A4 单页，文字可选中）。源文件在 `files/resume/resume.html`，改完运行 `python3 files/resume/build_resume.py` 重新生成（需要 weasyprint 和 Noto Sans SC / 思源黑体）

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
- 设计系统：暖白底 `#F6F4EF`、近黑字、唯一强调色是 logo 的粉色点；6 档字号（`--t1`–`--t6`）、3 档字重，正文栏 ≤ 680px、图片最宽 1200px。
- 字体：中文用系统字体（苹方 / Noto Sans SC / 微软雅黑）；Bricolage Grotesque 只用于名字和项目名；Silkscreen 像素字体只留在 Picto 的产品界面里。

## 个人标志
“Leyson” 后面的那个粉色点就是我的标志，也是全站唯一的强调色。favicon 为 `assets/img/favicon.svg`。

## 部署（GitHub Pages）
仓库根目录即站点根目录，已包含 `.nojekyll`。

1. 仓库 Settings → Pages
2. Source 选 **Deploy from a branch**，Branch 选 **`main`** / **`/ (root)`**，保存
3. 约 1 分钟后站点在 `https://leysonapple.github.io/Personal-Website/`

页面里的 canonical / Open Graph 链接按上面的地址生成（`tools/build.py` 里的 `SITE`）；如果改用自定义域名，记得同步修改后重新生成。
