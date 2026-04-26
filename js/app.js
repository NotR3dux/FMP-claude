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
});
