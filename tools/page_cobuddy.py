from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec, cuts, tabs as _tabs
import re as _re

# Draft case study — NOT yet linked from home / work / other pagers (user reviews first).
# Rebuilt from the CoBuddy deck (19 pages, Canva): copy and diagrams are HTML/CSS;
# only photos, illustrations, sketches and renders are images (assets/img/cob-*.jpg, cropped from the PDF).
PATH = 'projects/cobuddy.html'
B = '../'
I = B + 'assets/img/'


def img(name, alt, cls='', ext='jpg'):
    c = f' class="{cls}"' if cls else ''
    return f'<img{c} src="{I}cob-{name}.{ext}" alt="{alt}">'


def fig(name, alt, title, note='', cls=''):
    return f'<figure class="fig cob-fig {cls}"><div class="cob-ph">{img(name, alt, "zoom")}</div><figcaption><b>{title}</b>{(" " + note) if note else ""}</figcaption></figure>'



def tabs(name, items, label, first=True):
    """Same as build.tabs, but A/B variants open on the first tab."""
    h = _tabs(name, items, label)
    if not first:
        return h
    n = len(items) - 1
    h = h.replace(f'id="{name}-t{n}" aria-controls="{name}-p{n}" aria-selected="true" tabindex="0"', f'id="{name}-t{n}" aria-controls="{name}-p{n}" aria-selected="false" tabindex="-1"')
    h = h.replace(f'id="{name}-t0" aria-controls="{name}-p0" aria-selected="false" tabindex="-1"', f'id="{name}-t0" aria-controls="{name}-p0" aria-selected="true" tabindex="0"')
    h = h.replace(f'id="{name}-p0" aria-labelledby="{name}-t0" tabindex="0" hidden>', f'id="{name}-p0" aria-labelledby="{name}-t0" tabindex="0">')
    h = h.replace(f'id="{name}-p{n}" aria-labelledby="{name}-t{n}" tabindex="0">', f'id="{name}-p{n}" aria-labelledby="{name}-t{n}" tabindex="0" hidden>')
    return h


def cut(name, alt, cls=''):
    """Transparent product / hand cut-out from the original deck (webp with alpha)."""
    return img(name, alt, cls, 'webp')


# ---------------------------------------------------------------- hero

