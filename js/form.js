/* ============================================================
   FIND MY PARTNER — Registration Form (Supabase)
   ============================================================ */

import { supabase } from './supabase.js';

const formData = { package: null, transactionId: null, persons: [] };
let step = 1;
let selectedPackage = null;
const STEPS = 5;

const stepMeta = {
  1: { title: 'Syarat & Ketentuan ✏️',   sub: '' },
  2: { title: '💎 Pilih Paket 💎',         sub: 'Pilih paket yang sesuai kebutuhanmu' },
  3: { title: 'Info Personal 📝',          sub: 'Ceritain sedikit tentang dirimu!' },
  4: { title: 'Konfirmasi ✔️',             sub: 'Pastikan semua data sudah benar' },
  5: { title: 'Terima Kasih! 🎉',          sub: 'Pendaftaran berhasil!' },
};

export function initForm() { step = 1; selectedPackage = null; formData.persons = []; renderForm(); }

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

async function renderContent() {
  const el = document.getElementById('step-content');

  if (step === 1) {
    el.innerHTML = `
      <div class="fcard">
        <h3 style="font-size:17px;font-weight:700;color:var(--dark);margin-bottom:12px;">📌 Sebelum mengisi, perhatikan hal berikut:</h3>
        <ul style="font-size:13.5px;color:var(--muted);line-height:1.75;list-style:disc;padding-left:18px;margin-bottom:16px;">
          <li>Find My Partner menjunjung tinggi rasa aman, nyaman, dan saling menghargai.</li>
          <li>Segala bentuk rasisme, diskriminasi, pelecehan, ujaran kebencian dilarang keras.</li>
          <li>Platform ini untuk membangun relasi positif — teman maupun hubungan lebih serius.</li>
          <li>Pelanggaran ketentuan = partisipasi dibatalkan, biaya tidak dikembalikan.</li>
        </ul>
        <h3 style="font-size:15px;font-weight:700;color:var(--dark);margin-bottom:8px;">🔒 Privasi & Kerahasiaan Data</h3>
        <p style="font-size:13.5px;color:var(--muted);line-height:1.75;margin-bottom:16px;">
          Semua data yang kamu berikan dijaga kerahasiaannya dan hanya digunakan untuk proses matching oleh tim Find My Partner. Isi form dengan jujur agar hasil matching lebih optimal!
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
        <div style="display:flex;flex-direction:column;gap:12px;" id="pkg-list">
          ${[
            { value: 'Solo',     label: '🧍 Solo',     price: '15k', sub: '1 orang', color: '#6AADE0' },
            { value: '2 Person', label: '👫 2 Orang',  price: '25k', sub: '2 orang', color: '#B9A3DC' },
            { value: '3 Person', label: '👨‍👩‍👧 3 Orang', price: '35k', sub: '3 orang', color: '#6BC47A' },
          ].map(pkg => `
            <label style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-radius:14px;border:2.5px solid #e8e8e8;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#fff;" class="pkg-label">
              <div style="display:flex;align-items:center;gap:12px;">
                <input type="radio" name="package" value="${pkg.value}" style="width:18px;height:18px;accent-color:var(--green-d);">
                <div>
                  <div style="font-size:15px;font-weight:800;color:var(--dark);font-family:'Nunito',sans-serif;">${pkg.label}</div>
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
    let count = selectedPackage === '2 Person' ? 2 : selectedPackage === '3 Person' ? 3 : 1;
    el.innerHTML = Array.from({ length: count }, (_, i) => renderPersonForm(i + 1)).join('');

  } else if (step === 4) {
    const persons = formData.persons;
    if (!persons || persons.length === 0) {
      el.innerHTML = `<div class="fcard"><p style="color:red;">Data tidak ditemukan. Kembali ke langkah sebelumnya.</p></div>`;
      return;
    }
    el.innerHTML = `
      <div class="fcard">
        <p style="font-size:13px;color:var(--muted);margin-bottom:16px;">Pastikan semua informasi sudah benar sebelum submit.</p>
        ${persons.map((p, i) => `
          <div class="confirm-card">
            <h3 style="font-size:16px;font-weight:800;color:var(--dark);margin-bottom:10px;">Person ${i + 1}</h3>
            ${Object.entries({
              'Nama': p.fullName, 'Gender': p.gender, 'Tgl Lahir': p.birth,
              'Universitas': p.university, 'Fakultas': p.faculty, 'NIM': p.studentId,
              'Agama': p.religion, 'TB/BB': p.heightWeight, 'Suku': p.ethnicity,
              'Zodiak': p.zodiac, 'Tujuan': p.purpose, 'Hobi': p.hobby,
              'Tipe Ideal': p.idealType, 'Instagram': p.socialMedia, 'No. HP': p.phone,
              'MBTI': p.surveyPersonality, 'Love Language': p.surveyLoveLanguage,
              'Communication Style': p.surveyCommunication
            }).filter(([,v]) => v).map(([k,v]) => `
              <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #f5f5f5;font-size:13px;">
                <span style="font-weight:700;color:var(--dark);min-width:140px;">${k}:</span>
                <span style="color:var(--muted);">${v}</span>
              </div>
            `).join('')}
            <div style="display:flex;gap:8px;padding:5px 0;font-size:13px;"><span style="font-weight:700;color:var(--dark);min-width:140px;">Foto:</span><span style="color:var(--green-d);">✅ Uploaded</span></div>
            <div style="display:flex;gap:8px;padding:5px 0;font-size:13px;"><span style="font-weight:700;color:var(--dark);min-width:140px;">Bukti Bayar:</span><span style="color:var(--green-d);">✅ Uploaded</span></div>
          </div>
        `).join('')}
      </div>`;

  } else if (step === 5) {
    el.innerHTML = `
      <div class="fcard" style="text-align:center;">
        <img src="/images/goodbye.jpeg" alt="Terima kasih" style="max-width:100%;border-radius:14px;margin-bottom:20px;box-shadow:0 4px 16px rgba(0,0,0,0.1);">
        <h2 class="jk" style="font-size:22px;font-weight:900;color:var(--dark);margin-bottom:12px;">Terima Kasih Sudah Mendaftar! 🎉</h2>
        <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:12px;">Tim Find My Partner akan hubungi kamu via DM Instagram kalau kamu dapat match. Pastikan DM terbuka! 💌✨</p>
        <a href="https://drive.google.com/file/d/14ddH5QZEXpkbta6kBT6Kg83DVK4wcXl8/view?usp=sharing" target="_blank" style="color:var(--green-d);font-weight:700;text-decoration:underline;font-size:14px;">Baca panduan Find My Partner →</a>
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
      <div class="fgroup"><label>Tipe Ideal * <small style="color:var(--muted);font-weight:400;">(TB, suku, agama, love language, sifat, communication style)</small></label><input type="text" name="idealType" placeholder="Deskripsikan tipe ideal kamu"></div>
      <div class="fgroup"><label>Instagram *</label><input type="text" name="socialMedia" placeholder="@username"></div>
      <div class="frow">
        <div class="fgroup"><label>Foto Full Body * <small style="color:var(--muted);font-weight:400;">(kepala sampai kaki)</small></label><input type="file" name="fullBodyPhoto" accept="image/*"></div>
        <div class="fgroup"><label>Bukti Pembayaran *</label><input type="file" name="transactionProof" accept="image/*"></div>
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

function renderNav() {
  const el = document.getElementById('step-nav');
  const isFirst = step === 1;
  const isLast  = step === STEPS;

  let continueBtn = !isLast ? `
    <button id="continue-btn" onclick="window.stepNext()"
      class="btn-red" style="padding:12px 30px;font-size:14px;"
      ${isFirst ? 'disabled' : ''}>Lanjut →</button>` : '';

  el.innerHTML = `
    <button onclick="${isFirst ? "window.navTo('home')" : 'window.stepBack()'}"
      style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;font-weight:600;font-family:'Inter',sans-serif;padding:12px 0;">
      ← Kembali
    </button>
    ${continueBtn}
    ${isLast ? `<button onclick="window.navTo('home')" class="btn-red" style="padding:12px 30px;font-size:14px;">Selesai ✨</button>` : ''}
  `;

  if (isFirst) {
    const cb = document.getElementById('tos-agree');
    const btn = document.getElementById('continue-btn');
    cb.addEventListener('change', () => { btn.disabled = !cb.checked; });
  }

  if (step === 2) {
    const btn = document.getElementById('continue-btn');
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

  if (step === 3) {
    const btn = document.getElementById('continue-btn');
    btn.disabled = true;
    const inputs = document.querySelectorAll('.person-card input, .person-card select, .person-card textarea');
    const validate = () => {
      btn.disabled = ![...inputs].every(inp => inp.type === 'file' ? inp.files?.length > 0 : inp.value.trim() !== '');
    };
    inputs.forEach(inp => { inp.addEventListener('input', validate); inp.addEventListener('change', validate); });

    btn.onclick = async () => {
      btn.disabled = true; btn.textContent = 'Menyimpan...';
      formData.persons = [];
      for (let i = 0; i < document.querySelectorAll('.person-card').length; i++) {
        const card = document.querySelectorAll('.person-card')[i];
        const get  = n => card.querySelector(`[name="${n}"]`);
        const photoFile = get('fullBodyPhoto').files[0];
        const proofFile = get('transactionProof').files[0];
        let photoPath = null, proofPath = null;
        if (photoFile) { const { data } = await supabase.storage.from('uploads').upload(`photo-${Date.now()}-${i}.jpg`, photoFile); if (data) photoPath = data.path; }
        if (proofFile) { const { data } = await supabase.storage.from('uploads').upload(`proof-${Date.now()}-${i}.jpg`, proofFile); if (data) proofPath = data.path; }
        const p = { fullName: get('fullName').value, gender: get('gender').value, birth: get('birth').value, university: get('university').value, faculty: get('faculty').value, studentId: get('studentId').value, religion: get('religion').value, heightWeight: get('heightWeight').value, ethnicity: get('ethnicity').value, zodiac: get('zodiac').value, purpose: get('purpose').value, hobby: get('hobby').value, idealType: get('idealType').value, socialMedia: get('socialMedia').value, phone: get('phone').value, surveyPersonality: get('surveyPersonality').value, surveyLoveLanguage: get('surveyLoveLanguage').value, surveyCommunication: get('surveyCommunication').value };
        await supabase.from('persons').insert([{ transaction_id: formData.transactionId, full_name: p.fullName, gender: p.gender, birth: p.birth, university: p.university, faculty: p.faculty, student_id: p.studentId, religion: p.religion, height_weight: p.heightWeight, ethnicity: p.ethnicity, zodiac: p.zodiac, purpose: p.purpose, hobby: p.hobby, ideal_type: p.idealType, social_media: p.socialMedia, phone: p.phone, survey_personality: p.surveyPersonality, survey_love_language: p.surveyLoveLanguage, survey_communication: p.surveyCommunication, full_body_photo_url: photoPath, transaction_proof_url: proofPath }]);
        formData.persons.push(p);
      }
      step = 4; renderForm();
    };
  }

  if (step === 4) {
    document.getElementById('continue-btn').onclick = () => { step = 5; renderForm(); };
  }
}

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
