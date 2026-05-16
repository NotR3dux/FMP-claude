/* ============================================================
   FIND MY PARTNER — Reviews Module (Supabase-powered)
   ============================================================ */

import { supabase } from './supabase.js';
import { reviews as fallbackReviews } from './reviews-data.js';

export function initReviews() {
  loadReviews();
  initReviewModal();
}

async function loadReviews() {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  const reviews = (!error && data && data.length > 0) ? data : fallbackReviews;

  container.innerHTML = reviews.map((r, i) => `
    <div class="review-card" style="background:${r.color || '#FEF0F5'};animation-delay:${i * 0.08}s;">
      <div class="review-stars">${'★'.repeat(r.stars || 5)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-footer">
        <div class="review-avatar" style="background:${avatarColor(i)}">${initials(r.name)}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-type">${typeIcon(r.type)} ${r.type}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function initReviewModal() {
  const form = document.getElementById('review-submit-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('rv-name').value.trim();
    const text = document.getElementById('rv-text').value.trim();
    const type = document.getElementById('rv-type').value;
    if (!name || !text) return;

    const colorMap = { 'Best Friends': '#FEF0F5', 'Romantic Match': '#E8F5E0' };

    await supabase.from('reviews').insert([{
      name,
      text,
      type,
      stars: 5,
      status: 'pending',
      color: colorMap[type] || '#FEF0F5'
    }]);

    document.getElementById('review-form-wrap').style.display = 'none';
    document.getElementById('review-success').style.display = 'block';
    setTimeout(() => closeReviewModal(), 3000);
  });
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function avatarColor(i) {
  const colors = ['#E8684A','#6BC47A','#6AADE0','#B9A3DC','#F5C840','#F9ABBE'];
  return colors[i % colors.length];
}
function typeIcon(type) {
  if (type === 'Romantic Match' || type === 'romantic') return '✨';
  return '🧡';
}

export function openReviewModal() {
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  document.getElementById('review-form-wrap').style.display = 'block';
  document.getElementById('review-success').style.display = 'none';
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-text').value = '';
  modal.style.display = 'flex';
  void modal.offsetWidth;
  modal.classList.add('open');
}

export function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
}