def hero():
    """Slide 11 of the deck rebuilt 1:1. Every box is in the slide's own 1440×810 units
    (read from the PPTX xfrm + fillRect), so nothing drifts at any width."""
    def box(x, y, w, h=None):
        st = f'--x:{x};--y:{y};--w:{w}'
        return st + (f';--h:{h}' if h is not None else '')
    def t(x, y, w, txt, cls):
        return f'<p class="cs-t {cls}" style="{box(x, y, w)}">{txt}</p>'
    chips = ''.join([
        t(183.9, 568.5, 76, '安心材质', 'cs-ct'), t(173.4, 599.9, 96.9, '安全放心<br>呵护宝贝口腔', 'cs-cs'),
        t(344.8, 568.5, 76, '科学护龈', 'cs-ct'), t(350.5, 599.9, 64.6, '柔软刷毛<br>温和清洁', 'cs-cs'),
        t(506.9, 568.5, 76, '亲子设计', 'cs-ct'), t(504.6, 599.9, 80.7, '大小刷头<br>陪伴式刷牙', 'cs-cs')])
    return f"""
    <div class="case-visual cob-hero2 rv">
      <div class="cob-slide" role="img" aria-label="CoBuddy 亲子牙刷主视觉：儿童牙刷与家长牙刷立在展台上">
        {img('hero-bg2x', '', 'cs-bg', 'webp')}
        <span class="cs-a" style="{box(116.5, 81.0, 542.0)}">{cut('logo-co', 'Colgate CoBuddy 亲子牙刷')}</span>
        <span class="cs-a" style="{box(207.9, 188.9, 54.8)}">{cut('face', '')}</span>
        {t(89.7, 353.3, 586.2, '一刷相伴 呵护成长每一步', 'cs-h')}
        {t(238.8, 407.2, 288, '科学护齿 快乐刷牙', 'cs-s')}
        <span class="cs-a" style="{box(159.3, 458.9, 446.9, 102.9)}">{cut('hero-icons', '')}</span>
        {chips}
        <span class="cs-a" style="{box(826.0, 148.9, 164.7, 488.6)}">{cut('kid-a-hd', 'CoBuddy 儿童牙刷')}</span>
        <span class="cs-a" style="{box(1085.6, 10.0, 77.9, 702.4)}">{cut('hero-par-hero', 'CoBuddy 家长牙刷')}</span>
        <div class="cs-card" style="{box(710.3, 329.8, 140.3, 188.7)}"><svg class="cs-cardbg" viewBox="0 0 168 226" preserveAspectRatio="none" aria-hidden="true"><path d="M33 25H135Q152 25 152 42V80L161 92L152 89V186Q152 206 132 206H35Q15 206 15 186V42Q15 25 33 25Z" fill="#FDECCF"/><path d="M33 25H135Q152 25 152 42V80H15V42Q15 25 33 25Z" fill="#F4A20E"/></svg>
          <p class="cs-k1" style="--ty:27.6">儿童牙刷</p><p class="cs-k2" style="--ty:67.5">3-6岁</p><p class="cs-k3" style="--ty:107.9">小巧易握<br>硅胶保护口腔</p></div>
        <div class="cs-card flip" style="{box(1154.4, 248.0, 150.2, 175.0)}"><svg class="cs-cardbg" viewBox="0 0 168 226" preserveAspectRatio="none" aria-hidden="true"><path d="M33 25H135Q152 25 152 42V80L161 92L152 89V186Q152 206 132 206H35Q15 206 15 186V42Q15 25 33 25Z" fill="#FDECCF"/><path d="M33 25H135Q152 25 152 42V80H15V42Q15 25 33 25Z" fill="#F4A20E"/></svg>
          <p class="cs-k1" style="--ty:29.2">家长牙刷</p><p class="cs-k2" style="--ty:71.3">全面清洁</p><p class="cs-k3" style="--ty:102.4">深入清洁<br>呵护口腔健康</p></div>
      </div>
    </div>"""


def adult_vs_kid():
    return """
    <div class="cob-vs rv">
      <div class="cob-vs-c"><p class="eyebrow px">Adult logic</p><h4>成人牙刷逻辑</h4><ul><li>细长工具形态</li><li>三指精细捏握</li><li>精细动作控制</li><li>要求儿童适应工具</li></ul></div>
      <div class="cob-vs-ar" aria-hidden="true"><span>从成人工具缩小</span><b>→ 儿童动作适配</b></div>
      <div class="cob-vs-c on"><p class="eyebrow px">Kid reality</p><h4>儿童真实能力</h4><ul><li>掌心包握为主</li><li>动作不稳定</li><li>方向感弱</li><li>需要成人支持</li></ul></div>
    </div>"""


def essence():
    items = [('01 · 身体本质', '儿童不是小号成人', '手部尺度、握持方式、力量分布与动作精度都不同于成人。'),
             ('02 · 动作本质', '不是不愿意，是控制不了', '握不稳、控不准、刷不干净，带来挫败与抗拒，而非主观懒惰。'),
             ('03 · 成长本质', '不是替代完成，是支持参与', '目标不是代替孩子刷得更好，而是帮他在参与中逐步建立能力：不会刷 → 被代刷 → 逐步学会刷。'),
             ('04 · 情境本质', '不是单人工具，是亲子协同', '儿童刷牙常处于亲子共同参与的真实情境中，工具需要同时回应双方需求。')]
    return '<div class="cards cob-cards" style="--c:2">' + ''.join(
        f'<div class="card rv d{i}"><span class="n px">{a}</span><h4>{b}</h4><p>{c}</p></div>' for i, (a, b, c) in enumerate(items)) + '</div>'


