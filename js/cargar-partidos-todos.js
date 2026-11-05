import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const contenedorJornadas = document.getElementById("contenedor-jornadas");

// Creamos el contenedor para el selector dinámico de jornadas
const contenedorSelector = document.createElement("div");
contenedorSelector.className = "row mb-4";
contenedorJornadas.parentNode.insertBefore(contenedorSelector, contenedorJornadas);

async function cargarTodosLosPartidos() {
    if (!contenedorJornadas) return;

    try {
        const equiposSnap = await getDocs(collection(db, "equipos"));
        const equiposMap = {};
        equiposSnap.forEach(doc => {
            equiposMap[doc.id] = doc.data();
        });

        const partidosSnap = await getDocs(collection(db, "partidos"));

        if (partidosSnap.empty) {
            contenedorJornadas.innerHTML = `<div class="alert alert-info text-center">No hay partidos programados en el calendario todavía.</div>`;
            return;
        }

        let partidos = [];
        partidosSnap.forEach((doc) => {
            partidos.push({ id: doc.id, ...doc.data() });
        });

        // Ordenamos todos los partidos matemáticamente por jornada y fecha
        partidos.sort((a, b) => {
            const jA = parseInt(a.jornada) || 0;
            const jB = parseInt(b.jornada) || 0;
            if (jA !== jB) return jA - jB;
            return new Date(a.fecha) - new Date(b.fecha);
        });

        // Agrupamos por jornada
        const jornadas = {};
        partidos.forEach((partido) => {
            const numJornada = partido.jornada || "0"; 
            if (!jornadas[numJornada]) {
                jornadas[numJornada] = [];
            }
            jornadas[numJornada].push(partido);
        });

        const numerosJornadas = Object.keys(jornadas).map(Number).sort((a, b) => a - b);
        
        // Calcular jornada actual basada en la fecha de hoy
        const hoy = new Date();
        let jornadaActiva = numerosJornadas[0]; // Por defecto la primera
        
        for (let partido of partidos) {
            const fechaPartido = new Date(partido.fecha);
            // Buscamos el primer partido que sea HOY o en el FUTURO
            if (fechaPartido >= hoy) {
                jornadaActiva = parseInt(partido.jornada) || numerosJornadas[0];
                break;
            }
        }

        // Crear el selector HTML
        let opcionesSelect = '';
        numerosJornadas.forEach(num => {
            const selected = (num === jornadaActiva) ? 'selected' : '';
            opcionesSelect += `<option value="${num}" ${selected}>Jornada ${num}</option>`;
        });

        contenedorSelector.innerHTML = `
            <div class="col-md-4 offset-md-4 text-center">
                <label class="fw-bold mb-2 text-success">Selecciona la Jornada</label>
                <select id="selector-jornada" class="form-select border-success shadow-sm text-center fw-bold fs-5">
                    ${opcionesSelect}
                </select>
            </div>
        `;

        // Función para pintar solo la jornada seleccionada
        const pintarJornada = (numJornada) => {
            contenedorJornadas.innerHTML = "";
            let htmlJornada = `
                <div class="card shadow-sm border-0 mb-5">
                    <div class="card-header text-white fw-bold d-flex justify-content-between align-items-center" style="background-color: #225131;">
                        <span>JORNADA ${numJornada}</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush">
            `;

            jornadas[numJornada].forEach((p) => {
                const local = equiposMap[p.localId] || { nombre: p.localNombre || 'Local', escudo: "" };
                const visitante = equiposMap[p.visitanteId] || { nombre: p.visitanteNombre || 'Visitante', escudo: "" };

                const f = new Date(p.fecha);
                const fechaStr = isNaN(f.getTime()) ? (p.fecha || 'Sin fecha') : f.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                const resultadoHTML = p.estado === "Finalizado"
                    ? `<span class="badge bg-dark fs-6 px-3 py-2">${p.golesLocal} - ${p.golesVisitante}</span>`
                    : `<span class="badge bg-light text-dark border px-3 py-2 fw-bold" style="color: #225131 !important;">${fechaStr}</span>`;

                // Aquí están los escudos más separados usando mx-3 y justify-content-between
                const escudoLocal = local.escudo ? `<img src="${local.escudo}" style="width:35px; height:35px; object-fit:contain;" class="mx-3">` : '<div style="width:35px; height:35px;" class="mx-3"></div>';
                const escudoVisitante = visitante.escudo ? `<img src="${visitante.escudo}" style="width:35px; height:35px; object-fit:contain;" class="mx-3">` : '<div style="width:35px; height:35px;" class="mx-3"></div>';

                const nombreCampo = p.campo ? p.campo : 'Por definir';

                htmlJornada += `
                    <div class="list-group-item p-3">
                        <div class="row align-items-center text-center text-md-start">
                            <!-- Local (Escudo separado) -->
                            <div class="col-md-5 d-flex align-items-center justify-content-end mb-2 mb-md-0 text-end">
                                <span class="fw-bold fs-5 ${local.nombre.includes('LISBOA') ? 'text-success' : 'text-dark'}">${local.nombre}</span>
                                ${escudoLocal}
                            </div>
                            
                            <!-- Resultado / Fecha -->
                            <div class="col-md-2 text-center mb-2 mb-md-0">
                                ${resultadoHTML}
                                <div class="small text-muted mt-1">📍 ${nombreCampo}</div>
                            </div>
                            
                            <!-- Visitante (Escudo separado) -->
                            <div class="col-md-5 d-flex align-items-center justify-content-start mb-2 mb-md-0 text-start">
                                ${escudoVisitante}
                                <span class="fw-bold fs-5 ${visitante.nombre.includes('LISBOA') ? 'text-success' : 'text-dark'}">${visitante.nombre}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            htmlJornada += `
                        </div>
                    </div>
                </div>
            `;
            contenedorJornadas.innerHTML = htmlJornada;
        };

        // Pintamos la jornada activa por primera vez
        pintarJornada(jornadaActiva);

        // Escuchamos los cambios en el desplegable
        document.getElementById("selector-jornada").addEventListener("change", (e) => {
            pintarJornada(e.target.value);
        });

    } catch (error) {
        console.error("Error al cargar partidos:", error);
        contenedorJornadas.innerHTML = `<div class="alert alert-danger text-center">Error al recuperar el calendario de partidos.</div>`;
    }
}

cargarTodosLosPartidos();