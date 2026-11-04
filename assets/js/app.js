/* IAmAZING CONTENT // WEBSITE v2 // runtime
   Módulos: fondo ASCII, intro, scramble de títulos, reveal, contadores,
   carrusel de clientes, reels, casos, precios y formulario de prueba. */
(() => {
  'use strict';
  const C = window.IAMC || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const BLUE = '#4469F6', CEMENT = '#8D939F', ASH = '#5F6368';

  const fmt = (n) => {
    if (n == null) return '—';
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.0', '') + ' M';
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace('.0', '') + ' K';
    return String(n);
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 1. fondo ASCII (versión v1, optimizada para móvil) ---------- */
  function asciiBg() {
    const cv = $('#ascii-bg'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const chars = ['.', '-', '+', '=', 'o', 'x', 'O', '#', 'M', '@'];
    const CELL = isTouch ? 20 : 16;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, cols, rows, t = 0, last = 0, running = true;
    const p = { x: -9999, y: -9999, r: isTouch ? 150 : 220 };
    const resize = () => {
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL);
      ctx.font = `700 ${CELL * .8}px Inconsolata, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    };
    const draw = (now) => {
      if (!running) return;
      requestAnimationFrame(draw);
      if (now - last < (isTouch ? 50 : 33)) return; // 20 fps móvil / 30 fps desktop
      last = now; t += .04;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const cx = i * CELL + CELL / 2, cy = j * CELL + CELL / 2;
        const d = Math.hypot(p.x - cx, p.y - cy);
        let v = Math.sin(i * .18 + t) * Math.cos(j * .18 + t), inf = 0;
        if (d < p.r) { inf = 1 - d / p.r; v += Math.sin(inf * Math.PI * 3 - t * 2) * inf * 2.5; }
        const n = (Math.sin(v) + 1) / 2;
        const ch = chars[Math.max(0, Math.min(chars.length - 1, Math.floor(n * chars.length)))];
        if (inf > 0) { ctx.globalAlpha = .45 + inf * .5; ctx.fillStyle = d < p.r * .4 ? BLUE : CEMENT; }
        else { ctx.globalAlpha = .22; ctx.fillStyle = ASH; }
        ctx.fillText(ch, cx, cy);
      }
      ctx.globalAlpha = 1;
    };
    resize(); addEventListener('resize', resize);
    const move = (x, y) => { p.x = x; p.y = y; };
    addEventListener('pointermove', (e) => move(e.clientX, e.clientY), { passive: true });
    addEventListener('pointerdown', (e) => move(e.clientX, e.clientY), { passive: true });
    addEventListener('pointerleave', () => move(-9999, -9999));
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) requestAnimationFrame(draw); });
    if (reduced) { draw(1e9); running = false; return; } // un solo frame estático
    requestAnimationFrame(draw);
  }

  /* ---------- 2. intro ASCII (solo primera visita de la sesión) ---------- */
  function intro() {
    const box = $('#intro'); if (!box) return;
    let seen = false;
    try { seen = sessionStorage.getItem('iamc-intro') === '1'; } catch (e) {}
    const done = () => {
      box.classList.add('out'); document.body.style.overflow = '';
      try { sessionStorage.setItem('iamc-intro', '1'); } catch (e) {}
      setTimeout(() => box.remove(), 1000);
    };
    if (seen || reduced) { box.remove(); return; }
    const video = $('video', box), cv = $('canvas', box), ctx = cv.getContext('2d', { willReadFrequently: true });
    const PAL = [[95, 99, 104, ASH], [141, 147, 159, CEMENT], [68, 105, 246, BLUE]];
    const RAMP = ' .,:;i1tfLCG08@';
    const CELL = isTouch ? 8 : 7;
    let cols, rows, tmp, tctx, raf;
    document.body.style.overflow = 'hidden';
    const layout = () => {
      cv.width = innerWidth; cv.height = innerHeight;
      cols = Math.floor(innerWidth / CELL); rows = Math.floor(innerHeight / (CELL * 1.6));
      tmp = document.createElement('canvas'); tmp.width = cols; tmp.height = rows;
      tctx = tmp.getContext('2d', { willReadFrequently: true });
      ctx.font = `700 ${Math.floor(CELL * 1.55)}px Inconsolata, monospace`; ctx.textBaseline = 'top';
    };
    const pct = $('#intro-pct');
    const frame = () => {
      if (video.paused || video.ended) return;
      if (pct && video.duration) pct.textContent = Math.min(100, Math.round((video.currentTime / video.duration) * 100));
      tctx.drawImage(video, 0, 0, cols, rows);
      const px = tctx.getImageData(0, 0, cols, rows).data;
      ctx.fillStyle = '#0A0A0A'; ctx.fillRect(0, 0, cv.width, cv.height);
      const cw = cv.width / cols, chh = cv.height / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 4, R = px[i], G = px[i + 1], B = px[i + 2];
        const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(((.299 * R + .587 * G + .114 * B) / 255) * RAMP.length))];
        if (ch === ' ') continue;
        let best = 0, bd = Infinity;
        PAL.forEach((p, k) => { const d = (p[0] - R) ** 2 + (p[1] - G) ** 2 + (p[2] - B) ** 2; if (d < bd) { bd = d; best = k; } });
        ctx.fillStyle = PAL[best][3]; ctx.fillText(ch, c * cw, r * chh);
      }
      raf = requestAnimationFrame(frame);
    };
    video.addEventListener('play', () => { layout(); raf = requestAnimationFrame(frame); });
    video.addEventListener('ended', () => { cancelAnimationFrame(raf); done(); });
    $('.intro-skip', box)?.addEventListener('click', () => { video.pause(); cancelAnimationFrame(raf); done(); });
    setTimeout(() => { if (box.isConnected) done(); }, 9000); // seguro: nunca bloquear más de 9 s
    video.play().catch(done);
  }

  /* ---------- 3. scramble de títulos (efecto consola) ---------- */
  function scramble(el) {
    const final = el.dataset.text || el.textContent; el.dataset.text = final;
    if (reduced) return;
    const glyphs = '!<>-_\\/[]{}=+*^?#01';
    let f = 0; const total = 12;
    const tick = () => {
      el.textContent = final.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        return i < (f / total) * final.length ? ch : glyphs[(Math.random() * glyphs.length) | 0];
      }).join('');
      if (++f <= total) requestAnimationFrame(tick); else el.textContent = final;
    };
    tick();
  }

  /* ---------- 4. contadores ---------- */
  function countUp(el) {
    const end = +el.dataset.count; if (!end) return;
    if (reduced) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1400;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(end * e));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- 5. reveal on scroll ---------- */
  function observe() {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; io.unobserve(el);
      el.classList.add('in');
      if (el.matches('[data-scramble]')) scramble(el);
      $$('[data-count]', el).forEach(countUp);
      if (el.matches('[data-count]')) countUp(el);
    }), { threshold: .15 });
    $$('.reveal, [data-scramble], [data-count]').forEach((el) => io.observe(el));
  }

  /* ---------- 6. carrusel de clientes (home) ---------- */
  function clientMarquee() {
    const track = $('#client-track'); if (!track || !C.clients) return;
    const card = (c) => `<a class="client" href="${esc(c.url)}" target="_blank" rel="noopener">
        <span class="c-meta">${esc(c.id)} // ${esc(c.niche)}</span>
        <span class="c-num">${fmt(c.subs)}</span>
        <span class="c-name">${esc(c.name)}</span>
        <span class="c-meta">suscriptores</span></a>`;
    const html = C.clients.map(card).join('');
    track.innerHTML = html + html.replace(/<a /g, '<a aria-hidden="true" tabindex="-1" ');
  }

  /* ---------- 7. reels (portafolio) ---------- */
  function reels() {
    const track = $('#reel-track'); if (!track || !C.reels) return;
    const list = C.reels.filter((r) => r.file);
    if (!list.length) { track.closest('.reel').hidden = true; return; }
    track.innerHTML = list.map((r, i) => `<figure class="reel-item">
        <div class="reel-media"><video src="../assets/video/${esc(r.file)}"${r.poster ? ` poster="../assets/video/${esc(r.poster)}"` : ''} muted playsinline loop preload="none" aria-label="${esc(r.title)}"></video></div>
        <figcaption class="reel-cap"><b>${esc(r.title)}</b><span>${String(i + 1).padStart(2, '0')}/${String(list.length).padStart(2, '0')}</span></figcaption>
      </figure>`).join('');
    // reproducir solo el video visible: ahorra batería y datos
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target; if (e.isIntersecting && !reduced) v.play().catch(() => {}); else v.pause();
    }), { threshold: .6 });
    $$('video', track).forEach((v) => io.observe(v));
    const by = (dir) => track.scrollBy({ left: dir * (track.firstElementChild?.offsetWidth || 300), behavior: reduced ? 'auto' : 'smooth' });
    $('#reel-prev')?.addEventListener('click', () => by(-1));
    $('#reel-next')?.addEventListener('click', () => by(1));
  }

  /* ---------- 8. casos de clientes (portafolio) ---------- */
  function cases() {
    const box = $('#cases'); if (!box || !C.clients) return;
    box.innerHTML = C.clients.map((c) => `<article class="case panel reveal">
        <div class="case-top">
          <div><div class="case-id">${esc(c.id)} // CASE_FILE</div><h3>${esc(c.name)}</h3><div class="handle">${esc(c.handle)}</div></div>
          <span class="niche">${esc(c.niche)}</span>
        </div>
        <div class="stats">
          <div class="stat"><b data-count="${c.subs}">${fmt(c.subs)}</b><span>Suscriptores</span></div>
          <div class="stat"><b data-count="${c.videos}">${fmt(c.videos)}</b><span>Videos</span></div>
          <div class="stat"><b ${c.top ? `data-count="${c.top}"` : ''}>${fmt(c.top)}</b><span>Top video</span></div>
        </div>
        ${[['Servicio', c.service], ['Inicio', c.start], ['Evolución', c.growth]].some((r) => r[1]) ? `<dl class="timeline">${[['Servicio', c.service], ['Inicio', c.start], ['Evolución', c.growth]].filter((r) => r[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
        <a class="btn glitch" href="${esc(c.url)}" target="_blank" rel="noopener">[ VER_CANAL ]
          <img class="arr" src="../assets/brand/icons/icon-arrow-deploy-white.svg" alt=""></a>
      </article>`).join('');
  }

  /* ---------- 9. precios ---------- */
  function pricing() {
    const tiersBox = $('#tiers'), plansBox = $('#plans'), desc = $('#tier-desc');
    if (!tiersBox || !C.plans) return;
    let cur = 'aug';
    const render = () => {
      $$('button', tiersBox).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tier === cur)));
      desc.textContent = C.tiers.find((t) => t.id === cur)?.desc || '';
      plansBox.innerHTML = C.plans.map((p) => `<article class="plan panel${p.featured ? ' featured' : ''}">
          <div class="p-name">${esc(p.name)}${p.featured ? ' // RECOMENDADO' : ''}</div>
          <div class="p-hours">${esc(p.hours)}</div>
          <div class="p-price">$${p.price[cur].toLocaleString('en-US')} <small>USD / mes</small></div>
          <div class="mono-s">${esc(p.note)}</div>
          <ul>${p.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          <a class="btn ${p.featured ? 'btn-primary' : ''} glitch" href="../#prueba">[ EMPEZAR_CON_PRUEBA ]</a>
        </article>`).join('');
    };
    tiersBox.innerHTML = C.tiers.map((t) => `<button type="button" data-tier="${t.id}">${esc(t.label)}</button>`).join('');
    tiersBox.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { cur = b.dataset.tier; render(); } });
    render();
  }

  /* ---------- 10. footer / contacto ---------- */
  const ICONS = {
    instagram: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7c-.1-1.6-.4-3-1.6-4.2S17.6 1.2 16 1.1C14.4 1 9.6 1 8 1.1 6.4 1.2 5 1.5 3.8 2.7S2.2 5.4 2.1 7C2 8.6 2 13.4 2.1 15c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.4 0-8z',
    facebook: 'M14 8h3V4h-3c-2.8 0-4 1.8-4 4.4V11H7v4h3v9h4v-9h3l1-4h-4V8.6c0-.4.3-.6.6-.6z',
    linkedin: 'M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 9h4v12H2zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z',
    whatsapp: 'M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.4 23.5l6-1.6A11.8 11.8 0 0 0 20.5 3.5zM12 21.4a9.7 9.7 0 0 1-5-1.4l-.4-.2-3.6.9 1-3.5-.2-.4A9.8 9.8 0 1 1 12 21.4zm5.4-7.3c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.6.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z',
    telegram: 'M21.9 3.4 18.6 19c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 12.5 1 11c-1.1-.3-1.1-1.1.2-1.6L20.5 2c.9-.3 1.7.2 1.4 1.4z',
    email: 'M2 4h20v16H2zm2 2v.4l8 5.3 8-5.3V6zm16 12V8.8l-8 5.3-8-5.3V18z'
  };
  function contact() {
    const box = $('#socials'); if (!box) return;
    const k = C.contact || {};
    const links = [
      ['instagram', 'Instagram', k.instagram],
      ['facebook', 'Facebook', k.facebook],
      ['linkedin', 'LinkedIn', k.linkedin],
      ['whatsapp', 'WhatsApp', k.whatsapp && `https://wa.me/${k.whatsapp}`],
      ['telegram', 'Telegram', k.telegram && `https://t.me/${k.telegram}`],
      ['email', 'Email', k.email && `mailto:${k.email}`]
    ];
    const ok = links.filter((l) => l[2]);
    if (!ok.length) { box.hidden = true; }
    box.innerHTML = ok.map(([id, label, href]) => `<a href="${esc(href)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[id]}"/></svg>${label}</a>`).join('');
    $$('[data-domain]').forEach((el) => { el.textContent = C.domain || ''; });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- 11. formulario de prueba gratis ---------- */
  function trialForm() {
    const form = $('#trial-form'); if (!form) return;
    const status = $('#form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.website.value) return; // honeypot anti-spam
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(form));
      data.servicio = $$('input[name="servicio"]:checked', form).map((i) => i.value).join(', ');
      if (!data.servicio) { status.textContent = '[ ERROR ] Elige al menos un tipo de prueba.'; return; }
      const btn = $('button[type="submit"]', form); btn.disabled = true;
      status.textContent = '[ ENVIANDO_SOLICITUD... ]';
      try {
        if (C.formEndpoint) {
          const res = await fetch(C.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!res.ok) throw new Error(res.status);
          status.textContent = '[ OK ] Solicitud recibida. Te escribimos en menos de 24 h.';
          form.reset();
        } else if (C.contact?.whatsapp) {
          const msg = `Hola IAmAZING, quiero mi prueba gratis.\nNombre: ${data.nombre}\nEmail: ${data.email}\nCanal/marca: ${data.canal}\nPrueba: ${data.servicio}\nDetalle: ${data.mensaje || '-'}`;
          window.open(`https://wa.me/${C.contact.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
          status.textContent = '[ OK ] Te llevamos a WhatsApp para confirmar la solicitud.';
        } else {
          console.info('[IAMC] Lead (sin endpoint configurado):', data);
          status.textContent = '[ MODO_PRUEBA ] Formulario sin conectar todavía. Revisa la consola: el lead se capturó bien.';
        }
      } catch (err) {
        status.textContent = '[ ERROR ] No se pudo enviar. Escríbenos por WhatsApp o Telegram.';
      } finally { btn.disabled = false; }
    });
  }

  /* ---------- 13. secciones de la home (servicios, casos, proceso, FAQ, showreel) ---------- */
  function homeSections() {
    const svc = $('#services');
    if (svc && C.services) svc.innerHTML = C.services.map((s, i) => `<li class="svc reveal">
        <span class="svc-n">${String(i + 1).padStart(2, '0')}</span>
        <img src="assets/brand/icons/icon-${esc(s.icon)}-blue.svg" alt="" width="36" height="31">
        <h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></li>`).join('');

    const mc = $('#metric-cards');
    if (mc && C.featured) mc.innerHTML = C.featured.map((f) => {
      const c = (C.clients || []).find((x) => x.id === f.id); if (!c) return '';
      const v = c[f.metric];
      return `<a class="metric panel reveal" href="${esc(c.url)}" target="_blank" rel="noopener">
          <span class="case-id">${esc(c.id)} // ${esc(c.niche)}</span>
          <b data-count="${v}">${fmt(v)}</b>
          <span class="m-label">${esc(f.label)}</span>
          <span class="m-name">${esc(c.name)} <img class="arr" src="assets/brand/icons/icon-arrow-deploy-white.svg" alt=""></span></a>`;
    }).join('');

    const pr = $('#process');
    if (pr && C.process) pr.innerHTML = C.process.map((p, i) => `<li class="proc reveal">
        <span class="proc-n">[${String(i + 1).padStart(3, '0')}]</span>
        <h3>${esc(p.name)}</h3><span class="proc-t">${esc(p.time)}</span><p>${esc(p.desc)}</p></li>`).join('');

    const fq = $('#faq-list');
    if (fq && C.faq) fq.innerHTML = C.faq.map((f, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary><span class="faq-n">${String(i + 1).padStart(2, '0')}</span>${esc(f.q)}<span class="faq-x" aria-hidden="true">+</span></summary>
        <p>${esc(f.a)}</p></details>`).join('');

    const m = $('#manager'), mg = C.manager || {};
    if (m && mg.name) { m.hidden = false; m.innerHTML = `<span class="dot">■</span> Te responde <b>${esc(mg.name)}</b>${mg.role ? ` // ${esc(mg.role)}` : ''}`; }

    const sv = $('#showreel-video'), sb = $('#showreel-play'), sr = C.showreel || {};
    if (sv && sr.file) {
      sv.src = `assets/video/${sr.file}`; if (sr.poster) sv.poster = `assets/video/${sr.poster}`;
      sv.preload = 'metadata';
      sb.addEventListener('click', () => {
        if (sv.paused) { sv.muted = false; sv.controls = true; sv.play().catch(() => {}); sb.hidden = true; }
      });
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) { sv.pause(); return; }
        if (!sv.controls && !reduced) sv.play().catch(() => {});
      }), { threshold: .4 });
      io.observe(sv);
    } else if (sv) { sv.closest('.section').hidden = true; }
  }

  /* ---------- 12. loop de video en el hero ---------- */
  function heroLoop() {
    const hero = $('.hero'); const src = C.heroVideo; if (!hero || !src || reduced) return;
    const base = location.pathname.includes('/portafolio') ? '../' : '';
    const file = (innerWidth < 600 && src.mobile) ? src.mobile : src.desktop;
    if (!file) return;
    hero.insertAdjacentHTML('afterbegin', `<video class="hero-loop" src="${base}assets/video/${esc(file)}" autoplay muted loop playsinline preload="auto" aria-hidden="true"></video><div class="hero-fade"></div>`);
  }

  document.addEventListener('DOMContentLoaded', () => {
    heroLoop(); homeSections(); clientMarquee(); reels(); cases(); pricing(); contact(); trialForm();
    asciiBg(); intro(); observe();
  });
})();
