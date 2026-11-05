import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const contenedor = document.getElementById("contenedor-partidos-index");

async function cargarPartidosIndex() {
    if (!contenedor) return;

    try {
        // 1. Obtener todos los equipos para asociar los escudos por ID
        const equiposSnap = await getDocs(collection(db, "equipos"));
        const equiposMap = {};
        equiposSnap.forEach(doc => {
            equiposMap[doc.id] = doc.data();
        });

        // 2. Traer los 3 próximos partidos ordenados por fecha
        const q = query(collection(db, "partidos"), orderBy("fecha", "asc"), limit(3));
        const querySnapshot = await getDocs(q);

        contenedor.innerHTML = "";

        if (querySnapshot.empty) {
            contenedor.innerHTML = `<div class="col-12 text-center text-muted"><p>No hay partidos programados.</p></div>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const p = doc.data();
            const local = equiposMap[p.localId] || { nombre: p.localNombre, escudo: "" };
            const visitante = equiposMap[p.visitanteId] || { nombre: p.visitanteNombre, escudo: "" };

            // Formato de fecha legible
            const f = new Date(p.fecha);
            const fechaStr = isNaN(f) ? p.fecha : f.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

            // Mostrar resultado o VS
            const centroHTML = p.estado === "Finalizado"
                ? `<span class="badge bg-dark fs-6 px-3 py-2">${p.golesLocal} - ${p.golesVisitante}</span>`
                : `<span class="fw-bold fs-6" style="color: #CFA538;">VS</span>`;

            const escudoLocal = local.escudo ? `<img src="${local.escudo}" alt="${local.nombre}" style="width:32px; height:32px; object-fit:contain;" class="me-2">` : '';
            const escudoVisitante = visitante.escudo ? `<img src="${visitante.escudo}" alt="${visitante.nombre}" style="width:32px; height:32px; object-fit:contain;" class="ms-2">` : '';

            const cardHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm border-0 bg-light h-100">
                        <div class="card-body text-center d-flex flex-column justify-content-center">
                            <p class="text-muted small fw-bold mb-2">Jornada ${p.jornada} • ${fechaStr}h</p>
                            <div class="d-flex justify-content-center align-items-center mb-3">
                                <div class="d-flex align-items-center justify-content-end text-end" style="flex: 1;">
                                    <span class="fw-bold small ${local.nombre.includes('LISBOA') ? 'text-success' : 'text-dark'}">${local.nombre}</span>
                                    ${escudoLocal}
                                </div>
                                <div class="px-2">${centroHTML}</div>
                                <div class="d-flex align-items-center justify-content-start text-start" style="flex: 1;">
                                    ${escudoVisitante}
                                    <span class="fw-bold small ${visitante.nombre.includes('LISBOA') ? 'text-success' : 'text-dark'}">${visitante.nombre}</span>
                                </div>
                            </div>
                            <p class="mb-0 small text-muted">📍 ${p.campo || 'Por definir'}</p>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Error al cargar partidos en index:", error);
        contenedor.innerHTML = `<div class="col-12 text-center text-muted"><p>No se pudieron cargar los partidos.</p></div>`;
    }
}

cargarPartidosIndex();