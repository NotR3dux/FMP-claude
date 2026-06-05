/* ============================================================
   FIND MY PARTNER — Registration Form → Google Sheets
   ============================================================ */

// Ganti dengan URL Google Apps Script kamu setelah deploy
const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

const PRICES = { 'Solo': 15000, '2 Person': 25000, '3 Person': 35000 };
const PRICE_LABELS = { 'Solo': 'Rp 15.000', '2 Person': 'Rp 25.000', '3 Person': 'Rp 35.000' };

const formData = { package: null, persons: [], namaTransfer: '', proofBase64: null, photoBase64s: [] };
let step = 1;
let selectedPackage = null;
const STEPS = 5;

const stepMeta = {
  1: { title: 'Syarat & Ketentuan ✏️',  sub: '' },
  2: { title: '💎 Pilih Paket',          sub: 'Pilih paket yang sesuai kebutuhanmu' },
  3: { title: 'Info Personal 📝',        sub: 'Ceritain sedikit tentang dirimu!' },
  4: { title: 'Pembayaran 💳',           sub: 'Transfer via QRIS lalu upload bukti' },
  5: { title: 'Pendaftaran Dikirim! 🎉', sub: '' },
};

export function initForm() {
  step = 1;
  selectedPackage = null;
  Object.assign(formData, { package: null, persons: [], namaTransfer: '', proofBase64: null, photoBase64s: [] });
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

  // STEP 1 — Terms
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

  // STEP 2 — Pilih Paket
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

  // STEP 3 — Info Personal
  } else if (step === 3) {
    const count = selectedPackage === '2 Person' ? 2 : selectedPackage === '3 Person' ? 3 : 1;
    el.innerHTML = Array.from({ length: count }, (_, i) => renderPersonForm(i + 1)).join('');

  // STEP 4 — QRIS + Bukti Bayar
  } else if (step === 4) {
    const amount = PRICE_LABELS[selectedPackage] || '';
    el.innerHTML = `
      <div class="fcard" style="text-align:center;">
        <div style="display:inline-block;background:#f0f9ee;border-radius:16px;padding:10px 24px;margin-bottom:20px;">
          <span style="font-size:13px;color:var(--muted);font-weight:600;">Total Pembayaran</span><br>
          <span class="jk" style="font-size:32px;font-weight:900;color:var(--green-d);">${amount}</span>
        </div>

        <p style="font-size:13.5px;color:var(--muted);margin-bottom:18px;line-height:1.6;">
          Scan QRIS di bawah ini lalu transfer sesuai nominal. Setelah transfer, isi nama dan upload screenshot bukti bayar.
        </p>

        <div style="display:inline-block;border:3px solid #e8e8e8;border-radius:16px;padding:12px;margin-bottom:20px;background:#fff;">
          <img src="/brand_assets/qris.png" alt="QRIS Find My Partner"
            style="width:220px;height:220px;object-fit:contain;border-radius:8px;"
            onerror="this.parentElement.innerHTML='<div style=\'width:220px;height:220px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;\'><span style=\'font-size:40px;\'>📱</span><span style=\'font-size:12px;color:#999;\'>QRIS belum diupload</span></div>'">
        </div>

        <div style="text-align:left;">
          <div class="fgroup">
            <label>Nama Rekening / Akun yang Transfer *</label>
            <input type="text" id="nama-transfer" placeholder="Nama sesuai akun bank/e-wallet" value="${formData.namaTransfer || ''}">
          </div>
          <div class="fgroup">
            <label>Screenshot Bukti Transfer *</label>
            <small style="color:var(--muted);font-size:12px;margin-bottom:6px;display:block;">Upload screenshot dari aplikasi bank atau e-wallet kamu.</small>
            <input type="file" id="proof-upload" accept="image/*">
            <div id="proof-preview" style="margin-top:10px;"></div>
          </div>
        </div>
      </div>`;

    document.getElementById('proof-upload').addEventListener('change', async function() {
      const file = this.files[0];
      if (!file) return;
      const preview = document.getElementById('proof-preview');
      preview.innerHTML = `<p style="font-size:12px;color:var(--muted);">Mengompres gambar...</p>`;
      formData.proofBase64 = await compressImage(file);
      preview.innerHTML = `<img src="${formData.proofBase64}" style="max-width:100%;border-radius:10px;border:2px solid var(--green);">`;
    });

  // STEP 5 — Thank You
  } else if (step === 5) {
    el.innerHTML = `
      <div class="fcard" style="text-align:center;padding:40px 24px;">
        <div style="font-size:64px;margin-bottom:16px;">🎉</div>
        <h2 class="jk" style="font-size:24px;font-weight:900;color:var(--dark);margin-bottom:12px;">Pendaftaran Terkirim!</h2>
        <p style="font-size:14px;color:var(--muted);line-height:1.75;margin-bottom:16px;">
          Data kamu sudah kami terima! Tim FMP akan verifikasi bukti transfer kamu.<br>
          Kalau sudah diverifikasi dan kamu dapat match, kami akan hubungi via <strong>DM Instagram</strong>. 💌
        </p>
        <div style="background:#f0f9ee;border-radius:12px;padding:16px;margin-bottom:20px;border:1.5px solid var(--green);">
          <p style="font-size:13px;color:var(--green-d);font-weight:700;margin-bottom:4px;">Pastikan:</p>
          <ul style="font-size:13px;color:var(--muted);text-align:left;list-style:disc;padding-left:18px;line-height:1.8;">
            <li>DM Instagram kamu terbuka</li>
            <li>Follow <a href="https://www.instagram.com/_findmypartner/" target="_blank" style="color:var(--green-d);font-weight:700;">@_findmypartner</a></li>
            <li>Cek notifikasi secara berkala</li>
          </ul>
        </div>
        <a href="https://drive.google.com/file/d/14ddH5QZEXpkbta6kBT6Kg83DVK4wcXl8/view?usp=sharing"
          target="_blank"
          style="display:inline-block;font-size:14px;color:var(--green-d);font-weight:700;text-decoration:underline;">
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
        <div class="fgroup"><label>Gender *</label><select name="gender" required><option value="">Pilih</option><option>Male</option><option>Female</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>Tempat, Tgl Lahir *</label><input type="text" name="birth" placeholder="Kota, DD/MM/YYYY"></div>
        <div class="fgroup"><label>Zodiak *</label><select name="zodiac" required><option value="">Pilih</option><option>Aquarius</option><option>Pisces</option><option>Aries</option><option>Taurus</option><option>Gemini</option><option>Cancer</option><option>Leo</option><option>Virgo</option><option>Libra</option><option>Scorpio</option><option>Sagitarius</option><option>Capricorn</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>Universitas *</label><select name="university" required><option value="">Pilih</option><option>Universitas Airlangga</option><option>Universitas Negeri Surabaya</option><option>Institut Teknologi Sepuluh Nopember</option><option>Universitas Surabaya</option><option>Universitas Kristen Petra</option><option>Universitas Ciputra</option><option>Universitas Katolik Widya Mandala</option></select></div>
        <div class="fgroup"><label>Fakultas *</label><select name="faculty" required><option value="">Pilih</option><option>Farmasi</option><option>Hukum</option><option>Bisnis dan Ekonomika</option><option>Psikologi</option><option>Teknik</option><option>Kedokteran</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>NIM *</label><input type="text" name="studentId" placeholder="Nomor induk mahasiswa"></div>
        <div class="fgroup"><label>Agama *</label><select name="religion" required><option value="">Pilih</option><option>Islam</option><option>Kristen/Protestan</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Konghucu</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>Tinggi / Berat Badan *</label><input type="text" name="heightWeight" placeholder="170cm / 60kg"></div>
        <div class="fgroup"><label>Suku *</label><select name="ethnicity" required><option value="">Pilih</option><option>Jawa</option><option>Tionghoa</option><option>Batak</option><option>Sunda</option><option>Bali</option><option>Madura</option></select></div>
      </div>
      <div class="frow">
        <div class="fgroup"><label>Tujuan *</label><select name="purpose" required><option value="">Cari apa?</option><option value="Teman">🤝 Teman / Bestie</option><option value="Pasangan">💕 Pasangan / Jodoh</option></select></div>
        <div class="fgroup"><label>No. HP / WhatsApp *</label><input type="tel" name="phone" placeholder="08xxxxxxxxxx"></div>
      </div>
      <div class="fgroup"><label>Hobi *</label><input type="text" name="hobby" placeholder="Contoh: nonton film, hiking, masak..."></div>
      <div class="fgroup">
        <label>Tipe Ideal * <small style="color:var(--muted);font-weight:400;">(TB, suku, agama, love language, sifat, communication style)</small></label>
        <input type="text" name="idealType" placeholder="Deskripsikan tipe ideal kamu">
      </div>
      <div class="fgroup"><label>Instagram *</label><input type="text" name="socialMedia" placeholder="@username"></div>
      <div class="fgroup">
        <label>Foto Full Body * <small style="color:var(--muted);font-weight:400;">(kepala sampai kaki, tidak disebarluaskan)</small></label>
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
  const el = document.getElementById('step-nav');
  const isFirst = step === 1;
  const isLast  = step === STEPS;

  el.innerHTML = `
    <button onclick="${isFirst ? "window.navTo('home')" : 'window.stepBack()'}"
      style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;font-weight:600;font-family:'Inter',sans-serif;padding:12px 0;display:flex;align-items:center;gap:4px;">
      ← Kembali
    </button>
    ${isLast
      ? `<button onclick="window.navTo('home')" class="btn-red" style="padding:12px 30px;font-size:14px;">Kembali ke Beranda 🏠</button>`
      : `<button id="continue-btn" class="btn-red" style="padding:12px 30px;font-size:14px;" ${isFirst ? 'disabled' : ''}>
           Lanjut →
         </button>`
    }
  `;

  if (isLast) return;
  const btn = document.getElementById('continue-btn');

  // Step 1 — TOS checkbox
  if (step === 1) {
    const cb = document.getElementById('tos-agree');
    cb.addEventListener('change', () => { btn.disabled = !cb.checked; });
  }

  // Step 2 — Pilih paket
  if (step === 2) {
    btn.disabled = true;
    document.querySelectorAll('input[name="package"]').forEach(radio => {
      radio.addEventListener('change', () => {
        selectedPackage = radio.value;
        formData.package = selectedPackage;
        btn.disabled = false;
        document.querySelectorAll('.pkg-label').forEach(l => { l.style.borderColor = '#e8e8e8'; l.style.background = '#fff'; });
        radio.closest('.pkg-label').style.borderColor = 'var(--green-d)';
        radio.closest('.pkg-label').style.background = '#f0f9ee';
      });
    });
  }

  // Step 3 — Validasi personal info + kumpulkan foto
  if (step === 3) {
    btn.disabled = true;
    const inputs = document.querySelectorAll('.person-card input, .person-card select, .person-card textarea');
    const validate = () => {
      btn.disabled = ![...inputs].every(inp =>
        inp.type === 'file' ? inp.files?.length > 0 : inp.value.trim() !== ''
      );
    };
    inputs.forEach(inp => { inp.addEventListener('input', validate); inp.addEventListener('change', validate); });

    btn.onclick = async () => {
      btn.disabled = true;
      btn.textContent = 'Memproses foto...';
      formData.persons = [];
      formData.photoBase64s = [];

      const cards = document.querySelectorAll('.person-card');
      for (const card of cards) {
        const get = n => card.querySelector(`[name="${n}"]`);
        const photoFile = get('fullBodyPhoto').files[0];

        let photoB64 = null;
        if (photoFile) photoB64 = await compressImage(photoFile);
        formData.photoBase64s.push(photoB64);

        formData.persons.push({
          fullName: get('fullName').value, gender: get('gender').value,
          birth: get('birth').value, university: get('university').value,
          faculty: get('faculty').value, studentId: get('studentId').value,
          religion: get('religion').value, heightWeight: get('heightWeight').value,
          ethnicity: get('ethnicity').value, zodiac: get('zodiac').value,
          purpose: get('purpose').value, hobby: get('hobby').value,
          idealType: get('idealType').value, socialMedia: get('socialMedia').value,
          phone: get('phone').value,
          surveyPersonality: get('surveyPersonality').value,
          surveyLoveLanguage: get('surveyLoveLanguage').value,
          surveyCommunication: get('surveyCommunication').value,
        });
      }
      step = 4; renderForm();
    };
  }

  // Step 4 — Validasi bukti bayar lalu submit
  if (step === 4) {
    btn.disabled = true;
    btn.textContent = 'Kirim Pendaftaran →';

    const checkReady = () => {
      const nama  = document.getElementById('nama-transfer')?.value?.trim();
      const proof = formData.proofBase64;
      btn.disabled = !nama || !proof;
    };

    document.getElementById('nama-transfer')?.addEventListener('input', checkReady);
    document.getElementById('proof-upload')?.addEventListener('change', () => {
      setTimeout(checkReady, 500);
    });

    btn.onclick = async () => {
      formData.namaTransfer = document.getElementById('nama-transfer').value.trim();

      btn.disabled = true;
      btn.textContent = 'Mengirim data...';

      await submitToSheets();
      step = 5;
      renderForm();
    };
  }
}

// ── Submit ke Google Sheets via Apps Script ────────────────
async function submitToSheets() {
  const payload = {
    package:      formData.package,
    persons:      formData.persons,
    namaTransfer: formData.namaTransfer,
    proofBase64:  formData.proofBase64,
    photoBase64s: formData.photoBase64s,
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors', // Apps Script CORS workaround
      body:   JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Submit note:', err);
    // no-cors mode always throws — data still sent
  }
}

// ── Compress image sebelum kirim ───────────────────────────
function compressImage(file, maxDim = 1200, quality = 0.75) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else                { width  = Math.round(width  * maxDim / height); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Render ─────────────────────────────────────────────────
export function renderForm() {
  renderStepper();
  renderTitle();
  renderContent().then(() => renderNav());
  window.scrollTo({ top: 0, behavior: 'instant' });
}
export function stepNext() { if (step < STEPS) { step++; renderForm(); } }
export function stepBack() { if (step > 1)     { step--; renderForm(); } }
window.stepNext = stepNext;
window.stepBack = stepBack;
