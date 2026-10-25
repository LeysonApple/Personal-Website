from build import head, nav, foot, PDF

PATH = 'index.html'

MARQ = '<span><b>✦</b> SIFT <em>设计方向收敛 Agent</em> <b>✦</b> PICTO <em>异地情侣低打扰陪伴</em> <b>✦</b> FOCENDA <em>设计师动态日程</em></span>'

CARDS = [
    ('s', 'projects/sift.html', 'logo-sift.png', 'SIFT', '设计前期的 AI 方向收敛 Agent', 'Web · 已上线',
     '设计师拿到模糊 Brief，缺的不是图，而是判断的次序。', '4 周', '定位从“出图 AI”收敛为“判断搭档”', ['3 人小组组长', 'Agent 设计', '已上线']),
    ('p', 'projects/picto.html', 'logo-picto.png', 'Picto', '异地情侣的低打扰陪伴', 'Mobile · 原型',
     '即时通信把“被看见”绑成了“要回复”，异地情侣因此更累。', '0', '在线、已读等制造期待的信号', ['独立完成', '约 2 个月', '可运行原型']),
    ('f', 'projects/focenda.html', 'logo-focenda.png', 'Focenda', '设计师的动态日程规划', 'Web + Mobile · 内测',
     '设计师的时间被“非设计”吃掉：琐事多、信息散、难出结果。', '9/10', '内测用户使用了任务规划', ['用户访谈', '多端设计', '内测 10 人']),
]


