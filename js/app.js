/* ============================================================
   FIND MY PARTNER — App Entry Point
   ============================================================ */

import {
  initReveal,
  initRipple,
  initMagneticButtons,
  initStatCounters,
  initHeroParallax,
  initCardTilt,
  transitionView,
  initNavScroll,
  initGradientInteractive,
  initSparkles,
} from './animations.js';

import { initForm, renderForm, stepNext, stepBack } from './form.js';
import { showStatusResult, completePay } from './status.js';

// ── Current active view ────────────────────────────────────
let currentView = 'home';

// ── Navigation ─────────────────────────────────────────────
function navTo(view) {
  if (view === currentView) return;
  const fromEl = document.getElementById('v-' + currentView);
  const toEl   = document.getElementById('v-' + view);
  currentView  = view;
  transitionView(fromEl, toEl);
  if (view === 'form') initForm();
}
window.navTo = navTo;

// ── Back button alias used by form ─────────────────────────
window.stepNext = stepNext;
window.stepBack = stepBack;

// ── Mobile menu ────────────────────────────────────────────
let menuOpen = false;
window.toggleMobileMenu = function() {
  menuOpen = !menuOpen;
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  menu.style.display = menuOpen ? 'flex' : 'none';
  void menu.offsetWidth;
  menu.classList.toggle('open', menuOpen);
  btn.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
};
window.closeMobileMenu = function() {
  menuOpen = false;
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  menu.classList.remove('open');
  btn.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { menu.style.display = 'none'; }, 300);
};

// ── Smooth scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Show home view immediately
  const homeEl = document.getElementById('v-home');
  homeEl.style.display = 'block';
  void homeEl.offsetWidth;
  homeEl.classList.add('active');

  initReveal();
  initRipple();
  initMagneticButtons();
  initStatCounters();
  initHeroParallax();
  initCardTilt();
  initNavScroll();
  initGradientInteractive();
  initSparkles();
});
