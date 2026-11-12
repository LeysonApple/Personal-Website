from build import head, nav, foot, cards

PATH = 'work.html'


def render():
    return head('作品 — Leyson', '梁宇森 Leyson 的四个课程项目：SIFT、片刻 Picto、Focenda 专序、CoBuddy 亲子牙刷。', path='work.html') + nav('work') + f'''
<main id="main">
<header class="p-head wrap">
  <h1 class="rv">作品</h1>
  <p class="rv d1">四个课程项目：三个交互 / UI，一个工业设计跨界。</p>
</header>
<section class="wrap h-work" aria-label="项目列表">
  {cards(first_eager=True)}
</section>
</main>
''' + foot()
