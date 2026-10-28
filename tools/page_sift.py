from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec, Figs, metrics, cuts, tabs

PATH = 'projects/sift.html'
B = '../'
I = B + 'assets/img/'

# ---------------------------------------------------------------- recreated UI: the traceable canvas
# Copy taken from the real canvas screenshot (sift-canvas-hd.jpg) and the theme / generation cards.
NODES = [
    ('0', '简报解析', '设计简报', '已确认', 'k',
     '<p>为城市通勤者设计一款可折叠水壶，喝完能压扁放进包里，单手就能开合且不漏水。</p><p class="kw">关键词：轻 · 可折叠 · 单手 · 耐用 · 通勤</p>',
     '起点 · 设计师输入的 Brief'),
    ('1', '视觉抉择', '视觉抉择记录', '第 1 次记录', 'b',
     '<ol class="qa"><li>折叠方式在外观上如何被看见？<span class="ok">已选：风琴褶 · 环形褶皱逐级压缩</span></li>'
     '<li>壶身应该呈现怎样的触感？<span class="ok">已选：半透雾面硅胶 · 看得见水位</span></li>'
     '<li>单手开合的提示要多明显？<span class="tbd">暂不确定 · 不阻塞流程</span></li></ol>',
     '回指 00 简报 · 回答即写入记录'),
    ('2', '策略基准', '核心策略基准', '核心收敛', 'g',
     '<dl class="kv"><dt>设计驱动</dt><dd>形式与结构共同驱动（折叠即形态）</dd>'
     '<dt>设计假设</dt><dd>以风琴褶为核心结构语言，半透雾面硅胶让水位和褶皱同时可见，盖体单手按压开合；单手提示的强弱留待验证。</dd></dl>'
     '<div class="pills"><span>可见的折叠结构</span><span>半透雾面质感</span><span>单手按压盖钮</span><span class="no">不做户外硬核风</span><span class="no">避开高饱和塑料感</span></div>',
     '依据来源与未决项 · 1 项待定'),
    ('3', '风格主题', '呼吸褶', '主题 01 · 喜欢', 'v',
     '<p class="lead">风琴褶随饮水起伏 <i>与</i> 压扁收纳是同一个动作</p>'
     '<p>一节节半透雾面硅胶褶皱像在缓慢呼吸：满水时舒展成柔和的柱体，喝完按压即层层收拢；光线穿过褶皱边缘，留下一圈圈乳白色渐变高光。</p>',
     '已连 1 个上游：02 策略基准 · 已衍生 3 张下游探索卡'),
    ('4', '灵感检索', '跨平台灵感检索', '3 处精选渠道', 'o',
     '<p>围绕“褶皱可见 + 单手开合”的取舍收集真实产品与工艺证据，只做对照，不堆灵感图。</p>'
     '<ul class="q"><li><em>结构</em>accordion bellows silicone bottle industrial design</li><li><em>工艺</em>collapsible folding mechanism prototype detail</li>'
     '<li><em>CMF</em>translucent frosted silicone texture CMF</li><li><em>光影</em>minimal commuter product soft daylight</li></ul>'
     '<p class="neg">默认挂载 <code>-mockup -template -vector -stock -3d</code></p>',
     '检索目标 · 策略收敛「呼吸褶」'),
    ('5', '画面生成', '《呼吸褶》', '已渲染（1 版）', 'p',
     '<p class="lead">褶皱可见的柱体轮廓与单手按压盖钮的信息层次</p>'
     f'<div class="gen"><img src="{I}sift-bottle.jpg" alt="SIFT 生成的概念画面《呼吸褶》：半透雾面硅胶风琴褶水壶"><p>通勤包侧袋里的一只可折叠水壶，半透雾面乳白硅胶构成层层风琴褶，满水舒展、喝完收拢；暖灰哑光盖体配钴蓝按压钮，单手即可开合。</p></div>',
     '继承主题：呼吸褶 · 画面只辅助判断'),
]


# ---------------------------------------------------------------- hero: a messy brief sifted into directions
# All copy comes from the canvas / ask-card recreations below (same brief, same question, same chain).
# Each chip: (text, kept?, x offset, y offset, rotation)
CHIPS = [('可折叠', 1, -6, 4, -3), ('户外硬核风', 0, 8, -4, 2), ('单手开合', 1, 10, -6, 2), ('-mockup', 0, 12, 2, 1),
         ('不漏水', 1, -4, 8, 1), ('卷收式', 0, 2, -10, 3), ('通勤', 1, 6, -2, -2), ('高饱和塑料感', 0, -8, 6, -2),
         ('-template', 0, -6, -6, -1), ('轻', 1, -10, 6, 3), ('伸缩套筒', 0, -2, 4, -3), ('耐用', 1, 4, -8, -1), ('-stock', 0, 4, 8, 2)]


