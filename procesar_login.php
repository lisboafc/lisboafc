<?php
session_start();
// Solo creamos la sesión si JavaScript ha validado previamente en Firebase
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["token"]) && $_POST["token"] === "validado") {
    $_SESSION['admin_logeado'] = true;
    echo "OK";
}
?>