def strip():
    items = [('简单操作', '能自己完成挤牙膏、沾水等动作，说明手柄易抓握、易操作。'),
             ('主动拿握', '能够自主拿起牙刷并握住，愿意参与刷牙。'),
             ('刷牙姿态自然', '刷头入口角度多靠手腕与前臂带动，动作幅度较大。'),
             ('站立刷牙为主', '多为站立姿态，手肘抬起，手腕主导刷头运动。'),
             ('掌心包握为主', '多数儿童采用拳握或掌心包握，而非精细三指捏握。')]
    out = ''.join(f'<li class="rv d{min(i,3)}"><div class="cob-ph">{img(f"grip-{i+1}", "3–6 岁儿童日常刷牙：" + t, "zoom")}</div><span class="cob-no px">{i+1:02d}</span><b>{t}</b><p>{d}</p></li>' for i, (t, d) in enumerate(items))
    return f'<ol class="cob-strip">{out}</ol>'


def grip_ab():
    b = [('靠近刷柄中段', '多数在中后段区域握持。'), ('握持位置不固定', '会随手型大小、习惯和刷牙动作变化。'), ('手柄末端露出较长', '尾部部分露出，放大手腕摆动幅度。')]
    bs = ''.join(f'<figure><div class="cob-ph">{img(f"gripb-{i+1}", "儿童握持位置观察：" + t, "zoom")}</div><figcaption><b>{t}</b>{d}</figcaption></figure>' for i, (t, d) in enumerate(b))
    return f'''
    <div class="cob-ab rv">
      <div class="cob-ab-a">
        <p class="cob-k">A · 握持方式</p>
        <div class="cob-anno">{img('grip-hand', '儿童握牙刷的手部示意：拇指压在一侧，四指环抱，掌心包裹')}
          <ul><li><b>拇指压在一侧</b>提供方向感</li><li><b>四指环抱</b>提供主要握持力</li><li><b>掌心包裹</b>增加稳定性</li></ul></div>
        <p class="cob-fn">以掌心和四指包裹手柄，依靠手腕带动刷牙。</p>
      </div>
      <div class="cob-ab-b"><p class="cob-k">B · 握持位置</p><div class="cob-three">{bs}</div></div>
      <div class="cob-ab-c">
        <p class="cob-k">观察结论</p>
        <ul class="cob-dots"><li>儿童能主动握住牙刷，但多以拳握 / 掌心包握为主，控制精度有限。</li><li>刷牙动作主要由手腕和前臂带动，精细控制不足。</li><li>成人比例的细长牙刷会增加控制力矩，导致旋转、滑移与刷头角度偏移。</li></ul>
        <p class="cob-tip"><i aria-hidden="true">✦</i>设计启示：需要明确的主握区，引导手自然落位。</p>
      </div>
    </div>'''


def chain():
    steps = ['控制力弱', '清洁不到位', '家长被迫代刷', '参与感低', '抵触刷牙']
    s = ''.join(f'<li>{x}</li>' for x in steps)
    return f'''<div class="cob-chain rv"><p class="cob-k">核心总结</p><ol>{s}</ol>
      <p class="cob-q"><em class="px">Design opportunity</em>如何让儿童能稳定控制刷牙动作，同时让家长自然辅助而非替代，提升清洁效果与体验？</p></div>'''


# ---------------------------------------------------------------- 02 insight

def parent_obs():
    obs = [('pc-1', '儿童以掌心包握为主，依赖手柄体积建立稳定控制。'), ('pc-2', '家长从外侧覆盖儿童手背，提供方向与力度的辅助。'), ('pc-3', '双手形成内外两层控制，共同修正牙刷方向与节奏。')]
    o = ''.join(f'<li class="rv d{i}"><div class="cob-ph">{img(n, "亲子辅助刷牙场景照片", "zoom")}</div><p>{t}</p></li>' for i, (n, t) in enumerate(obs))
    return f'''<ol class="cob-obs">{o}</ol>
    <div class="cob-sch rv">{img('pc-grip', '亲子辅助握持方式示意：儿童握住刷柄前段，家长的手在后段从外侧稳定辅助')}
      <div><p class="cob-k">亲子辅助握持方式 · 示意</p><p>儿童前段主握，家长后段稳定辅助：同一根手柄上形成亲子协同控制，提供稳定支持与正确引导。</p></div></div>'''