def _chips():
    return ''.join(
        f'<span class="sx-chip {"k" if keep else "x"}" style="--x:{x}px;--y:{y}px;--r:{r}deg;--d:{k * -0.7:.1f}s">{t}</span>'
        for k, (t, keep, x, y, r) in enumerate(CHIPS))


HERO = f'''
    <div class="case-visual sx-visual rv">
      <div class="sx-stage" role="img" aria-label="SIFT 画布示意：一句模糊 Brief 的碎片经过一道关键提问，筛成策略基准、风格主题与画面生成三张方向卡">
        <div class="sx-canvas sift-ui" aria-hidden="true">
          <p class="sx-crumb"><b>SIFT</b> / 呼吸褶 · 折叠水壶</p>
          <div class="sx-col sx-in">
            <p class="sx-k px">00 · Brief</p>
            <p class="sx-brief">为城市通勤者设计一款可折叠水壶，喝完能压扁放进包里，单手就能开合且不漏水。</p>
            <div class="sx-cloud">{_chips()}</div>
          </div>
          <div class="sx-sieve"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="sx-col sx-ask">
            <p class="sx-k px">01 · 关键提问</p>
            <div class="sx-q">
              <header><span class="chip-k b">1 视觉抉择</span><span class="st">形态结构</span></header>
              <h5>折叠方式在外观上如何被看见？</h5>
              <span class="sx-o on"><b>01</b>风琴褶：环形褶皱逐级压缩<em></em></span>
              <span class="sx-o"><b>02</b>卷收式：软袋整体卷起扣合<em></em></span>
              <span class="sx-o"><b>03</b>伸缩套筒：硬质分段嵌套<em></em></span>
              <span class="sx-o tbd"><b>?</b>暂不确定 · 不阻塞流程<em></em></span>
            </div>
          </div>
          <div class="sx-col sx-out">
            <p class="sx-k px">02 · 收敛方向</p>
            <ol class="sx-dirs">
              <li class="c-g"><span class="chip-k">2 策略基准</span><b>形式与结构共同驱动</b><span>可见的折叠结构 · 半透雾面质感 · 单手按压盖钮</span></li>
              <li class="c-v"><span class="chip-k">3 风格主题</span><b>呼吸褶</b><span>风琴褶随饮水起伏，与压扁收纳是同一个动作</span></li>
              <li class="c-p sx-gen"><img src="{I}sift-bottle.jpg" alt="" width="768" height="768" fetchpriority="high" decoding="async"><div><span class="chip-k">5 画面生成</span><b>《呼吸褶》</b><span>继承主题：呼吸褶</span></div></li>
            </ol>
          </div>
        </div>
      </div>
    </div>'''


def canvas():
    nodes, panels = [], []
    for i, (n, kind, title, status, c, body, src) in enumerate(NODES):
        on = i == 0
        nodes.append(
            f'<li><button type="button" class="cv-node c-{c}" data-step="{i}" aria-pressed="{"true" if on else "false"}" aria-controls="cv-detail">'
            f'<span class="chip-k">{n} {kind}</span><b>{title}</b><span class="st">{status}</span></button></li>')
        panels.append(
            f'<div class="cv-pane c-{c}" data-pane="{i}"{"" if on else " hidden"}>'
            f'<header><span class="chip-k">{n} {kind}</span><span class="st">{status}</span></header><h4>{title}</h4>{body}'
            f'<p class="src"><span aria-hidden="true">↳</span> {src}</p></div>')
    return f'''<div class="ui-frame ui-browser sift-ui" data-canvas>
  <div class="ub-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="crumbs"><b>SIFT</b> / 呼吸褶 · 折叠水壶</span><span class="acts"><button type="button" class="cv-play" data-play aria-label="逐步播放推演链"><span aria-hidden="true">▶</span> 播放推演</button><span class="ghost">导出提案</span></span></div>
  <div class="cv-body">
    <ol class="cv-nodes" aria-label="推演链：点击任一卡片查看内容与来源">{''.join(nodes)}</ol>
    <div class="cv-detail" id="cv-detail" aria-live="polite">{''.join(panels)}</div>
  </div>
</div>'''


