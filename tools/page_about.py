from build import head, nav, foot, STATUS

PATH = 'about.html'

HONORS = [('国赛一等奖', '第十四届全国海洋航行器设计与制作大赛；另获省赛二等奖'),
          ('省级创新项目立项', '《“一器多形”——传统花器模块化创新设计》'),
          ('2024–2025 学年', '三好学生 · 校级奖学金 · 勤工助学先进个人')]
SKILLS = [('交互与体验', '用户研究 · 信息架构 · 交互流程 · 可用性测试'),
          ('视觉与原型', 'Figma · 设计系统 · 高保真原型 · 像素角色与动效'),
          ('设计软件', 'Photoshop · Illustrator · Creo · KeyShot'),
          ('AI 工具', '用 Claude、Cursor、Codex 等 AI 编程工具把设计做成可运行原型')]
EXP = [('广州美术学院 · 教务部助理', '2024.12 – 2026.05 · 毕业展、“未来学院”论坛平面设计；优化资料归档流程'),
       ('工业设计学院团委学生会 · 文娱部', '2023.09 – 2024.09 · 策划执行校庆“八杂街”，参与校运会组织'),
       ('心理委员', '参与培训、督导模拟与谈话训练')]


def block(title, items):
    li = ''.join(f'<li><b>{a}</b><span>{b}</span></li>' for a, b in items)
    return f'<div class="cv-b rv"><h2 class="lab">{title}</h2><ul>{li}</ul></div>'


def render():
    return head('关于 — Leyson', '梁宇森 Leyson，广州美术学院工业设计（智能交互方向）本科，2027届，UI / 交互设计。', path='about.html') + nav('about') + f'''
<main id="main">
<section class="a-hero wrap">
  <div class="a-photo rv"><img src="assets/img/portrait.jpg" alt="梁宇森 Leyson 的照片" loading="eager"></div>
  <div class="a-txt rv d1">
    <p class="h-id"><img class="ava" src="assets/img/avatar-pixel.png" alt="" width="40" height="40" loading="eager"><span>梁宇森 <span class="pn">Leyson</span></span></p>
    <h1>你好，我是 <span class="pn">Leyson</span>。</h1>
    <p class="a-bio">广州美术学院 工业设计（智能交互方向）本科，2027届。工业设计出身，关心人和系统之间那一点点摩擦：先把问题定义清楚，再用减法做取舍，最后借助 AI 编程工具做成能跑的原型。</p>
    <p class="h-line">{STATUS}</p>
  </div>
</section>
<section class="a-cv wrap">
  {block('荣誉', HONORS)}
  {block('技能', SKILLS)}
  {block('经历', EXP)}
</section>
</main>
''' + foot()
