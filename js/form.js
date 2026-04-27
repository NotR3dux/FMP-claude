/* ============================================================
   FIND MY PARTNER — Multi-Step Form
   ============================================================ */

import { initReveal, initMagneticButtons, initCardTilt } from './animations.js';

let step = 1;
const STEPS = 4;

const stepMeta = {
  1: { title: 'Personal Info',  sub: 'Tell us about yourself' },
  2: { title: 'Preferences',    sub: 'What kind of connection are you looking for?' },
  3: { title: 'Your Photo',     sub: 'Add a photo to your profile' },
  4: { title: 'Payment',        sub: 'Complete your registration' },
};

export function initForm() {
  step = 1;
  renderForm();
}

function renderStepper() {
  let html = '';
  for (let i = 1; i <= STEPS; i++) {
    const cls   = i < step ? 'done' : i === step ? 'cur' : 'todo';
    const inner = i < step ? '✓' : i;
    html += `<div class="step-dot ${cls}">${inner}</div>`;
    if (i < STEPS) {
      const lc = i < step ? 'done' : 'todo';
      html += `<div class="step-line ${lc}"></div>`;
    }
  }
  document.getElementById('stepper').innerHTML = html;
}

function renderTitle() {
  const { title, sub } = stepMeta[step];
  document.getElementById('step-title').innerHTML = `
    <h2 class="jk fade-up" style="font-size:25px;font-weight:800;color:var(--dark);margin-bottom:5px;">${title}</h2>
    <p class="fade-up" style="color:var(--light-muted);font-size:14.5px;animation-delay:0.06s;">${sub}</p>
  `;
}

function renderContent() {
  const el = document.getElementById('step-content');

  if (step === 1) {
    el.innerHTML = `
      <div class="card card-tilt fade-up">
        <div class="form-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Full Name <span style="color:var(--brand);">*</span></label>
            <input type="text" class="finput" placeholder="Your full name">
          </div>
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Age <span style="color:var(--brand);">*</span></label>
            <input type="number" class="finput" placeholder="Your age">
          </div>
        </div>
        <div class="form-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Gender <span style="color:var(--brand);">*</span></label>
            <select class="finput"><option value="">Select gender</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option></select>
          </div>
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Location</label>
            <input type="text" class="finput" placeholder="City or area">
          </div>
        </div>
        <div class="form-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Email <span style="color:var(--brand);">*</span></label>
            <input type="email" class="finput" placeholder="your@email.com">
          </div>
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Phone</label>
            <input type="tel" class="finput" placeholder="Your phone number">
          </div>
        </div>
        <div style="margin-bottom:14px;">
          <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Instagram Handle</label>
          <input type="text" class="finput" placeholder="@yourusername">
        </div>
        <div>
          <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">About You</label>
          <textarea class="finput" rows="4" placeholder="Tell us a bit about yourself — your personality, hobbies, what makes you you..." style="resize:vertical;"></textarea>
        </div>
      </div>`;

  } else if (step === 2) {
    el.innerHTML = `
      <div class="card card-tilt fade-up">
        <div style="margin-bottom:14px;">
          <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">What are you looking for? <span style="color:var(--brand);">*</span></label>
          <select class="finput"><option value="">Choose one</option><option>Romantic Partner</option><option>New Best Friend</option><option>Either / Open to Both</option></select>
        </div>
        <div style="margin-bottom:14px;">
          <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Preferred Gender</label>
          <select class="finput"><option value="">Any preference?</option><option>Male</option><option>Female</option><option>Non-binary</option><option>No preference</option></select>
        </div>
        <div class="form-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Preferred Age (Min)</label>
            <input type="number" class="finput" value="18" placeholder="18">
          </div>
          <div>
            <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Preferred Age (Max)</label>
            <input type="number" class="finput" value="35" placeholder="35">
          </div>
        </div>
        <div>
          <label style="font-size:12.5px;font-weight:600;color:var(--dark);display:block;margin-bottom:5px;">Your Interests &amp; Hobbies</label>
          <input type="text" class="finput" placeholder="e.g. Music, Hiking, Cooking, Gaming, Travel...">
          <p style="font-size:12px;color:var(--light-muted);margin-top:5px;">Separate with commas — this helps us find a better match!</p>
        </div>
      </div>`;

  } else if (step === 3) {
    el.innerHTML = `
      <div class="card card-tilt fade-up">
        <p style="font-size:14.5px;color:#4A4035;text-align:center;line-height:1.65;margin-bottom:22px;">Upload a clear photo of yourself. This helps us find a great match and verify your profile.</p>
        <div class="upload-zone" id="upload-zone" onclick="document.getElementById('photo-file').click()">
          <input type="file" id="photo-file" accept="image/*" style="display:none;" onchange="window.previewPhoto(this)">
          <div id="photo-inner">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C8A09A" stroke-width="1.5" style="display:block;margin:0 auto 10px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <div style="font-size:14.5px;font-weight:600;color:#C8A09A;">Click to upload</div>
            <div style="font-size:12.5px;color:#D0A89A;margin-top:4px;">JPG, PNG · up to 10 MB</div>
          </div>
        </div>
        <div style="background:#FDF0EC;border-radius:12px;padding:13px 17px;font-size:13px;color:#8A6A60;line-height:1.5;text-align:center;">
          📸 Tips: Use a recent, clear photo of just you. Avoid sunglasses or group photos. Smile!
        </div>
      </div>`;

  } else if (step === 4) {
    el.innerHTML = `
      <div class="fade-up">
        <p style="text-align:center;font-size:14.5px;color:var(--muted);margin-bottom:14px;">One-time payment to activate your matchmaking profile.</p>
        <div style="height:4px;border-radius:2px;background:linear-gradient(to right,#D44E27,#9040C0,#3A78D0);margin-bottom:14px;animation:fadeUp 0.4s both;"></div>
        <div class="card card-tilt">
          <div style="text-align:center;margin-bottom:22px;">
            <div style="display:inline-flex;align-items:center;gap:6px;background:#FDF0EC;border-radius:9999px;padding:6px 16px;font-size:12.5px;color:var(--brand);font-weight:700;margin-bottom:14px;font-family:'Plus Jakarta Sans',sans-serif;">🍒 One-Time Fee</div>
            <div class="jk" style="font-size:52px;font-weight:900;color:var(--dark);line-height:1;">$9.99 <span style="font-size:16px;font-weight:500;color:var(--light-muted);">one-time</span></div>
          </div>
          <div style="margin-bottom:26px;">
            ${['Personal human matchmaking','Handpicked connection — love or friendship','Profile verification included',"Private intro if you're both in","100% your choice — no pressure"].map(t => `
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;animation:fadeUp 0.4s both;">
                <span style="color:var(--brand);font-size:15px;font-weight:700;">✓</span>
                <span style="font-size:14.5px;color:#3A2820;">${t}</span>
              </div>`).join('')}
          </div>
          <button onclick="window.completePay()" class="btn-red" style="width:100%;justify-content:center;font-size:15.5px;padding:15px;">🍒 Pay &amp; Find My Person</button>
          <div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:12px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#AAA" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style="font-size:12px;color:#AAA;">Secure payment · Money-back guarantee</span>
          </div>
        </div>
      </div>`;
  }

  // Re-init tilt on newly rendered cards
  setTimeout(() => {
    initCardTilt();
    initMagneticButtons();
  }, 50);
}