# ---------------------------------------------------------------- recreated UI: the ask card (sift-ask.jpg)
ASK = [
    ('q1', '1 · 形态结构', '折叠方式在外观上如何被看见？', ['风琴褶：环形褶皱逐级压缩', '卷收式：软袋整体卷起扣合', '伸缩套筒：硬质分段嵌套']),
    ('q2', '2 · 材质工艺', '壶身应该呈现怎样的触感？', ['半透雾面硅胶：看得见水位', '亲肤软胶：哑光实色', '金属环 + 硅胶：硬软拼接']),
]


def ask_card():
    qs = []
    for qid, tag, q, opts in ASK:
        o = ''.join(
            f'<label class="opt"><input type="radio" name="{qid}" value="{v}"{" checked" if j == 0 else ""}><span class="n px">0{j + 1}</span><span class="t">{v}</span><span class="r" aria-hidden="true"></span></label>'
            for j, v in enumerate(opts))
        o += f'<label class="opt tbd"><input type="radio" name="{qid}" value="暂不确定"><span class="n" aria-hidden="true">?</span><span class="t">暂不确定 · 不阻塞流程</span><span class="r" aria-hidden="true"></span></label>'
        qs.append(f'<fieldset class="ask-q"><legend><span class="tag">{tag}</span>{q}</legend>{o}</fieldset>')
    return f'''<div class="ui-frame ui-card sift-ui ask" data-ask>
  <header><span class="chip-k b">1 视觉抉择</span><span class="st">待确认</span></header>
  <h4>关键视觉抉择</h4><p class="hint">对齐核心视觉取舍；未确定项可直接跳过。</p>
  {''.join(qs)}
  <div class="ask-out" aria-live="polite"><span class="px">→ 写入视觉抉择记录</span><ul data-ask-out></ul></div>
</div>'''


def ba():
    before = ''.join(f'<li>{t}</li>' for t in [
        '1. 请问您希望这款产品在整体上呈现出怎样的风格与气…', '2. 在材料选择方面，您是否有特别偏好或需要避免的…',
        '3. 关于目标用户的年龄层、使用习惯以及…', '4. 您对色彩方案是否有初步设想，比如…', '5. 是否需要考虑品牌调性与现有产品线…'])
    return f'''<div class="ba-ui">
  <div class="ba-side before rv"><span class="ba-k px">Before · 早期版本（重绘）</span>
    <div class="ui-card sift-ui qlist"><ol>{before}</ol><p class="foot-k">随机 1–5 题 · 平均题干 40+ 字</p>
      <span class="pin" style="top:18%;right:-12px" aria-hidden="true">1</span></div>
    <p class="ba-note"><b>1</b> 开放式问卷：题干长、无选项，设计师得自己组织答案。</p></div>
  <div class="ba-arrow" aria-hidden="true">→</div>
  <div class="ba-side after rv d1"><span class="ba-k px">After · 当前版本 · 可直接点选</span>
    {ask_card()}
    <p class="ba-note"><b>2</b> 每轮 2–3 题、题干 ≤35 字、选项对立，可选“暂不确定”；回答即写入记录。</p></div>
</div>'''


def more(title, body):
    return f'<details class="more"><summary><span class="px"><i class="o">+ 展开</i><i class="c">− 收起</i></span>{title}</summary><div class="more-b">{body}</div></details>'


def shot(f, t, n, d=''):
    return (f'<figure class="rv {d}"><div class="browser"><img class="zoom" src="{I}{f}.jpg" alt="SIFT {t}卡片界面截图"></div>'
            f'<figcaption><b>{t}</b>{n}</figcaption></figure>')


PROBLEMS = '''<div class="cards" style="--c:4">
  <div class="card"><h4>意图模糊</h4><p>说不清最大的不确定性</p></div>
  <div class="card"><h4>生图幻觉</h4><p>前期要的是策略，不是效果图</p></div>
  <div class="card"><h4>搜图无序</h4><p>模板样机掩盖真实工艺</p></div>
  <div class="card"><h4>决策不收敛</h4><p>讲不清方向怎么来的</p></div>
</div>'''

MENTOR = '''<blockquote class="pull"><p>“找图本身并不占优势……画布式对设计师团队更友好。”</p><cite class="px">Mentor review · 2026.09.22</cite></blockquote>
<p class="split-line"><span><b>AI 负责</b>拆解需求、提出对立假设、记录来源</span><span><b>设计师负责</b>权衡选项、表达偏好、拍板路线</span></p>'''

