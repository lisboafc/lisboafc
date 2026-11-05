<?php
session_start();
// Si no hay sesión válida, se expulsa al usuario al login
if (!isset($_SESSION['admin_logeado']) || $_SESSION['admin_logeado'] !== true) {
    header("Location: ../login.php");
    exit;
}
?>
<!-- Aquí empieza tu <!DOCTYPE html> y el resto del código... -->

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Admin | Lisboa F.C.</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background-color: #f8f9fa;">

<nav class="navbar navbar-dark mb-4 shadow-sm" style="background-color: #225131; border-bottom: 3px solid #CFA538;">
  <div class="container">
    <span class="navbar-brand fw-bold" style="color: #CFA538;">PANEL DE CONTROL</span>
    <div>
        <a href="competicion.php" class="btn btn-sm btn-outline-light me-2">Competición</a>
        <a href="crear-noticia.php" class="btn btn-sm btn-outline-light me-2">Noticias</a>
        <a href="../logout.php" class="btn btn-sm btn-danger fw-bold">Cerrar Sesión</a>
    </div>
  </div>
</nav>

<div class="container mb-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card shadow-sm border-0">
                <div class="card-header text-white fw-bold" style="background-color: #225131;">
                    Publicar Nueva Noticia
                </div>
                <div class="card-body">
                    <form id="form-noticia">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Título de la Noticia</label>
                            <input type="text" id="titulo" class="form-class form-control" placeholder="Ej: Gran victoria en el derbi" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Categoría</label>
                            <select id="categoria" class="form-select" required>
                                <option value="Actualidad">Actualidad</option>
                                <option value="Patrocinios">Patrocinios</option>
                                <option value="Crónica">Crónica de Partido</option>
                                <option value="Club">Club</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Imagen de la Noticia</label>
                            <input type="file" id="imagen" class="form-control" accept="image/*" required>
                            <div class="form-text">La imagen se convertirá a Base64 y se guardará en la base de datos.</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Contenido</label>
                            <textarea id="contenido" class="form-control" rows="5" placeholder="Escribe aquí la noticia..." required></textarea>
                        </div>

                        <button type="submit" id="btn-guardar" class="btn text-white w-100 fw-bold" style="background-color: #225131;">
                            Publicar Noticia
                        </button>
                    </form>
                    <div id="mensaje" class="mt-3"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="../js/crear-noticia.js"></script>
</body>
</html>