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
  initNavScroll,
  initSparkles,
} from './animations.js';

import { initReviews, openReviewModal, closeReviewModal } from './reviews.js';

const GFORM_REGISTRATION = 'https://forms.gle/UvcQABcBJvJbK4H28';

// ── External links ────────────────────────────────────────
window.openRegistration = function() {
  window.open(GFORM_REGISTRATION, '_blank');
};

window.openReviewModal  = openReviewModal;
window.closeReviewModal = closeReviewModal;

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

// ── Smooth scroll ─────────────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const t = document.querySelector(a.getAttribute('href'));
  if (t) t.scrollIntoView({ behavior: 'smooth' });
});

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
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
  initSparkles();
  initReviews();
});
