// ============================================================
//   FIND MY PARTNER — Google Apps Script Backend
//   Paste seluruh kode ini ke Google Apps Script
//   Lalu deploy sebagai Web App (Anyone can access)
// ============================================================

const FOLDER_NAME = 'FMP Uploads';

// Harga per paket
const PRICES = {
  'Solo':     'Rp 15.000',
  '2 Person': 'Rp 25.000',
  '3 Person': 'Rp 35.000',
};

// ── Entry point ────────────────────────────────────────────
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var data = JSON.parse(e.postData.contents);
    var txId = processSubmission(data);
    output.setContent(JSON.stringify({ success: true, txId: txId }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.toString() }));
  }

  return output;
}

function doGet(e) {
  return ContentService.createTextOutput('FMP API OK');
}

// ── Main processing ────────────────────────────────────────
function processSubmission(data) {
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = new Date();
  var txId   = 'FMP-' + Utilities.formatDate(timestamp, 'Asia/Jakarta', 'yyyyMMdd-HHmmss');

  // Pastikan sheet sudah ada
  ensureSheets(ss);

  // Simpan file ke Drive
  var folder    = getOrCreateFolder(FOLDER_NAME);
  var txFolder  = folder.createFolder(txId);
  var proofUrl  = '';
  var photoUrls = [];

  if (data.proofBase64) {
    proofUrl = saveBase64(txFolder, data.proofBase64, 'bukti-bayar.jpg');
  }
  if (Array.isArray(data.photoBase64s)) {
    data.photoBase64s.forEach(function(b64, i) {
      if (b64) photoUrls.push(saveBase64(txFolder, b64, 'foto-person-' + (i + 1) + '.jpg'));
      else      photoUrls.push('');
    });
  }

  // ── Sheet Database ─────────────────────────────────────
  var dbSheet = ss.getSheetByName('📊 Database');
  var persons = data.persons || [];
  var row     = [timestamp, txId, data.package];

  for (var i = 0; i < 3; i++) {
    var p = persons[i] || {};
    row = row.concat([
      p.fullName || '', p.gender || '', p.birth || '',
      p.university || '', p.faculty || '', p.studentId || '',
      p.religion || '', p.heightWeight || '', p.ethnicity || '',
      p.zodiac || '', p.purpose || '', p.hobby || '',
      p.idealType || '', p.socialMedia || '', p.phone || '',
      p.surveyPersonality || '', p.surveyLoveLanguage || '', p.surveyCommunication || '',
      photoUrls[i] || '',
    ]);
  }

  row.push(data.namaTransfer || '', proofUrl, 'Pending');
  dbSheet.appendRow(row);

  // ── Sheet Admin ────────────────────────────────────────
  var adminSheet  = ss.getSheetByName('✅ Admin');
  var adminRow    = adminSheet.getLastRow() + 1;
  var names       = persons.map(function(p) { return p.fullName;    }).filter(Boolean).join(', ');
  var phones      = persons.map(function(p) { return p.phone;       }).filter(Boolean).join(', ');
  var instagrams  = persons.map(function(p) { return p.socialMedia; }).filter(Boolean).join(', ');
  var purposes    = persons.map(function(p) { return p.purpose;     }).filter(Boolean).join(', ');
  var proofCell   = proofUrl ? '=HYPERLINK("' + proofUrl + '","📎 Lihat Bukti")' : '—';

  adminSheet.appendRow([
    timestamp,
    txId,
    data.package,
    PRICES[data.package] || '',
    names,
    purposes,
    instagrams,
    phones,
    data.namaTransfer || '',
    false,   // ✅ Sudah TF?
    false,   // ✅ Sudah Diproses?
    proofCell,
    '',      // Catatan admin
  ]);

  // Tambahkan checkbox
  adminSheet.getRange(adminRow, 10).insertCheckboxes();
  adminSheet.getRange(adminRow, 11).insertCheckboxes();

  // Warnai baris jika jumlah ganjil (zebra striping)
  if (adminRow % 2 === 0) {
    adminSheet.getRange(adminRow, 1, 1, 13).setBackground('#f0f9ee');
  }

  return txId;
}

// ── Setup sheets ────────────────────────────────────────────
function ensureSheets(ss) {
  if (!ss.getSheetByName('📊 Database')) {
    var db = ss.insertSheet('📊 Database');
    setupDatabaseSheet(db);
  }
  if (!ss.getSheetByName('✅ Admin')) {
    var admin = ss.insertSheet('✅ Admin');
    setupAdminSheet(admin);
    ss.setActiveSheet(admin);
  }
}

function setupDatabaseSheet(sheet) {
  var personCols = [
    'Nama', 'Gender', 'Tgl Lahir', 'Universitas', 'Fakultas', 'NIM',
    'Agama', 'TB/BB', 'Suku', 'Zodiak', 'Tujuan', 'Hobi',
    'Ideal Type', 'Instagram', 'No HP', 'MBTI', 'Love Language', 'Comm Style', 'Foto',
  ];
  var headers = ['Timestamp', 'TX ID', 'Paket'];
  ['P1', 'P2', 'P3'].forEach(function(px) {
    personCols.forEach(function(c) { headers.push(px + ' ' + c); });
  });
  headers.push('Nama Transfer', 'Bukti Bayar', 'Status');

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1a4d0e').setFontColor('#fff').setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 160);
}

function setupAdminSheet(sheet) {
  var headers = [
    'Waktu Daftar', 'TX ID', 'Paket', 'Total Bayar',
    'Nama', 'Tujuan', 'Instagram', 'No HP', 'Nama Transfer',
    'Sudah TF? ✅', 'Sudah Diproses? ✅', 'Bukti Bayar', 'Catatan Admin',
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1a4d0e').setFontColor('#fff').setFontWeight('bold').setFontSize(11);
  sheet.setFrozenRows(1);

  // Lebar kolom
  var widths = [160, 160, 80, 100, 200, 100, 160, 130, 140, 100, 120, 130, 200];
  widths.forEach(function(w, i) { sheet.setColumnWidth(i + 1, w); });

  // Freeze + filter
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).createFilter();
}

// ── Drive helpers ───────────────────────────────────────────
function getOrCreateFolder(name) {
  var iter = DriveApp.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : DriveApp.createFolder(name);
}

function saveBase64(folder, base64Data, filename) {
  var clean  = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
  var blob   = Utilities.newBlob(Utilities.base64Decode(clean), 'image/jpeg', filename);
  var file   = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}
