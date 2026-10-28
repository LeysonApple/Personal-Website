import json
from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec, metrics, cuts

PATH = 'projects/focenda.html'
B = '../'
I = B + 'assets/img/'

# The eight tasks exactly as they appear in the prototype screenshots (importance / energy / minutes).
TASKS = [
    ('9点到10点 交互设计课', 66, 38, 60, '09:00'),
    ('回复导师邮件 15分钟', 74, 22, 15, ''),
    ('阅读论文 45分钟', 58, 62, 45, ''),
    ('完成作品集排版 2小时', 90, 66, 120, ''),
    ('准备周五汇报 90分钟', 84, 76, 90, ''),
    ('整理灵感素材库 30分钟', 24, 16, 30, ''),
    ('整理课堂笔记 40分钟', 34, 30, 40, ''),
    ('清理旧版文件夹 60分钟', 18, 72, 60, ''),
]
QUADS = [('do', '优先完成', '重要 · 轻松'), ('focus', '专注推进', '重要 · 费力'), ('easy', '顺手处理', '不急 · 轻松'), ('cut', '考虑删减', '不急 · 费力')]


def quad_of(i, e):
    return ('do' if e < 50 else 'focus') if i >= 50 else ('easy' if e < 50 else 'cut')


def short(name):
    return name.split(' ')[0][:4] + '…'


def quadrant():
    bubbles = []
    for k, (n, i, e, m, fixed) in enumerate(TASKS):
        q = quad_of(i, e)
        size = 44 + round(i * 0.36)
        style = f'left:{e}%;bottom:{i}%;--s:{size}px'
        bubbles.append(f'<button type="button" class="bb q-{q}" style="{style}" data-task="{k}" aria-pressed="{"true" if k == 4 else "false"}" aria-label="{n}：重要度 {i}，精力 {e}">{short(n)}</button>')
    labels = ''.join(f'<span class="ql ql-{c}"><small>{s}</small>{t}</span>' for c, t, s in QUADS)
    return f'<div class="qd"><div class="qd-in">{labels}<span class="ax ax-x" aria-hidden="true">低精力 → 高精力</span><span class="ax ax-y" aria-hidden="true">低重要度 → 高重要度</span>{"".join(bubbles)}</div></div>'


def detail():
    return '''<div class="fd" aria-live="polite" data-fd>
  <span class="tag-s">任务详情</span><h4 data-f="name">准备周五汇报 90分钟</h4>
  <div class="sc"><span class="imp">重要程度：<b data-f="i">84</b></span><span class="eng">投入程度：<b data-f="e">76</b></span></div>
  <dl><div><dt>时间</dt><dd data-f="time">尚未指定时间</dd></div><div><dt>预计耗时</dt><dd data-f="min">90 分钟</dd></div><div><dt>象限</dt><dd data-f="q">专注推进</dd></div></dl>
  <div class="tip"><b>执行建议</b><p data-f="tip">这项任务重要且需要专注，建议留出完整时间，并先拆成 2–3 个小步骤。</p></div>
</div>'''


def app_bar(title_right=''):
    return f'<div class="fa-bar"><span class="lg" aria-hidden="true"><img src="{I}logo-focenda.png" alt=""></span><b>Focenda</b><small>专序</small><span class="sp"></span>{title_right}</div>'


def quad_ui():
    leg = ''.join(f'<span class="lg-i q-{c}"><i></i>{t}</span>' for c, t, _ in QUADS)
    return f'''<div class="ui-frame ui-browser foc-ui" data-quad>
  <div class="ub-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>{app_bar('<span class="seg"><span class="on">今日</span><span>未来</span><span>设置</span></span>')}</div>
  <div class="fq"><div class="fq-main"><div class="fq-h"><span class="seg"><span class="on">优先级视图</span><span>时间安排</span></span><span class="legend">{leg}</span></div>{quadrant()}</div>{detail()}</div>
</div>'''


RHYTHMS = [('focus', '专注推进', '任务紧密衔接', '优先处理高价值任务，减少中途切换。'),
           ('bal', '均衡节奏', '工作与休息交替', '每项任务之间预留 15 分钟缓冲。'),
           ('easy', '轻松安排', '保留更多空白', '先做轻松任务，为高消耗事项留出余量。')]


