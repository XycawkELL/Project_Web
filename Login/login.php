<?php
// 1. Memunculkan error jika ada masalah sistem (Mencegah layar blank putih)
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// 2. Memanggil koneksi database
require 'koneksi.php'; 

if (isset($_POST['login'])) {
    // Menangkap data input dan mengamankannya dari SQL Injection
    $user_id = mysqli_real_escape_string($conn, $_POST['user_id']);
    $password = $_POST['password'];

    // Inject CDN SweetAlert2 dan Google Fonts untuk tampilan pop-up
    echo '<!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Proses Sign In - TemuTrip</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;600&display=swap">
        <style>
            body {
                background-color: #f4f7f6;
                font-family: "Plus Jakarta Sans", sans-serif;
            }
            .swal2-popup {
                font-family: "Plus Jakarta Sans", sans-serif !important;
                border-radius: 16px !important;
                box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1) !important;
            }
            .swal2-confirm {
                background-color: #34715c !important; /* Warna hijau utama TemuTrip */
                padding: 12px 35px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
            }
        </style>
    </head>
    <body>';

    // Query untuk mencari user berdasarkan username ATAU email
    $query = "SELECT * FROM users WHERE username = '$user_id' OR email = '$user_id'";
    $result = mysqli_query($conn, $query);

    // Cek apakah data user ditemukan di database
    if (mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        
        // Verifikasi kecocokan password plaintext dengan hash yang tersimpan di database
        if (password_verify($password, $row['password'])) {
            // Set Session jika login sukses
            $_SESSION['login'] = true;
            $_SESSION['username'] = $row['username'];
            
            // POP-UP SUKSES: Otomatis menutup sendiri dalam 1.5 detik lalu pindah ke Home
            echo "<script>
                // =========================================================================
                // LOGIKA MULTI-ACCOUNT: Mengunci session localstorage agar tidak tertimpa
                // =========================================================================
                let username = '" . $row['username'] . "';
                localStorage.setItem('active_user', username);
                
                // Jika user baru pertama kali login, buat slot memori default khusus akunnya
                if (!localStorage.getItem('p_name_' + username)) {
                    localStorage.setItem('p_name_' + username, username);
                }

                // Muat data kustom spesifik milik akun ini ke key global agar dibaca frontend
                localStorage.setItem('p_name', localStorage.getItem('p_name_' + username));
                localStorage.setItem('user_avatar', localStorage.getItem('user_avatar_' + username) || '');
                localStorage.setItem('p_email', localStorage.getItem('p_email_' + username) || '');
                localStorage.setItem('p_phone', localStorage.getItem('p_phone_' + username) || '');
                localStorage.setItem('p_birth', localStorage.getItem('p_birth_' + username) || '');
                localStorage.setItem('p_city', localStorage.getItem('p_city_' + username) || '');
                localStorage.setItem('p_gender', localStorage.getItem('p_gender_' + username) || 'Laki-laki');

                setTimeout(function() {
                    Swal.fire({
                        icon: 'success',
                        title: 'Selamat Datang Kembali!',
                        text: 'Mempersiapkan petualanganmu...',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '../Home/Home.html';
                    });
                }, 100);
            </script>";
            echo '</body></html>';
            exit;
        } else {
            // POP-UP GAGAL: Password tidak cocok
            echo "<script>
                setTimeout(function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Password Salah!',
                        text: 'Kata sandi yang kamu masukkan tidak sesuai. Silakan coba lagi.',
                        confirmButtonText: 'Coba Lagi'
                    }).then((result) => {
                        window.location.href = 'Login.html';
                    });
                }, 100);
            </script>";
            echo '</body></html>';
            exit;
        }
    } else {
        // POP-UP GAGAL: Username atau Email tidak terdaftar sama sekali
        echo "<script>
            setTimeout(function() {
                Swal.fire({
                    icon: 'question',
                    title: 'Akun Tidak Ditemukan',
                    text: 'Username atau email belum terdaftar di TemuTrip.',
                    confirmButtonText: 'Kembali'
                }).then((result) => {
                    window.location.href = 'register.html';
                });
            }, 100);
        </script>";
        echo '</body></html>';
        exit;
    }
}
?>