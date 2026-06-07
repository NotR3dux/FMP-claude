/* ============================================================
   FIND MY PARTNER — Registration Form (Supabase)
   ============================================================ */

import { supabase } from './supabase.js';

const formData = { package: null, transactionId: null, persons: [] };
let step = 1;
let selectedPackage = null;
const STEPS = 5;

// ── Image helper: resize + convert any format to JPEG ──────
async function prepareImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1600;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', 0.88);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// ── Draft persistence ──────────────────────────────────────
const DRAFT_KEY = 'fmp_draft';

function saveDraft() {
  if (step !== 3) return;
  const persons = [];
  for (const card of document.querySelectorAll('.person-card')) {
    const g = n => card.querySelector(`[name="${n}"]`);
    persons.push({
      fullName: g('fullName')?.value || '',
      gender: g('gender')?.value || '',
      birthPlace: g('birthPlace')?.value || '',
      birthDate: g('birthDate')?.value || '',
      zodiac: g('zodiac')?.value || '',
      university: g('university')?.value || '',
      religion: g('religion')?.value || '',
      height: g('height')?.value || '',
      weight: g('weight')?.value || '',
      ethnicity: g('ethnicity')?.value || '',
      purpose: g('purpose')?.value || '',
      phone: g('phone')?.value || '',
      hobby: g('hobby')?.value || '',
      idealType: g('idealType')?.value || '',
      socialMedia: g('socialMedia')?.value || '',
      surveyPersonality: g('surveyPersonality')?.value || '',
      surveyLoveLanguage: g('surveyLoveLanguage')?.value || '',
      surveyCommunication: g('surveyCommunication')?.value || '',
    });
  }
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      package: formData.package,
      transactionId: formData.transactionId,
      persons,
    }));
  } catch {}
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function restoreDraftToForm() {
  if (step !== 3) return;
  const draft = loadDraft();
  if (!draft?.persons?.length) return;
  const cards = document.querySelectorAll('.person-card');
  cards.forEach((card, i) => {
    const p = draft.persons[i];
    if (!p) return;
    const set = (name, val) => {
      if (!val) return;
      const el = card.querySelector(`[name="${name}"]`);
      if (el) el.value = val;
    };
    set('fullName', p.fullName);   set('gender', p.gender);
    set('birthPlace', p.birthPlace); set('birthDate', p.birthDate);
    set('zodiac', p.zodiac);       set('university', p.university);
    set('religion', p.religion);   set('height', p.height);
    set('weight', p.weight);       set('ethnicity', p.ethnicity);
    set('purpose', p.purpose);     set('phone', p.phone);
    set('hobby', p.hobby);         set('idealType', p.idealType);
    set('socialMedia', p.socialMedia);
    set('surveyPersonality', p.surveyPersonality);
    set('surveyLoveLanguage', p.surveyLoveLanguage);
    set('surveyCommunication', p.surveyCommunication);
  });
  applySelectStyles();
}

// ── Step meta ──────────────────────────────────────────────
const stepMeta = {
  1: { title: 'Syarat & Ketentuan ✏️',   sub: '' },
  2: { title: '💎 Pilih Paket',           sub: 'Pilih paket yang sesuai kebutuhanmu' },
  3: { title: 'Info Personal 📝',         sub: 'Ceritain sedikit tentang dirimu!' },
  4: { title: 'Pembayaran 💳',             sub: 'Transfer dan upload bukti pembayaran' },
  5: { title: 'Sedang Diproses ⏳',       sub: 'Pendaftaran kamu sedang kami proses' },
};

export function initForm() {
  const draft = loadDraft();
  if (draft?.persons?.length > 0 && draft.package) {
    // Restore to step 3 with saved package + transaction
    step = 3;
    selectedPackage = draft.package;
    formData.package = draft.package;
    formData.transactionId = draft.transactionId;
  } else {
    step = 1;
    selectedPackage = null;
    Object.assign(formData, { package: null, transactionId: null, persons: [] });
  }
  renderForm();
}