def timeline_ui():
    r = ''.join(f'<label class="rh"><input type="radio" name="rhythm" value="{k}"{" checked" if k == "bal" else ""}><b>{t}</b><em>{s}</em><span>{d}</span></label>' for k, t, s, d in RHYTHMS)
    hours = ''.join(f'<span style="left:{(h - 9) / 12 * 100:.3f}%">{h:02d}:00</span>' for h in range(9, 22))
    return f'''<div class="ui-frame ui-browser foc-ui" data-tl>
  <div class="ub-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>{app_bar('<span class="seg"><span class="on">今日</span><span>未来</span><span>设置</span></span>')}</div>
  <div class="ft">
    <fieldset class="ft-r"><legend>安排方式<small>选一个适合今天的节奏。</small></legend>{r}<p class="saved">✓ 排期已自动保存，明日失效</p></fieldset>
    <div class="ft-m">
      <p class="ft-sum" aria-live="polite"><span class="tag-s">安排建议</span><span data-tl-sum>今天已离线安排 8 项任务，预计需要 7 小时 40 分钟。</span><span class="ot" data-tl-ot></span></p>
      <div class="ft-axis"><div class="hrs" aria-hidden="true">{hours}</div><div class="track" data-tl-track><span class="off" style="left:{9 / 12 * 100:.3f}%"><em>下班界限</em></span></div></div>
      <ol class="ft-list" data-tl-list></ol>
    </div>
  </div>
</div>'''


def plan_phone():
    groups = []
    for c, t, s in QUADS:
        items = [x for x in TASKS if quad_of(x[1], x[2]) == c]
        li = ''.join(f'<li><b>{n}</b><span>重要 {i} · 精力 {e}</span></li>' for n, i, e, m, f in items)
        groups.append(f'<div class="pg-g q-{c}"><p><i></i>{t}<span>{s} · {len(items)} 项</span></p><ul>{li}</ul></div>')
    tasks = ''.join(f'<li class="q-{quad_of(i, e)}"><span class="ck" aria-hidden="true"></span><div><b><i></i>{n}</b><span class="tg"><em>重要度: {i}</em><em>精力: {e}</em></span></div></li>' for n, i, e, m, f in TASKS[:4])
    tabs = ('<div class="ph-tabs" role="tablist" aria-label="手机端视图">'
            '<button type="button" role="tab" id="ph-t0" aria-controls="ph-p0" aria-selected="false" tabindex="-1">任务清单</button>'
            '<button type="button" role="tab" id="ph-t1" aria-controls="ph-p1" aria-selected="true" tabindex="0">规划视图</button></div>')
    return f'''<div class="ui-phone foc-ui plan" data-tabs>
  {app_bar('<span class="today"><small>TODAY</small>24</span>')}
  {tabs}
  <div class="ph-p" role="tabpanel" id="ph-p0" aria-labelledby="ph-t0" tabindex="0" hidden>
    <h5>今天要完成什么？</h5><p class="hint">先写下一件事，再慢慢排好今天。</p>
    <p class="avail">可用时间 <span>8.0h 可用</span></p>
    <p class="in">写下任务，也可以直接带上时间，例如：整理房间45分钟 / 下午3点到4点开会<span>添加任务</span></p>
    <p class="lab">今日任务</p><ul class="tl-tasks">{tasks}</ul>
  </div>
  <div class="ph-p" role="tabpanel" id="ph-p1" aria-labelledby="ph-t1" tabindex="0">{''.join(groups)}</div>
  <nav class="tb" aria-hidden="true"><span class="on">今日</span><span>未来</span><span>设置</span></nav>
</div>'''