def pivot():
    return '''<div class="cob-pivot rv">
      <div class="cob-egg"><p>儿童不是不会握，<br>而是握住后<b>难以稳定控制</b>。</p><hr><p>家长不是不能帮，<br>而是<b>缺少自然辅助介入点</b>。</p></div>
    </div>'''


def opp():
    items = [('i-hand', '儿童主握', '从被动配合', '主动参与'), ('i-family', '家长稳定辅助', '从代替刷牙', '稳定儿童手部动作'), ('i-shield', '刷柄承接', '从单人工具', '亲子协同界面')]
    return '<ol class="cob-opp">' + ''.join(
        f'<li class="rv d{i}">{cut(ic, "")}<span class="cob-no px">{i+1:02d}</span><h4>{a}</h4><p><s>{b}</s><b>→ {c}</b></p></li>' for i, (ic, a, b, c) in enumerate(items)) + '</ol>'

# ---------------------------------------------------------------- 04 design

def otter():
    return f'''<div class="cob-otter rv">
      <div class="cob-otter-big cob-ph">{img('otter-1', '海獭妈妈仰躺在水面，把幼崽托在腹部', 'zoom')}<span class="cob-tag">母体承托</span></div>
      <div class="cob-otter-s cob-ph">{img('otter-2', '海獭幼崽安置于母亲腹部中央', 'zoom')}<span class="cob-tag">环抱负形</span></div>
      <div class="cob-otter-s cob-ph">{img('otter-3', '海獭圆耳、小眼、短胡须的面部特征', 'zoom')}<span class="cob-tag">五官特征</span></div>
      <div class="cob-extract"><p class="cob-k">设计提取</p><p>把海獭妈妈怀抱幼崽的自然姿态，转译为牙刷造型语言。</p>
        <div class="cob-shapes"><figure>{img('shape-front', '造型提取：正面环抱')}<figcaption>正面环抱</figcaption></figure><figure>{img('shape-side', '造型提取：侧面环抱')}<figcaption>侧面环抱</figcaption></figure></div></div>
    </div>
    <div class="cob-map rv">
      <div><b>母体承托</b><span>→</span><b>手掌包裹的握柄</b></div>
      <div><b>幼崽在腹部中央</b><span>→</span><b>掌心落位的主握区</b></div>
      <div><b>圆耳 · 小眼 · 短胡须</b><span>→</span><b>柔和、有安全感的五官</b></div>
    </div>'''


def details():
    d = [('可爱五官造型', '圆耳、小眼、短胡须，传递柔和与安全感。'), ('硅胶包裹刷头', '柔软包裹，保护口腔，安全不伤牙龈。'), ('环抱握持结构', '母体环抱形态，贴合儿童手掌，握持稳定。')]
    return f'''<div class="cob-det rv">{img('details', '细节特征：五官造型、硅胶包裹刷头、环抱握持结构', 'zoom')}
      <div class="cards" style="--c:3">{"".join(f'<div class="card"><span class="n px">Detail {i+1:02d}</span><h4>{a}</h4><p>{b}</p></div>' for i, (a, b) in enumerate(d))}</div></div>'''


def sketch_kid():
    it = ''.join(f'<li>{cut(f"iter-{i}", f"海獭造型迭代第 {i} 轮")}<span class="px">V{i}</span></li>' for i in range(1, 6))
    return f"""
    <p class="sub-h rv gap-top">手绘草图 · 儿童款</p>
    <p class="rv">以海獭妈妈怀抱幼崽的姿态为原型，通过多角度与细节草图，探索造型结构、握持体验与刷头形态。</p>
    <div class="cob-iter rv">
      <div class="cob-iter-l"><p class="cob-k">造型迭代</p><ol>{it}</ol><p class="cob-fn">五轮造型迭代：从侧身逐步转向正面环抱，轮廓收圆，中间的负形留给手指落位。</p></div>
      <div class="cob-iter-r"><p class="cob-k">造型概念</p>{cut('concept', '造型概念：母体包裹，幼崽置于腹部中央')}<p class="cob-fn">母体包裹，幼崽置于腹部中央，形成天然保护感与陪伴姿态。</p></div>
    </div>
    <div class="cob-pair rv">
      <figure class="cob-fig"><div class="cob-stage">{cut('kid3v-a', '儿童款 A 正面环抱款三视图')}</div><figcaption><b>A · 正面环抱款</b>三视图：正面、侧面、背面</figcaption></figure>
      <figure class="cob-fig"><div class="cob-stage">{cut('kid3v-b', '儿童款 B 侧面环抱款三视图')}</div><figcaption><b>B · 侧面环抱款</b>三视图：正面、侧面、背面</figcaption></figure>
    </div>
    {details()}"""