// ── Stepper ────────────────────────────────────────────────
function renderStepper() {
  let html = '';
  for (let i = 1; i <= STEPS; i++) {
    const cls   = i < step ? 'done' : i === step ? 'cur' : 'todo';
    const inner = i < step ? '✓' : i;
    html += `<div class="step-dot ${cls}">${inner}</div>`;
    if (i < STEPS) html += `<div class="step-line ${i < step ? 'done' : 'todo'}"></div>`;
  }
  document.getElementById('stepper').innerHTML = html;
}

function renderTitle() {
  const { title, sub } = stepMeta[step];
  document.getElementById('step-title').innerHTML = `
    <h2 class="jk" style="font-size:24px;font-weight:900;color:var(--dark);margin-bottom:4px;">${title}</h2>
    ${sub ? `<p class="int" style="color:var(--muted);font-size:14px;">${sub}</p>` : ''}
  `;
}

// ── Step content ───────────────────────────────────────────
async function renderContent() {
  const el = document.getElementById('step-content');

  if (step === 1) {
    el.innerHTML = `
      <div class="fcard">
        <h3 style="font-size:17px;font-weight:700;color:var(--dark);margin-bottom:12px;">📌 Sebelum mengisi, perhatikan:</h3>
        <ul style="font-size:13.5px;color:var(--muted);line-height:1.8;list-style:disc;padding-left:18px;margin-bottom:16px;">
          <li>Find My Partner menjunjung tinggi rasa aman, nyaman, dan saling menghargai.</li>
          <li>Segala bentuk rasisme, diskriminasi, pelecehan, ujaran kebencian dilarang keras.</li>
          <li>Platform ini untuk relasi positif — teman maupun hubungan lebih serius.</li>
          <li>Pelanggaran = partisipasi dibatalkan, biaya tidak dikembalikan.</li>
        </ul>
        <h3 style="font-size:15px;font-weight:700;color:var(--dark);margin-bottom:8px;">🔒 Privasi & Kerahasiaan Data</h3>
        <p style="font-size:13.5px;color:var(--muted);line-height:1.8;margin-bottom:16px;">
          Semua data kamu dijaga kerahasiaannya dan <strong>hanya digunakan untuk proses matching</strong> oleh tim FMP.
          Isi dengan jujur agar matching lebih optimal!
        </p>
        <label style="display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:var(--dark);cursor:pointer;padding:14px;background:#f0f8ee;border-radius:12px;border:2px solid var(--green);">
          <input type="checkbox" id="tos-agree" style="width:18px;height:18px;accent-color:var(--green-d);cursor:pointer;">
          Saya telah membaca dan menyetujui ketentuan Find My Partner.
        </label>
      </div>`;

  } else if (step === 2) {
    el.innerHTML = `
      <div class="fcard">
        <p class="int" style="font-size:13px;color:var(--muted);margin-bottom:18px;text-align:center;">Harga promo presale — pilih paket yang sesuai:</p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[
            { value:'Solo',     emoji:'🧍', label:'Solo',     price:'15k', sub:'1 orang',  color:'#6AADE0' },
            { value:'2 Person', emoji:'👫', label:'2 Orang',  price:'25k', sub:'2 orang',  color:'#B9A3DC' },
            { value:'3 Person', emoji:'👨‍👩‍👧', label:'3 Orang', price:'35k', sub:'3 orang',  color:'#6BC47A' },
          ].map(pkg => `
            <label class="pkg-label" style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-radius:14px;border:2.5px solid #e8e8e8;cursor:pointer;background:#fff;transition:border-color 0.2s,background 0.2s;">
              <div style="display:flex;align-items:center;gap:12px;">
                <input type="radio" name="package" value="${pkg.value}" style="width:18px;height:18px;accent-color:var(--green-d);">
                <div>
                  <div style="font-size:15px;font-weight:800;color:var(--dark);font-family:'Nunito',sans-serif;">${pkg.emoji} ${pkg.label}</div>
                  <div style="font-size:12px;color:var(--muted);">${pkg.sub}</div>
                </div>
              </div>
              <div style="font-size:22px;font-weight:900;color:${pkg.color};font-family:'Nunito',sans-serif;">${pkg.price}</div>
            </label>
          `).join('')}
        </div>
        <p style="font-size:12px;color:var(--muted);text-align:center;margin-top:14px;">* Pembayaran diinfo setelah form diterima.</p>
      </div>`;

  } else if (step === 3) {
    const count = selectedPackage === '2 Person' ? 2 : selectedPackage === '3 Person' ? 3 : 1;
    const draft = loadDraft();
    const hasDraft = draft?.persons?.some(p => Object.values(p).some(v => v));
    el.innerHTML = (hasDraft
      ? `<div style="background:#f0f9ee;border:1.5px solid var(--green);border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;font-size:13px;color:var(--dark);">
           <span style="font-size:18px;">💾</span>
           <span><strong>Data tersimpan dipulihkan.</strong> Lanjut dari bagian yang belum selesai — foto perlu diupload ulang.</span>
         </div>`
      : '') + Array.from({ length: count }, (_, i) => renderPersonForm(i + 1)).join('');

  } else if (step === 4) {
    const priceMap  = { 'Solo': 'Rp 15.000', '2 Person': 'Rp 25.000', '3 Person': 'Rp 35.000' };
    const pkgLabel  = { 'Solo': 'Solo (1 orang)', '2 Person': '2 Orang', '3 Person': '3 Orang' };
    const price     = priceMap[formData.package] || '';
    const pkg       = pkgLabel[formData.package] || formData.package;
    const firstName = formData.persons?.[0]?.fullName || 'Nama Lengkap';
    el.innerHTML = `
      <div class="fcard">
        <div style="background:#f0f9ee;border-radius:12px;padding:14px 18px;margin-bottom:20px;border:1.5px solid var(--green);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:2px;">Paket yang dipilih</div>
            <div style="font-size:16px;font-weight:800;color:var(--dark);">${pkg}</div>
          </div>
          <div style="font-size:26px;font-weight:900;color:var(--green-d);">${price}</div>
        </div>

        <h3 style="font-size:15px;font-weight:800;color:var(--dark);margin-bottom:12px;">💳 Info Pembayaran</h3>
        <div style="background:#fff;border:1.5px solid #e8e8e8;border-radius:12px;padding:16px 18px;margin-bottom:16px;">
          <div style="font-size:12px;color:var(--muted);margin-bottom:4px;">Transfer ke rekening:</div>
          <div style="font-size:16px;font-weight:800;color:var(--dark);">BLU BCA</div>
          <div style="font-size:24px;font-weight:900;color:var(--green-d);letter-spacing:3px;margin:8px 0;">0067 0723 8457</div>
          <div style="font-size:13px;color:var(--muted);">a.n. <strong style="color:var(--dark);">Olivia Calista Widodo</strong></div>
        </div>

        <div style="background:#fffbe6;border:1.5px solid #F5C840;border-radius:12px;padding:14px 16px;margin-bottom:20px;">
          <div style="font-size:13px;font-weight:800;color:var(--dark);margin-bottom:6px;">📝 Berita Acara Transfer</div>
          <div style="font-size:13px;color:var(--muted);margin-bottom:4px;">Format: <code style="background:#fff3cc;padding:2px 7px;border-radius:4px;font-size:12px;font-weight:700;">NamaLengkap_PaketYangDipilih</code></div>
          <div style="font-size:13px;color:var(--muted);">Contoh: <strong style="color:var(--dark);">${firstName}_Paket ${pkg}</strong></div>
        </div>

        <div class="fgroup">
          <label>Screenshot Bukti Transfer *</label>
          <input type="file" id="proof-upload" accept="image/*">
          <small style="color:var(--muted);font-size:12px;margin-top:4px;display:block;">Upload screenshot bukti transfer dari aplikasi banking kamu</small>
        </div>
        <div id="upload-error-msg" style="display:none;background:#fee2e2;border:1px solid #fca5a5;color:#b91c1c;border-radius:8px;padding:10px 14px;font-size:13px;margin-top:8px;word-break:break-all;"></div>
      </div>`;

  } else if (step === 5) {
    el.innerHTML = `
      <div class="fcard" style="text-align:center;padding:40px 24px;">
        <div style="font-size:64px;margin-bottom:16px;">⏳</div>
        <h2 class="jk" style="font-size:24px;font-weight:900;color:var(--dark);margin-bottom:12px;">Pesanan Sedang Diproses!</h2>
        <p style="font-size:14px;color:var(--muted);line-height:1.75;margin-bottom:20px;">
          Pembayaran kamu sedang kami verifikasi. Tim Find My Partner akan menghubungi kamu lewat
          <strong>DM Instagram</strong> kalau sudah dapat match. Sabar ya! 💌
        </p>
        <div style="background:#f0f9ee;border-radius:12px;padding:16px 18px;margin-bottom:20px;border:1.5px solid var(--green);text-align:left;">
          <ul style="font-size:13px;color:var(--muted);list-style:disc;padding-left:18px;line-height:1.9;margin:0;">
            <li>Pastikan DM Instagram kamu <strong style="color:var(--dark);">terbuka</strong></li>
            <li>Follow <a href="https://www.instagram.com/_findmypartner/" target="_blank" style="color:var(--green-d);font-weight:700;">@_findmypartner</a></li>
            <li>Cek notifikasi secara berkala</li>
          </ul>
        </div>
        <a href="https://drive.google.com/file/d/14ddH5QZEXpkbta6kBT6Kg83DVK4wcXl8/view?usp=sharing"
          target="_blank" style="font-size:14px;color:var(--green-d);font-weight:700;text-decoration:underline;">
          Baca panduan Find My Partner →
        </a>
      </div>`;
  }
}

