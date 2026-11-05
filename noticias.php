<?php include 'includes/header.php'; ?>

<div class="container my-5">
    <div class="row mb-4">
        <div class="col-12">
            <h1 class="text-uppercase fw-bold mb-3" style="color: #225131; border-bottom: 3px solid #CFA538; padding-bottom: 10px;">
                Actualidad del Club
            </h1>
            <p class="text-muted">Todas las novedades, crónicas y anuncios del Lisboa Fútbol Club.</p>
        </div>
    </div>

    <!-- Contenedor dinámico de Noticias -->
    <div class="row" id="contenedor-noticias-completo">
        <div class="col-12 text-center py-5">
            <div class="spinner-border" style="color: #225131;" role="status">
                <span class="visually-hidden">Cargando noticias...</span>
            </div>
        </div>
    </div>
</div>

<!-- Ventana Flotante (Modal) para leer la noticia entera -->
<div class="modal fade" id="modalNoticia" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content border-0 shadow">
      <div class="modal-header text-white" style="background-color: #225131;">
        <h5 class="modal-title fw-bold" id="modal-titulo">Cargando...</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body p-0">
        <img id="modal-imagen" src="" class="w-100" style="max-height: 400px; object-fit: cover; display: none;">
        <div class="p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span id="modal-categoria" class="badge text-dark" style="background-color: #CFA538;"></span>
                <small id="modal-fecha" class="text-muted"></small>
            </div>
            <div id="modal-contenido" class="fs-5" style="white-space: pre-line; color: #333;"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="module" src="js/cargar-todas-noticias.js"></script>
<?php include 'includes/footer.php'; ?>