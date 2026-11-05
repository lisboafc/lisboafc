<?php include 'includes/header.php'; ?>

<div class="container my-5">
    <div class="row">
        <div class="col-12">
            <h1 class="text-uppercase fw-bold mb-4" style="color: #225131; border-bottom: 3px solid #CFA538; padding-bottom: 10px;">
                Calendario de Partidos
            </h1>
            <p class="text-muted">Consulta las fechas, horarios y resultados de todos los encuentros de la temporada.</p>
        </div>
    </div>

    <!-- Contenedor donde se cargarán las jornadas dinámicamente -->
    <div id="contenedor-jornadas" class="mt-4">
        <div class="text-center py-5">
            <div class="spinner-border" style="color: #225131;" role="status">
                <span class="visually-hidden">Cargando calendario...</span>
            </div>
        </div>
    </div>
</div>

<script type="module" src="js/cargar-partidos-todos.js"></script>
<?php include 'includes/footer.php'; ?>