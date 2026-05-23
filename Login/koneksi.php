<?php
$host = "localhost";
$user = "root"; // Default username XAMPP
$pass = "";     // Default password XAMPP biasanya kosong
$db   = "db_temutrip"; // Nama database yang kita buat tadi

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>