LINEAGE = '''<div class="cards" style="--c:4">
  <div class="card"><h4>主语锚定</h4><p>品类贯穿全链路</p></div>
  <div class="card"><h4>Brief 锚点</h4><p>继承哪条核心主张</p></div>
  <div class="card"><h4>确认取舍</h4><p>吸纳哪轮提问的选择</p></div>
  <div class="card"><h4>避坑防线</h4><p>规避哪些已声明禁忌</p></div>
</div>'''

NEXT = '''<div class="table-scroll" tabindex="0" role="region" aria-label="终期问题与下一轮方案"><table class="compare">
<thead><tr><th scope="col">新问题</th><th scope="col">提出者</th><th scope="col">下一轮方案（未上线）</th></tr></thead><tbody>
<tr><th scope="row">卡片多了会迷路</th><td data-label="提出者">LM · 服务设计</td><td class="new" data-label="下一轮">阶段折叠 + 小地图</td></tr>
<tr><th scope="row">术语有门槛</th><td data-label="提出者">JWY · 产品经理</td><td class="new" data-label="下一轮">术语悬停释义</td></tr>
<tr><th scope="row">跳出去会断思路</th><td data-label="提出者">CH · 工业设计</td><td class="new" data-label="下一轮">插件回填外部图片</td></tr>
<tr><th scope="row">结论不够醒目</th><td data-label="提出者">WY · 甲方 / 市场</td><td class="new" data-label="下一轮">置顶“当前结论”</td></tr>
</tbody></table></div>'''

PRD = [
    ('v1.0', '09.18', '<dl class="kv"><dt>定位</dt><dd>视觉研究规划 Agent</dd><dt>变化</dt><dd>起点：解决“不知道先搜什么”</dd></dl>'),
    ('v2.0', '09.18–21', '<dl class="kv"><dt>定位</dt><dd>方向收敛 + 视觉探索</dd><dt>变化</dt><dd>加入方向状态卡、人工检查点</dd></dl>'),
    ('v3.1', '09.23', '<dl class="kv"><dt>定位</dt><dd>视觉策略与方向收敛智能体</dd><dt>变化</dt><dd class="cut-t">删掉生图、打样等伪工程字段</dd></dl>'),
    ('v4.0', '09.27', '<dl class="kv"><dt>定位</dt><dd>多分支推演与协同工作台</dd><dt>变化</dt><dd class="cut-t">删掉右侧对话框、AI 主推标记</dd></dl>'),
]


