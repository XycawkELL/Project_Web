<?php
session_start(); // Mulai sesi untuk menyimpan data login
require 'koneksi.php';

if (isset($_POST['login'])) {
    $user_id = mysqli_real_escape_string($conn, $_POST['user_id']); // Bisa berupa username atau email
    $password = $_POST['password'];

    // Cari user berdasarkan username ATAU email
    $query = "SELECT * FROM users WHERE username = '$user_id' OR email = '$user_id'";
    $result = mysqli_query($conn, $query);

    // Cek apakah akun ditemukan
    if (mysqli_num_rows($result) === 1) {
        $row = mysqli_fetch_assoc($result);
        
        // Verifikasi kecocokan password yang diketik dengan yang di-hash di database
        if (password_verify($password, $row['password'])) {
            // Set Session jika berhasil
            $_SESSION['login'] = true;
            $_SESSION['username'] = $row['username'];
            
            // Arahkan ke halaman utama kamu (contoh: index.html/php)
            echo "<script>alert('Login Berhasil!'); window.location.href='Home.html';</script>";
            exit;
        } else {
            echo "<script>alert('Password salah!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Akun tidak ditemukan!'); window.history.back();</script>";
    }
}
?>