def sketch_parent():
    return f"""
    <p class="sub-h rv gap-top">手绘草图 · 家长牙刷</p>
    <p class="rv">家长款以辅助控制为核心：延长刷柄与稳定握持结构，帮助家长在亲子协同刷牙中完成方向引导。尾端延续海獭幼崽的造型，和儿童款放在一起就是一对母子。</p>
    <div class="cob-pair rv">
      <figure class="cob-fig"><div class="cob-stage tan">{cut('par3v-a', '家长款 A 三视图，左侧附儿童款作比例参考')}</div><figcaption><b>A · 正面款</b>左侧小牙刷为儿童款，作比例参考</figcaption></figure>
      <figure class="cob-fig"><div class="cob-stage tan">{cut('par3v-b', '家长款 B 三视图，左侧附儿童款作比例参考')}</div><figcaption><b>B · 侧面款</b>延长刷柄，便于从外侧稳定辅助</figcaption></figure>
    </div>"""

# ---------------------------------------------------------------- 05 outcome

def renders():
    kid = tabs('rk', [('A 正面环抱', 'Front hug', f'<div class="cob-render">{cut("rkid-a", "儿童款 A 正面环抱款产品渲染：正面、侧面、背面")}</div>'),
                      ('B 侧面环抱', 'Side hug', f'<div class="cob-render">{cut("rkid-b", "儿童款 B 侧面环抱款产品渲染：正面、侧面、背面")}</div>')], '儿童款方案')
    par = tabs('rp', [('A 正面款', 'Front', f'<div class="cob-render cob-render-p">{cut("par-a", "家长款 A 正面渲染")}{cut("rpar-a-side", "家长款 A 侧面与背面渲染")}{cut("kid-a", "儿童款，作比例参考", "cob-ref")}</div>'),
                      ('B 侧面款', 'Side', f'<div class="cob-render cob-render-p">{cut("par-b", "家长款 B 正面渲染")}{cut("rpar-b-side", "家长款 B 侧面与背面渲染")}{cut("kid-b", "儿童款，作比例参考", "cob-ref")}</div>')], '家长款方案')
    return f"""
    <div class="cob-spec rv">
      <div><p class="eyebrow px">Kid · 3–6 岁</p><h4>儿童牙刷</h4><p>小巧易握，环抱式握柄贴合小手掌；软硅胶保护口腔。</p></div>
      <div><p class="eyebrow px">Parent</p><h4>家长牙刷</h4><p>流线把手设计，舒适稳定、控制自如；全面清洁，深入呵护口腔健康。</p></div>
    </div>
    <p class="sub-h rv gap-sm">产品渲染 · 儿童款</p>
    {kid}
    <p class="sub-h rv gap-sm">产品渲染 · 家长款</p>
    {par}
    <p class="cob-fn rv">右侧小牙刷为儿童款，作比例参考。</p>"""


