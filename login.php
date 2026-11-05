<?php
session_start();
// Si ya hay sesión PHP iniciada, redirige al admin
if (isset($_SESSION['admin_logeado']) && $_SESSION['admin_logeado'] === true) {
    header("Location: admin/competicion.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Acceso Técnico | Lisboa F.C.</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center justify-content-center vh-100">

<div class="card shadow-sm border-0" style="width: 350px;">
    <div class="card-header text-center text-white fw-bold" style="background-color: #225131;">
        Acceso Técnico
    </div>
    <div class="card-body p-4">
        <div id="mensaje-error" class="alert alert-danger py-2 text-center small d-none"></div>
        
        <form id="form-login">
            <div class="mb-3">
                <label class="form-label small fw-bold">Email</label>
                <input type="email" id="login-email" class="form-control form-control-sm" required autofocus>
            </div>
            <div class="mb-4">
                <label class="form-label small fw-bold">Contraseña</label>
                <input type="password" id="login-pass" class="form-control form-control-sm" required>
            </div>
            <button type="submit" id="btn-login" class="btn btn-dark w-100 fw-bold">Entrar</button>
        </form>
        <div class="text-center mt-3">
            <a href="index.php" class="text-muted small text-decoration-none">Volver a la web</a>
        </div>
    </div>
</div>

<script type="module">
    // Importamos la configuración y la librería de Auth
    import { db } from "./js/firebase-config.js";
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    
    // Obtenemos el servicio de autenticación de tu Firebase
    const auth = getAuth();
    
    document.getElementById("form-login").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = document.getElementById("login-email").value;
        const pass = document.getElementById("login-pass").value;
        const btn = document.getElementById("btn-login");
        const msgError = document.getElementById("mensaje-error");
        
        btn.disabled = true;
        btn.innerText = "Verificando...";
        msgError.classList.add("d-none");

        // Firebase verifica los datos encriptados
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                // Si Firebase da el OK, creamos la sesión PHP
                fetch("procesar_login.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: "token=validado"
                })
                .then(() => {
                    window.location.href = "admin/competicion.php";
                });
            })
            .catch((error) => {
                btn.disabled = false;
                btn.innerText = "Entrar";
                msgError.innerText = "Credenciales incorrectas.";
                msgError.classList.remove("d-none");
            });
    });
</script>
</body>
</html>