def rules():
    return '''<div class="rules">
  <div class="rule rv"><span class="no px">01 · 评估</span><h4>关键词打分</h4><p>每项起始 <b>40</b> 分，按任务描述加减，结果限定在 <b>10–95</b>。</p>
    <ul class="kw"><li><b class="up">+25</b>高价值词 → 重要度<small>核心、规划、复盘</small></li><li><b class="dn">−20</b>低价值词 → 重要度<small>整理、报销、周报</small></li><li><b class="up">+25</b>高投入词 → 精力<small>开发、改版、紧急</small></li><li><b class="dn">−20</b>轻量词 → 精力<small>快速、顺手、草拟</small></li></ul></div>
  <div class="rule rv d1"><span class="no px">02 · 归类</span><h4>以 50 分为界</h4>
    <div class="mini-q" aria-label="四象限：重要度与精力均以 50 为界"><span class="q-do">优先完成<small>重要 ≥50 · 精力 &lt;50</small></span><span class="q-focus">专注推进<small>重要 ≥50 · 精力 ≥50</small></span><span class="q-easy">顺手处理<small>重要 &lt;50 · 精力 &lt;50</small></span><span class="q-cut">考虑删减<small>重要 &lt;50 · 精力 ≥50</small></span></div>
    <ul class="kw tips"><li>重要 ≥70 且 精力 ≥70 → 拆成 2–3 个小步骤</li><li>重要 ≥70 → 适合优先完成</li><li>重要 &lt;50 且 精力 &gt;50 → 缩小范围或延后</li></ul></div>
  <div class="rule rv d2"><span class="no px">03 · 排期</span><h4>三种节奏排序</h4>
    <ul class="kw"><li><b>专注</b>重要×1.2 − 精力×0.15，从高到低<small>无间隔</small></li><li><b>均衡</b>重要 ÷ 精力，从高到低<small>间隔 15 分钟</small></li><li><b>轻松</b>精力从低到高<small>间隔 15 分钟</small></li></ul>
    <p>先锁定固定时间与午休，其余任务依次填入空档；超过下班时间即标为超时。</p></div>
</div>'''

# ---------------------------------------------------------------- hero: scattered tasks → quadrant → a day that switches rhythm
# Every word comes from the recreations below: the same 8 tasks, quadrant names, detail tip and rhythm copy.
# The two day plans are computed with the same local rules as the Fig. 02 timeline (main.js), not drawn by hand.
HERO_PICK = 4  # 准备周五汇报 90分钟 — the task followed through all three steps
# (task index, x offset px, y offset px, rotation deg) for the unsorted cloud
CLOUD = [(3, 0, 2, -2), (1, 54, -2, 2), (0, 14, 4, 1), (5, 44, -2, -1), (2, 4, 6, 2), (7, 60, -4, -2), (6, 22, 2, 1)]
# two-character fragments taken from each task name, for the small bubbles
# small hero-only nudges (% of the quadrant) so bubbles at near-identical scores don't stack; each stays in its quadrant
NUDGE = [(2, -2), (-4, 4), (0, 0), (-6, 1), (6, -9), (6, 12), (10, -4), (-3, 4)]
BUB = ['交互<br>设计', '回复<br>导师', '阅读<br>论文', '作品集<br>排版', '周五<br>汇报', '灵感<br>素材', '课堂<br>笔记', '旧版<br>文件']
OFF_MIN = 18 * 60


def fmt(m):
    return f'{m // 60:02d}:{m % 60:02d}'


def day_plan(rhythm):
    """Port of main.js plan(): lock fixed time + lunch, then fill gaps in rhythm order."""
    order = {'focus': lambda t: -(t[1] * 1.2 - t[2] * 0.15), 'bal': lambda t: -(t[1] / t[2])}[rhythm]
    gap = 0 if rhythm == 'focus' else 15
    blocks = [{'k': k, 's': int(f[:2]) * 60, 'e': int(f[:2]) * 60 + m} for k, (n, i, e, m, f) in enumerate(TASKS) if f]
    blocks.append({'k': 'lunch', 's': 12 * 60, 'e': 13 * 60})
    out, cur = [], 9 * 60
    for k, t in sorted([(k, t) for k, t in enumerate(TASKS) if not t[4]], key=lambda kt: order(kt[1])):
        moved = True
        while moved:
            moved = False
            for b in blocks:
                if cur < b['e'] and cur + t[3] > b['s']:
                    cur, moved = b['e'] + gap, True
        out.append({'k': k, 's': cur, 'e': cur + t[3]})
        cur += t[3] + gap
    return sorted(blocks + out, key=lambda x: x['s'])


