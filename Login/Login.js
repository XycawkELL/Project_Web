// --- FITUR GANTI TAB (Jika masih digunakan) ---
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.form-container').forEach(form => form.classList.add('hidden'));

  const target = document.getElementById(tab);
  target.classList.remove('hidden');

  target.style.animation = 'none';
  target.offsetHeight;
  target.style.animation = '';
}

// --- FITUR MATA PASSWORD ---
function togglePassword(btn) {
  const input = btn.closest('.input-wrapper').querySelector('input');
  const icon = btn.querySelector('.eye-icon');
  
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  icon.src = isHidden
    ? 'https://cdn.jsdelivr.net/npm/lucide-static@0.441.0/icons/eye-off.svg'
    : 'https://cdn.jsdelivr.net/npm/lucide-static@0.441.0/icons/eye.svg';

  btn.classList.toggle('visible', isHidden);
}

// --- FITUR LUPA SANDI ---
function showForgot(e) {
  e.preventDefault();
  
  // Sembunyikan Header Utama & Footer Daftar
  const mainHeader = document.getElementById('mainHeader');
  if (mainHeader) mainHeader.style.display = 'none';
  
  const authFooter = document.getElementById('authFooter');
  if (authFooter) authFooter.style.display = 'none';
  
  // Sembunyikan form login
  document.getElementById('signin').classList.add('hidden');
  
  // Tampilkan form lupa sandi dengan animasi
  const target = document.getElementById('forgot');
  target.classList.remove('hidden');
  target.style.animation = 'none';
  target.offsetHeight; // Memicu reflow browser
  target.style.animation = '';
}

function hideForgot(e) {
  e.preventDefault();
  
  // Tampilkan kembali Header Utama & Footer Daftar
  const mainHeader = document.getElementById('mainHeader');
  if (mainHeader) mainHeader.style.display = 'block';
  
  const authFooter = document.getElementById('authFooter');
  if (authFooter) authFooter.style.display = 'block';
  
  // Sembunyikan form lupa sandi
  document.getElementById('forgot').classList.add('hidden');
  
  // Tampilkan form login kembali
  const target = document.getElementById('signin');
  target.classList.remove('hidden');
  target.style.animation = 'none';
  target.offsetHeight; 
  target.style.animation = '';
}