def hold():
    return f"""
    <p class="sub-h rv gap-top">握持展示</p>
    <p class="rv">专为亲子协同刷牙设计：儿童易握，家长辅助更轻松。</p>
    <div class="cob-hold rv">
      <figure class="cob-hold-f">{cut('hold-family', '妈妈在身后陪女儿刷牙')}<figcaption><b>亲子协同</b>孩子主握，家长在旁稳定辅助。</figcaption></figure>
      <figure>{cut('hold-kid', '小手握住 CoBuddy 儿童款，四指落在海獭环抱的负形里')}<figcaption><b>3–6 岁儿童握持</b>贴合小手掌，易握稳，能自主。</figcaption></figure>
      <figure>{cut('hold-adult', '成人手握 CoBuddy 家长款')}<figcaption><b>成人握持</b>流线把手，舒适稳定，控制自如。</figcaption></figure>
    </div>
    <p class="sub-h rv gap-top">组合展示</p>
    <p class="rv">家长牙刷的尾端是一只海獭宝宝，正好嵌进儿童牙刷的环抱里：两支牙刷收纳时合成“妈妈抱着宝宝”，用起来再分开。</p>
    <div class="cob-slide cob-combo2 rv" role="img" aria-label="组合展示：家长牙刷尾端的海獭宝宝嵌入儿童牙刷的环抱握柄，A、B 两款各一组">
        <span class="cs-r" style="--x:47.3;--y:-208.6;--w:625.1;--h:788.5;--r:0deg">{cut('cb-kid-a', '')}</span>
        <span class="cs-r" style="--x:-36.1;--y:231.8;--w:782.6;--h:1391.3;--r:180deg">{cut('cb-par-a', '')}</span>
        <span class="cs-r" style="--x:294.9;--y:-208.6;--w:627.4;--h:790.9;--r:0deg">{cut('cb-kid-b', '')}</span>
        <span class="cs-r" style="--x:221.2;--y:221.6;--w:775.6;--h:1378.8;--r:180deg">{cut('cb-par-b', '')}</span>
        <span class="cs-r" style="--x:832.9;--y:127.2;--w:529.6;--h:668.1;--r:270deg">{cut('cb-kid-a', '')}</span>
        <span class="cs-r" style="--x:1394.7;--y:-124.3;--w:663.1;--h:1178.9;--r:90deg">{cut('cb-par-a', '')}</span>
        <span class="cs-r" style="--x:832.9;--y:-84.5;--w:531.6;--h:670.1;--r:270deg">{cut('cb-kid-b', '')}</span>
        <span class="cs-r" style="--x:1383.8;--y:-333.9;--w:657.1;--h:1168.2;--r:90deg">{cut('cb-par-b', '')}</span>
        <svg class="cs-line" viewBox="0 0 1440 810" aria-hidden="true"><line x1="867.2" y1="524.6" x2="922.6" y2="620.6" stroke="#CEAA8F" stroke-width="2.25" stroke-dasharray="0 6" stroke-linecap="round"/><circle cx="867.2" cy="524.6" r="4" fill="#CEAA8F"/><circle cx="922.6" cy="620.6" r="4" fill="#CEAA8F"/></svg>
        <p class="cs-t cs-note" style="--x:838.1;--y:640.6;--w:258.5">软硅胶保护儿童口腔安全</p>
    </div>
    <p class="quote rv gap-top">一刷相伴，呵护成长每一步。</p>"""

# ---------------------------------------------------------------- page

