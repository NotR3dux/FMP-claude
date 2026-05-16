/* ============================================================
   FIND MY PARTNER — App Entry Point
   ============================================================ */

import {
  initReveal, initRipple, initMagneticButtons,
  initStatCounters, initHeroParallax, initCardTilt,
  initNavScroll, initSparkles,
} from './animations.js';

import { initReviews, openReviewModal, closeReviewModal } from './reviews.js';
import { initForm, renderForm, stepNext, stepBack } from './form.js';
import { supabase } from './supabase.js';

// ── View navigation ────────────────────────────────────────
let currentView = 'home';

window.navTo = function(view) {
  if (view === currentView) return;
  const fromEl = document.getElementById('v-' + currentView);
  const toEl   = document.getElementById('v-' + view);
  if (!fromEl || !toEl) return;

  fromEl.classList.remove('active');
  fromEl.classList.add('exit');
  setTimeout(() => {
    fromEl.style.display = 'none';
    fromEl.classList.remove('exit');
    toEl.style.display = 'block';
    void toEl.offsetWidth;
    toEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 360);

  currentView = view;
  if (view === 'form') initForm();
};

// ── Registration ───────────────────────────────────────────
window.openRegistration = function() { window.navTo('form'); };

window.openReviewModal  = openReviewModal;
window.closeReviewModal = closeReviewModal;
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

// ── Smooth scroll ─────────────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const t = document.querySelector(a.getAttribute('href'));
  if (t) t.scrollIntoView({ behavior: 'smooth' });
});

// ── Load prices from Supabase ──────────────────────────────
async function loadPrices() {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .order('sort_order');

  if (error || !data) return;

  const map = { 'Solo': 'price-solo', '2 Orang': 'price-duo', '3 Orang': 'price-trio' };
  data.forEach(p => {
    const el = document.getElementById(map[p.package_name]);
    if (el) el.textContent = p.price_text;
  });
}

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
  loadPrices();
});
