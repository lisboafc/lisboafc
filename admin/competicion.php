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
    <title>Competición | Lisboa F.C.</title>
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
    <!-- Fila Superior: Creación de Equipos y Partidos -->
    <div class="row">
        <!-- Formulario: Registrar Equipo -->
        <div class="col-md-5 mb-4">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header text-white fw-bold" style="background-color: #225131;">
                    Añadir Nuevo Equipo a la Liga
                </div>
                <div class="card-body">
                    <form id="form-equipo">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Nombre del Equipo</label>
                            <input type="text" id="nombre-equipo" class="form-control" placeholder="Ej: Rayo Vallecano F7" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Escudo (Opcional)</label>
                            <input type="file" id="escudo-equipo" class="form-control" accept="image/*">
                        </div>
                        <button type="submit" id="btn-guardar-equipo" class="btn w-100 fw-bold mt-2" style="background-color: #CFA538; color: #000000;">
                            Registrar Equipo
                        </button>
                    </form>
                    <div id="mensaje-equipo" class="mt-3"></div>
                </div>
            </div>
        </div>

        <!-- Formulario: Registrar Partido -->
        <div class="col-md-7 mb-4">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header text-white fw-bold" style="background-color: #225131;">
                    Programar Nuevo Partido
                </div>
                <div class="card-body">
                    <form id="form-partido">
                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label fw-bold">Jornada</label>
                                <input type="number" id="jornada-partido" class="form-control" min="1" value="1" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label fw-bold">Fecha y Hora</label>
                                <input type="datetime-local" id="fecha-partido" class="form-control" required>
                            </div>
                        </div>
                        <div class="row mb-3 align-items-end">
                            <div class="col-5">
                                <label class="form-label fw-bold text-success">Equipo Local</label>
                                <select id="local-partido" class="form-select select-equipos" required></select>
                            </div>
                            <div class="col-2 text-center fw-bold fs-5 text-muted">VS</div>
                            <div class="col-5">
                                <label class="form-label fw-bold text-primary">Equipo Visitante</label>
                                <select id="visitante-partido" class="form-select select-equipos" required></select>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="form-label fw-bold">Campo / Polideportivo</label>
                            <input type="text" id="campo-partido" class="form-control" placeholder="Ej: Polideportivo Aluche" required>
                        </div>
                        <button type="submit" id="btn-guardar-partido" class="btn text-white w-100 fw-bold" style="background-color: #225131;">
                            Programar Partido
                        </button>
                    </form>
                    <div id="mensaje-partido" class="mt-3"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Fila Inferior: Gestión de Resultados y Clasificación en Vivo -->
    <div class="row mt-2">
        <!-- Gestor de Resultados -->
        <div class="col-md-7 mb-4">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header text-white fw-bold bg-dark">
                    Gestor de Resultados
                </div>
                <div class="card-body" style="max-height: 500px; overflow-y: auto;">
                    <div id="lista-partidos-admin">
                        <div class="text-center text-muted py-4">Cargando partidos...</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Clasificación Automática -->
        <div class="col-md-5 mb-4">
            <div class="card shadow-sm border-0 h-100">
                <div class="card-header fw-bold" style="background-color: #CFA538; color: #000000;">
                    Clasificación en Vivo
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover table-striped mb-0 text-center align-middle">
                            <thead class="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th class="text-start">Equipo</th>
                                    <th>PJ</th>
                                    <th>PTS</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-clasificacion-admin">
                                <tr><td colspan="4" class="text-center text-muted py-4">Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="../js/admin-competicion.js"></script>
</body>
</html>