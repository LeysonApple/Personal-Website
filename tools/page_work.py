from build import head, nav, foot, PDF

PATH = 'work.html'

LOGO = {'s': 'logo-sift.png', 'p': 'logo-picto.png', 'f': 'logo-focenda.png', 'c': 'logo-cobuddy.png'}
ITEMS = [
    ('s', '01', 'SIFT', '', '设计前期的 AI 方向收敛 Agent', '每次只问一个会改变设计判断的问题。', ['Web', '3 人小组组长', '已上线', '2026'], 'projects/sift.html', 'sift-hero.jpg'),
    ('p', '02', 'Picto', '片刻', '情侣的低打扰陪伴 App', '先表达“我现在怎样”，再决定要不要说话。', ['Mobile', '独立完成', '约 2 个月', '2026'], 'projects/picto.html', 'picto-room.jpg'),
    ('f', '03', 'Focenda', '专序', '每日规划与动态排期', '按重要度和精力，排好今天。', ['Web + Mobile', '内测 10 人', '2026'], 'projects/focenda.html', 'focenda-priority.jpg'),
    ('c', '04', 'CoBuddy', '', '亲子牙刷 · 工业设计跨界', '同一套方法用在实体产品：先定义谁主导，再做形态。', ['工业设计', '高露洁 × 广美', '独立完成', '2026'], 'projects/cobuddy.html', ''),
]


def render():
    rows = ''
    for k, n, name, cn, title, line, tags, href, img in ITEMS:
        t = ''.join(f'<li class="chip">{x}</li>' for x in tags)
        small = f'<small>{cn}</small>' if cn else ''
        rows += f'''
  <li class="pick {k} rv">
    <a href="{href}">
      <span class="num px">{n}</span>
      <h2><span class="lg"><img src="assets/img/{LOGO[k]}" alt=""></span>{name}{small}</h2>
      <div class="desc"><b>{title}</b><span>{line}</span><ul class="tags" aria-label="项目信息">{t}</ul></div>
      <span class="enter">进入项目 <span aria-hidden="true">→</span></span>
    </a>
  </li>'''
    return head('作品 — Leyson', '选择一个项目：SIFT、片刻 Picto、Focenda 专序、CoBuddy 亲子牙刷。每个项目按 问题 → 判断 → 设计 → 结果 展开。', path='work.html') + nav('work') + f'''
<main id="main">
  <div class="wrap">
    <header class="pick-head">
      <p class="eyebrow px rv">Selected work · 2026</p>
      <h1 class="rv d1">作品</h1>
      <p class="rv d2">3 个交互 / UI·UX 项目，加 1 个工业设计跨界项目。</p>
    </header>
    <ol class="picks">{rows}
    </ol>
  </div>
</main>
''' + foot()