function renderPersonForm(index) {
  return `
    <div class="fcard person-card" style="margin-bottom:20px;">
      <h3 class="jk" style="font-size:17px;font-weight:900;color:var(--dark);margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid #f0f0f0;">
        ${index > 1 ? `👤 Person ${index}` : '👤 Data Diri'}
      </h3>
      <div class="frow">
        <div class="fgroup"><label>Nama Lengkap *</label><input type="text" name="fullName" placeholder="Nama lengkap"></div>
        <div class="fgroup"><label>Jenis Kelamin *</label><select name="gender" required><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup">
          <label>Tempat, Tgl Lahir *</label>
          <div style="display:flex;gap:8px;">
            <input type="text" name="birthPlace" placeholder="Kota lahir" style="flex:1;">
            <input type="date" name="birthDate" style="flex:1;color:var(--dark);" max="2008-12-31" min="1990-01-01">
          </div>
        </div>
        <div class="fgroup"><label>Zodiak *</label><select name="zodiac" required><option value="">Pilih</option><option>Aquarius</option><option>Pisces</option><option>Aries</option><option>Taurus</option><option>Gemini</option><option>Cancer</option><option>Leo</option><option>Virgo</option><option>Libra</option><option>Scorpio</option><option>Sagitarius</option><option>Capricorn</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>Asal Universitas *</label><select name="university" required><option value="">Pilih</option><option>Universitas Airlangga</option><option>Universitas Negeri Surabaya</option><option>Institut Teknologi Sepuluh Nopember</option><option>Universitas Surabaya</option><option>Universitas Kristen Petra</option><option>Universitas Ciputra</option><option>Universitas Katolik Widya Mandala</option><option>Lainnya</option></select></div>
        <div class="fgroup"><label>Agama *</label><select name="religion" required><option value="">Pilih</option><option>Islam</option><option>Kristen Protestan</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Konghucu</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup">
          <label>TB/BB saat ini *</label>
          <div style="display:flex;gap:8px;">
            <div style="flex:1;position:relative;">
              <input type="number" name="height" placeholder="Tinggi" min="100" max="250" style="width:100%;padding-right:34px;box-sizing:border-box;">
              <span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--muted);pointer-events:none;">cm</span>
            </div>
            <div style="flex:1;position:relative;">
              <input type="number" name="weight" placeholder="Berat" min="30" max="200" style="width:100%;padding-right:34px;box-sizing:border-box;">
              <span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--muted);pointer-events:none;">kg</span>
            </div>
          </div>
        </div>
        <div class="fgroup"><label>Etnis *</label><select name="ethnicity" required><option value="">Pilih</option><option>Jawa</option><option>Tionghoa</option><option>Batak</option><option>Sunda</option><option>Bali</option><option>Madura</option><option>Lainnya</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>Apa yang kamu cari? *</label><select name="purpose" required><option value="">Pilih</option><option value="Teman">🤝 Teman / Bestie</option><option value="Pasangan">💕 Pasangan / Jodoh</option></select></div>
        <div class="fgroup"><label>No. WA Aktif *</label><input type="tel" name="phone" placeholder="08xxxxxxxxxx"></div>
      </div>
      <div class="fgroup"><label>Hobi *</label><input type="text" name="hobby" placeholder="Contoh: nonton film, hiking, masak..."></div>
      <div class="fgroup">
        <label>Tipe Ideal * <small style="color:var(--muted);font-weight:400;">Tuliskan: Tinggi badan, Etnis, Agama, love language, sifat, dan communication style</small></label>
        <input type="text" name="idealType" placeholder="Deskripsikan tipe ideal kamu">
      </div>
      <div class="fgroup"><label>Media Sosial (Instagram) *</label><input type="text" name="socialMedia" placeholder="@username"></div>
      <div class="fgroup">
        <label>Foto KTM Aktif * <small style="color:var(--muted);font-weight:400;">(tidak akan disebarluaskan, hanya untuk verifikasi)</small></label>
        <input type="file" name="fullBodyPhoto" accept="image/*">
      </div>
      <div class="fgroup">
        <label>Hasil MBTI * — <a href="https://www.16personalities.com/id/tes-kepribadian" target="_blank" style="color:var(--green-d);font-weight:600;font-size:12px;">Tes di sini</a></label>
        <input type="text" name="surveyPersonality" placeholder="Contoh: ENFP, ISTJ, dll">
      </div>
      <div class="fgroup">
        <label>Hasil Love Language * — <a href="https://5lovelanguages.com/quizzes/love-language" target="_blank" style="color:var(--green-d);font-weight:600;font-size:12px;">Tes di sini</a></label>
        <textarea name="surveyLoveLanguage" rows="2" placeholder="Contoh: (1) Physical Touch, (2) Words of Affirmation..."></textarea>
      </div>
      <div class="fgroup">
        <label>Hasil Communication Style * — <a href="https://personalitylingo.com/free-communication-style-quiz/" target="_blank" style="color:var(--green-d);font-weight:600;font-size:12px;">Tes di sini</a></label>
        <textarea name="surveyCommunication" rows="2" placeholder="Contoh: Planner Style Communication, dll"></textarea>
      </div>
    </div>
  `;
}