def render():
    cards = ''
    for i, (k, href, logo, name, line, tag, prob, num, numlab, chips) in enumerate(CARDS):
        d = f' d{i}' if i else ''
        chip = ''.join(f'<span>{c}</span>' for c in chips)
        cards += f'''
      <a class="pc {k} rv{d}" href="{href}" data-tilt data-cursor="查看">
        <span class="pc-top"><img class="logo" src="assets/img/{logo}" alt=""><span class="px">{i + 1:02d} · {tag}</span></span>
        <span class="pc-txt"><b>{name}</b><span>{line}</span></span>
        <span class="pc-body">
          <span class="pc-prob"><em class="px">Problem</em>{prob}</span>
          <span class="pc-stat"><strong>{num}</strong><span>{numlab}</span></span>
          <span class="pc-chips">{chip}</span>
        </span>
        <span class="pc-go" aria-hidden="true">→</span>
      </a>'''
    return head('梁宇森 Leyson — 交互设计作品集', '梁宇森 Leyson，广州美术学院工业设计（智能交互方向）。把复杂的判断，变成清楚的一步。作品：SIFT、片刻 Picto、Focenda 专序。') + nav('home') + f'''
<main id="main">
<section class="hero">
  <div class="wrap">
    <div class="kick px rv"><span>Interaction Designer</span><span>Guangzhou</span><span>GAFA · 2023–2027</span></div>
    <h1 class="rv d1" aria-label="Leyson.">Leyson<button type="button" class="mk mk-hero" data-dot data-follow aria-label="这个点是我的标志，点一下换个颜色"><span class="hint px" aria-hidden="true">Click me</span></button></h1>
    <div class="hero-grid">
      <div class="rv d2">
        <p class="lede">把复杂的判断，<br>变成<span class="hl">清楚的一步</span>。</p>
        <p class="sub">广州美术学院 工业设计（智能交互方向）本科。我习惯先把问题定义清楚，再用减法做取舍，最后借助 AI 编程工具把设计做成能跑的原型。</p>
        <div class="acts">
          <a class="btn btn-ink" href="work.html" data-magnetic>选一个项目 <span class="arr" aria-hidden="true">→</span></a>
          <a class="btn btn-line" href="{PDF}" download>下载 PDF</a>
        </div>
      </div>
      <aside class="status rv d3" aria-label="我的当前状态">
        <div class="top px"><span>Status · 此刻</span><span class="clock" data-clock><i aria-hidden="true"></i>广州 <time>--:--</time></span></div>
        <div class="me">
          <div class="ava"><img src="assets/img/portrait-avatar.jpg" alt="梁宇森 Leyson 头像" loading="eager"></div>
          <div><b>梁宇森 Leyson</b><span>交互 / UI·UX 设计</span></div>
        </div>
        <dl>
          <dt>心情</dt><dd>有点兴奋</dd>
          <dt>正在做</dt><dd>打磨作品集</dd>
          <dt>联系偏好</dt><dd>欢迎来聊</dd>
        </dl>
        <div class="say"><a href="#contact">→ 开放实习机会</a><a class="fmt px" href="work.html">See work ↗</a></div>
      </aside>
    </div>
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="track">
  {MARQ}
  {MARQ}
  {MARQ}
  {MARQ}
</div></div>

<section class="sec" aria-labelledby="how-h">
  <div class="wrap">
    <div class="sec-head rv"><div class="no px">01 · How I work</div><h2 id="how-h">三个作品，<br>同一种做事方式。</h2></div>
    <div class="how">
      <article class="rv"><span class="n px">01</span><h3>先找到真正的问题</h3><p>不急着画界面。先弄清用户卡在哪一步，哪个判断最影响结果。</p><div class="eg"><span>SIFT · 四个断层</span><span>Focenda · 访谈</span></div></article>
      <article class="rv d1"><span class="n px">02</span><h3>用减法做取舍</h3><p>删掉“看起来很强”的功能，留下真正帮人省力的那一个。</p><div class="eg"><span>不做对话框</span><span>不显示已读</span></div></article>
      <article class="rv d2"><span class="n px">03</span><h3>做成能跑的原型</h3><p>借助 AI 编程工具把设计落成可交互 Demo，再拿去给人用、听反馈、改。</p><div class="eg"><span>SIFT 已上线</span><span>Focenda 内测</span></div></article>
    </div>
  </div>
</section>

<section class="sec sec-work" aria-labelledby="work-h">
  <div class="wrap">
    <div class="sec-head rv"><div class="no px">02 · Selected work</div><h2 id="work-h">三个项目，三次取舍。</h2><a class="more" href="work.html">全部作品 <span aria-hidden="true">→</span></a></div>
    <div class="pcs">{cards}
    </div>
  </div>
</section>

<section class="sec" id="about" aria-labelledby="about-h">
  <div class="wrap">
    <div class="sec-head rv"><div class="no px">03 · About</div><h2 id="about-h">你好，我是<span class="lat"> Leyson</span>。</h2></div>
    <div class="about">
      <div class="photo rv"><img src="assets/img/portrait.jpg" alt="梁宇森 Leyson 的照片"><span class="hi px"><i class="mk" aria-hidden="true"></i>Hi! I’m Leyson</span></div>
      <div class="rv d1">
        <p class="intro">工业设计出身，关心“人和系统之间那一点点摩擦”。<span class="mute">我喜欢把复杂的判断拆成清楚的一步，也喜欢像素、角色这种能让产品有温度的小东西。</span></p>
        <div class="cv">
          <div><h3 class="px">Honors</h3><ul>
            <li><b>国赛一等奖</b><span>第十四届全国海洋航行器设计与制作大赛；另获省赛二等奖</span></li>
            <li><b>2024–2025 学年</b><span>三好学生 · 校级奖学金 · 勤工助学先进个人</span></li>
          </ul></div>
          <div><h3 class="px">Skills</h3><ul>
            <li><b>交互与体验</b><span>用户研究 · 信息架构 · 交互流程</span></li>
            <li><b>视觉与原型</b><span>Figma · 设计系统 · 像素角色与动效</span></li>
            <li><b>AI 辅助开发</b><span>借助 AI 编程工具把设计做成可运行原型</span></li>
          </ul></div>
          <div><h3 class="px">Experience</h3><ul>
            <li><b>广州美术学院 · 教务部助理</b><span>毕业展、“未来学院”论坛平面设计；优化资料归档流程</span></li>
            <li><b>工业设计学院学生会 · 文娱部</b><span>策划执行校庆八杂街，参与校运会组织</span></li>
            <li><b>心理委员</b><span>谈话训练与同伴支持</span></li>
          </ul></div>
        </div>
      </div>
    </div>
  </div>
</section>
</main>
''' + foot()
