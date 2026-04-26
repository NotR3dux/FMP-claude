/* ============================================================
   FIND MY PARTNER — Status Check
   ============================================================ */

export function showStatusResult() {
  const val = document.getElementById('status-inp').value.trim() || '@yourhandle';
  document.getElementById('status-uname').textContent = val;

  const checkEl  = document.getElementById('status-check');
  const resultEl = document.getElementById('status-result');

  checkEl.style.opacity  = '0';
  checkEl.style.transform = 'scale(0.96)';
  setTimeout(() => {
    checkEl.style.display  = 'none';
    resultEl.style.display = 'block';
    resultEl.style.opacity  = '0';
    resultEl.style.transform = 'scale(0.96)';
    void resultEl.offsetWidth;
    resultEl.style.transition = 'opacity 0.35s, transform 0.35s cubic-bezier(0.22,1,0.36,1)';
    resultEl.style.opacity  = '1';
    resultEl.style.transform = 'scale(1)';
    setTimeout(() => { document.getElementById('pbar').style.width = '45%'; }, 200);
  }, 280);
}

export function completePay() {
  window.navTo('status');
  requestAnimationFrame(() => {
    document.getElementById('status-check').style.display  = 'none';
    const res = document.getElementById('status-result');
    res.style.display = 'block';
    document.getElementById('status-uname').textContent = '@yourhandle';
    setTimeout(() => { document.getElementById('pbar').style.width = '45%'; }, 350);
  });
}

// Expose globally for inline onclick
window.showStatusResult = showStatusResult;
window.completePay      = completePay;
