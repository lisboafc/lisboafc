<?php include 'includes/header.php'; ?>

<div class="container my-5">
    <div class="row mb-4">
        <div class="col-12">
            <h1 class="text-uppercase fw-bold mb-3" style="color: #225131; border-bottom: 3px solid #CFA538; padding-bottom: 10px;">
                Clasificación General
            </h1>
            <p class="text-muted">Sigue nuestra posición en la tabla. Los datos se actualizan automáticamente tras cada partido.</p>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card shadow-sm border-0">
                <div class="card-header text-white fw-bold text-center fs-5" style="background-color: #000000; border-top: 4px solid #CFA538;">
                    TEMPORADA 2026 / 2027
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 text-center align-middle">
                            <thead class="table-dark" style="background-color: #225131;">
                                <tr>
                                    <th style="width: 5%;">#</th>
                                    <th class="text-start" style="width: 35%;">EQUIPO</th>
                                    <th title="Partidos Jugados">PJ</th>
                                    <th title="Victorias">V</th>
                                    <th title="Empates">E</th>
                                    <th title="Derrotas">D</th>
                                    <th title="Goles a Favor" class="d-none d-md-table-cell">GF</th>
                                    <th title="Goles en Contra" class="d-none d-md-table-cell">GC</th>
                                    <th title="Diferencia de Goles">DG</th>
                                    <th class="fs-5" style="color: #CFA538;" title="Puntos">PTS</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-clasificacion-publica">
                                <tr>
                                    <td colspan="10" class="text-center py-5">
                                        <div class="spinner-border" style="color: #225131;" role="status">
                                            <span class="visually-hidden">Cargando clasificación...</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="module" src="js/cargar-clasificacion.js"></script>
<?php include 'includes/footer.php'; ?>