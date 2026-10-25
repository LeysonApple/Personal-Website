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
      t.textContent = s; t.dateTime = s;
      const night = h >= 22 || h < 7;
      clock.classList.toggle('night', night);
      clock.title = night ? '广州 · 夜间' : '广州 · 白天';
    };
    tick(); setInterval(tick, 20000);
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

  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
