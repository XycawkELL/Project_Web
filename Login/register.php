<?php
// Panggil koneksi ke database
require 'koneksi.php';

if (isset($_POST['register'])) {
    // Tangkap data dari form
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];
    $konfirmasi = $_POST['konfirmasi_password'];

    // 1. Cek apakah password dan konfirmasi sama
    if ($password !== $konfirmasi) {
        echo "<script>
                alert('Pendaftaran gagal: Password tidak cocok!'); 
                window.history.back();
              </script>";
        exit;
    }

    // 2. Cek apakah username atau email sudah pernah didaftarkan
    $cek_user = mysqli_query($conn, "SELECT * FROM users WHERE username = '$username' OR email = '$email'");
    if (mysqli_num_rows($cek_user) > 0) {
        echo "<script>
                alert('Pendaftaran gagal: Username atau Email sudah terdaftar!'); 
                window.history.back();
              </script>";
        exit;
    }

    // 3. Enkripsi password untuk keamanan
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // 4. Masukkan data ke dalam database
    $query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed_password')";
    
    if (mysqli_query($conn, $query)) {
        // --- BAGIAN PENGALIHAN (REDIRECT) ---
        // Jika berhasil, munculkan pop-up alert lalu arahkan kembali ke Login.html
        echo "<script>
                alert('Pendaftaran Berhasil! Silakan Sign In menggunakan akun baru kamu.'); 
                window.location.href = 'Login.html';
              </script>";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>