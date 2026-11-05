<?php include 'includes/header.php'; ?>

<!-- Hero Section: Foto del equipo con bienvenida -->
<!-- Nota: Sustituye 'img/equipo-fondo.jpg' por la ruta de tu foto real -->
<div class="container-fluid p-0 position-relative" style="background: url('img/equipo-fondo.jpg') center/cover no-repeat; height: 80vh; min-height: 400px;">
    <!-- Capa oscura para que el texto se lea bien sobre la foto -->
    <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(0,0,0,0.6);"></div>
    
    <div class="container position-relative h-100 d-flex align-items-center justify-content-center text-center">
        <div class="text-white">
            <h1 class="display-3 fw-bold text-uppercase" style="color: #FFFFFF; text-shadow: 2px 2px 4px #000000;">Lisboa F.C.</h1>
            <p class="lead fs-4" style="color: #CFA538; text-shadow: 1px 1px 2px #000000;">Orgullo, pasión y fútbol de barrio</p>
        </div>
    </div>
</div>

<div class="container mt-5">
    
<!-- Sección: Próximos Partidos -->
    <div class="row mb-5">
        <div class="col-12">
            <h2 class="text-uppercase fw-bold mb-4" style="color: #225131; border-bottom: 3px solid #CFA538; padding-bottom: 10px;">Próximos Partidos</h2>
        </div>
    </div>

    <!-- Contenedor dinámico donde Firebase cargará los 3 próximos partidos -->
    <div class="row mb-5" id="contenedor-partidos-index">
        <div class="col-12 text-center py-4">
            <div class="spinner-border" style="color: #225131;" role="status">
                <span class="visually-hidden">Cargando partidos...</span>
            </div>
        </div>
    </div>

<!-- Sección: Últimas Noticias -->
    <div class="row">
        <div class="col-12">
            <h2 class="text-uppercase fw-bold mb-4" style="color: #225131; border-bottom: 3px solid #CFA538; padding-bottom: 10px;">Últimas Noticias</h2>
        </div>
    </div>

    <!-- Contenedor donde JavaScript cargará SOLO las noticias reales -->
    <div class="row" id="contenedor-noticias">
        <!-- El contenido se cargará dinámicamente desde Firebase -->
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    </div>

    </div>
</div>

<script type="module" src="js/cargar-noticias.js"></script>
<script type="module" src="js/cargar-noticias.js"></script>
<script type="module" src="js/cargar-partidos-index.js"></script>
<?php include 'includes/footer.php'; ?>
