/* ============================================================
   FIND MY PARTNER — Animations & Motion
   ============================================================ */

// ── Scroll-reveal (Intersection Observer) ──────────────────
export function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Ripple on .btn-red clicks ──────────────────────────────
export function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-red');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    rip.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  });
}

// ── Magnetic hover on .btn-red ─────────────────────────────
export function initMagneticButtons() {
  document.querySelectorAll('.btn-red, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-2px) scale(1.02)`;
      // Update radial highlight position
      const rx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const ry = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      btn.style.setProperty('--rx', rx + '%');
      btn.style.setProperty('--ry', ry + '%');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── Animated stat counters ─────────────────────────────────
export function initStatCounters() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const el      = e.target;
      const num     = parseFloat(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const label   = el.dataset.label  || '';   // e.g. "K"
      const dur     = 1400;
      const start   = performance.now();

      function fmt(v) {
        if (label === 'K') return Math.round(v / 1000) + 'K';
        return Math.round(v).toString();
      }

      function tick(now) {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = fmt(ease * num) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else {
          el.textContent = fmt(num) + suffix;
          el.classList.add('bump');
          setTimeout(() => el.classList.remove('bump'), 300);
        }
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
}

// ── Hero cherry parallax on mouse ─────────────────────────
export function initHeroParallax() {
  const hero = document.querySelector('#hero-section');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const r  = hero.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    const cherry = hero.querySelector('.hero-cherry');
    if (cherry) cherry.style.transform = `translate(${cx*14}px, ${cy*10}px) rotate(-4deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    const cherry = hero.querySelector('.hero-cherry');
    if (cherry) cherry.style.transform = '';
  });
}

// ── Card tilt on hover ─────────────────────────────────────
export function initCardTilt() {
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = (e.clientX - r.left)  / r.width  - 0.5;
      const cy = (e.clientY - r.top)   / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-cy * 6}deg) rotateY(${cx * 6}deg) translateY(-4px)`;
      card.style.boxShadow = `${-cx*10}px ${-cy*10}px 32px rgba(212,78,39,0.10), 0 4px 12px rgba(28,18,8,0.07)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// ── Page transition helper ─────────────────────────────────
export function transitionView(fromEl, toEl) {
  if (fromEl) {
    fromEl.classList.add('exit');
    fromEl.classList.remove('active');
    setTimeout(() => {
      fromEl.style.display = 'none';
      fromEl.classList.remove('exit');
    }, 400);
  }
  if (toEl) {
    toEl.style.display = 'block';
    // Force reflow before adding active
    void toEl.offsetWidth;
    toEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Re-observe reveal elements in the new view
    requestAnimationFrame(() => {
      toEl.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        void el.offsetWidth;
      });
      setTimeout(initReveal, 60);
      initMagneticButtons();
      initCardTilt();
    });
  }
}

// ── Interactive gradient blob follows mouse ────────────────
export function initGradientInteractive() {
  const interactive = document.getElementById('grad-interactive');
  if (!interactive) return;
  let curX = 0, curY = 0, tgX = 0, tgY = 0, rafId = null;

  function move() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interactive.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    rafId = requestAnimationFrame(move);
  }

  window.addEventListener('mousemove', e => {
    tgX = e.clientX;
    tgY = e.clientY;
    if (!rafId) move();
  });
}

// ── Sticky nav shadow on scroll ────────────────────────────
export function initNavScroll() {
  const nav = document.querySelector('#main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 2px 18px rgba(28,18,8,0.08)';
      nav.style.background = 'rgba(240,234,226,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
    } else {
      nav.style.boxShadow = '';
      nav.style.background = '';
      nav.style.backdropFilter = '';
    }
  }, { passive: true });
}
