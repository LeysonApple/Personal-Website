from build import head, nav, foot, pager, crumb, meta, tldr, toc, sec, Figs, metrics, cuts, tabs

PATH = 'projects/sift.html'
B = '../'
I = B + 'assets/img/'

# ---------------------------------------------------------------- recreated UI: the traceable canvas
# Copy taken from the real canvas screenshot (sift-canvas.jpg) and the theme / generation cards.
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
    def row(q, opts):
        return f'<p class="bq">{q}</p><div class="bo">' + ''.join(('<span class="on">' if k == 0 else '<span>') + f'{x}</span>' for k, x in enumerate(opts)) + '</div>'
    after = row('1 · 折叠方式如何被看见？', ['风琴褶', '卷收式', '伸缩套筒']) + row('2 · 壶身呈现怎样的触感？', ['半透雾面', '哑光实色', '硬软拼接'])
    return f'''<div class="ba-ui">
  <div class="ba-side before rv"><span class="ba-k px">Before · 早期版本（重绘）</span>
    <div class="ui-card sift-ui qlist"><ol>{before}</ol><p class="foot-k">随机 1–5 题 · 平均题干 40+ 字</p>
      <span class="pin" style="top:18%;right:-12px" aria-hidden="true">1</span></div>
    <p class="ba-note"><b>1</b> 开放式问卷：题干长、无选项，设计师得自己组织答案。</p></div>
  <div class="ba-arrow" aria-hidden="true">→</div>
  <div class="ba-side after rv d1"><span class="ba-k px">After · 当前版本</span>
    <div class="ui-card sift-ui qopts">{after}<p class="foot-k blue">2–3 题 · 题干 ≤35 字 · 选项强对立</p>
      <span class="pin" style="top:30%;right:-12px" aria-hidden="true">2</span></div>
    <p class="ba-note"><b>2</b> 对立选项逼出真实偏好，点选即可回答。</p></div>
</div>'''