function renderNav() {
  const el = document.getElementById('step-nav');
  const isFirst = step === 1;
  el.innerHTML = `
    <button onclick="${isFirst ? "window.navTo('home')" : 'window.stepBack()'}"
      class="fade-up"
      style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;
             color:${isFirst ? '#C0B0A8' : 'var(--dark)'};font-size:14.5px;font-weight:600;
             font-family:'Inter',sans-serif;transition:color 0.18s,transform 0.18s;
             animation-delay:0.08s;"
      onmouseover="this.style.color='var(--dark)';this.style.transform='translateX(-3px)'"
      onmouseout="this.style.color='${isFirst ? '#C0B0A8' : 'var(--dark)'}'
;this.style.transform=''">
      ← Back
    </button>
    ${step < STEPS
      ? `<button onclick="window.stepNext()" class="btn-red fade-up" style="padding:12px 30px;font-size:14.5px;animation-delay:0.12s;">Continue →</button>`
      : ''}
  `;
}

export function renderForm() {
  renderStepper();
  renderTitle();
  renderContent();
  renderNav();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function stepNext() { if (step < STEPS) { step++; renderForm(); } }
export function stepBack() { if (step > 1)     { step--; renderForm(); } }

window.stepNext = stepNext;
window.stepBack = stepBack;

window.previewPhoto = function(inp) {
  if (!inp.files[0]) return;
  const r = new FileReader();
  r.onload = e => {
    document.getElementById('photo-inner').innerHTML = `
      <img src="${e.target.result}" style="width:120px;height:120px;border-radius:14px;object-fit:cover;margin:0 auto 10px;display:block;animation:fadeUp 0.3s both;">
      <div style="font-size:13px;color:var(--brand);font-weight:600;">Photo ready ✓</div>
    `;
  };
  r.readAsDataURL(inp.files[0]);
};
