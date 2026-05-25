// 1. OTOMATIS LOAD DATA: Cek apakah ada data tersimpan di browser saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("temutrip_old_username")) {
    document.getElementById("username").value = localStorage.getItem("temutrip_old_username");
  }
  if (localStorage.getItem("temutrip_old_email")) {
    document.getElementById("email").value = localStorage.getItem("temutrip_old_email");
  }

  // Bersihkan memori setelah dipakai biar gak nempel selamanya
  localStorage.removeItem("temutrip_old_username");
  localStorage.removeItem("temutrip_old_email");
});

// 2. SIMPAN DATA SEBELUM SUBMIT: Amankan teks inputan pas tombol daftar dipencet
document.getElementById("signupForm").addEventListener("submit", function () {
  localStorage.setItem("temutrip_old_username", document.getElementById("username").value);
  localStorage.setItem("temutrip_old_email", document.getElementById("email").value);
});

// 3. FUNGSI MATA PASSWORD: Toggle sembunyikan/tampilkan password
function togglePassword(btn) {
  const input = btn.closest('.input-wrapper').querySelector('input');
  const icon = btn.querySelector('.eye-icon');
  const isHidden = input.type === 'password';
  
  input.type = isHidden ? 'text' : 'password';
  icon.src = isHidden
    ? 'https://cdn.jsdelivr.net/npm/lucide-static@0.441.0/icons/eye-off.svg'
    : 'https://cdn.jsdelivr.net/npm/lucide-static@0.441.0/icons/eye.svg';
}