def render():
    s1 = f'''
    <h3 class="rv">一张画布：从 Brief 到方向，<br>每一步都可追溯。</h3>
    <figure class="fig rv wide cv-shot"><div class="cv-scroll" tabindex="0" role="region" aria-label="SIFT 线上画布截图，可横向滚动"><div class="cv-labels" aria-hidden="true"><span style="left:8.5%"><b>1</b>简报</span><span style="left:24.5%"><b>2</b>关键提问</span><span style="left:41%"><b>3</b>策略基准</span><span style="left:57.5%"><b>4</b>风格主题</span><span style="left:74%"><b>5</b>灵感检索</span><span style="left:91%"><b>6</b>画面生成</span></div><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><div class="cv-pins"><img class="zoom" src="{I}sift-canvas-hd.jpg" alt="SIFT 线上画布截图：简报、视觉抉择、策略基准、风格主题、灵感检索、画面生成六张卡片连成推演链"><span class="cv-pin" style="left:8.5%"><b>1</b></span><span class="cv-pin" style="left:24.5%"><b>2</b></span><span class="cv-pin" style="left:41%"><b>3</b></span><span class="cv-pin" style="left:57.5%"><b>4</b></span><span class="cv-pin" style="left:74%"><b>5</b></span><span class="cv-pin" style="left:91%"><b>6</b></span></div></div></div>
      <figcaption><span class="fn px">Fig. 01</span><b>线上画布</b>1 简报 → 6 画面生成，卡片之间的连线即继承关系，每张卡都能回指来源。</figcaption></figure>
    <h3 class="h-sm rv gap-top">四张核心卡片</h3>
    <div class="shots sift-shots" style="--c:4">
      {shot('sift-ask-hd', '关键提问', '每轮 2–3 题，选项对立')}
      {shot('sift-theme-hd', '风格主题', '写明继承自哪张卡', 'd1')}
      {shot('sift-gen-hd', '画面生成', '画面只辅助判断', 'd2')}
      {shot('sift-advisor-hd', '策略顾问', '横向对比，给出排序', 'd3')}
    </div>
    <h3 class="h-sm rv gap-top">65 秒看完 SIFT。</h3>
    <div class="video rv"><video controls playsinline preload="none" width="1920" height="1080" poster="{I}sift-launch-poster.jpg" aria-label="SIFT 发布短片，65 秒"><source src="{B}assets/video/sift-launch.mp4" type="video/mp4">你的浏览器不支持视频播放。</video></div>
    <p class="note rv">短片用另一个 Brief（冷萃茶）完整演示一遍流程。</p>'''

    s2 = f'''
    <h3 class="rv">提问从“问卷”变成“抉择”。</h3>
    <figure class="fig">{ba()}<figcaption class="rv"><span class="fn px">Fig. 02</span><b>Before / After</b>早期版本为重绘示意，右侧为当前版本，可直接点选。</figcaption></figure>
    <p class="sub-h rv gap-top">我主导删掉的三件事</p>
    {cuts([('09.18', '长篇策略方案', '测试中没人读完', '每轮只问 2–3 个关键问题'),
           ('09.21', '生图、打样字段', '被当成出图工具', '画面只辅助判断'),
           ('09.22', '多个 AI 对话框', '确认过的判断找不回', '交互全部放进画布卡片')])}'''

    s3 = '''
    <h3 class="rv">两轮测试：从“看不懂”<br>到“说得清方向怎么来的”。</h3>
    <div class="shift rv">
      <div><p class="px">中期测试 · 集中问题</p><ul><li>文字偏多</li><li>只给链接</li><li>视觉证据不足</li><li>流程偏长</li></ul></div>
      <span class="ar" aria-hidden="true">→</span>
      <div class="on"><p class="px">终期测试 · 6 位新参与者</p><ul><li>流程关系更清楚</li><li>搜索更有方向</li><li>参考证据回到画布</li><li>非设计角色也能参与</li></ul></div>
    </div>
    <div class="voices one gap-sm">
      <blockquote class="rv"><p>“我不是设计师，但现在能理解为什么从 Brief 走到这个方向，也知道该怎么给反馈。”</p><cite>JWY · 产品经理</cite></blockquote>
    </div>
    <p class="note rv">4 周内 PRD 从 v1.0 迭代到 v4.0 并上线，100+ 次代码提交。</p>'''

    s4 = f'''
    <p class="rv">想看我怎么一步步推到这里，可以展开：</p>
    <div class="rv">
    {more('设计前期的四个断层', PROBLEMS)}
    {more('导师评审：重新定义产品', MENTOR)}
    {more('PRD 四个版本：定位越改越窄', tabs('prd', PRD, 'PRD 版本'))}
    {more('给每个主题挂上“血统”', LINEAGE)}
    {more('终期反馈与下一轮方案', NEXT)}
    </div>
    <p class="quote rv gap-sm">最难的不是让 AI 多说，而是让它问对问题。</p>'''

    return head('SIFT — Leyson', 'SIFT：设计前期的 AI 视觉策略收敛智能体。每次只问一个会改变设计判断的问题。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-sift">
  <div class="wrap">
    {crumb('SIFT')}
    <p class="case-id px rv"><img src="{I}logo-sift.png" alt="">SIFT · 01 / 04</p>
    <h1 class="rv">Sift the noise.<br>Find the direction.</h1>
    <p class="sub rv d1">设计前期的 AI 智能体：把一句模糊 Brief，收敛成说得清来由的视觉方向。</p>
    {meta([('Role', '组长<br>调研 · 产品定义 · 交互设计'), ('Team', '3 人小组'), ('Timeline', '2026.09 – 10 · 4 周'), ('Platform', 'Web · 已上线'), ('Tools', '借助 AI 编程工具完成开发<br>Next.js · React Flow · DeepSeek')])}
{HERO}
  </div>
</section>

{tldr([('Problem · 问题', '设计师不缺图，缺“先判断什么”的次序。'), ('Design · 设计', '可追溯的画布，每轮只问 2–3 个对立选择题。'), ('Outcome · 结果', '4 周迭代上线，两轮用户测试。')])}
{toc([('design', '01', '设计', 'Design'), ('decision', '02', '关键取舍', 'Decision'), ('outcome', '03', '结果', 'Outcome'), ('process', '04', '过程', 'Process')])}
{sec('design', '01', '设计', 'Design', s1, 'full')}
{sec('decision', '02', '关键取舍', 'Decision', s2, 'full')}
{sec('outcome', '03', '结果', 'Outcome', s3, 'dark-sec full')}
{sec('process', '04', '过程', 'Process', s4, 'full')}
</main>
''' + pager('sift') + foot(B)
