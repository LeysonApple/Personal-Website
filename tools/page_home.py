from build import head, nav, foot, cards, contact_links, STATUS

PATH = 'index.html'


def render():
    return head('梁宇森 Leyson — UI / 交互设计作品集', '梁宇森 Leyson，广州美术学院工业设计（智能交互方向），2027届。把复杂的判断，变成清楚的一步。作品：SIFT、片刻 Picto、Focenda 专序、CoBuddy 亲子牙刷。') + nav('home') + f'''
<main id="main">
<section class="h-hero wrap">
  <p class="h-id rv"><img class="ava" src="assets/img/avatar-pixel.png" alt="" width="40" height="40" loading="eager"><span>梁宇森 <span class="pn">Leyson</span></span></p>
  <h1 class="rv d1">把复杂的判断，<br>变成清楚的一步。</h1>
  <p class="h-line rv d2">{STATUS}</p>
  <div class="rv d2">{contact_links()}</div>
</section>

<section class="h-work wrap" aria-labelledby="work-h">
  <div class="sec-h"><h2 id="work-h" class="lab">精选作品</h2><a class="more" href="work.html">全部作品 →</a></div>
  {cards(first_eager=True)}
</section>

<section class="h-about wrap" aria-labelledby="about-h">
  <div class="h-about-in rv">
    <img class="h-about-img" src="assets/img/portrait.jpg" alt="梁宇森 Leyson 的照片">
    <div>
      <h2 id="about-h" class="lab">关于我</h2>
      <p class="h-about-t">广州美术学院 工业设计（智能交互方向）本科，2027届。先把问题定义清楚，再用减法做取舍，最后借助 AI 编程工具把设计做成能跑的原型。</p>
      <a class="more" href="about.html">荣誉、技能与经历 →</a>
    </div>
  </div>
</section>
</main>
''' + foot()
