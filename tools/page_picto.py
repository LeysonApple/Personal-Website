from build import head, nav, foot, case_hero, facts, chapter, fig, shot, cuts, results, next_project, proto_btn

PATH = 'projects/picto.html'
B = '../'
I = B + 'assets/img/'

# ---------------------------------------------------------------- pixel characters (Picto's own product characters)
# Sampled cell-by-cell from assets/img/picto-after.jpg by tools/extract_picto_sprites.py
# (top = 琪琪 the tabby cat, bottom = 森森 the dog). Re-run that script and paste if the art changes.
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
  <h4>现在的我</h4><p class="hint">正在为 琪琪 更新 · 仅保存在当前设备</p>
  <fieldset><legend>心情 <span data-sel="mood">已选 · 有点累</span></legend><div class="pk-grid g5">{m}</div></fieldset>
  <fieldset><legend>正在做什么 <span data-sel="doing">已选 · 休息充电</span></legend><div class="pk-grid g4">{d}</div></fieldset>
  <fieldset><legend>联系偏好 <span data-sel="pref">已选 · 只想被看见</span></legend><div class="pk-grid g2">{p}</div></fieldset>
</div>'''


def home_phone():
    return f'''<div class="ui-phone picto-ui home" aria-label="伴侣首页预览：随左侧选择实时更新">
  <div class="hm-top"><div><b>琪琪 的片刻</b><span>当前角色：森森 · 本地演示</span></div><span class="sw">切换角色</span></div>
  <div class="dev">
    <div class="dev-h"><span><i></i>琪琪 · 本地状态</span><span class="ago">{heart('#E8654F')}刚刚</span></div>
    <div class="scr" data-scr>
      <span class="badge b1">表情 <b data-o="mood">有点累</b></span><span class="badge b2">场景 <b data-o="doing">休息充电</b></span>
      {cat_svg()}
      <p class="bub">「回家啦，晚霞很好看」</p>
    </div>
  </div>
  <div class="st-card" aria-live="polite"><p class="sent" data-o="sent">琪琪现在有点累，正在休息充电。</p><p class="pl"><span data-o="heart">{heart('#F4F1EC')}</span><span data-o="pline">看见就好，不必开启聊天。</span></p><p class="upd">更新于 刚刚</p></div>
  <div class="mo"><span class="ph" aria-hidden="true"></span><div><b>下班路上的晚霞</b><span>刚刚</span></div></div>
  <nav class="tb" aria-hidden="true"><span class="on">首页</span><span>设置状态</span><span>拍一片刻</span><span>留一句</span><span>片刻墙</span></nav>
</div>'''


# ---------------------------------------------------------------- hero: the two characters and what each one sees
# 琪琪 = the tabby cat, 森森 = the dog, both on-model from picto-after.jpg. Sentences follow the demo's own rule
# ("<名字>现在<心情>，正在<活动>。" / pref line), so nothing here is new copy.


def hero_side(who, cls, kind, mood, mc, doing, pref, pc, line):
    return f'''<div class="px-side {cls}">
            <div class="px-bub"><p class="px-who"><i></i>{who} · 刚刚更新</p><p class="px-sent">{who}现在{mood}，正在{doing}。</p>
              <p class="px-tags"><span><span class="face" style="--fc:{mc}"><i></i></span>{mood}</span><span>{doing}</span><span>{heart(pc)}{pref}</span></p>
              <p class="px-pl">{line}</p></div>
            <div class="px-char" style="--mc:{mc}">{sprite_svg(kind, 'cat ' + kind)}<span class="px-shadow"></span></div>
          </div>'''


def hero():
    left = hero_side('琪琪', 'l', 'cat', '有点累', '#A9C3E8', '休息充电', '只想被看见', '#F4F1EC', '看见就好，不必开启聊天。')
    right = hero_side('森森', 'r', 'dog', '开心', '#F7C948', '通勤', '可以联系', '#7CC3A6', '联系偏好：可以联系')
    return f'''
    <div class="case-visual px-visual rv">
      <div class="px-stage" role="img" aria-label="Picto 示意：像素猫琪琪与像素狗森森，各自头顶是对方能看到的状态卡（心情、正在做、联系偏好），中间是一句会自动退出首页的留言">
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


def proto_cta(where):
    """体验原型 entry: opens the static local prototype in a new tab."""
    return f'''<div class="proto-cta proto-picto proto-{where} rv"><a class="btn btn-proto" href="{B}prototypes/picto/" target="_blank" rel="noopener">体验原型 <span class="arr" aria-hidden="true">↗</span><span class="sr">（新标签页打开）</span></a><p class="proto-note"><span>本地原型</span> · <span>数据仅保存在你的浏览器</span> · <span>同一浏览器内切换双角色</span></p></div>'''



