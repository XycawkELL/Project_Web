<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require 'koneksi.php'; 

if (isset($_POST['reset'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    // Menyiapkan tag HTML awal agar SweetAlert2 bisa dimuat oleh PHP
    echo '<!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Proses Reset Password</title>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&display=swap">
        <style>
            body { background-color: #f4f7f6; font-family: "Plus Jakarta Sans", sans-serif; }
            .swal2-popup { border-radius: 16px !important; box-shadow: 0px 10px 30px rgba(0,0,0,0.1) !important; font-family: "Plus Jakarta Sans", sans-serif; }
            .swal2-confirm { background-color: #34715c !important; border-radius: 8px !important; font-weight: 600 !important; }
        </style>
    </head>
    <body>';

    // 1. Cek apakah email terdaftar di database
    $cek_email = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email'");
    if (mysqli_num_rows($cek_email) === 0) {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Email Tidak Ditemukan',
                text: 'Email yang kamu masukkan belum terdaftar di sistem kami.',
                confirmButtonText: 'Kembali'
            }).then(() => { window.location.href = 'Login.html'; });
        </script></body></html>";
        exit;
    }

    // 2. Cek kecocokan konfirmasi password
    if ($new_password !== $confirm_password) {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Password Tidak Cocok',
                text: 'Konfirmasi password harus persis sama dengan password baru.',
                confirmButtonText: 'Ulangi'
            }).then(() => { window.location.href = 'Login.html'; });
        </script></body></html>";
        exit;
    }

    // 3. Cek standar keamanan password
    if (strlen($new_password) < 8 || !preg_match("/[A-Za-z]/", $new_password) || !preg_match("/[0-9]/", $new_password)) {
        echo "<script>
            Swal.fire({
                icon: 'warning',
                title: 'Password Lemah',
                text: 'Password baru wajib minimal 8 karakter dengan kombinasi huruf dan angka!',
                confirmButtonText: 'Perbaiki'
            }).then(() => { window.location.href = 'Login.html'; });
        </script></body></html>";
        exit;
    }

    // 4. Proses Update Password ke Database
    $password_hashed = password_hash($new_password, PASSWORD_DEFAULT);
    $query = "UPDATE users SET password = '$password_hashed' WHERE email = '$email'";
    $update = mysqli_query($conn, $query);

    if ($update) {
        echo "<script>
            Swal.fire({
                icon: 'success',
                title: 'Reset Berhasil!',
                text: 'Password akun kamu telah berhasil diubah. Silakan Login menggunakan password baru.',
                confirmButtonText: 'Ke Halaman Login'
            }).then(() => { window.location.href = 'Login.html'; });
        </script>";
    } else {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi masalah pada database. Silakan coba lagi.',
                confirmButtonText: 'Kembali'
            }).then(() => { window.location.href = 'Login.html'; });
        </script>";
    }

    echo '</body></html>';
}
?>