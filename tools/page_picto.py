from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec

PATH = 'projects/picto.html'
B = '../'
I = B + 'assets/img/'


def render():
    s1 = '''
    <h3 class="rv">情侣想要的是“被想起”，<br>不是“被要求回复”。</h3>
    <p class="rv">桌面研究里反复出现同一个张力：关系需要持续的在场感，但现有工具把“在场”和“回复义务”绑在一起。</p>
    <div class="stats rv picto-ink">
      <div><b data-count>52%</b><span>伴侣没按预期时间回复时会感到焦虑</span></div>
      <div><b data-count>67.5%</b><span>有过异地恋经历</span></div>
      <div><b data-count>41.3%</b><span>认为“忽略了联系”是异地恋的阻碍</span></div>
      <div><b>0</b><span>在线、已读等制造期待的信号，Picto 一个都不显示</span></div>
    </div>
    <p class="note rv">来源：Huang &amp; Yao, 2024, JSPR, N=50；中国青年报社会调查中心, 2016, N=2001。为已发表研究数据，非本项目调研。</p>'''

    s2 = '''
    <h3 class="rv">三个原则，约束所有功能与表达。</h3>
    <div class="notes">
      <div class="card rv"><span class="n px">01</span><h4>看见，不等于打扰。</h4><p>状态先于消息，让关心可以停在“我知道了”。</p></div>
      <div class="card rv d1"><span class="n px">02</span><h4>不回应，也被允许。</h4><p>联系偏好直接可见，不用让沉默承担解释成本。</p></div>
      <div class="card rv d2"><span class="n px">03</span><h4>温柔，但操作必须清楚。</h4><p>情感留给标题与角色，按钮和反馈直接说明结果。</p></div>
    </div>'''

    s3 = f'''
    <h3 class="rv">“智能”来自可解释的状态映射。</h3>
    <p class="rv">不是自动替你表达，而是把主动选择的信息，转化为可预测、可感知的状态反馈。</p>
    <div class="formula rv"><span>有点累<small class="px">心情 · 10 种</small></span><i aria-hidden="true">+</i><span>休息充电<small class="px">正在做 · 12 种</small></span><i aria-hidden="true">+</i><span>看见就好<small class="px">联系偏好 · 4 档</small></span><i aria-hidden="true">=</i><span class="out">反馈状态，不催促回应</span></div>
    <div class="two gap-sm">
      <figure class="fig rv"><div class="sheet"><img class="zoom pixel" src="{I}picto-tired.jpg" alt="Picto 像素角色：有点累，休息充电"></div><figcaption><b>输出</b>状态句 + 像素姿态 + 联系边界</figcaption></figure>
      <p class="aside rv">状态由用户主动选择；系统只组合已知输入，<b>不推断情绪</b>。这样每一个反馈都能说出“为什么是这样”，也不会替任何人做决定。</p>
    </div>'''

    s4 = f'''
    <h3 class="rv">从表达，到看见，再到留存。</h3>
    <div class="shots" style="--c:4">
      <figure class="rv"><div class="phone"><img class="zoom" src="{I}picto-home.jpg" alt="Picto 首页：看见对方此刻的状态"></div><figcaption><b>首页</b>先看见对方此刻</figcaption></figure>
      <figure class="rv d1"><div class="phone"><img class="zoom" src="{I}picto-status.jpg" alt="Picto 选择状态页"></div><figcaption><b>选状态</b>一次说清三件事</figcaption></figure>
      <figure class="rv d2"><div class="phone"><img class="zoom" src="{I}picto-polaroid.jpg" alt="Picto 拍一片刻页"></div><figcaption><b>拍一片刻</b>相机不可用也不中断</figcaption></figure>
      <figure class="rv d3"><div class="phone"><img class="zoom" src="{I}picto-wall.jpg" alt="Picto 片刻墙"></div><figcaption><b>片刻墙</b>短句离开首页，留在这里</figcaption></figure>
    </div>'''

    s5 = f'''
    <h3 class="rv">四次关键迭代，让作品更诚实。</h3>
    <div class="two">
      <div class="ba">
        <figure class="fig rv"><span class="tag">Before</span><div class="sheet"><img class="zoom" src="{I}picto-before.jpg" alt="Picto 早期首页"></div></figure>
        <figure class="fig rv d1"><span class="tag">After</span><div class="sheet"><img class="zoom" src="{I}picto-after.jpg" alt="Picto 当前首页"></div></figure>
      </div>
      <ol class="steps rv">
        <li><div><b>角色</b><span>程序像素角色成为唯一基准，应用、头像与封面共用同一套造型。</span></div></li>
        <li><div><b>语言</b><span>能力不再被夸大：“在线、已送达”改为“当前设备、切换角色查看”。</span></div></li>
        <li><div><b>流程</b><span>分散的页面整合为六步双角色交接，表达、看见、回应、接收形成闭环。</span></div></li>
        <li><div><b>展示</b><span>冗长的过程说明，换成真实界面和可交互的案例页。</span></div></li>
      </ol>
    </div>'''

    s6 = '''
    <p class="quote rv">让亲密关系里的“此刻”，先被看见。</p>
    <p class="aside rv gap-sm">下一步计划用一周日记研究验证三个设计假设，并回应低打扰本身的代价：状态不能完全代替主动表达，所以 Picto 保留了短句。</p>'''

    return head('片刻 Picto — Leyson', '片刻 Picto：介于沉默与即时聊天之间的低打扰陪伴方式。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-picto">
  <div class="wrap">
    {crumb('Picto')}
    <p class="case-id px rv"><img src="{I}logo-picto.png" alt="">Picto 片刻 · 02 / 03</p>
    <h1 class="rv cjk">看见彼此，<br>不必一直聊天。</h1>
    <p class="sub rv d1">片刻 Picto 是一种介于沉默与即时聊天之间的低打扰陪伴方式：先表达“我现在怎样”，再决定要不要说话。</p>
    {meta([('Role', '问题定义 · 状态机制 · 语言边界'), ('Team', '独立完成'), ('Timeline', '约 2 个月'), ('Platform', 'Mobile · 可运行原型'), ('Tools', 'AI 协作完成实现、测试与素材')])}
    <div class="case-visual rv"><img class="zoom" src="{I}picto-room.jpg" alt="Picto 像素小屋主视觉" fetchpriority="high"></div>
  </div>
</section>

{tldr([('Problem · 问题', '即时通信把“被看见”绑成了“要回复”，忙碌和异地的情侣因此更累。'), ('Approach · 判断', '用一张状态卡代替一条消息：心情 + 正在做 + 联系偏好，边界直接说出来。'), ('Outcome · 结果', '一套可解释的状态系统、完整的双角色流程和可运行原型。')])}
{toc([('problem', '01', '问题', 'Problem'), ('principles', '02', '设计原则', 'Decision'), ('system', '03', '交互系统', 'Design'), ('flow', '04', '核心流程', 'Design'), ('iterate', '05', '迭代', 'Iteration'), ('next-step', '06', '下一步', 'Next')])}
{sec('problem', '01', '问题', 'Problem', s1)}
{sec('principles', '02', '设计原则', 'Decision', s2, 'theme-picto')}
{sec('system', '03', '交互系统', 'Design', s3)}
{sec('flow', '04', '核心流程', 'Design', s4, 'tint-peach')}
{sec('iterate', '05', '迭代', 'Iteration', s5)}
{sec('next-step', '06', '下一步', 'Next', s6, 'theme-picto')}
</main>
''' + pager('picto') + foot(B)