def scr(f, t):
    return fig(f'<div class="phone"><img class="zoom" src="{I}{f}.jpg" alt="Picto 原型截图：{t}"></div>', t)


SPECTRUM = '''<ol class="spec" aria-label="沉默、Picto 与即时聊天的位置">
      <li><b>沉默</b><span>对方未必感知到</span></li>
      <li class="on"><b>Picto</b><span>让当下先被看见</span></li>
      <li><b>即时聊天</b><span>可能形成回复压力</span></li>
    </ol>'''


def render():
    cover = f'<img src="{I}cover-picto.jpg" alt="Picto 的像素角色琪琪与森森，各自在自己的小房间里" fetchpriority="high">'
    info = [('项目性质', '课程项目 · 独立完成'),
            ('我的角色', '问题定义、状态机制、交互与像素角色视觉、原型开发'),
            ('时间', '2026.07 – 09 · 约 2 个月'),
            ('工具', 'AI 编程工具 · 手机端 Web 原型 · 数据仅存本地')]
    tl = ['用 <b>1</b> 张状态卡代替一条消息：心情 × 正在做 × 联系偏好。',
          '不显示在线、已读，也不让 AI 推断情绪；<b>4</b> 档联系偏好让沉默不必解释。',
          '<b>6</b> 步双角色闭环的可运行原型，<b>21</b> 项逻辑测试全部通过。']
    demo = fig(f'<div class="panel panel-picto"><div class="picto-demo" data-picto>{picker()}{home_phone()}</div></div>',
               '试一试：左边换一组状态，右边是对方看到的。系统只组合本人的选择，不推断情绪。')
    phones = '<div class="grid4">' + scr('picto-home', '首页：看见对方此刻') + scr('picto-status', '设置状态：心情 × 正在做 × 偏好') + \
             scr('picto-polaroid', '拍一片刻：分享照片') + scr('picto-wall', '片刻墙：照片和短句按时间留存') + '</div>'
    chars = '<div class="grid2 grid-chars">' + fig(f'<div class="plate plate-px"><img class="zoom pixel" src="{I}picto-before.jpg" alt="早期角色参考：扁平方脸的像素猫与像素狗"></div>', '早期：扁平方脸的参考图') + \
            fig(f'<div class="plate plate-px"><img class="zoom pixel" src="{I}picto-after.jpg" alt="当前角色：程序绘制的像素角色"></div>', '现在：程序绘制的像素角色，全应用共用一套造型') + '</div>'
    proto = proto_btn(f'{B}prototypes/picto/', '本地原型 · 数据只存在你的浏览器 · 可切换双角色')

    return head('片刻 Picto — Leyson', '片刻 Picto：介于沉默与即时聊天之间的低打扰情侣陪伴 App。课程项目，独立完成。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
{case_hero('picto', '片刻 · 低打扰情侣陪伴 App', '看见彼此，<br>不必一直聊天。', '给情侣用的陪伴 App：先让对方看见“我现在怎样”，再决定要不要说话。', cover)}
{facts(info, tl, proto)}
{chapter('01', '问题', '聊天把“被看见”，<br>绑成了“要回复”。', '已发表研究中，52% 的人在伴侣没按预期回复时会焦虑（Huang &amp; Yao, 2024，非本项目调研）。异地、忙碌的情侣，需要介于沉默与聊天之间的方式。', SPECTRUM)}
{chapter('02', '关键判断', '只显示本人主动表达的，<br>不推断，也不催回复。', '状态句由本人的选择按规则拼成，不让 AI 替人表达；也不采集定位、步数或在线时间，在场不该变成监视。', demo)}
{chapter('03', '设计', '四个页面，<br>一条“表达 → 看见 → 留存”的闭环。', '表达当下，对方看见，留一句轻回应；留言到期自动退出首页，照片和短句进入片刻墙。', phones + chars)}
{cuts([('在线 · 电量', '暗示了不该有的监视，改为“刚刚更新”'),
       ('已读 · 送达回执', '会让接收方觉得必须回复'),
       ('AI 推断情绪', '不可预测，还会替人表达')])}
{results('04', '原型完整可跑，<br>真实效果交给下一步研究。', '以下是工程验收，说明原型稳定可用，不等于用户验证。下一步计划招募 3–5 对情侣，做一周日记研究。',
         [('6 步', '双角色闭环'), ('21 项', '逻辑测试通过'), ('23 项', '主流程断言'), ('3 种', '手机宽度适配')],
         '让亲密关系里的“此刻”，先被看见。', '', proto)}
</main>
''' + next_project('picto') + foot(B)