// ── Nav buttons ────────────────────────────────────────────
function renderNav() {
  const el      = document.getElementById('step-nav');
  const isFirst = step === 1;
  const isLast  = step === STEPS;

  el.innerHTML = `
    <button onclick="${isFirst ? "window.navTo('home')" : 'window.stepBack()'}"
      style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;font-weight:600;font-family:'Inter',sans-serif;padding:12px 0;">
      ← Kembali
    </button>
    ${isLast
      ? `<button onclick="window.navTo('home')" class="btn-red" style="padding:12px 30px;font-size:14px;">Kembali ke Beranda 🏠</button>`
      : `<button id="continue-btn" onclick="window.stepNext()" class="btn-red" style="padding:12px 30px;font-size:14px;" ${isFirst ? 'disabled' : ''}>Lanjut →</button>`
    }
  `;

  if (isLast) return;
  const btn = document.getElementById('continue-btn');

  // ── Step 1: checkbox gate ────────────────────────────────
  if (step === 1) {
    document.getElementById('tos-agree').addEventListener('change', e => {
      btn.disabled = !e.target.checked;
    });
  }

  // ── Step 2: package selection ────────────────────────────
  if (step === 2) {
    btn.disabled = true;
    document.querySelectorAll('input[name="package"]').forEach(radio => {
      radio.addEventListener('change', async () => {
        selectedPackage = radio.value;
        formData.package = selectedPackage;
        btn.disabled = false;
        document.querySelectorAll('.pkg-label').forEach(l => { l.style.borderColor = '#e8e8e8'; l.style.background = '#fff'; });
        radio.closest('.pkg-label').style.borderColor = 'var(--green-d)';
        radio.closest('.pkg-label').style.background = '#f0f9ee';
        const { data, error } = await supabase.from('transactions').insert([{ package: selectedPackage }]).select();
        if (!error && data) formData.transactionId = data[0].id;
      });
    });
  }

  // ── Step 3: personal info (always-on btn + validate on click) ──
  if (step === 3) {
    const handleTestBypass = async () => {
      const { data } = await supabase.from('persons').select('full_name').ilike('full_name', 'test%');
      const nums = (data || []).map(r => parseInt(r.full_name.replace(/^test/i, ''))).filter(n => !isNaN(n) && n > 0);
      const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
      const count = selectedPackage === '2 Person' ? 2 : selectedPackage === '3 Person' ? 3 : 1;
      formData.persons = Array.from({ length: count }, (_, i) => ({
        fullName: `test${nextNum + i}`, gender: 'Laki-laki', birth: 'Jakarta, 01/01/2000',
        university: 'Universitas Airlangga', faculty: 'FEB', studentId: '123456',
        religion: 'Islam', heightWeight: '170cm / 65kg', ethnicity: 'Jawa', zodiac: 'Aries',
        purpose: 'Pasangan', hobby: 'Test hobby', idealType: 'Test ideal type',
        socialMedia: '@test', phone: '08123456789', surveyPersonality: 'ENFP',
        surveyLoveLanguage: 'Words of Affirmation', surveyCommunication: 'Test', _photoFile: null, _isTest: true,
      }));
      step = 4; renderForm();
    };
    // Restore draft data now that DOM is ready
    restoreDraftToForm();

    const inputs  = document.querySelectorAll('.person-card input, .person-card select, .person-card textarea');
    const isEmpty = inp => inp.type === 'file' ? !inp.files?.length : !inp.value.trim();
    const markField = inp => { inp.style.borderColor = isEmpty(inp) ? '#ef4444' : ''; };

    // Live feedback + auto-save
    inputs.forEach(inp => {
      inp.addEventListener('input',  () => { if (!isEmpty(inp)) inp.style.borderColor = ''; saveDraft(); });
      inp.addEventListener('change', () => { markField(inp); saveDraft(); });
      inp.addEventListener('blur',   () => markField(inp));
    });

    btn.onclick = async () => {
      // TEST BYPASS: name "test999" skips validation + auto-increments in DB
      const firstNameInput = document.querySelector('.person-card [name="fullName"]');
      if (firstNameInput?.value === 'test999') { await handleTestBypass(); return; }

      // Validate all — mark empties red
      inputs.forEach(markField);
      const firstEmpty = [...inputs].find(isEmpty);
      if (firstEmpty) {
        firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return; // Block navigation
      }

      // All valid — collect data
      formData.persons = [];
      for (const card of document.querySelectorAll('.person-card')) {
        const get = n => card.querySelector(`[name="${n}"]`);
        const birthDateRaw = get('birthDate').value;
        const [by, bm, bd] = birthDateRaw ? birthDateRaw.split('-') : ['', '', ''];
        const birthFormatted = birthDateRaw ? `${bd}/${bm}/${by}` : '';
        formData.persons.push({
          fullName: get('fullName').value, gender: get('gender').value,
          birth: get('birthPlace').value + (birthFormatted ? ', ' + birthFormatted : ''),
          university: get('university').value,
          faculty: '', studentId: '',
          religion: get('religion').value,
          heightWeight: get('height').value + 'cm / ' + get('weight').value + 'kg',
          ethnicity: get('ethnicity').value, zodiac: get('zodiac').value,
          purpose: get('purpose').value, hobby: get('hobby').value,
          idealType: get('idealType').value, socialMedia: get('socialMedia').value,
          phone: get('phone').value,
          surveyPersonality: get('surveyPersonality').value,
          surveyLoveLanguage: get('surveyLoveLanguage').value,
          surveyCommunication: get('surveyCommunication').value,
          _photoFile: get('fullBodyPhoto').files[0] || null,
        });
      }
      step = 4;
      renderForm();
    };
  }

  // ── Step 4: payment ──────────────────────────────────────
  if (step === 4) {
    const isTest = formData.persons?.[0]?._isTest;
    btn.disabled = !isTest;
    const proofInput = document.getElementById('proof-upload');
    if (!isTest) {
      proofInput.addEventListener('change', () => {
        btn.disabled = !proofInput.files?.length;
        if (proofInput.files?.length) proofInput.style.borderColor = '';
      });
    }

    btn.onclick = async () => {
      if (!isTest && !proofInput.files?.length) {
        proofInput.style.borderColor = '#ef4444';
        proofInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Menyimpan...';

      let uploadError = null;
      const uploadFile = async (file, prefix, idx = '') => {
        if (!file) return null;
        const prepared = await prepareImage(file);
        const path = `${prefix}-${Date.now()}${idx}-${Math.random().toString(36).slice(2)}.jpg`;
        const { data, error } = await supabase.storage.from('uploads').upload(path, prepared, {
          contentType: 'image/jpeg', upsert: false,
        });
        if (error) {
          console.error(`Upload failed (${prefix}):`, error.message, error);
          uploadError = `Upload error: ${error.message}`;
          return null;
        }
        return data?.path || null;
      };

      // Upload proof (null in test mode)
      const proofPath = await uploadFile(proofInput.files?.[0] || null, 'proof');

      // Upload each person's photo + insert record
      for (const [idx, p] of formData.persons.entries()) {
        const photoPath = await uploadFile(p._photoFile || null, 'photo', `-${idx}`);

        const { error: insertErr } = await supabase.from('persons').insert([{
          transaction_id: formData.transactionId,
          full_name: p.fullName, gender: p.gender, birth: p.birth,
          university: p.university, faculty: p.faculty, student_id: p.studentId,
          religion: p.religion, height_weight: p.heightWeight, ethnicity: p.ethnicity,
          zodiac: p.zodiac, purpose: p.purpose, hobby: p.hobby,
          ideal_type: p.idealType, social_media: p.socialMedia, phone: p.phone,
          survey_personality: p.surveyPersonality,
          survey_love_language: p.surveyLoveLanguage,
          survey_communication: p.surveyCommunication,
          full_body_photo_url: photoPath,
          transaction_proof_url: proofPath,
        }]);
        if (insertErr) uploadError = (uploadError ? uploadError + ' | ' : '') + `DB error: ${insertErr.message}`;
      }

      if (uploadError) {
        btn.disabled = false;
        btn.textContent = 'Coba Lagi';
        const errDiv = document.getElementById('upload-error-msg');
        if (errDiv) { errDiv.textContent = uploadError; errDiv.style.display = 'block'; }
        return;
      }

      clearDraft();
      step = 5;
      renderForm();
    };
  }
}

function applySelectStyles(root = document) {
  root.querySelectorAll('.fgroup select').forEach(sel => {
    const update = () => sel.classList.toggle('is-placeholder', sel.value === '');
    update();
    sel.addEventListener('change', update);
  });
}

export function renderForm() {
  renderStepper();
  renderTitle();
  renderContent().then(() => { renderNav(); applySelectStyles(); });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
export function stepNext() { if (step < STEPS) { step++; renderForm(); } }
export function stepBack() { if (step > 1)     { step--; renderForm(); } }
window.stepNext = stepNext;
window.stepBack = stepBack;
