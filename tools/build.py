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
    ('sift', 'SIFT', 'projects/sift.html', '不急着出图，先帮设计师想清方向', ''),
    ('picto', 'Picto', 'projects/picto.html', '一张状态卡，代替一条消息', ''),
    ('focenda', 'Focenda', 'projects/focenda.html', '10 人内测，80% 接受自动排期', ''),
    ('cobuddy', 'CoBuddy', 'projects/cobuddy.html', '孩子主握，家长从外侧辅助', ''),
]


RESUME = 'files/Leyson-Resume.pdf'
STATUS = '<span>UI / 交互设计</span> · <span>2027届</span> · <span>广州</span> · <span>正在找实习</span>'
V = '11121'  # asset cache-buster


def head(title, desc, base='', path='', kind='website'):
    url = SITE + path
    return f"""<!doctype html>
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
<meta name="theme-color" content="#F6F4EF">
<link rel="icon" href="{base}assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="{base}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="{base}assets/img/apple-touch-icon.png">
<link rel="preload" href="{base}assets/fonts/Bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{base}assets/css/style.css?v={V}">
<script>document.documentElement.className='js';try{{var c=localStorage.getItem('ly-dot');if(c)document.documentElement.style.setProperty('--dot',c)}}catch(e){{}}</script>
</head>
<body>
<a class="skip" href="#main">跳到正文</a>
"""


def nav(cur, base=''):
    def a(href, label, key):
        c = ' aria-current="page"' if key == cur else ''
        return f'<a href="{base}{href}"{c}>{label}</a>'
    return f"""<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="{base}index.html" aria-label="Leyson 首页">Leyson<i class="mk" aria-hidden="true"></i></a>
    <nav aria-label="主导航"><ul>
      <li>{a('work.html', '作品', 'work')}</li>
      <li>{a('about.html', '关于', 'about')}</li>
      <li><a href="{base}{RESUME}" download>简历</a></li>
    </ul></nav>
  </div>
</header>
"""


def contact_links(base=''):
    return f"""<div class="c-links">
      <a class="btn btn-ink" href="{base}{RESUME}" download>下载简历 <span aria-hidden="true">↓</span></a>
      <span class="mail-group"><a class="btn btn-line" href="mailto:{MAIL}">{MAIL}</a><button type="button" class="copy" data-copy="{MAIL}" aria-label="复制邮箱地址"><span>复制</span></button></span>
    </div>"""


def foot(base=''):
    return f"""<footer class="foot" id="contact">
  <div class="wrap">
    <h2>一起聊聊？</h2>
    <p class="foot-l">欢迎聊实习机会，也欢迎聊这几个项目的细节。</p>
    {contact_links(base)}
    <p class="foot-tel">电话 <a href="tel:{TEL}">{TEL_SHOW}</a></p>
    <div class="base">
      <span>© <span id="y">2026</span> 梁宇森 Leyson · 广州</span>
      <a href="#main">回到顶部 ↑</a>
    </div>
  </div>
</footer>
<p class="toast" role="status" aria-live="polite"></p>
<script src="{base}assets/js/main.js?v={V}" defer></script>
</body>
</html>
"""


# ---------------------------------------------------------------- project cards (home + work)

CARDS = [
    # key, name, cn, href, cover, line (<=20 字), tags
    ('sift', 'SIFT', '', 'projects/sift.html', 'cover-sift.jpg', '不急着出图，先帮设计师想清方向', ['课程项目 · 3 人小组组长', 'AI 智能体', 'Web 原型']),
    ('picto', 'Picto', '片刻', 'projects/picto.html', 'cover-picto.jpg', '一张状态卡，代替一条消息', ['课程项目 · 独立完成', '情侣陪伴 App', '可运行原型']),
    ('focenda', 'Focenda', '专序', 'projects/focenda.html', 'cover-focenda.jpg', '10 人内测，80% 接受自动排期', ['课程项目 · 独立完成', '日程规划', 'Web + 手机']),
    ('cobuddy', 'CoBuddy', '', 'projects/cobuddy.html', 'cover-cobuddy.jpg', '孩子主握，家长从外侧辅助', ['课程项目 · 广美 × 高露洁', '工业设计', '亲子牙刷']),
]


def cards(base='', first_eager=False):
    out = []
    for i, (k, name, cn, href, cover, line, tags) in enumerate(CARDS):
        t = ''.join(f'<li>{x}</li>' for x in tags)
        small = f'<small>{cn}</small>' if cn else ''
        ld = ' loading="eager"' if (first_eager and i < 2) else ''
        out.append(f"""
    <li class="card c-{k} rv{' d1' if i % 2 else ''}">
      <a href="{base}{href}">
        <span class="card-cover"><img src="{base}assets/img/{cover}" alt="{name} 项目封面"{ld}></span>
        <span class="card-t"><b class="pn">{name}{small}</b><span class="card-n">{i + 1:02d}</span></span>
        <span class="card-l">{line}</span>
        <ul class="tags" aria-label="项目信息">{t}</ul>
      </a>
    </li>""")
    return '<ol class="cards">' + ''.join(out) + '\n  </ol>'


# ---------------------------------------------------------------- case-study template