def render():
    s1 = '''
    <h3 class="rv">设计前期缺的不是图，<br>而是判断的次序。</h3>
    <p class="rv">工业、CMF、包装和 UI 设计师拿到模糊 Brief 后，常卡在四个断层。</p>
    <div class="cards" style="--c:2">
      <div class="card rv"><span class="n px">01</span><h4>意图与边界模糊</h4><p>有初步感受，却说不清最大的不确定性在哪，常把视觉诉求和技术约束混在一起。</p></div>
      <div class="card rv d1"><span class="n px">02</span><h4>AI 工具的“生图幻觉”</h4><p>一键出效果图很热闹，但前期需要的是视觉策略与检索方向。</p></div>
      <div class="card rv"><span class="n px">03</span><h4>搜图没有次序</h4><p>先搜材质还是先搜结构？Behance、Pinterest 上大量模板样机掩盖了真实工艺。</p></div>
      <div class="card rv d1"><span class="n px">04</span><h4>决策不收敛</h4><p>收藏夹堆满碎片图，却很难向团队和客户讲清方向是怎么推出来的。</p></div>
    </div>
    <p class="insight rv"><span aria-hidden="true">→</span> 机会点：不再帮设计师“找更多图”，而是帮他们理清先判断什么、再去搜什么。</p>'''

    s2 = '''
    <h3 class="rv">一次导师评审，<br>让我们重新定义了产品。</h3>
    <blockquote class="pull rv"><p>“找图本身并不占优势，网上不花钱就能搜到海量素材。同时开好几个 AI 对话框来回切换很割裂，画布式对设计师团队更友好。”</p><cite class="px">Mentor review · 2026.09.22</cite></blockquote>
    <div class="cards gap-sm" style="--c:3">
      <div class="card rv"><span class="n px">→ 01</span><h4>不拼素材量</h4><p>搜图交给外部平台，SIFT 只负责理清搜索次序。</p></div>
      <div class="card rv d1"><span class="n px">→ 02</span><h4>不做对话框</h4><p>所有 AI 交互发生在画布卡片里，过程可追溯。</p></div>
      <div class="card rv d2"><span class="n px">→ 03</span><h4>只做收敛</h4><p>把模糊需求变成清晰、有画面感的设计判断。</p></div>
    </div>
    <div class="scope gap-sm rv">
      <div class="do"><p class="px">Do · 只服务 Day 0 的方向判断</p><ul><li>找出 Brief 里最大的不确定性，一次问一个分水岭问题</li><li>把确认过的判断沉淀为可追溯的 Design State</li><li>为当前视点规划去噪的跨平台检索方向</li></ul></div>
      <div class="dont"><p class="px">Don’t · 坚决不做</p><ul><li>效果图渲染与交付工具</li><li>项目管理看板或“完成度”仪表盘</li><li>替设计师做最终的美学拍板</li></ul></div>
    </div>
    <p class="split-line rv"><span><b>AI 负责</b>拆解需求、提出对立假设、理清检索次序、记录每个判断的来源</span><span><b>设计师负责</b>权衡选项、表达审美偏好、拍板路线、随时就地修改</span></p>'''

    prd = [
        ('v1.0', '09.18', '<dl class="kv"><dt>定位</dt><dd>视觉研究规划 Agent</dd><dt>做什么</dt><dd>把 Brief 编成探索路线和中英搜索词</dd><dt>变化</dt><dd>起点：解决“不知道先搜什么”</dd></dl>'),
        ('v2.0', '09.18–21', '<dl class="kv"><dt>定位</dt><dd>方向收敛 + 视觉探索</dd><dt>做什么</dt><dd>先问清方向，再给路线和搜索方案</dd><dt>变化</dt><dd>加入：方向状态卡、人工检查点</dd></dl>'),
        ('v3.1', '09.23', '<dl class="kv"><dt>定位</dt><dd>视觉策略与方向收敛智能体</dd><dt>做什么</dt><dd>纯无限画布，卡片可以自由连线合成</dd><dt>变化</dt><dd class="cut-t">删掉：生图、打样等伪工程字段</dd></dl>'),
        ('v4.0', '09.27', '<dl class="kv"><dt>定位</dt><dd>多分支推演与协同工作台</dd><dt>做什么</dt><dd>多分支推演、来源追溯、多人协同</dd><dt>变化</dt><dd class="cut-t">删掉：右侧对话框、AI 主推标记</dd></dl>'),
    ]
    s3 = f'''
    <h3 class="rv">每次只问一个<br>会改变设计判断的问题。</h3>
    <ol class="loop rv" aria-label="SIFT 提问循环"><li>Brief</li><li>找不确定性</li><li class="on">关键提问 · 2–3 个对立选项</li><li>设计师回答</li><li>更新 State</li><li>人工确认点</li></ol>
    <p class="rv">AI 的推论标为“待确认”，设计师确认的才算事实；方向收敛或连续不确定时，平滑停到人工确认点。</p>
    <p class="sub-h rv gap-sm">我主导的三个取舍</p>
    {cuts([('09.18', '一次性输出长篇方案', '几千字的策略方案，测试中几乎没人读完，判断点被淹没。', '单轮收敛提问：每轮只问 2–3 个关键问题'),
           ('09.21', '生图、打样与公差字段', '效果图和伪工程字段让产品被当成出图工具，偏离“前期判断”的定位。', '删掉伪工程字段，概念画面只辅助判断'),
           ('09.22', '多个 AI 对话框来回切', '确认过的判断很难被找回和追溯。', '所有 AI 交互放进画布卡片，每一步都有来源')])}
    <p class="sub-h rv gap-sm">PRD 四个版本：定位越改越窄</p>
    {tabs('prd', prd, 'PRD 版本')}
    <p class="note rv">从“帮你找图”退到“帮你做判断”，后两版都在删掉会让人误解定位的功能。</p>'''

    s4 = f'''
    <h3 class="rv">一张画布，串起从 Brief<br>到提案的整条推演链。</h3>
    <p class="rv">简报 → 视觉抉择 → 策略基准 → 风格主题 → 灵感检索 → 画面生成。每张卡片标明状态，并写清自己继承了谁。点任意一张，或按“播放推演”看它怎么一步步收敛。</p>
    <figure class="fig rv wide">{canvas()}<figcaption><span class="fn px">Fig. 01</span><b>可追溯的画布</b>按真实界面重建的示例链路。每张卡片底部的 ↳ 都指向它的来源，所以方向能被讲清楚。</figcaption></figure>

    <div class="feat gap-top">
      <figure class="fig rv">{ask_card()}<figcaption><span class="fn px">Fig. 02</span><b>关键提问卡</b>可直接点选试试，选择会即时写入记录。</figcaption></figure>
      <div class="rv d1">
        <p class="eyebrow px">Ask card · 提问只问分水岭</p>
        <h3 class="h-sm">四条规则，<br>让提问变成抉择。</h3>
        <ol class="steps">
          <li><div><b>每轮 2–3 题</b><span>每题对应一个会改变方向的变量，题干不超过 35 字。</span></div></li>
          <li><div><b>选项彼此对立</b><span>风琴褶 / 卷收式 / 伸缩套筒，逼出真实偏好。</span></div></li>
          <li><div><b>允许“暂不确定”</b><span>前期保留探索空间，不确定的题单独记录、不阻塞流程。</span></div></li>
          <li><div><b>回答即沉淀</b><span>结果写进视觉抉择记录，后续卡片全部回指它。</span></div></li>
        </ol>
      </div>
    </div>

    <div class="gap-top">
      <h3 class="h-sm rv">改动前后：提问从“问卷”变成“抉择”。</h3>
      <figure class="fig">{ba()}<figcaption class="rv"><span class="fn px">Fig. 03</span><b>提问界面 Before / After</b>早期版本为重绘示意；当前版本按线上界面重建。</figcaption></figure>
    </div>

    <div class="gap-top">
      <h3 class="h-sm rv">主题越往后越偏离 Brief？<br>给每个主题挂上“血统”。</h3>
      <p class="rv">测试中“折叠水壶”到后段被泛化成“通用极简容器”，前面确认的材质倾向也被遗忘。对策是让每个风格主题都说清自己从哪里来。</p>
      <div class="cards" style="--c:4">
        <div class="card rv"><h4>主语锚定</h4><p>核心品类作为不可变主语贯穿全链路。</p></div>
        <div class="card rv d1"><h4>Brief 锚点</h4><p>继承了最初的哪条核心主张。</p></div>
        <div class="card rv d2"><h4>确认取舍</h4><p>吸纳了哪一轮提问的选择。</p></div>
        <div class="card rv d3"><h4>避坑防线</h4><p>主动规避了哪些已声明的禁忌。</p></div>
      </div>
    </div>'''

    s5 = f'''
    <h3 class="rv">从概念到线上可用，<br>再到两轮用户测试。</h3>
    {metrics([('4 周', 'PRD 从 v1.0 迭代至 v4.0', '2026.09 – 10', False), ('100+', '次代码提交', '线上可用版本', False), ('6', '位新参与者参与终期复测', '中期 + 终期两轮', True), ('17', '个垂直设计检索源', '每个主题精选 3 处', True)], 'dark')}
    <div class="shift gap-sm rv">
      <div><p class="px">中期集中问题</p><ul><li>文字偏多</li><li>只给链接</li><li>视觉证据不足</li><li>流程偏长</li></ul></div>
      <span class="ar" aria-hidden="true">→</span>
      <div class="on"><p class="px">终期变化</p><ul><li>流程关系更清楚</li><li>搜索更有方向</li><li>参考证据回到画布</li><li>非设计角色更易参与</li></ul></div>
    </div>
    <div class="voices gap-sm">
      <blockquote class="rv"><p>“这次我能看懂每张卡片为什么会出现，不再像上次只是一直回答问题。但卡片多起来以后还是会有点迷路。”</p><cite>LM · 服务设计方向</cite><span class="good">✓ 流程关系明显更清楚</span><span class="warn">△ 信息密度开始上升</span></blockquote>
      <blockquote class="rv d1"><p>“我不是设计师，但现在能理解为什么从 Brief 走到这个方向，也知道该怎么给反馈，而不是只说‘感觉不对’。”</p><cite>JWY · 产品经理</cite><span class="good">✓ 非设计角色更易参与</span><span class="warn">△ 专业术语仍有门槛</span></blockquote>
      <blockquote class="rv d2"><p>“我喜欢现在可以保留多个方向再回来比，更像真实设计过程，不像做 AI 问卷。不过确认 / 存疑 / 废弃第一次会犹豫。”</p><cite>SY · 交互 / UX 方向</cite><span class="good">✓ 更接近真实工作流</span><span class="warn">△ 状态机制需要学习</span></blockquote>
    </div>
    <p class="note rv">终期测试为 6 位参与者的定性反馈，以上摘录其中 3 位。新问题从“好不好用”转向信息密度和学习成本。</p>
    <h3 class="h-sm rv gap-top">65 秒看完 SIFT。</h3>
    <div class="video rv"><video controls playsinline preload="none" width="1920" height="1080" poster="{I}sift-launch-poster.jpg" aria-label="SIFT 发布短片，65 秒"><source src="{B}assets/video/sift-launch.mp4" type="video/mp4">你的浏览器不支持视频播放。<a href="{B}assets/video/sift-launch.mp4">下载视频</a></video></div>
    <p class="note rv">约 19 MB · 点击播放后才开始加载。</p>'''

    s6 = '''
    <p class="quote rv">最难的不是让 AI 多说，而是让它问对问题。</p>
    <div class="cards gap-sm" style="--c:3">
      <div class="card rv"><h4>克制比功能更难</h4><p>删掉打样、渲染、完成度这些“看起来很强”的功能，产品反而更像设计师的搭档。</p></div>
      <div class="card rv d1"><h4>假设和事实要分开</h4><p>AI 的推论标为待确认，设计师确认的才算事实，信任感来自透明。</p></div>
      <div class="card rv d2"><h4>做组长也要做取舍</h4><p>在调研、设计和开发之间排优先级，每次转向都写进决策日志。</p></div>
    </div>
    <p class="sub-h rv gap-sm">下一轮方案（尚未上线）</p>
    <div class="table-scroll rv" tabindex="0" role="region" aria-label="终期问题与下一轮方案">
    <table class="compare">
      <thead><tr><th scope="col">终期新问题</th><th scope="col">提出者</th><th scope="col">下一轮设计方案</th></tr></thead>
      <tbody>
        <tr><th scope="row">卡片多了会迷路</th><td data-label="提出者">LM · 服务设计</td><td class="new" data-label="下一轮">按阶段折叠卡片，画布加小地图与“当前步骤”指示</td></tr>
        <tr><th scope="row">专业术语有门槛</th><td data-label="提出者">JWY · 产品经理</td><td class="new" data-label="下一轮">术语悬停释义，为非设计角色提供通俗说法</td></tr>
        <tr><th scope="row">跳到外部会断思路</th><td data-label="提出者">CH · 工业设计</td><td class="new" data-label="下一轮">浏览器插件把外部图片直接回填到对应卡片</td></tr>
        <tr><th scope="row">关键结论不够醒目</th><td data-label="提出者">WY · 甲方 / 市场</td><td class="new" data-label="下一轮">画布顶部置顶“当前结论”摘要，可一键导出给客户</td></tr>
      </tbody>
    </table>
    </div>'''

    return head('SIFT — Leyson', 'SIFT：设计前期的 AI 视觉策略收敛智能体。每次只问一个会改变设计判断的问题。', B, PATH, 'article') + nav('work', B) + f'''
<main id="main" class="case">
<section class="case-hero theme-sift">
  <div class="wrap">
    {crumb('SIFT')}
    <p class="case-id px rv"><img src="{I}logo-sift.png" alt="">SIFT · 01 / 03</p>
    <h1 class="rv">Sift the noise.<br>Find the direction.</h1>
    <p class="sub rv d1">设计前期的 AI 智能体：把一句模糊 Brief，收敛成说得清来由的视觉方向。</p>
    {meta([('Role', '组长<br>调研 · 产品定义 · 交互设计'), ('Team', '3 人小组'), ('Timeline', '2026.09 – 10 · 4 周<br>PRD 迭代至 v4.0'), ('Platform', 'Web · 已上线'), ('Tools', '借助 AI 编程工具完成开发<br>Next.js · React Flow · DeepSeek')])}
    <div class="case-visual rv"><img class="zoom" src="{I}sift-hero.jpg" alt="SIFT 界面卡片组合：风格主题、概念画面与策略基准" fetchpriority="high"></div>
  </div>
</section>

{tldr([('Problem · 问题', '拿到模糊 Brief，设计师不缺图，缺的是“先判断什么、再搜什么”的次序。'), ('My role · 我的角色', '3 人小组组长：主导调研、产品定义与交互设计，借助 AI 编程工具完成开发。'), ('Key decision · 关键判断', '不拼素材量、不做对话框：每轮只问 2–3 个分水岭问题，所有交互放进可追溯的画布。'), ('Outcome · 结果', '4 周 PRD 迭代至 v4.0 并上线；中期与终期两轮用户测试，100+ 次代码提交。')])}
{toc([('problem', '01', '问题', 'Problem'), ('insight', '02', '洞察', 'Insight'), ('decision', '03', '关键判断', 'Decision'), ('design', '04', '设计', 'Design'), ('outcome', '05', '结果', 'Outcome'), ('reflect', '06', '反思', 'Reflection')])}
{sec('problem', '01', '问题', 'Problem', s1)}
{sec('insight', '02', '洞察', 'Insight', s2)}
{sec('decision', '03', '关键判断', 'Decision', s3, 'dark-sec')}
{sec('design', '04', '设计', 'Design', s4)}
{sec('outcome', '05', '结果', 'Outcome', s5, 'dark-sec')}
{sec('reflect', '06', '反思', 'Reflection', s6)}
</main>
''' + pager('sift') + foot(B)
