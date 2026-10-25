// Leyson. — small interactions (vanilla, no dependencies)
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- toast ---------- */
  const toastEl = $('.toast'); let toastT;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 1800);
  };

  /* ---------- nav border on scroll ---------- */
  const nav = $('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal on scroll ---------- */
  const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  $$('.rv').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------- the dot: Leyson’s mark. Click to recolour, remembered across pages ---------- */
  const DOTS = [['#F0687F', '珊瑚红'], ['#8FA6FF', '薰衣草'], ['#1466FF', '钴蓝'], ['#22B45E', '薄荷绿'], ['#F5A524', '琥珀黄']];
  const cur = () => getComputedStyle(root).getPropertyValue('--dot').trim().toUpperCase();
  $$('[data-dot]').forEach((b) => b.addEventListener('click', () => {
    const i = DOTS.findIndex(([c]) => c === cur());
    const [c, name] = DOTS[(i + 1) % DOTS.length];
    root.style.setProperty('--dot', c);
    try { localStorage.setItem('ly-dot', c); } catch (e) { /* private mode */ }
    $$('.mk').forEach((m) => { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); });
    toast(`这个点换成了${name} · 全站同步`);
  }));

  /* hero dot leans toward the pointer, like it’s paying attention */
  const follow = $('[data-follow]');
  if (follow && fine && !reduce) {
    window.addEventListener('pointermove', (e) => {
      const r = follow.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 600) * 10;
      follow.style.setProperty('--fx', `${(dx / d) * k}px`);
      follow.style.setProperty('--fy', `${(dy / d) * k}px`);
    }, { passive: true });
  }

  /* ---------- live Guangzhou time in the status card ---------- */
  const clock = $('[data-clock]');
  if (clock) {
    const t = $('time', clock);
    const fmt = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => {
      const s = fmt.format(new Date()); const h = parseInt(s, 10);
      t.innerHTML = s.replace(':', '<span class="cl">:</span>'); t.dateTime = s;
      const night = h >= 22 || h < 7;
      clock.classList.toggle('night', night);
      clock.title = night ? '广州 · 夜间' : '广州 · 白天';
    };
    tick(); setInterval(tick, 20000);
  }

  /* ---------- status card: pixel avatar + cycling rows ---------- */
  const PXC = { o: '#29231F', y: '#F7C948', p: '#F2A0A8', w: '#FFFFFF', g: '#7CC3A6', s: '#F7C948', b: '#A5643A', r: '#F0687F', u: '#8FB3E8' };
  const pxSvg = (rows) => `<svg viewBox="0 0 8 8" shape-rendering="crispEdges">${rows.map((row, y) => [...row].map((c, x) => c === '.' ? '' : `<rect x="${x}" y="${y}" width="1" height="1" fill="${PXC[c]}"/>`).join('')).join('')}</svg>`;
  const ICONS = {
    excited: ['..oooo..', '.oyyyyo.', 'oyoyyoyo', 'oyyyyyyo', 'opooooPo'.replace('P', 'p'), 'oyorroyo', '.oyyyyo.', '..oooo..'],
    focus: ['..oooo..', '.oyyyyo.', 'ooyyyooo'.slice(0, 8), 'oyyyyyyo', 'oyyyyyyo', 'oyyooyyo', '.oyyyyo.', '..oooo..'],
    sleepy: ['..oooo..', '.oyyyyo.', 'oyyyyyyo', 'ooyyyooo'.slice(0, 8), 'opyyyypo', 'oyyooyyo', '.oyyyyo.', '..oooo..'],
    happy: ['..oooo..', '.oyyyyo.', 'oyoyyoyo', 'opyyyypo', 'ooyyyyoo', 'oyooooyo', '.oyyyyo.', '..oooo..'],
    folio: ['oooooooo', 'owwwwwwo', 'owswwwwo', 'owwwwgwo', 'owwwgggo', 'owgggggo', 'owwwwwwo', 'oooooooo'],
    proto: ['......oo', '.....oro', '....oyoo', '...oyyo.', '..oyyo..', '.oyyo...', 'owoo....', 'oo......'],
    read: ['........', 'oooooooo', 'owwwowwo', 'oowwoowo', 'owwwowwo', 'oowwoowo', 'oooooooo', '........'],
    coffee: ['..w.w...', '...w.w..', 'oooooo..', 'obbbboo.', 'obbbbo.o', 'obbbboo.', '.oooo...', 'oooooo..'],
  };
  const CYC = {
    mood: [['有点兴奋', 'excited'], ['很专注', 'focus'], ['有点困', 'sleepy'], ['挺开心', 'happy']],
    doing: [['打磨作品集', 'folio'], ['画交互原型', 'proto'], ['读论文', 'read'], ['续一杯咖啡', 'coffee']],
  };
  $$('[data-cyc]').forEach((btn) => {
    const list = CYC[btn.dataset.cyc], ico = $('.pxi', btn), lab = $('span', btn), dt = btn.closest('dd').previousElementSibling.textContent;
    let i = 0;
    const show = (anim) => {
      ico.innerHTML = pxSvg(ICONS[list[i][1]]); lab.textContent = list[i][0];
      btn.setAttribute('aria-label', `${dt}：${list[i][0]}（点一下换一个）`);
      if (anim && !reduce) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    };
    btn.addEventListener('click', () => { i = (i + 1) % list.length; show(true); });
    show(false);
  });
  const ava = $('[data-ava]'), say = $('[data-ava-say]');
  if (ava && say) {
    const LINES = ['嗨，我是 Leyson', '要不要看看作品？', '实习机会欢迎来聊', '排版又改了一版'];
    let k = 0, hideT = 0;
    const blink = () => { ava.classList.add('blink'); setTimeout(() => ava.classList.remove('blink'), 140); };
    ava.addEventListener('click', () => {
      say.textContent = LINES[k]; k = (k + 1) % LINES.length;
      say.classList.add('show'); clearTimeout(hideT); hideT = setTimeout(() => say.classList.remove('show'), 2200);
      if (!reduce) { ava.classList.remove('hop'); void ava.offsetWidth; ava.classList.add('hop'); blink(); }
    });
    ava.addEventListener('animationend', () => ava.classList.remove('hop'));
    if (!reduce) { const loop = () => { blink(); setTimeout(loop, 2800 + Math.random() * 2600); }; setTimeout(loop, 2000); }
  }

  /* ---------- tilt + magnetic (fine pointers only) ---------- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${x * 6}deg`); el.style.setProperty('--rx', `${-y * 6}deg`);
      });
      el.addEventListener('pointerleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
    });
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    /* work list: the preview image follows the pointer inside the row */
    $$('[data-peek]').forEach((a) => a.addEventListener('pointermove', (e) => {
      const r = a.getBoundingClientRect();
      a.style.setProperty('--mx', `${Math.min(Math.max(e.clientX - r.left, 200), r.width * 0.42)}px`);
      a.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  }

  /* ---------- cursor dot: the mark follows you around ---------- */
  const cur$ = $('.cursor');
  if (cur$ && fine && !reduce) {
    root.classList.add('has-cursor');
    const dot = $('span', cur$);
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      cur$.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY; cur$.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);
      const lab = e.target.closest('[data-cursor], .zoom');
      const hide = e.target.closest('a, button, input, [data-dot]') && !lab;
      cur$.classList.toggle('label', !!lab);
      cur$.classList.toggle('hide', !!hide);
      dot.textContent = lab ? (lab.dataset.cursor || '放大') : '';
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur$.classList.remove('on'));
  }

  /* ---------- lightbox ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', '查看大图');
  lb.innerHTML = '<img alt=""><button type="button" aria-label="关闭大图">×</button>';
  document.body.appendChild(lb);
  const big = $('img', lb), closeBtn = $('button', lb); let opener = null;
  const close = () => {
    if (!lb.classList.contains('on')) return;
    lb.classList.remove('on'); document.body.style.overflow = '';
    big.removeAttribute('src'); if (opener) opener.focus();
  };
  $$('img.zoom').forEach((img) => {
    img.tabIndex = 0; img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `放大查看：${img.alt}`);
    const open = () => {
      opener = img; big.src = img.currentSrc || img.src; big.alt = img.alt;
      lb.classList.add('on'); document.body.style.overflow = 'hidden'; closeBtn.focus();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab' && lb.classList.contains('on')) { e.preventDefault(); closeBtn.focus(); }
  });

  /* ---------- case study: active section in the index + reading progress ---------- */
  const toc = $('.toc');
  if (toc) {
    const links = $$('a', toc), list = $('ol', toc);
    const secs = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
    const main = $('main');
    const update = () => {
      const line = window.innerHeight * 0.35;
      let act = -1;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < line) act = i; });
      links.forEach((a, i) => {
        const on = i === act;
        if (on !== a.classList.contains('on')) {
          a.classList.toggle('on', on);
          if (on) { a.setAttribute('aria-current', 'location'); list.scrollTo({ left: a.offsetLeft - list.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); }
          else a.removeAttribute('aria-current');
        }
      });
      const r = main.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      toc.style.setProperty('--p', p.toFixed(3));
    };
    window.addEventListener('scroll', update, { passive: true }); update();
  }

  /* ---------- numbers count up once when they appear ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      const el = e.target, txt = el.textContent, m = txt.match(/([\d.]+)(.*)/);
      if (!m) return;
      const end = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1100), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toFixed(dec) + m[2];
        if (k < 1) requestAnimationFrame(step); else el.textContent = txt;
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- copy email ---------- */
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const v = b.dataset.copy; let ok = false;
    try { await navigator.clipboard.writeText(v); ok = true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } ta.remove();
    }
    const s = $('span', b);
    s.textContent = ok ? '已复制 ✓' : '复制失败'; b.classList.toggle('done', ok);
    toast(ok ? `邮箱已复制：${v}` : '复制失败，请手动选择邮箱');
    setTimeout(() => { s.textContent = '复制'; b.classList.remove('done'); }, 2000);
  }));


  /* ==========================================================
     Case-study recreations (all keyboard-operable, reduced-motion safe)
     ========================================================== */

  /* ---------- generic tabs: arrow keys move, Home/End jump ---------- */
  $$('[data-tabs]').forEach((box) => {
    const tabs = $$('[role=tab]', box);
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ---------- SIFT: traceable canvas ---------- */
  $$('[data-canvas]').forEach((cv) => {
    const nodes = $$('.cv-node', cv), panes = $$('.cv-pane', cv), play = $('[data-play]', cv);
    let timer = 0;
    const show = (i) => {
      nodes.forEach((n, k) => n.setAttribute('aria-pressed', k === i));
      panes.forEach((p, k) => { p.hidden = k !== i; });
    };
    const stop = () => { clearInterval(timer); timer = 0; play.setAttribute('aria-pressed', 'false'); play.innerHTML = '<span aria-hidden="true">▶</span> 播放推演'; };
    nodes.forEach((n, i) => n.addEventListener('click', () => { stop(); show(i); }));
    play.setAttribute('aria-pressed', 'false');
    play.addEventListener('click', () => {
      if (timer) return stop();
      let i = 0; show(0);
      play.setAttribute('aria-pressed', 'true'); play.innerHTML = '<span aria-hidden="true">❚❚</span> 暂停';
      timer = setInterval(() => { i += 1; if (i >= nodes.length) return stop(); show(i); }, reduce ? 3200 : 2200);
    });
  });

  /* ---------- SIFT: ask card writes into the decision record ---------- */
  $$('[data-ask]').forEach((card) => {
    const out = $('[data-ask-out]', card);
    const qs = $$('fieldset', card);
    const render = () => {
      out.innerHTML = qs.map((f, i) => {
        const c = $('input:checked', f);
        const v = c ? c.value : '—';
        return `<li><b>${i + 1}</b>${v === '暂不确定' ? '暂不确定 · 单独记录，不阻塞流程' : '已选：' + v}</li>`;
      }).join('');
    };
    card.addEventListener('change', render); render();
  });

  /* ---------- Picto: state picker → partner's home ---------- */
  $$('[data-picto]').forEach((demo) => {
    const get = (n) => $(`input[name=${n}]:checked`, demo);
    const o = (k) => $(`[data-o=${k}]`, demo);
    const scr = $('[data-scr]', demo);
    const svgHeart = (c) => `<svg class="hrt" viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" fill="${c}" stroke="#29231F" stroke-width=".35"/></svg>`;
    const update = (e) => {
      const m = get('mood'), d = get('doing'), p = get('pref');
      o('mood').textContent = m.value; o('doing').textContent = d.value;
      o('sent').textContent = `琪琪现在${m.value}，正在${d.value}。`;
      o('heart').innerHTML = svgHeart(p.dataset.c);
      o('pline').textContent = p.value === '只想被看见' ? '看见就好，不必开启聊天。' : `联系偏好：${p.value}`;
      scr.style.setProperty('--mc', m.dataset.c);
      ['mood', 'doing', 'pref'].forEach((n) => { $(`[data-sel=${n}]`, demo).textContent = '已选 · ' + get(n).value; });
      if (e && !reduce) { scr.classList.remove('bump'); void scr.offsetWidth; scr.classList.add('bump'); }
    };
    demo.addEventListener('change', update); update();
  });

  /* ---------- Picto: 留一句 ---------- */
  $$('[data-note]').forEach((card) => {
    const inp = $('[data-note-in]', card), cnt = $('[data-note-cnt]', card), dur = $('[data-note-dur]', card);
    const up = () => {
      cnt.textContent = `${[...inp.value].length}/30`;
      const d = $('input[name=dur]:checked', card).value;
      dur.textContent = d;
    };
    card.addEventListener('input', up); card.addEventListener('change', up); up();
  });

  /* ---------- Focenda: data + rules (straight from the prototype’s local rules) ---------- */
  const fdata = $('#foc-data');
  if (fdata) {
    const T = JSON.parse(fdata.textContent);
    const quad = (t) => (t.i >= 50 ? (t.e < 50 ? ['do', '优先完成'] : ['focus', '专注推进']) : (t.e < 50 ? ['easy', '顺手处理'] : ['cut', '考虑删减']));
    const tip = (t) => {
      if (t.i >= 70 && t.e >= 70) return '这项任务重要且需要专注，建议留出完整时间，并先拆成 2–3 个小步骤。';
      if (t.i >= 70) return '规则：重要 ≥70 → 适合优先完成。';
      if (t.i < 50 && t.e > 50) return '规则：重要 <50 且精力 >50 → 缩小范围或延后。';
      return '未触发建议规则，按所选节奏排入时间轴。';
    };
    const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

    /* quadrant → detail */
    $$('[data-quad]').forEach((qd) => {
      const fd = $('[data-fd]', qd), f = (k) => $(`[data-f=${k}]`, fd), bs = $$('button.bb', qd);
      bs.forEach((b) => b.addEventListener('click', () => {
        const t = T[+b.dataset.task];
        bs.forEach((x) => x.setAttribute('aria-pressed', x === b));
        f('name').textContent = t.n; f('i').textContent = t.i; f('e').textContent = t.e;
        f('time').textContent = t.f ? `${t.f}–${fmt(parseInt(t.f, 10) * 60 + t.m)} · 用户锁定时间` : '尚未指定时间';
        f('min').textContent = `${t.m} 分钟`; f('q').textContent = quad(t)[1]; f('tip').textContent = tip(t);
        if (!reduce) { fd.classList.remove('flash'); void fd.offsetWidth; fd.classList.add('flash'); }
      }));
    });

    /* timeline: lock fixed time + lunch, then fill gaps in rhythm order */
    $$('[data-tl]').forEach((tl) => {
      const track = $('[data-tl-track]', tl), list = $('[data-tl-list]', tl), sum = $('[data-tl-sum]', tl), ot = $('[data-tl-ot]', tl);
      const D0 = 9 * 60, D1 = 21 * 60, OFF = 18 * 60, pct = (m) => ((m - D0) / (D1 - D0)) * 100;
      const order = {
        focus: (a, b) => (b.i * 1.2 - b.e * 0.15) - (a.i * 1.2 - a.e * 0.15),
        bal: (a, b) => b.i / b.e - a.i / a.e,
        easy: (a, b) => a.e - b.e,
      };
      const plan = (r) => {
        const gap = r === 'focus' ? 0 : 15;
        const fixed = T.filter((t) => t.f).map((t) => { const s = parseInt(t.f, 10) * 60 + (+t.f.split(':')[1] || 0); return { t, s, e: s + t.m, fixed: true }; });
        const blocks = [...fixed, { lunch: true, s: 12 * 60, e: 13 * 60 }];
        const out = [];
        let cur = D0;
        T.filter((t) => !t.f).sort(order[r]).forEach((t) => {
          let moved = true;
          while (moved) {
            moved = false;
            for (const b of blocks) { if (cur < b.e && cur + t.m > b.s) { cur = b.e + gap; moved = true; } }
          }
          out.push({ t, s: cur, e: cur + t.m }); cur += t.m + gap;
        });
        return [...blocks, ...out].sort((a, b) => a.s - b.s);
      };
      const draw = () => {
        const r = $('input[name=rhythm]:checked', tl).value, items = plan(r);
        $$('.blk', track).forEach((x) => x.remove());
        list.innerHTML = '';
        let over = 0;
        items.forEach((it) => {
          const q = it.lunch ? '' : 'q-' + quad(it.t)[0], isOver = it.e > OFF;
          if (isOver && !it.lunch) over += 1;
          const b = document.createElement('span');
          b.className = `blk ${q}${it.lunch ? ' lunch' : ''}${it.fixed ? ' fixed' : ''}${isOver ? ' over' : ''}`;
          b.style.left = pct(it.s) + '%'; b.style.width = pct(it.e) - pct(it.s) + '%';
          track.appendChild(b);
          const li = document.createElement('li');
          li.className = `${q}${it.lunch ? ' lunch' : ''}${isOver ? ' over' : ''}`;
          const name = it.lunch ? '午休' : it.t.n;
          const tag = it.lunch ? '锁定' : it.fixed ? '用户锁定时间' : isOver ? '超时' : quad(it.t)[1];
          li.innerHTML = `<time>${fmt(it.s)}–${fmt(it.e)}</time><span class="nm"><i></i><span>${name}</span></span><span class="tg">${tag}</span>`;
          list.appendChild(li);
        });
        const total = T.reduce((a, t) => a + t.m, 0);
        sum.textContent = `今天已离线安排 ${T.length} 项任务，预计需要 ${Math.floor(total / 60)} 小时 ${total % 60} 分钟。`;
        ot.textContent = over ? `${over} 项超过 18:00 下班界限` : '';
      };
      tl.addEventListener('change', draw); draw();
    });
  }

  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
