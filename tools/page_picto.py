from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec, metrics

PATH = 'projects/picto.html'
B = '../'
I = B + 'assets/img/'

# ---------------------------------------------------------------- pixel characters (Picto's own product characters)
# Sampled cell-by-cell from assets/img/picto-after.jpg by tools/extract_picto_sprites.py
# (top = 小满 the tabby cat, bottom = 阿澈 the dog). Re-run that script and paste if the art changes.
CAT = [
    '...a......a...',
    '..bcb....bcb..',
    '..bbbabababb..',
    '..bbbbbabbbb..',
    '..bbbbbbbbbb..',
    '..bbbbbbbbbb..',
    '..bbdebbdebb..',
    '..bbeebbeebb..',
    'aabbbfggfbbbaa',
    '..chhhhhhhhc..',
    '.abbhhhbbbbba.',
    '...bhhhffbbba.',
    '...bbffffbbbb.',
    '...bbffffbbbb.',
    '...bbffffbbbb.',
    '...bbbbbbbb...',
    '...aab..baa...',
]
CAT_PAL = {'a': '#895433', 'b': '#C6854E', 'c': '#ED9CA6', 'd': '#FCFCFC', 'e': '#2D2422', 'f': '#F0C799', 'g': '#B75C68', 'h': '#E2696D'}

DOG = [
    '...a......a...',
    '..ab......ba..',
    '..aaaaccaaaa..',
    '..aaaaccaaaa..',
    '..aaaaaaaaaa..',
    '..aacdaacdaa..',
    '..aaddaaddaa..',
    '..aaddaaddaa..',
    '..aaacddcaaa..',
    '..effffffffe.g',
    '..aafffaaaaaag',
    '...afffcccaaa.',
    '...acccccca...',
    '...acccccca...',
    '...acccccca...',
    '...aaaaaaaa...',
    '...gga..agg...',
]
DOG_PAL = {'a': '#D49864', 'b': '#F8AAB9', 'c': '#F7F3E9', 'd': '#2C2C2C', 'e': '#FCD1A6', 'f': '#E16A6E', 'g': '#AC7249'}

SPRITES = {'cat': (CAT, CAT_PAL), 'dog': (DOG, DOG_PAL)}


def sprite_svg(kind='cat', cls='cat'):
    grid, pal = SPRITES[kind]
    rects = ''.join(f'<rect x="{x}" y="{y}" width="1" height="1" fill="{pal[ch]}"/>'
                    for y, row in enumerate(grid) for x, ch in enumerate(row) if ch != '.')
    return f'<svg class="{cls}" viewBox="0 0 {len(grid[0])} {len(grid)}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">{rects}</svg>'


def cat_svg(cls='cat'):
    return sprite_svg('cat', cls)


# ---------------------------------------------------------------- recreated UI: status picker + home (picto-status.jpg, picto-home.jpg)
MOODS = [('开心', '#F7C948'), ('平静', '#8FD3BE'), ('有点累', '#A9C3E8'), ('想你', '#F2A7B0'), ('难过', '#7F9CC0'),
         ('生气', '#E4483F'), ('有点不安', '#A08BD6'), ('困了', '#4E5D73'), ('兴奋', '#F59A4A'), ('想安静', '#D9CBB8')]
DOING = ['学习', '工作', '玩游戏', '吃饭', '睡觉', '通勤', '散步', '看电影', '听歌', '发呆', '和朋友一起', '休息充电']
PREFS = [('可以联系', '#7CC3A6'), ('晚点回复', '#F5C26B'), ('需要一点空间', '#E8654F'), ('只想被看见', '#F4F1EC')]


def heart(c):
    return f'<svg class="hrt" viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" fill="{c}" stroke="#29231F" stroke-width=".35"/></svg>'


def picker():
    m = ''.join(f'<label class="pk mood"><input type="radio" name="mood" value="{n}" data-c="{c}"{" checked" if n == "有点累" else ""}><span class="face" style="--fc:{c}" aria-hidden="true"><i></i></span><span>{n}</span></label>' for n, c in MOODS)
    d = ''.join(f'<label class="pk"><input type="radio" name="doing" value="{n}"{" checked" if n == "休息充电" else ""}><span>{n}</span></label>' for n in DOING)
    p = ''.join(f'<label class="pk pref"><input type="radio" name="pref" value="{n}" data-c="{c}"{" checked" if n == "只想被看见" else ""}>{heart(c)}<span>{n}</span></label>' for n, c in PREFS)
    return f'''<div class="ui-card picto-ui pk-card">
  <h4>现在的我</h4><p class="hint">正在为 小满 更新 · 仅保存在当前设备</p>
  <fieldset><legend>心情 <span data-sel="mood">已选 · 有点累</span></legend><div class="pk-grid g5">{m}</div></fieldset>
  <fieldset><legend>正在做什么 <span data-sel="doing">已选 · 休息充电</span></legend><div class="pk-grid g4">{d}</div></fieldset>
  <fieldset><legend>联系偏好 <span data-sel="pref">已选 · 只想被看见</span></legend><div class="pk-grid g2">{p}</div></fieldset>
</div>'''


