function switchTab(tab) {
  // Ubah styling tab yang aktif
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Sembunyikan semua form
  document.querySelectorAll('.form-container').forEach(form => form.classList.add('hidden'));

  // Tampilkan form yang dituju (signin atau signup)
  const target = document.getElementById(tab);
  target.classList.remove('hidden');

  // Mainkan ulang animasi
  target.style.animation = 'none';
  target.offsetHeight;
  target.style.animation = '';
}

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
  
  // 1. Sembunyikan container tabs (Sign In / Sign Up)
  document.querySelector('.tabs').style.display = 'none';
  
  // 2. Sembunyikan Header Utama ("Selamat Datang")
  // Ambil elemen header-content yang pertama agar tidak bentrok dengan header lupa sandi
  const mainHeader = document.querySelectorAll('.header-content')[0];
  if(mainHeader) mainHeader.style.display = 'none';
  
  // 3. Sembunyikan form sign in dan sign up SECARA EKSPLISIT (Fix Bug Numpuk)
  document.getElementById('signin').classList.add('hidden');
  document.getElementById('signup').classList.add('hidden');
  
  // 4. Tampilkan form lupa sandi dengan animasi
  const target = document.getElementById('forgot');
  target.classList.remove('hidden');
  target.style.animation = 'none';
  target.offsetHeight; // Memicu reflow
  target.style.animation = '';
}

function hideForgot(e) {
  e.preventDefault();
  
  // 1. Tampilkan kembali container tabs
  document.querySelector('.tabs').style.display = 'flex';
  
  // 2. Tampilkan kembali Header Utama
  const mainHeader = document.querySelectorAll('.header-content')[0];
  if(mainHeader) mainHeader.style.display = 'block';
  
  // 3. Aktifkan tab "Sign In" secara manual
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab')[0].classList.add('active');
  
  // 4. Sembunyikan form lupa sandi & Tampilkan form "signin"
  document.getElementById('forgot').classList.add('hidden');
  document.getElementById('signin').classList.remove('hidden');
  
  // Mainkan ulang animasi
  const target = document.getElementById('signin');
  target.style.animation = 'none';
  target.offsetHeight; 
  target.style.animation = '';
}
