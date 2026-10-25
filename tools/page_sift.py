from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec

PATH = 'projects/sift.html'
B = '../'
I = B + 'assets/img/'


def render():
    s1 = f'''
    <h3 class="rv">设计前期缺的不是图，<br>而是判断的次序。</h3>
    <p class="rv">工业、CMF、包装和 UI 设计师拿到模糊 Brief 后，常卡在四个断层。</p>
    <div class="cards" style="--c:2">
      <div class="card rv"><span class="n px">01</span><h4>意图与边界模糊</h4><p>有初步感受，却说不清最大的不确定性在哪，常把视觉诉求和技术约束混在一起。</p></div>
      <div class="card rv d1"><span class="n px">02</span><h4>AI 工具的“生图幻觉”</h4><p>一键出效果图很热闹，但前期需要的是视觉策略与检索方向。</p></div>
      <div class="card rv"><span class="n px">03</span><h4>搜图没有次序</h4><p>先搜材质还是先搜结构？大量模板样机掩盖了真实工艺。</p></div>
      <div class="card rv d1"><span class="n px">04</span><h4>决策不收敛</h4><p>收藏夹堆满碎片图，却很难向团队讲清方向是怎么推出来的。</p></div>
    </div>
    <p class="insight rv"><span aria-hidden="true">→</span> 机会点：不再帮设计师“找更多图”，而是帮他们理清先判断什么、再去搜什么。</p>'''

    s2 = f'''
    <h3 class="rv">每次只问一个<br>会改变设计判断的问题。</h3>
    <ol class="loop rv" aria-label="SIFT 提问循环"><li>Brief</li><li>找不确定性</li><li class="on">关键提问 · 2–3 个对立选项</li><li>设计师回答</li><li>更新 State</li><li>人工确认点</li></ol>
    <p class="rv">AI 的推论标为“待确认”，设计师确认的才算事实；方向收敛或连续不确定时，平滑停到人工确认点。</p>
    <p class="sub-h rv">我主导的三次减法</p>
    <div class="cut">
      <div class="row rv"><span class="d px">09.18</span><span class="no-"><s>一次性输出长篇方案</s><small>几千字的策略方案，测试中几乎没人读完</small></span><span class="ar" aria-hidden="true">→</span><span class="yes">每轮只问 2–3 个关键问题</span></div>
      <div class="row rv"><span class="d px">09.21</span><span class="no-"><s>生图、打样与公差字段</s><small>让产品被当成出图工具，偏离前期判断</small></span><span class="ar" aria-hidden="true">→</span><span class="yes">删掉伪工程字段，画面只辅助判断</span></div>
      <div class="row rv"><span class="d px">09.22</span><span class="no-"><s>多个 AI 对话框来回切</s><small>确认过的判断很难被找回和追溯</small></span><span class="ar" aria-hidden="true">→</span><span class="yes">所有 AI 交互放进画布卡片，每步有来源</span></div>
    </div>'''

    s3 = f'''
    <h3 class="rv">一张画布，串起从 Brief<br>到提案的整条推演链。</h3>
    <p class="rv">简报 → 视觉抉择 → 策略基准 → 风格主题 → 灵感检索 → 画面生成。卡片可以自由组合，每张都标明自己的状态。</p>
    <figure class="fig browser rv"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}sift-canvas.jpg" alt="SIFT 主画布：从简报到画面生成的卡片链"></figure>

    <div class="two gap-top">
      <div class="rv">
        <p class="eyebrow px">Demo walkthrough · 示例 Brief</p>
        <h3 class="h-sm">一句模糊 Brief，三个问题后收敛成一张概念图。</h3>
        <ol class="steps">
          <li><div><b>输入 Brief</b><span>为城市通勤者设计一款可折叠水壶，喝完能压扁放进包里，单手开合且不漏水。</span></div></li>
          <li><div><b>三个分水岭问题</b><span>形态：风琴褶 · 材质：半透雾面硅胶 · 开合提示：暂不确定，待验证。</span></div></li>
          <li><div><b>沉淀策略基准</b><span>以风琴褶为结构语言，让水位和褶皱同时可见；不确定项单独留档。</span></div></li>
          <li><div><b>推演主题并检索</b><span>推出「呼吸褶」「水位线」「通勤石」，选定后生成去噪检索词与概念画面。</span></div></li>
        </ol>
      </div>
      <figure class="fig rv d1"><div class="sheet"><img class="zoom" src="{I}sift-bottle.jpg" alt="概念画面《呼吸褶》：半透雾面硅胶风琴褶水壶"></div><figcaption><b>05</b>概念画面《呼吸褶》</figcaption></figure>
    </div>

    <div class="shots gap-top" style="--c:4">
      <figure class="rv"><div class="sheet"><img class="zoom" src="{I}sift-ask.jpg" alt="关键提问卡"></div><figcaption><b>提问</b>只问分水岭</figcaption></figure>
      <figure class="rv d1"><div class="sheet"><img class="zoom" src="{I}sift-theme.jpg" alt="风格主题卡"></div><figcaption><b>主题</b>说得清从哪来</figcaption></figure>
      <figure class="rv d2"><div class="sheet"><img class="zoom" src="{I}sift-gen.jpg" alt="概念画面卡"></div><figcaption><b>画面</b>只辅助判断</figcaption></figure>
      <figure class="rv d3"><div class="sheet"><img class="zoom" src="{I}sift-advisor.jpg" alt="策略顾问面板"></div><figcaption><b>顾问</b>拍板权留给设计师</figcaption></figure>
    </div>

    <div class="gap-top">
      <h3 class="h-sm rv">改动前后：提问从“问卷”变成“抉择”。</h3>
      <div class="ba">
        <figure class="fig rv"><span class="tag">Before · 重绘示意</span><div class="sheet"><img class="zoom" src="{I}sift-ba-ask0.jpg" alt="早期提问界面（重绘示意）"></div></figure>
        <figure class="fig rv d1"><span class="tag">After · 当前版本</span><div class="sheet"><img class="zoom" src="{I}sift-ba-ask1.jpg" alt="当前提问界面"></div></figure>
      </div>
    </div>'''

    s4 = f'''
    <h3 class="rv">65 秒看完 SIFT。</h3>
    <div class="video rv"><video controls playsinline preload="none" width="1920" height="1080" poster="{I}sift-launch-poster.jpg" aria-label="SIFT 发布短片，65 秒"><source src="{B}assets/video/sift-launch.mp4" type="video/mp4">你的浏览器不支持视频播放。<a href="{B}assets/video/sift-launch.mp4">下载视频</a></video></div>
    <p class="note rv">约 19 MB · 点击播放后才开始加载。</p>'''

    s5 = '''
    <p class="quote rv">最难的不是让 AI 多做，而是让它少做。</p>
    <div class="cards gap-sm" style="--c:3">
      <div class="card rv"><h4>克制比功能更难</h4><p>删掉打样、渲染这些“看起来很强”的功能，产品反而更像设计师的搭档。</p></div>
      <div class="card rv d1"><h4>假设和事实要分开</h4><p>AI 的推论标为待确认，设计师确认的才算事实，信任感来自透明。</p></div>
      <div class="card rv d2"><h4>做组长也要做取舍</h4><p>在调研、设计和开发之间排优先级，每次转向都写进决策日志。</p></div>
    </div>'''

    return head('SIFT — Leyson', 'SIFT：设计前期的 AI 视觉策略收敛智能体。每次只问一个会改变设计判断的问题。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-sift">
  <div class="wrap">
    {crumb('SIFT')}
    <p class="case-id px rv"><img src="{I}logo-sift.png" alt="">SIFT · 01 / 03</p>
    <h1 class="rv">Sift the noise.<br>Find the direction.</h1>
    <p class="sub rv d1">SIFT 是一个服务设计前期的 AI 智能体：把一句模糊 Brief，收敛成说得清来由的视觉方向。</p>
    {meta([('Role', '组长<br>调研 · 产品定义 · 交互设计'), ('Team', '3 人小组'), ('Timeline', '2026.09 – 10 · 4 周<br>PRD 迭代至 v4.0'), ('Platform', 'Web · 已上线'), ('Tools', '借助 AI 编程工具完成开发<br>Next.js · React Flow · DeepSeek')])}
    <div class="case-visual rv"><img class="zoom" src="{I}sift-hero.jpg" alt="SIFT 界面卡片组合：风格主题、概念画面与策略基准" fetchpriority="high"></div>
  </div>
</section>

{tldr([('Problem · 问题', '拿到模糊 Brief，设计师不缺图，缺的是“先判断什么、再搜什么”的次序。'), ('Approach · 判断', '只问分水岭问题的 Agent，加一张能追溯每一步来源的画布。'), ('Outcome · 结果', '4 周把定位越改越窄：从“能出图的 AI”收敛成“陪你做判断的搭档”。')])}
{toc([('problem', '01', '问题', 'Problem'), ('decision', '02', '关键判断', 'Decision'), ('design', '03', '设计', 'Design'), ('film', '04', '发布短片', 'Outcome'), ('reflect', '05', '反思', 'Reflection')])}
{sec('problem', '01', '问题', 'Problem', s1)}
{sec('decision', '02', '关键判断', 'Decision', s2, 'dark-sec')}
{sec('design', '03', '设计', 'Design', s3)}
{sec('film', '04', '发布短片', 'Outcome', s4, 'dark-sec')}
{sec('reflect', '05', '反思', 'Reflection', s5)}
</main>
''' + pager('sift') + foot(B)