def home_phone():
    return f'''<div class="ui-phone picto-ui home" aria-label="伴侣首页预览：随左侧选择实时更新">
  <div class="hm-top"><div><b>小满 的片刻</b><span>当前角色：阿澈 · 本地演示</span></div><span class="sw">切换角色</span></div>
  <div class="dev">
    <div class="dev-h"><span><i></i>小满 · 本地状态</span><span class="ago">{heart('#E8654F')}刚刚</span></div>
    <div class="scr" data-scr>
      <span class="badge b1">表情 <b data-o="mood">有点累</b></span><span class="badge b2">场景 <b data-o="doing">休息充电</b></span>
      {cat_svg()}
      <p class="bub">「回家啦，晚霞很好看」</p>
    </div>
  </div>
  <div class="st-card" aria-live="polite"><p class="sent" data-o="sent">小满现在有点累，正在休息充电。</p><p class="pl"><span data-o="heart">{heart('#F4F1EC')}</span><span data-o="pline">看见就好，不必开启聊天。</span></p><p class="upd">更新于 刚刚</p></div>
  <div class="mo"><span class="ph" aria-hidden="true"></span><div><b>下班路上的晚霞</b><span>刚刚</span></div></div>
  <nav class="tb" aria-hidden="true"><span class="on">首页</span><span>设置状态</span><span>拍一片刻</span><span>留一句</span><span>片刻墙</span></nav>
</div>'''


# ---------------------------------------------------------------- hero: the two characters and what each one sees
# 小满 = the tabby cat, 阿澈 = the dog, both on-model from picto-after.jpg. Sentences follow the demo's own rule
# ("<名字>现在<心情>，正在<活动>。" / pref line), so nothing here is new copy.


def hero_side(who, cls, kind, mood, mc, doing, pref, pc, line):
    return f'''<div class="px-side {cls}">
            <div class="px-bub"><p class="px-who"><i></i>{who} · 刚刚更新</p><p class="px-sent">{who}现在{mood}，正在{doing}。</p>
              <p class="px-tags"><span><span class="face" style="--fc:{mc}"><i></i></span>{mood}</span><span>{doing}</span><span>{heart(pc)}{pref}</span></p>
              <p class="px-pl">{line}</p></div>
            <div class="px-char" style="--mc:{mc}">{sprite_svg(kind, 'cat ' + kind)}<span class="px-shadow"></span></div>
          </div>'''


def hero():
    left = hero_side('小满', 'l', 'cat', '有点累', '#A9C3E8', '休息充电', '只想被看见', '#F4F1EC', '看见就好，不必开启聊天。')
    right = hero_side('阿澈', 'r', 'dog', '开心', '#F7C948', '通勤', '可以联系', '#7CC3A6', '联系偏好：可以联系')
    return f'''
    <div class="case-visual px-visual rv">
      <div class="px-stage" role="img" aria-label="Picto 示意：像素猫小满与像素狗阿澈，各自头顶是对方能看到的状态卡（心情、正在做、联系偏好），中间是一句会自动退出首页的留言">
        <div class="px-scene picto-ui" aria-hidden="true">
          {left}
          <div class="px-mid">
            <div class="px-note"><p class="px-nk">留一句 · 首页显示 3 小时</p><p>「晚点找你，给你看今天的晚霞」</p></div>
            <div class="px-path"><i></i><i></i><i></i>{heart('#F0687F')}<i></i><i></i><i></i></div>
            <p class="px-flag">不显示在线 · 已读 · 送达</p>
          </div>
          {right}
          <div class="px-floor"></div>
        </div>
      </div>
    </div>'''