def render():
    s1 = f'''
    <h3 class="rv">孩子握得住牙刷，<br>却<span class="hl">控制不住</span>刷牙。</h3>
    <p class="rv">儿童牙刷的本质，不应只被理解为“清洁牙齿的工具”。对孩子而言，刷牙同时是身体控制、自我照护与日常习惯建立的过程。我从本质主义视角出发，重新思考工具如何支持儿童完成动作，而不是要求儿童适应成人工具。</p>
    {adult_vs_kid()}
    {essence()}
    <p class="sub-h rv gap-top">握持观察：孩子真实刷牙时怎么握？</p>
    <p class="rv">观察 3–6 岁儿童的日常刷牙动作，分析握持方式、手部姿态与控制特点，为牙刷的体量、截面与握持区设计提供依据。</p>
    {strip()}
    {grip_ab()}
    {chain()}'''

    s2 = f'''
    <h3 class="rv">真正的问题不是孩子不会握，<br>而是握住后<span class="hl">无法稳定</span>完成动作。</h3>
    <p class="rv">再观察家长参与的刷牙：孩子掌心包握，家长从外侧覆盖孩子手背。两只手落在同一根手柄上，形成内外两层控制，这是现有牙刷从没为它设计过的动作。</p>
    {parent_obs()}
'''

    s3 = f'''
    <h3 class="rv">从工具加法，<br>到亲子协同。</h3>
    <p class="rv">不是让牙刷更大，而是让儿童与家长更稳定地共同控制。现有产品多在工具本身做加法，问题依然存在：它们只优化了牙刷作为“单人工具”的可用性，没有重构亲子刷牙时的协同关系。</p>
    {cuts([('旧方向 01', '加粗手柄', '握得住，但入口笨重，灵活性下降。', '环抱式主握区：体积留给掌心，刷头一端保持纤细灵活。'),
           ('旧方向 02', '加防滑材料', '增摩擦，但方向仍不清晰。', '用海獭造型本身指示握持方向，手自然落位。'),
           ('旧方向 03', '加安全附件', '降低风险，但结构复杂，增加工具负担。', '软硅胶包裹刷头，保护集成进形态里。')])}
    {pivot()}
    <p class="sub-h rv gap-sm">新机会：亲子协同关系</p>
    <p class="rv">重新定义儿童、家长与牙刷之间的协同关系，实现参与感、控制力与清洁效果的平衡。</p>
    {opp()}'''

    s4 = f'''
    <h3 class="rv">海獭妈妈抱着幼崽，<br>就是“孩子主握、家长辅助”。</h3>
    <p class="rv">灵感来自海獭妈妈温柔环抱幼崽的姿态，把爱与陪伴融入每一次刷牙体验。</p>
    {otter()}
    {sketch_kid()}
    {sketch_parent()}'''

    s5 = f'''
    <h3 class="rv">一对牙刷，<br>一个“儿童主握、家长辅助”的动作。</h3>
    <p class="rv">儿童款负责“握得稳”，家长款负责“扶得准”。两支牙刷沿用同一套海獭造型语言，放在一起就是一对母子。</p>
    {renders()}
    {hold()}'''

    return head('CoBuddy 亲子牙刷 — Leyson', 'CoBuddy 亲子牙刷：广州美术学院 × 高露洁校企合作课程项目。让 3–6 岁孩子握得稳，让家长辅助而不代替。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case cob">
<section class="case-hero theme-cob">
  <div class="wrap">
    {crumb('CoBuddy')}
    <p class="case-id px rv"><img src="{I}logo-cobuddy.png" alt="">CoBuddy 亲子牙刷 · 04 / 04</p>
    <h1 class="rv cjk">不是把牙刷变可爱，<br>而是让孩子握得稳。</h1>
    <p class="sub rv d1">为 3–6 岁儿童和家长设计的一对亲子牙刷：孩子主握，家长从外侧稳定辅助，而不是抢过牙刷代刷。</p>
    {meta([('Role', '研究 · 造型 · 草图 · 渲染'), ('Team', '独立完成'), ('Timeline', '约 2 个月 · 2026'), ('Context', '广美 × 高露洁 校企合作'), ('Output', '儿童款 + 家长款 · 两套方案')])}
{hero()}
  </div>
</section>

{tldr([('Problem · 问题', '3–6 岁孩子握得住牙刷，却控制不稳；家长只能抢过来代刷，孩子越来越抗拒。'), ('My role · 我的角色', '约 2 个月独立完成：握持观察、问题定义、造型提取、手绘草图到产品渲染。'), ('Key decision · 关键判断', '不在工具上做加法，而是把刷柄设计成亲子协同的界面：孩子主握，家长辅助。'), ('Outcome · 结果', '海獭环抱造型的儿童款 + 家长款，正面 / 侧面两套方案，完成草图、渲染与握持展示。')])}
{toc([('problem', '01', '问题', 'Problem'), ('insight', '02', '洞察', 'Insight'), ('decision', '03', '判断', 'Decision'), ('design', '04', '设计', 'Design'), ('outcome', '05', '结果', 'Outcome')])}
{sec('problem', '01', '问题', 'Problem', s1)}
{sec('insight', '02', '洞察', 'Insight', s2, 'tint-cob')}
{sec('decision', '03', '判断', 'Decision', s3)}
{sec('design', '04', '设计', 'Design', s4, 'tint-cob')}
{sec('outcome', '05', '结果', 'Outcome', s5)}
</main>
''' + pager('cobuddy') + foot(B)


if __name__ == '__main__':
    import sys
    from build import write
    sys.dont_write_bytecode = True
    write(PATH, render())