def case_hero(key, kicker, title, sub, cover, base='../'):
    i = [p[0] for p in PROJECTS].index(key)
    name = PROJECTS[i][1]
    return f"""<header class="c-hero wrap">
  <p class="c-kick"><a href="{base}work.html">作品</a><span aria-hidden="true">/</span><span class="pn">{name}</span><span class="c-kick-d">{kicker}</span></p>
  <h1>{title}</h1>
  <p class="c-sub">{sub}</p>
</header>
<div class="c-cover wrap-wide c-{key}">{cover}</div>
"""


def facts(info, tldr, extra=''):
    """info: 4 (label, value). tldr: 3 short lines (numbers in <b>)."""
    seg = lambda v: ' · '.join(f'<span class="nw">{x}</span>' for x in v.split(' · '))
    dl = ''.join(f'<div><dt>{a}</dt><dd>{seg(b)}</dd></div>' for a, b in info)
    li = ''.join(f'<li>{x}</li>' for x in tldr)
    return f"""<section class="c-facts wrap" aria-label="项目信息与速览">
  <dl class="info">{dl}</dl>
  <div class="tldr"><h2 class="lab">一分钟速览</h2><ul>{li}</ul>{extra}</div>
</section>
"""


def chapter(no, label, heading, body, visual='', anchor=''):
    a = f' id="{anchor}"' if anchor else ''
    b = f'<p class="c-body">{body}</p>' if body else ''
    v = f'<div class="c-vis wrap-wide">{visual}</div>' if visual else ''
    return f"""<section class="chap"{a}>
  <div class="wrap txt rv">
    <p class="lab"><span class="no">{no}</span>{label}</p>
    <h2>{heading}</h2>
    {b}
  </div>
  {v}
</section>
"""


def fig(media, cap, cls=''):
    c = f' class="f {cls}"' if cls else ' class="f"'
    return f'<figure{c}>{media}<figcaption>{cap}</figcaption></figure>'


def shot(src, alt, frame='plain'):
    img = f'<img class="zoom" src="{src}" alt="{alt}">'
    if frame == 'browser':
        return f'<div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div>{img}</div>'
    if frame == 'phone':
        return f'<div class="phone">{img}</div>'
    return f'<div class="plate">{img}</div>'


def cuts(items):
    """items: (what was cut, why — one line). At most 3."""
    li = ''.join(f'<li><s>{x}</s><span>{y}</span></li>' for x, y in items[:3])
    return f"""<section class="chap c-cuts">
  <div class="wrap txt rv">
    <p class="lab"><span class="no">—</span>取舍</p>
    <h2>我删掉了什么</h2>
    <ul class="cutlist">{li}</ul>
  </div>
</section>
"""


def results(no, heading, body, nums, quote='', cite='', after=''):
    """nums: (value, label). Facts only."""
    n = ''.join(f'<li><b>{v}</b><span>{l}</span></li>' for v, l in nums)
    q = f'<blockquote class="quote"><p>{quote}</p>{f"<cite>{cite}</cite>" if cite else ""}</blockquote>' if quote else ''
    b = f'<p class="c-body">{body}</p>' if body else ''
    return f"""<section class="chap c-res">
  <div class="wrap txt rv">
    <p class="lab"><span class="no">{no}</span>结果</p>
    <h2>{heading}</h2>
    {b}
  </div>
  <div class="wrap-wide rv"><ul class="nums" style="--n:{len(nums)}">{n}</ul></div>
  <div class="wrap txt rv">{q}{after}</div>
</section>
"""


def next_project(key, base='../'):
    i = [p[0] for p in PROJECTS].index(key)
    nk, nn, nh, nl, _ = PROJECTS[(i + 1) % len(PROJECTS)]
    cover = [c for c in CARDS if c[0] == nk][0][4]
    return f"""<nav class="next wrap" aria-label="下一个项目">
  <a href="{base}{nh}">
    <span class="next-t"><span class="lab">下一个项目</span><b class="pn">{nn} <span aria-hidden="true">→</span></b><span class="next-l">{nl}</span></span>
    <span class="next-img"><img src="{base}assets/img/{cover}" alt=""></span>
  </a>
  <p class="next-all"><a href="{base}work.html">查看全部作品</a></p>
</nav>
"""


def proto_btn(href, note):
    return f'<p class="proto"><a class="btn btn-ink" href="{href}" target="_blank" rel="noopener">体验原型 <span aria-hidden="true">↗</span><span class="sr">（新标签页打开）</span></a><span>{note}</span></p>'


# kept for the recreations that still use tabs (CoBuddy renders)
def tabs(name, items, label):
    """items: (tab, sub, panel_html). Accessible tabs (arrow keys) — main.js wires them."""
    tl = ''.join(
        f'<button type="button" role="tab" id="{name}-t{i}" aria-controls="{name}-p{i}" aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}"><b>{t}</b></button>'
        for i, (t, s, _) in enumerate(items))
    ps = ''.join(
        f'<div class="tp" role="tabpanel" id="{name}-p{i}" aria-labelledby="{name}-t{i}" tabindex="0"{"" if i == 0 else " hidden"}>{p}</div>'
        for i, (_, _, p) in enumerate(items))
    return f'<div class="tabs" data-tabs><div class="tl" role="tablist" aria-label="{label}">{tl}</div>{ps}</div>'


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
    names = sys.argv[1:] or ['page_home', 'page_work', 'page_about', 'page_sift', 'page_picto', 'page_focenda', 'page_cobuddy']
    for name in names:
        mod = importlib.import_module(name)
        write(mod.PATH, mod.render())