def note_card():
    durs = ['30 分钟', '1 小时', '3 小时', '不自动消失']
    r = ''.join(f'<label class="pk"><input type="radio" name="dur" value="{d}"{" checked" if d == "3 小时" else ""}><span>{d}</span></label>' for d in durs)
    return f'''<div class="ui-card picto-ui note-card" data-note>
  <h4>留一句</h4>
  <label class="nt"><span class="sr">短句内容</span><input type="text" maxlength="30" value="晚点找你，给你看今天的晚霞" data-note-in><span class="cnt px" data-note-cnt>13/30</span></label>
  <fieldset><legend>首页显示时长</legend><div class="pk-grid g4">{r}</div></fieldset>
  <ol class="life"><li><b>现在</b><span>留在首页 · <span data-note-dur>3 小时</span></span></li><li><b>到期</b><span>退出首页，不把关心变成长期提醒</span></li><li><b>之后</b><span>和照片一起，按时间进入片刻墙</span></li></ol>
</div>'''


def lang_rows(rows):
    return '<div class="lang">' + ''.join(
        f'<div class="lr rv"><span class="old"><s>{a}</s></span><span class="ar" aria-hidden="true">→</span><span class="new">{b}</span><p>{c}</p></div>'
        for a, b, c in rows) + '</div>'


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
    <h3 class="rv">拆开“表达、看见、回应”，<br>让它们不必同时发生。</h3>
    <blockquote class="pull rv picto-pull"><p>“我想让你知道我此刻怎样，但不一定想开启一段对话。”</p><cite class="px">Design hypothesis · 设计起点，不把个人经验包装成用户研究结论</cite></blockquote>
    <div class="spectrum rv" aria-label="沉默、Picto 与即时聊天的位置">
      <div><b>沉默</b><span>对方未必感知到</span></div>
      <div class="on"><b>Picto</b><span>让当下先被看见</span></div>
      <div><b>即时聊天</b><span>可能形成回复压力</span></div>
    </div>
    <p class="sub-h rv gap-sm">前人研究给了三个启示</p>
    <div class="cards" style="--c:3">
      <div class="card rv"><span class="n px">CHI 2006 · Kaye</span><h4>极简信号也能承载亲密</h4><p>异地情侣只能互相发送“一比特”点击，却会结合情境读出丰富含义。<b>→ 状态不必写成长消息。</b></p></div>
      <div class="card rv d1"><span class="n px">CHI 2022 · Read receipts</span><h4>已读回执制造压力</h4><p>接收方感到必须回复，发送方则期待即时回应。<b>→ 不做在线、已读与送达回执。</b></p></div>
      <div class="card rv d2"><span class="n px">JSPR 2021 · n=647</span><h4>回应仍然重要</h4><p>更频繁、回应性更强的联系与更高的关系满意度相关。<b>→ 回应可以轻到一句“我看见了”。</b></p></div>
    </div>'''

    s3 = f'''
    <h3 class="rv">三个原则，约束所有功能与表达。</h3>
    <div class="notes">
      <div class="card rv"><span class="n px">01</span><h4>看见，不等于打扰。</h4><p>状态先于消息，让关心可以停在“我知道了”。</p></div>
      <div class="card rv d1"><span class="n px">02</span><h4>不回应，也被允许。</h4><p>联系偏好直接可见，不用让沉默承担解释成本。</p></div>
      <div class="card rv d2"><span class="n px">03</span><h4>温柔，但操作必须清楚。</h4><p>情感留给标题与角色，按钮和反馈直接说明结果。</p></div>
    </div>
    <p class="sub-h rv gap-top">功能语言和情感语言分开：每个词都对应真实能力</p>
    {lang_rows([('配对成功', '本地双人体验已建立', '说明这是同一浏览器里的角色模拟。'), ('在线 · 电量 72%', '刚刚更新 · 看见就好', '只呈现用户主动表达的状态与边界。'), ('消息已送达', '已保存到当前设备', '反馈与真实存储范围完全一致。')])}
    <p class="sub-h rv gap-top">规则是刻意的选择：为什么现在不用生成式 AI</p>
    <div class="cards" style="--c:3">
      <div class="card rv"><span class="n px">01</span><h4>可预测</h4><p>同样的选择，永远得到同样的状态句。</p></div>
      <div class="card rv d1"><span class="n px">02</span><h4>不代替表达</h4><p>情绪由本人选择，系统不推断、不放大。</p></div>
      <div class="card rv d2"><span class="n px">03</span><h4>留在本地</h4><p>心情与活动不上传，不需要账号。</p></div>
    </div>'''

    s4 = f'''
    <h3 class="rv">“智能”来自可解释的状态映射。</h3>
    <p class="rv">心情 10 种 × 正在做 12 种 × 联系偏好 4 档。心情决定表情，活动决定场景，偏好把边界直接说出来。试着在左边换一组，看右边伴侣看到什么。</p>
    <figure class="fig wide rv"><div class="picto-demo" data-picto>{picker()}{home_phone()}</div>
      <figcaption><span class="fn px">Fig. 01</span><b>设置状态 → 伴侣首页</b>按原型界面重建，选项与原型一致。状态由本人选择，系统只组合已知输入，不推断情绪。</figcaption></figure>

    <div class="feat gap-top">
      <figure class="fig rv">{note_card()}<figcaption><span class="fn px">Fig. 02</span><b>留一句</b>30 字以内；时长只控制首页显示，到期后留在片刻墙。</figcaption></figure>
      <div class="rv d1">
        <p class="eyebrow px">Flow · 六步双角色交接</p>
        <h3 class="h-sm">从表达，到看见，<br>再到留存。</h3>
        <ol class="steps">
          <li><div><b>表达当下</b><span>心情、活动与联系偏好。</span></div></li>
          <li><div><b>状态代理</b><span>像素姿态与状态句同步更新。</span></div></li>
          <li><div><b>切换视角</b><span>同一设备模拟两端。</span></div></li>
          <li><div><b>看见对方</b><span>姿态、状态句与边界。</span></div></li>
          <li><div><b>轻量回应</b><span>短句时长可选。</span></div></li>
          <li><div><b>留下片刻</b><span>照片与短句进入片刻墙；相机不可用时改用本地图片，流程不中断。</span></div></li>
        </ol>
      </div>
    </div>

    <div class="refs gap-top rv">
      <p class="eyebrow px">Original screens · 原型截图</p>
      <div class="refs-row">
        <figure class="fig"><div class="phone"><img class="zoom" src="{I}picto-polaroid.jpg" alt="Picto 原型截图：拍一片刻"></div><figcaption><span class="fn px">Fig. 03</span><b>拍一片刻</b></figcaption></figure>
        <figure class="fig"><div class="phone"><img class="zoom" src="{I}picto-wall.jpg" alt="Picto 原型截图：片刻墙"></div><figcaption><span class="fn px">Fig. 04</span><b>片刻墙</b>短句离开首页，留在这里。</figcaption></figure>
      </div>
    </div>'''

    s5 = f'''
    <h3 class="rv">四次关键迭代，让作品更诚实。</h3>
    <div class="iter">
      <div class="it rv"><span class="px">7/31 初版</span><span class="u old">ONLINE · 100%</span><span class="ar" aria-hidden="true">→</span><span class="u new">刚刚更新</span><p>不再暗示没有实现的在线与电量。</p></div>
      <div class="it rv d1"><span class="px">7/31 初版</span><span class="u old">打扰状态</span><span class="ar" aria-hidden="true">→</span><span class="u new">四档联系偏好</span><p>两列排布，保存按钮不再遮挡选项。</p></div>
      <div class="it rv d2"><span class="px">7/31 初版</span><span class="u old">一直显示</span><span class="ar" aria-hidden="true">→</span><span class="u new">不自动消失</span><p>明确时长只控制首页显示。</p></div>
    </div>
    <div class="two gap-sm">
      <div class="ba keep2">
        <figure class="fig rv"><span class="tag">Before · 扁平方脸参考</span><div class="stage tight"><img class="zoom pixel" src="{I}picto-before.jpg" alt="早期角色参考：扁平方脸的像素猫与像素狗"></div></figure>
        <figure class="fig rv d1"><span class="tag">After · 程序像素角色</span><div class="stage tight"><img class="zoom pixel" src="{I}picto-after.jpg" alt="当前角色：程序绘制的像素角色，用于应用、头像与封面"></div></figure>
      </div>
      <ol class="steps rv">
        <li><div><b>角色</b><span>程序像素角色成为唯一基准，应用、头像与封面共用同一套造型。</span></div></li>
        <li><div><b>语言</b><span>能力不再被夸大：“在线、已送达”改为“当前设备、切换角色查看”。</span></div></li>
        <li><div><b>流程</b><span>分散的页面整合为六步双角色交接，表达、看见、回应、接收形成闭环。</span></div></li>
        <li><div><b>展示</b><span>冗长的过程说明，换成真实界面和可交互的案例页。</span></div></li>
      </ol>
    </div>
    <p class="sub-h rv gap-top">已完成的工程验收</p>
    {metrics([('21', '项逻辑测试', '', True), ('23', '项浏览器主流程断言', '', True), ('44', '项案例页断言', '', True), ('3', '种手机宽度', '', True)], 'picto')}
    <p class="note rv">工程验收说明原型能稳定运行，不等于用户验证；真实使用效果见下一步的日记研究计划。</p>'''

    s6 = '''
    <p class="quote rv">让亲密关系里的“此刻”，先被看见。</p>
    <p class="sub-h rv gap-sm">低打扰也有代价：三个风险要提前回应</p>
    <div class="cards" style="--c:3">
      <div class="card rv"><span class="n px">Risk 01</span><h4>状态替代了聊天</h4><p>看到“一切如常”，就不再主动说话。<b>→ 状态只是开场，首页始终保留“留一句”的入口。</b></p></div>
      <div class="card rv d1"><span class="n px">Risk 02</span><h4>在场变成监视</h4><p>持续共享位置、步数，会让一方觉得被盯着。<b>→ 只显示本人主动选择的状态，不采集定位、步数或在线时间。</b></p></div>
      <div class="card rv d2"><span class="n px">Risk 03</span><h4>又多一个要看的 App</h4><p>功能一多，它就成了另一个消息箱。<b>→ 只做两个人、三件事：状态、短句、片刻。</b></p></div>
    </div>
    <p class="note rv">应对为当前设计取舍，尚待真实用户验证。</p>
    <p class="sub-h rv gap-sm">下一步：用一周日记研究验证三个假设</p>
    <p class="aside rv">招募 3–5 对异地或忙碌的情侣，使用原型 7 天，前后各做一次半结构化访谈。</p>
    <div class="table-scroll rv" tabindex="0" role="region" aria-label="验证计划">
    <table class="compare">
      <thead><tr><th scope="col">假设</th><th scope="col">方法</th><th scope="col">观测指标</th></tr></thead>
      <tbody>
        <tr><th scope="row">H1 低打扰表达能降低回复压力</th><td data-label="方法">每日日记 + 前后访谈</td><td data-label="指标">回复压力自评（1–7）</td></tr>
        <tr><th scope="row">H2 联系偏好比在线状态更有用</th><td data-label="方法">日记 + 使用记录</td><td data-label="指标">偏好设置与查看频次</td></tr>
        <tr><th scope="row">H3 能区分首页时效与片刻墙</th><td data-label="方法">可用性任务</td><td data-label="指标">任务完成率与误解次数</td></tr>
      </tbody>
    </table>
    </div>'''

    return head('片刻 Picto — Leyson', '片刻 Picto：介于沉默与即时聊天之间的低打扰陪伴方式。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-picto px-hero">
  <div class="wrap">
    {crumb('Picto')}
    <p class="case-id px rv"><img src="{I}logo-picto.png" alt="">Picto 片刻 · 02 / 03</p>
    <h1 class="rv cjk">看见彼此，<br>不必一直聊天。</h1>
    <p class="sub rv d1">介于沉默与即时聊天之间的低打扰陪伴方式：先表达“我现在怎样”，再决定要不要说话。</p>
    {meta([('Role', '问题定义 · 状态机制 · 语言边界'), ('Team', '独立完成'), ('Timeline', '约 2 个月'), ('Platform', 'Mobile · 可运行原型'), ('Tools', 'AI 协作完成实现、测试与素材')])}
{hero()}
  </div>
</section>

{tldr([('Problem · 问题', '即时通信把“被看见”绑成了“要回复”，忙碌和异地的情侣因此更累。'), ('My role · 我的角色', '约 2 个月独立完成：问题定义、状态机制、语言边界与最终取舍；AI 协作完成实现与测试。'), ('Key decision · 关键判断', '用一张状态卡代替一条消息：心情 + 正在做 + 联系偏好；用可预测的规则，而非生成式 AI。'), ('Outcome · 结果', '可解释的状态系统、六步双角色闭环与可运行原型；通过 21 项逻辑测试与 23 项主流程断言。')])}
{toc([('problem', '01', '问题', 'Problem'), ('insight', '02', '洞察', 'Insight'), ('principles', '03', '原则', 'Decision'), ('system', '04', '设计', 'Design'), ('iterate', '05', '迭代与结果', 'Outcome'), ('next-step', '06', '反思', 'Reflection')])}
{sec('problem', '01', '问题', 'Problem', s1)}
{sec('insight', '02', '洞察', 'Insight', s2, 'theme-picto')}
{sec('principles', '03', '原则', 'Decision', s3)}
{sec('system', '04', '设计', 'Design', s4, 'tint-peach')}
{sec('iterate', '05', '迭代与结果', 'Outcome', s5)}
{sec('next-step', '06', '反思', 'Reflection', s6, 'theme-picto')}
</main>
''' + pager('picto') + foot(B)