def day_layout(rhythm):
    """y (px) per item: height grows with duration, free minutes between items become visible space."""
    y, prev, pos, line = 0, None, {}, None
    for it in day_plan(rhythm):
        g = 0
        if prev is not None:
            g = 5 + min(it['s'] - prev, 45) * 0.6
            y += g
        if line is None and it['e'] > OFF_MIN:
            line = y - g / 2
            y += 18  # a band under the 18:00 line for its label
        h = 22 + (it['e'] - it['s']) / 6
        pos[it['k']] = (round(y), round(h), it['s'], it['e'])
        y += h
        prev = it['e']
    return pos, round(y), round(line if line is not None else y + 6)


def hero():
    cloud = ''.join(
        f'<span class="fo-chip" style="--x:{x}px;--y:{y}px;--r:{r}deg;--d:{j * -0.9:.1f}s">{TASKS[k][0]}</span>'
        for j, (k, x, y, r) in enumerate(CLOUD))
    pick = TASKS[HERO_PICK]
    qname = dict((c, t) for c, t, _ in QUADS)

    bubbles = []
    for k, (n, i, e, m, f) in enumerate(TASKS):
        on = ' on' if k == HERO_PICK else ''
        dx, dy = NUDGE[k]
        bubbles.append(f'<span class="fo-b q-{quad_of(i, e)}{on}" style="left:{9 + e * .82 + dx:.1f}%;bottom:{9 + i * .82 + dy:.1f}%;--s:{30 + round(i * .2)}px;--d:{k * -0.6:.1f}s">{BUB[k]}</span>')
    qlabels = ''.join(f'<span class="fo-ql ql-{c}">{t}<small>{sub}</small></span>' for c, t, sub in QUADS)

    a, ha, la = day_layout('focus')
    b, hb, lb = day_layout('bal')
    over_b = sum(1 for k, v in b.items() if k != 'lunch' and v[3] > OFF_MIN)
    rows = []
    for k in [x['k'] for x in day_plan('focus')]:
        ya, h, sa, ea = a[k]
        yb, _, sb, eb = b[k]
        if k == 'lunch':
            cls, name, tag_a = 'lunch', '午休', '锁定'
        else:
            n, i, e, m, f = TASKS[k]
            cls, name, tag_a = 'q-' + quad_of(i, e), n, ('锁定' if f else qname[quad_of(i, e)])
        ov = eb > OFF_MIN and k != 'lunch'
        cls += (' on' if k == HERO_PICK else '') + (' ov' if ov else '')
        tag = f'<span class="fo-tg fo-x"><span class="a">{tag_a}</span><span class="b">超时</span></span>' if ov else f'<span class="fo-tg">{tag_a}</span>'
        rows.append(
            f'<li class="fo-blk {cls}" style="--ya:{ya}px;--yb:{yb}px;--h:{h}px">'
            f'<time class="fo-x"><span class="a">{fmt(sa)}–{fmt(ea)}</span><span class="b">{fmt(sb)}–{fmt(eb)}</span></time>'
            f'<span class="fo-bar"><b>{name}</b>{tag}</span></li>')
    (_, t1, s1, d1), (_, t2, s2, d2) = RHYTHMS[0], RHYTHMS[1]
    rows_h = max(ha, hb, la + 22, lb + 22)

    return f'''
    <div class="case-visual fo-visual rv">
      <div class="fo-stage" role="img" aria-label="Focenda 示意：零散写下的 8 项任务，按重要度与精力落进四个象限，再按所选节奏排成今天的时间轴；在“专注推进”与“均衡节奏”之间切换时，顺序与空档随之改变，超过 18:00 下班界限的任务标为超时">
        <div class="fo-canvas foc-ui" aria-hidden="true">
          <p class="fo-crumb"><span class="lg"></span><b>Focenda</b> / 今日</p>
          <div class="fo-col fo-in">
            <p class="fo-k px">00 · 写下</p>
            <div class="fo-input"><span class="fo-hint">写下任务，也可以直接带上时间</span><span class="fo-typed">{pick[0]}<i class="fo-caret"></i></span><span class="fo-add">添加任务</span></div>
            <div class="fo-cloud">{cloud}</div>
          </div>
          <svg class="fo-flow f1" viewBox="0 0 56 300" preserveAspectRatio="none"><path d="M0 60 C 30 60, 26 130, 56 130"/><path d="M0 150 C 28 150, 28 150, 56 150"/><path d="M0 240 C 30 240, 26 170, 56 170"/></svg>
          <div class="fo-col fo-mid">
            <p class="fo-k px">01 · 分象限</p>
            <div class="fo-quad"><div class="fo-qin">{qlabels}<span class="fo-ax x">精力 →</span><span class="fo-ax y">重要度 →</span>{''.join(bubbles)}</div></div>
            <div class="fo-detail"><span class="tag-s">任务详情</span><b>{pick[0]}</b><span class="fo-sc"><span class="imp">重要程度 {pick[1]}</span><span class="eng">投入程度 {pick[2]}</span></span><p>这项任务重要且需要专注，建议留出完整时间，并先拆成 2–3 个小步骤。</p></div>
          </div>
          <svg class="fo-flow f2" viewBox="0 0 56 300" preserveAspectRatio="none"><path d="M0 110 C 30 110, 26 70, 56 70"/><path d="M0 150 C 28 150, 28 150, 56 150"/><path d="M0 190 C 30 190, 26 230, 56 230"/></svg>
          <div class="fo-col fo-out">
            <p class="fo-k px">02 · 排进今天</p>
            <div class="fo-day">
              <div class="fo-seg"><i class="fo-thumb"></i><span class="s-a">{t1}</span><span class="s-b">{t2}</span></div>
              <p class="fo-cap fo-x"><span class="a"><b>{s1}</b>{d1}</span><span class="b"><b>{s2}</b>{d2}</span></p>
              <ol class="fo-rows" style="--rh:{rows_h}px">{''.join(rows)}<li class="fo-off" style="--ya:{la}px;--yb:{lb}px"><span class="fo-x"><span class="a">18:00 下班界限</span><span class="b">{over_b} 项超过 18:00 下班界限</span></span></li></ol>
            </div>
          </div>
        </div>
      </div>
    </div>'''



