<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require 'koneksi.php'; 

if (isset($_POST['register'])) { 
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password']; 
    $konfirmasi_password = $_POST['konfirmasi_password']; 

    echo '<!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Proses Registrasi - TemuTrip</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap">
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
                background-color: #34715c !important;
                padding: 12px 35px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
            }
        </style>
    </head>
    <body>';

    // ------------------------------------------------------------------
    // VALIDASI 1: Cek Apakah Username Sudah Terdaftar
    // ------------------------------------------------------------------
    $cek_username = mysqli_query($conn, "SELECT username FROM users WHERE username = '$username'");
    if (mysqli_num_rows($cek_username) > 0) {
        echo "<script>
            Swal.fire({
                icon: 'warning',
                title: 'Username Tidak Tersedia',
                text: 'Username sudah digunakan oleh petualang lain. Coba nama lain!',
                confirmButtonText: 'Kembali Ke Sign Up'
            }).then((result) => {
                window.location.href = 'register.html'; // Tembak stabil ke HTML
            });
        </script>
        </body></html>";
        exit; 
    }

    // ------------------------------------------------------------------
    // VALIDASI 2: Cek Apakah Email Sudah Terdaftar
    // ------------------------------------------------------------------
    $cek_email = mysqli_query($conn, "SELECT email FROM users WHERE email = '$email'");
    if (mysqli_num_rows($cek_email) > 0) {
        echo "<script>
            Swal.fire({
                icon: 'warning',
                title: 'Email Sudah Terpakai',
                text: 'Silakan gunakan alamat email lain yang belum terdaftar.',
                confirmButtonText: 'Kembali Ke Sign Up'
            }).then((result) => {
                window.location.href = 'register.html'; // Tembak stabil ke HTML
            });
        </script>
        </body></html>";
        exit; 
    }

    // ------------------------------------------------------------------
    // VALIDASI 3: Cek Apakah Password Pertama dan Konfirmasi Berbeda
    // ------------------------------------------------------------------
    if ($password !== $konfirmasi_password) {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Password Tidak Cocok',
                text: 'Konfirmasi password harus sama persis dengan password yang kamu ketik pertama kali!',
                confirmButtonText: 'Perbaiki'
            }).then((result) => {
                window.location.href = 'register.html';
            });
        </script>
        </body></html>";
        exit;
    }

    // ------------------------------------------------------------------
    // VALIDASI 4: Minimal 8 Karakter & Harus Kombinasi Huruf + Angka
    // ------------------------------------------------------------------
    if (strlen($password) < 8 || !preg_match("/[A-Za-z]/", $password) || !preg_match("/[0-9]/", $password)) {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Password Kurang Kuat',
                text: 'Password wajib minimal 8 karakter dengan kombinasi huruf dan angka!',
                confirmButtonText: 'Perbaiki Password'
            }).then((result) => {
                window.location.href = 'register.html';
            });
        </script>
        </body></html>";
        exit;
    }

    // ------------------------------------------------------------------
    // PROSES SIMPAN: Jika Semua Validasi Di Atas Lolos
    // ------------------------------------------------------------------
    $password_hashed = password_hash($password, PASSWORD_DEFAULT);

    $query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password_hashed')";
    $eksekusi = mysqli_query($conn, $query);

    if ($eksekusi) {
        // Jika sukses total, kita perintahkan Javascript buat hapus permanen data sementaranya
        echo "<script>
            localStorage.removeItem('temutrip_old_username');
            localStorage.removeItem('temutrip_old_email');
            Swal.fire({
                icon: 'success',
                title: 'Registrasi Berhasil!',
                text: 'Akun TemuTrip kamu sudah aktif. Yuk, langsung login!',
                confirmButtonText: 'Ke Halaman Login'
            }).then((result) => {
                window.location.href = 'Login.html';
            });
        </script>";
    } else {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan sistem database, silakan coba lagi.',
                confirmButtonText: 'Kembali'
            }).then((result) => {
                window.location.href = 'register.html';
            });
        </script>";
    }
    
    echo '</body></html>';
}
?>