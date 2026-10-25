from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec

PATH = 'projects/focenda.html'
B = '../'
I = B + 'assets/img/'


def render():
    s1 = '''
    <h3 class="rv">设计师的时间，<br>被“非设计”吃掉了。</h3>
    <p class="rv">访谈初创公司设计师后，归纳出三类关键阻塞。</p>
    <div class="cards" style="--c:3">
      <div class="card rv"><span class="n px">01</span><h4>琐事太多</h4><p>隐性劳动侵蚀创作时间。</p></div>
      <div class="card rv d1"><span class="n px">02</span><h4>信息没对齐</h4><p>链路断裂导致高频返工。</p></div>
      <div class="card rv d2"><span class="n px">03</span><h4>难拿出结果</h4><p>设计价值难以量化呈现。</p></div>
    </div>
    <ol class="loop rv gap-sm" aria-label="定位的变化"><li>研究起点：为设计师做 AI 协同工作空间</li><li>内测发现：最被需要的是“排好今天”</li><li class="on">定位：每日规划与动态排期</li></ol>'''

    s2 = f'''
    <h3 class="rv">按价值与精力，<br>分进四个象限。</h3>
    <p class="rv">一句话输入任务，带上时长与时间；每个任务得到重要度与精力两项评分，气泡位置就是优先级。</p>
    <ul class="quad rv" aria-label="四个象限">
      <li><b>优先完成</b><span>重要 · 轻松</span></li>
      <li><b>专注推进</b><span>重要 · 费力</span></li>
      <li><b>顺手处理</b><span>不急 · 轻松</span></li>
      <li><b>考虑删减</b><span>不急 · 费力</span></li>
    </ul>
    <div class="two gap-sm">
      <figure class="fig rv"><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}focenda-detail.jpg" alt="Focenda 任务详情与执行建议"></div><figcaption><b>点开任务</b>重要又费力？先拆成 2–3 个小步骤。</figcaption></figure>
      <div class="rv d1">
        <p class="eyebrow px">Local rules · 每条安排都说得出理由</p>
        <ol class="steps">
          <li><div><b>评估</b><span>每项起始 40 分，按任务描述中的关键词加减，结果限定在 10–95。</span></div></li>
          <li><div><b>归类</b><span>以 50 分为界，分进四个象限。</span></div></li>
          <li><div><b>排期</b><span>专注 · 均衡 · 轻松三种节奏排序，全部在本地运行。</span></div></li>
        </ol>
      </div>
    </div>
    <figure class="fig rv gap-top"><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}focenda-timeline.jpg" alt="Focenda 今日时间轴"></div><figcaption><b>选一种节奏</b>生成今天的时间轴，可拖动调整，超过下班界限即标红。</figcaption></figure>'''

    s3 = f'''
    <h3 class="rv">电脑看全局，手机看下一步。</h3>
    <div class="two">
      <figure class="fig rv"><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}focenda-future.jpg" alt="Focenda 桌面端：未来 7 天"></div><figcaption><b>Desktop</b>1280–1920px 多栏工作面 · 向前排一周</figcaption></figure>
      <div class="shots" style="--c:2">
        <figure class="rv d1"><div class="phone"><img class="zoom" src="{I}focenda-today.jpg" alt="Focenda 手机端：今日"></div><figcaption><b>今日</b></figcaption></figure>
        <figure class="rv d2"><div class="phone"><img class="zoom" src="{I}focenda-plan.jpg" alt="Focenda 手机端：计划"></div><figcaption><b>计划</b>320–430px 单列</figcaption></figure>
      </div>
    </div>'''

    s4 = f'''
    <h3 class="rv">内测 10 人 · 2 天。</h3>
    <div class="stats rv foc-ink">
      <div><b>9/10</b><span>使用了任务规划</span></div>
      <div><b data-count>84%</b><span>任务完成率</span></div>
      <div><b data-count>80%</b><span>接受自动排期</span></div>
      <div><b>6/10</b><span>主动调整优先级</span></div>
    </div>
    <p class="note rv">样本较小，属初步验证。参与者：学生 5 · 职场办公 3 · 自由职业 2。</p>
    <h3 class="rv gap-top">从 Focus Flow 到 Focenda：<br>把术语换成人话。</h3>
    <figure class="fig rv"><span class="tag">Before · Focus Flow 早期方案（重绘示意）</span><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}focenda-early.jpg" alt="早期方案 Focus Flow"></div></figure>
    <div class="table-scroll rv" tabindex="0" role="region" aria-label="命名对比表">
    <table class="compare">
      <thead><tr><th scope="col"><span class="sr">维度</span></th><th scope="col">早期 · Focus Flow</th><th scope="col">现在 · Focenda</th></tr></thead>
      <tbody>
        <tr><th scope="row">象限命名</th><td class="old" data-label="早期 · Focus Flow">极度聚焦 · 核心攻坚 · 摸鱼日常 · 强效排雷</td><td class="new" data-label="现在 · Focenda">优先完成 · 专注推进 · 顺手处理 · 考虑删减</td></tr>
        <tr><th scope="row">评分维度</th><td class="old" data-label="早期 · Focus Flow">含金量 · 耗费</td><td class="new" data-label="现在 · Focenda">重要度 · 精力</td></tr>
        <tr><th scope="row">导航结构</th><td class="old" data-label="早期 · Focus Flow">任务大厅 · 设计图库 · 周报</td><td class="new" data-label="现在 · Focenda">今日 · 未来 · 设置</td></tr>
      </tbody>
    </table>
    </div>'''

    return head('Focenda 专序 — Leyson', 'Focenda 专序：按重要度与精力排好今天的动态日程规划。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-foc">
  <div class="wrap">
    {crumb('Focenda')}
    <p class="case-id px rv"><img src="{I}logo-focenda.png" alt="">Focenda 专序 · 03 / 03</p>
    <h1 class="rv">Flow Better.<br>Focus Smarter.</h1>
    <p class="sub rv d1">Focenda 专序：把零散任务，变成可执行的一日安排。起初是课程作业，课程结束后我继续独立打磨。</p>
    {meta([('Role', '研究 · 产品定义 · 交互与视觉'), ('Context', '课程作业 → 课后独立打磨'), ('Research', '设计师半结构化访谈<br>14 个问题'), ('Platform', 'Web + Mobile 响应式'), ('Test', '内测 10 人 · 2 天')])}
    <div class="case-visual rv stack">
      <div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}focenda-priority.jpg" alt="Focenda 四象限界面" fetchpriority="high"></div>
      <div class="phone"><img class="zoom" src="{I}focenda-today.jpg" alt="Focenda 手机今日页" fetchpriority="high"></div>
    </div>
  </div>
</section>

{tldr([('Problem · 问题', '设计师的时间被“非设计”吃掉：琐事太多、信息没对齐、难拿出结果。'), ('Approach · 判断', '先把“排好今天”做扎实：按重要度 × 精力分象限，再按节奏生成时间轴。'), ('Outcome · 结果', '10 人内测中 9 人用了任务规划；产品从“设计师协作空间”收敛到每日规划。')])}
{toc([('research', '01', '研究', 'Problem'), ('flow', '02', '核心流程', 'Design'), ('devices', '03', '多端', 'Design'), ('test', '04', '内测与迭代', 'Outcome')])}
{sec('research', '01', '研究', 'Problem', s1)}
{sec('flow', '02', '核心流程', 'Design', s2, 'theme-foc')}
{sec('devices', '03', '多端', 'Design', s3)}
{sec('test', '04', '内测与迭代', 'Outcome', s4, 'tint-blue')}
</main>
''' + pager('focenda') + foot(B)