def proto_cta(where):
    """体验原型 entry: opens the static local prototype in a new tab."""
    return f'''<div class="proto-cta proto-foc proto-{where} rv"><a class="btn btn-proto" href="{B}prototypes/focenda/" target="_blank" rel="noopener">体验原型 <span class="arr" aria-hidden="true">↗</span><span class="sr">（新标签页打开）</span></a><p class="proto-note"><span>本地原型</span> · <span>数据仅保存在你的浏览器</span></p></div>'''


def more(title, body):
    return f'<details class="more"><summary><span class="px"><i class="o">+ 展开</i><i class="c">− 收起</i></span>{title}</summary><div class="more-b">{body}</div></details>'


def bshot(f, t, n, d=''):
    return (f'<figure class="rv {d}"><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}{f}.jpg" alt="Focenda 原型截图：{t[2:]}" loading="lazy"></div>'
            f'<figcaption><b>{t}</b>{n}</figcaption></figure>')


def pshot(f, t, n, d=''):
    return (f'<figure class="rv {d}"><div class="phone"><img class="zoom" src="{I}{f}.jpg" alt="Focenda 手机端截图：{t[2:]}" loading="lazy"></div>'
            f'<figcaption><b>{t}</b>{n}</figcaption></figure>')


def render():
    data = json.dumps([{'n': n, 'i': i, 'e': e, 'm': m, 'f': f} for n, i, e, m, f in TASKS], ensure_ascii=False)

    research = f'''<p>对初创公司设计师做半结构化访谈（14 个问题），归纳出三类关键阻塞。</p>
    {metrics([('7.4', '项 · 平均负责的工作类型', '', True), ('3.7', '次 · 每个页面平均修改', '', True), ('70%', '返工源于需求模糊', '', True), ('83%', '只能自己上网找资料', '', True)], 'foc')}
    <div class="cards gap-sm" style="--c:3">
      <div class="card"><span class="n px">01</span><h4>琐事太多</h4><p>隐性劳动侵蚀创作时间。</p></div>
      <div class="card"><span class="n px">02</span><h4>信息没对齐</h4><p>链路断裂导致高频返工。</p></div>
      <div class="card"><span class="n px">03</span><h4>难拿出结果</h4><p>设计价值难以量化呈现。</p></div>
    </div>'''

    naming = f'''<div class="table-scroll" tabindex="0" role="region" aria-label="命名对比表">
    <table class="compare">
      <thead><tr><th scope="col"><span class="sr">维度</span></th><th scope="col">早期 · Focus Flow</th><th scope="col">现在 · Focenda</th></tr></thead>
      <tbody>
        <tr><th scope="row">象限命名</th><td class="old" data-label="早期">极度聚焦 · 核心攻坚 · 摸鱼日常 · 强效排雷</td><td class="new" data-label="现在">优先完成 · 专注推进 · 顺手处理 · 考虑删减</td></tr>
        <tr><th scope="row">评分维度</th><td class="old" data-label="早期">含金量 · 耗费</td><td class="new" data-label="现在">重要度 · 精力</td></tr>
        <tr><th scope="row">导航结构</th><td class="old" data-label="早期">任务大厅 · 设计图库 · 周报</td><td class="new" data-label="现在">今日 · 未来 · 设置</td></tr>
      </tbody>
    </table>
    </div>
    <figure class="fig gap-sm ref-sm"><div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i></div><img class="zoom" src="{I}focenda-early.jpg" alt="早期方案 Focus Flow 界面（重绘示意）" loading="lazy"></div><figcaption><b>早期方案 Focus Flow</b>重绘示意，作为对照参考。</figcaption></figure>'''

    devices = '''<ol class="steps">
          <li><div><b>Desktop · 1280–1920px</b><span>多栏工作面：左侧录入与清单，右侧四象限或时间轴。</span></div></li>
          <li><div><b>Mobile · 320–430px</b><span>单列工作流：任务清单与规划视图分开，底部三项导航。</span></div></li>
          <li><div><b>本地优先</b><span>无需账号，可导出 JSON 备份；macOS 小组件同步今日。</span></div></li>
        </ol>'''

    reflect = '''<div class="cards" style="--c:3">
      <div class="card"><h4>跟着证据收窄</h4><p>研究起点是设计师协作空间，内测显示最被需要的是规划。</p></div>
      <div class="card"><h4>规则要说得出理由</h4><p>评分、归类与排期全部是可读的本地规则。</p></div>
      <div class="card"><h4>术语换成人话</h4><p>“强效排雷”改为“考虑删减”，第一次打开就能看懂。</p></div>
    </div>
    <p class="note">下一步：个性化复盘，以及设计库调用、周报复盘两个概念模块。内测样本较小，结论有待更大样本验证。</p>'''

    s1 = f'''
    <h3 class="rv">一句话录入，<br>按重要度 × 精力排好今天。</h3>
    <div class="shots swipe" style="--c:2">
      {bshot('focenda-priority', '① 优先级视图', '气泡位置 = 重要度 × 精力，落进四个象限')}
      {bshot('focenda-timeline', '② 一日时间轴', '选一种节奏，自动生成今天的安排', 'd1')}
    </div>
    <div class="shots swipe gap-sm" style="--c:2">
      {bshot('focenda-detail', '③ 任务详情', '两项评分 + 执行建议')}
      {bshot('focenda-future', '④ 未来 7 天', '提前把任务放进某一天', 'd1')}
    </div>
    <div class="shots swipe gap-sm phone-row" style="--c:4">
      {pshot('focenda-today', '⑤ 手机 · 任务清单', '首屏只留输入与今日任务')}
      {pshot('focenda-plan', '⑥ 手机 · 规划视图', '单列看下一步', 'd1')}
    </div>
    <p class="note rv">可运行原型真实截图，Web + 手机响应式。</p>
    <h3 class="h-sm rv gap-top">试一试：点任意气泡，看它的评分和建议。</h3>
    <figure class="fig wide rv">{quad_ui()}<figcaption><span class="fn px">Fig. 01</span><b>优先级视图 + 任务详情</b>按原型界面重建，8 个任务与评分取自原型示例数据。</figcaption></figure>
    <h3 class="h-sm rv gap-top">再换一种节奏：同一组任务，顺序和空档都不同。</h3>
    <figure class="fig wide rv">{timeline_ui()}<figcaption><span class="fn px">Fig. 02</span><b>一日时间轴</b>专注把高价值任务排前面，均衡和轻松留出缓冲；超过 18:00 的标红。</figcaption></figure>
    <script type="application/json" id="foc-data">{data}</script>'''

    s2 = f'''
    <h3 class="rv">跟着证据收窄：<br>先把“排好今天”做扎实。</h3>
    <ol class="loop rv" aria-label="定位的变化"><li>研究起点：为设计师做 AI 协同工作空间</li><li>内测发现：最被需要的是“排好今天”</li><li class="on">定位：面向大众的每日规划与动态排期</li></ol>
    {cuts([('Concept', '设计库调用', '不在“排好今天”的主路径上', '保留为概念设计，留作后续版本'), ('Concept', '周报复盘', '先验证规划与排期，再做汇总', '“个性化复盘”放入后续'), ('Built', '任务管理 + 时间规划', '9/10 位内测者实际用到', '自然语言录入、四象限、三种节奏、未来七天', True)])}
    <h3 class="h-sm rv gap-top">不用大模型：三步本地规则，每条安排都说得出理由。</h3>
    {rules()}'''

    s3 = f'''
    <h3 class="rv">内测 10 人 · 2 天：<br>9 人用上了规划，80% 接受自动排期。</h3>
    {metrics([('90%', '使用了任务规划', '9 / 10 人', True), ('84%', '任务完成率', '任务口径', True), ('80%', '接受自动排期', '排期口径', True), ('60%', '主动调整优先级', '6 / 10 人', True)], 'foc')}
    <p class="note rv">样本较小，属初步验证。参与者：学生 5 · 职场办公 3 · 自由职业 2。</p>
    <p class="sub-h rv gap-sm">反馈直接变成了改动</p>
    <div class="fb">
      <div class="rv"><q>第一次进入不知道先看哪里</q><span class="ar" aria-hidden="true">→</span><b>首屏只留输入与今日任务</b></div>
      <div class="rv d1"><q>希望有新手引导</q><span class="ar" aria-hidden="true">→</span><b>三步引导 + 示例任务</b></div>
      <div class="rv d2"><q>希望总结更个性化</q><span class="ar" aria-hidden="true">→</span><b>个性化复盘 · 后续版本</b></div>
    </div>
    {proto_cta('outcome')}
    <p class="quote rv gap-sm">先把“排好今天”做扎实。</p>'''

    s4 = f'''
    <p class="rv">过程细节，按需展开：</p>
    <div class="rv">
    {more('访谈研究：设计师的时间被“非设计”吃掉', research)}
    {more('从 Focus Flow 到 Focenda：把术语换成人话', naming)}
    {more('多端适配：电脑看全局，手机看下一步', devices)}
    {more('反思与下一步', reflect)}
    </div>'''

    return head('Focenda 专序 — Leyson', 'Focenda 专序：按重要度与精力排好今天的动态日程规划。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-foc">
  <div class="wrap">
    {crumb('Focenda')}
    <p class="case-id px rv"><img src="{I}logo-focenda.png" alt="">Focenda 专序 · 03 / 04</p>
    <h1 class="rv">Flow Better.<br>Focus Smarter.</h1>
    <p class="sub rv d1">每日规划工具：一句话写下任务，它按重要度和精力帮你排好今天。</p>
    {meta([('Problem · 问题', '任务一多，不知道先做哪件，<br>也不知道今天排得下多少'), ('Solution · 方案', '重要度 × 精力分进四象限，<br>选一种节奏生成今日时间轴'), ('My role · 我负责', '研究、产品定义、交互与视觉，<br>借助 AI 编程工具实现'), ('Result · 结果', '10 人 · 2 天内测：任务完成率 84%<br>80% 接受自动排期')])}
    <p class="meta-line px rv">课程作业 → 课后独立打磨 · 设计师访谈 14 问 · Web + Mobile 响应式 · 本地运行</p>
    {proto_cta('hero')}
{hero()}
  </div>
</section>

{toc([('design', '01', '设计', 'Design'), ('decision', '02', '关键取舍', 'Decision'), ('outcome', '03', '结果', 'Outcome'), ('process', '04', '过程', 'Process')])}
{sec('design', '01', '设计', 'Design', s1, 'full')}
{sec('decision', '02', '关键取舍', 'Decision', s2, 'full')}
{sec('outcome', '03', '结果', 'Outcome', s3, 'tint-blue full')}
{sec('process', '04', '过程', 'Process', s4, 'full')}
</main>
''' + pager('focenda') + foot(B)
