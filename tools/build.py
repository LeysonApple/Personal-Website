"""Generates the static pages from shared partials.  Run:  python3 tools/build.py

Every page is rendered by a tools/page_*.py module, then passed through
`enhance()`, which adds intrinsic width/height, lazy loading and a WebP
<picture> source to each image, so templates can stay short.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://leysonapple.github.io/Personal-Website/'
PDF = 'files/Leyson-Portfolio-Short.pdf'
MAIL = 'leyson@foxmail.com'
TEL = '+8618929085955'
TEL_SHOW = '189 2908 5955'

# order used for prev / next navigation between case studies
PROJECTS = [
    ('sift', 'SIFT', 'projects/sift.html', '设计前期的 AI 方向收敛 Agent', 'theme-sift'),
    ('picto', 'Picto', 'projects/picto.html', '看见彼此，不必一直聊天。', 'theme-picto-acc'),
    ('focenda', 'Focenda', 'projects/focenda.html', '把零散任务，变成可执行的一日安排。', 'theme-foc'),
]


def head(title, desc, base='', path='', kind='website'):
    url = SITE + path
    return f'''<!doctype html>
<html lang="zh-CN" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="author" content="梁宇森 Leyson">
<link rel="canonical" href="{url}">
<meta property="og:type" content="{kind}">
<meta property="og:site_name" content="Leyson — 交互设计作品集">
<meta property="og:locale" content="zh_CN">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F3F1EC">
<link rel="icon" href="{base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="{base}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="{base}assets/img/apple-touch-icon.png">
<link rel="preload" href="{base}assets/fonts/Bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}assets/css/style.css">
<script>document.documentElement.className='js';try{{var c=localStorage.getItem('ly-dot');if(c)document.documentElement.style.setProperty('--dot',c)}}catch(e){{}}</script>
</head>
<body>
<a class="skip" href="#main">跳到正文</a>
'''


def nav(cur, base=''):
    def a(href, label, key, cls=''):
        c = ' aria-current="page"' if key == cur else ''
        k = f' class="{cls}"' if cls else ''
        return f'<a href="{base}{href}"{c}{k}>{label}</a>'
    return f'''<header class="nav">
  <div class="wrap">
    <a class="brand" href="{base}index.html" aria-label="Leyson 首页">Leyson<i class="mk" aria-hidden="true"></i></a>
    <span class="open px">Open to internships · 2026</span>
    <ul>
      <li>{a('work.html', '作品', 'work')}</li>
      <li>{a('index.html#about', '关于', 'about')}</li>
      <li class="hide-xs"><a href="#contact">联系</a></li>
      <li><a class="cta" href="{base}{PDF}" download>PDF <span aria-hidden="true">↓</span></a></li>
    </ul>
  </div>
</header>
'''


def foot(base=''):
    return f'''<footer class="foot" id="contact">
  <div class="wrap">
    <p class="eyebrow px">Contact</p>
    <h2 aria-label="Let’s talk.">Let’s talk<button type="button" class="mk mk-big" data-dot aria-label="换一个点的颜色"></button></h2>
    <p class="l">期待和你聊聊这三个作品背后的取舍。</p>
    <div class="links">
      <span class="mail-group"><a href="mailto:{MAIL}">{MAIL}</a><button type="button" class="copy" data-copy="{MAIL}" aria-label="复制邮箱地址"><span>复制</span></button></span>
      <a href="tel:{TEL}">{TEL_SHOW}</a>
      <a href="{base}{PDF}" download>下载作品集 PDF <span aria-hidden="true">↓</span></a>
    </div>
    <div class="base">
      <span>© <span id="y">2026</span> 梁宇森 Leyson · 广州</span>
      <span class="px">Designed by Leyson · built with AI</span>
      <a class="top px" href="#main">Back to top ↑</a>
    </div>
  </div>
</footer>
<div class="cursor" aria-hidden="true"><span></span></div>
<p class="toast" role="status" aria-live="polite"></p>
<script src="{base}assets/js/main.js" defer></script>
</body>
</html>
'''


# ---------------------------------------------------------------- case-study parts

def crumb(name, base='../'):
    return f'<nav class="crumb px" aria-label="面包屑"><a href="{base}work.html">Work</a><span aria-hidden="true">/</span><span aria-current="page">{name}</span></nav>'


def meta(items):
    return '<dl class="meta">' + ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in items) + '</dl>'


def tldr(items):
    return '<section class="wrap tldr-wrap" aria-label="项目概要"><div class="tldr">' + ''.join(
        f'<div class="rv"><h2 class="px">{a}</h2><p>{b}</p></div>' for a, b in items) + '</div></section>'


def toc(items):
    """items: (anchor, no, label, phase). Sticky in-page index; JS marks the active one."""
    lis = ''.join(f'<li><a href="#{i}"><span class="px">{n}</span>{l}<em>{p}</em></a></li>' for i, n, l, p in items)
    return f'<nav class="toc" aria-label="本页目录"><div class="wrap"><ol>{lis}</ol><span class="toc-bar" aria-hidden="true"></span></div></nav>'


def sec(anchor, no, label, phase, body, cls=''):
    c = f'block {cls}'.strip()
    return f'''<section class="{c}" id="{anchor}" aria-labelledby="{anchor}-h"><div class="wrap split">
  <div class="lab rv"><span class="no px">{no} · {phase}</span><h2 id="{anchor}-h">{label}</h2></div>
  <div class="body">{body}
  </div>
</div></section>
'''


def pager(key, base='../'):
    i = [p[0] for p in PROJECTS].index(key)
    _, pn, ph, _, _ = PROJECTS[i - 1]
    _, nn, nh, nl, nt = PROJECTS[(i + 1) % len(PROJECTS)]
    return f'''<a class="next {nt}" href="{base}{nh}">
  <div class="wrap">
    <span class="px">Next project · {(i + 1) % len(PROJECTS) + 1:02d}/{len(PROJECTS):02d}</span>
    <span class="next-t">{nn} <span class="arr" aria-hidden="true">→</span></span>
    <p>{nl}</p>
  </div>
</a>
<nav class="wrap pager" aria-label="项目切换">
  <a class="pg prev" href="{base}{ph}" rel="prev"><span class="px">← Previous</span><b>{pn}</b></a>
  <a class="pg all" href="{base}work.html"><span class="px">All work</span><b>全部项目</b></a>
  <a class="pg nxt" href="{base}{nh}" rel="next"><span class="px">Next →</span><b>{nn}</b></a>
</nav>
'''


# ---------------------------------------------------------------- image enhancer

IMG_RE = re.compile(r'<img\b([^>]*?)\s*/?>')
SRC_RE = re.compile(r'\bsrc="([^"]+)"')


def _dims(path):
    from PIL import Image
    with Image.open(path) as im:
        return im.size


def enhance(html, page_path):
    page_dir = (ROOT / page_path).parent
    out, pos = [], 0
    for m in IMG_RE.finditer(html):
        attrs = m.group(1)
        src = SRC_RE.search(attrs)
        if not src or 'assets/img/' not in src.group(1):
            continue
        file = (page_dir / src.group(1)).resolve()
        if not file.exists():
            raise SystemExit(f'missing image {src.group(1)} in {page_path}')
        if ' alt=' not in attrs:
            raise SystemExit(f'image without alt: {src.group(1)} in {page_path}')
        w, h = _dims(file)
        if 'width=' not in attrs:
            attrs += f' width="{w}" height="{h}"'
        if 'fetchpriority' not in attrs and 'loading=' not in attrs:
            attrs += ' loading="lazy"'
        if 'decoding=' not in attrs:
            attrs += ' decoding="async"'
        tag = f'<img{attrs}>'
        webp = file.with_suffix('.webp')
        if file.suffix == '.jpg' and webp.exists():
            wsrc = src.group(1)[:-4] + '.webp'
            tag = f'<picture><source srcset="{wsrc}" type="image/webp">{tag}</picture>'
        out.append(html[pos:m.start()]); out.append(tag); pos = m.end()
    out.append(html[pos:])
    return ''.join(out)


def write(path, html):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(enhance(html, path), encoding='utf-8')
    print('wrote', path)


if __name__ == '__main__':
    import importlib, sys
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(ROOT / 'tools'))
    for name in ['page_home', 'page_work', 'page_sift', 'page_picto', 'page_focenda']:
        mod = importlib.import_module(name)
        write(mod.PATH, mod.render())
