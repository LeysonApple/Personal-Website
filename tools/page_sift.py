from build import head, nav, foot, case_hero, facts, chapter, fig, shot, cuts, results, next_project

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
            <p class="sx-k">00 · Brief</p>
            <p class="sx-brief">为城市通勤者设计一款可折叠水壶，喝完能压扁放进包里，单手就能开合且不漏水。</p>
            <div class="sx-cloud">{_chips()}</div>
          </div>
          <div class="sx-sieve"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="sx-col sx-ask">
            <p class="sx-k">01 · 关键提问</p>
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
            <p class="sx-k">02 · 收敛方向</p>
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
]


def ask_card():
    qs = []
    for qid, tag, q, opts in ASK:
        o = ''.join(
            f'<label class="opt"><input type="radio" name="{qid}" value="{v}"{" checked" if j == 0 else ""}><span class="n">0{j + 1}</span><span class="t">{v}</span><span class="r" aria-hidden="true"></span></label>'
            for j, v in enumerate(opts))
        o += f'<label class="opt tbd"><input type="radio" name="{qid}" value="暂不确定"><span class="n" aria-hidden="true">?</span><span class="t">暂不确定 · 不阻塞流程</span><span class="r" aria-hidden="true"></span></label>'
        qs.append(f'<fieldset class="ask-q"><legend><span class="tag">{tag}</span>{q}</legend>{o}</fieldset>')
    return f'''<div class="ui-frame ui-card sift-ui ask" data-ask>
  <header><span class="chip-k b">1 视觉抉择</span><span class="st">待确认</span></header>
  <h4>关键视觉抉择</h4><p class="hint">对齐核心视觉取舍；未确定项可直接跳过。</p>
  {''.join(qs)}
  <div class="ask-out" aria-live="polite"><span>→ 写入视觉抉择记录</span><ul data-ask-out></ul></div>
</div>'''


def ba():
    before = ''.join(f'<li>{t}</li>' for t in [
        '1. 请问您希望这款产品在整体上呈现出怎样的风格与气…', '2. 在材料选择方面，您是否有特别偏好或需要避免的…',
        '3. 关于目标用户的年龄层、使用习惯以及…', '4. 您对色彩方案是否有初步设想，比如…', '5. 是否需要考虑品牌调性与现有产品线…'])
    return f'''<div class="ba-ui">
  <div class="ba-side before rv"><span class="ba-k">早期 · 开放式问卷（重绘）</span>
    <div class="ui-card sift-ui qlist"><ol>{before}</ol><p class="foot-k">随机 1–5 题 · 平均题干 40+ 字</p>
      </div>
    <p class="ba-note">题干长、无选项，设计师得自己组织答案。</p></div>
  <div class="ba-arrow" aria-hidden="true">→</div>
  <div class="ba-side after rv d1"><span class="ba-k">现在 · 对立选择题（可点选）</span>
    {ask_card()}
    <p class="ba-note">每轮 2–3 题，可选“暂不确定”，回答即写入记录。</p></div>
</div>'''



def card_shot(f, alt):
    return f'<div class="browser"><img class="zoom" src="{I}{f}.jpg" alt="{alt}"></div>'


def render():
    cover = HERO
    info = [('项目性质', '课程项目 · 组长（3 人小组）'),
            ('我的角色', '产品定义、交互设计、原型开发；2 位队友提供建议与资料'),
            ('时间', '2026.09 – 10 · 4 周'),
            ('工具', 'AI 编程工具 · Next.js · React Flow · DeepSeek')]
    tl = ['<b>4 周</b>把 PRD 从 v1.0 迭代到 <b>v4.0</b>，定位从“出图 AI”收敛为“判断搭档”。',
          '提问从开放式问卷，改成每轮 <b>2–3</b> 道对立选择题。',
          '终期 <b>6</b> 位新参与者测试：非设计师也能看懂方向的来由。']

    problem = '<ul class="chips"><li>意图模糊</li><li>生图幻觉</li><li>搜图无序</li><li>决策不收敛</li></ul>'

    canvas_fig = fig(f'''<div class="cv-scroll" tabindex="0" role="region" aria-label="SIFT 画布截图，可横向滚动"><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}sift-canvas-hd.jpg" alt="SIFT 画布截图：简报、视觉抉择、策略基准、风格主题、灵感检索、画面生成六张卡片连成推演链"></div></div>''',
                     '简报 → 关键提问 → 策略基准 → 风格主题 → 灵感检索 → 画面生成，连线即继承关系。', 'f-wide')
    four = '<div class="grid4">' + ''.join(
        fig(card_shot(f, f'SIFT {t}卡片截图'), t) for f, t in
        [('sift-ask-hd', '关键提问：每轮 2–3 题'), ('sift-theme-hd', '风格主题：写明继承自哪张卡'),
         ('sift-gen-hd', '画面生成：只辅助判断'), ('sift-advisor-hd', '策略顾问：多方向横向对比')]) + '</div>'
    video = fig(f'''<div class="video"><video controls playsinline preload="none" width="1920" height="1080" poster="{I}sift-launch-poster.jpg" aria-label="SIFT 演示短片，65 秒"><source src="{B}assets/video/sift-launch.mp4" type="video/mp4">你的浏览器不支持视频播放。</video></div>''',
                '65 秒演示：用另一个 Brief（冷萃茶）完整走一遍流程。')

    return head('SIFT — Leyson', 'SIFT：设计前期的 AI 视觉策略收敛智能体。课程项目，3 人小组组长。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
{case_hero('sift', '视觉策略收敛智能体', '不急着出图，<br>先帮设计师想清方向。', '给设计师用的 AI 智能体：把一句模糊的 Brief，收敛成说得清来由的视觉方向。', cover)}
{facts(info, tl)}
{chapter('01', '问题', '设计师缺的不是图，<br>而是“先判断什么”的次序。', '拿到模糊 Brief，常见 AI 工具直接给效果图。可前期真正要回答的是：最大的不确定在哪，方向从哪来。我们归纳出四个断层：', problem)}
{chapter('02', '关键判断', 'AI 负责提问和记录，<br>设计师负责拍板。', '导师评审时说“找图本身并不占优势，画布式对设计师团队更友好”。于是我把提问从问卷改成抉择：选项对立，可以跳过，回答即留痕。', fig('<div class="panel">' + ba() + '</div>', '左为早期版本的重绘示意，右为当前版本，可直接点选。'))}
{chapter('03', '设计', '一张画布：从 Brief 到方向，<br>每一步都可追溯。', '六张卡片连成推演链，每张卡写明继承自哪一步、吸纳了哪次选择、避开了哪些禁忌。', canvas_fig + four + video)}
{cuts([('长篇策略方案', '测试中没人读完，改为每轮只问 2–3 个关键问题'),
       ('生图、打样字段', '会被当成出图工具，画面只留作辅助判断'),
       ('多个 AI 对话框', '确认过的判断找不回，交互全部收进画布卡片')])}
{results('04', '流程看得懂了，<br>非设计师也能参与。', '中期测试的问题集中在文字多、流程长；终期测试中，参与者反馈流程关系更清楚，参考证据也回到了画布上。',
         [('4 周', 'PRD v1.0 → v4.0'), ('100+', '次代码提交'), ('6 位', '终期测试新参与者')],
         '“我不是设计师，但现在能理解为什么从 Brief 走到这个方向，也知道该怎么给反馈。”', 'JWY · 产品经理，终期测试参与者')}
</main>
''' + next_project('sift') + foot(B)
