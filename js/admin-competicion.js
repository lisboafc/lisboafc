import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. GESTIÓN DE EQUIPOS ---
const formEquipo = document.getElementById("form-equipo");
formEquipo.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre-equipo").value;
    const archivoEscudo = document.getElementById("escudo-equipo").files[0];
    const btn = document.getElementById("btn-guardar-equipo");
    const msj = document.getElementById("mensaje-equipo");

    btn.disabled = true;
    btn.innerText = "Guardando...";

    const guardarEnFirebase = async (base64) => {
        try {
            await addDoc(collection(db, "equipos"), {
                nombre: nombre,
                escudo: base64,
                puntos: 0, jugados: 0, ganados: 0, empatados: 0, perdidos: 0, golesFavor: 0, golesContra: 0
            });
            msj.innerHTML = `<div class="alert alert-success mt-2">Equipo registrado.</div>`;
            formEquipo.reset();
            cargarDatosAdmin(); 
        } catch (error) {
            msj.innerHTML = `<div class="alert alert-danger mt-2">Error al guardar.</div>`;
        } finally {
            btn.disabled = false;
            btn.innerText = "Registrar Equipo";
            setTimeout(() => msj.innerHTML = "", 3000);
        }
    };

    if (archivoEscudo) {
        const reader = new FileReader();
        reader.readAsDataURL(archivoEscudo);
        reader.onload = () => guardarEnFirebase(reader.result);
    } else {
        guardarEnFirebase(""); 
    }
});

// --- 2. GESTIÓN DE PARTIDOS ---
const formPartido = document.getElementById("form-partido");
formPartido.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const jornada = parseInt(document.getElementById("jornada-partido").value);
    const fecha = document.getElementById("fecha-partido").value;
    const localId = document.getElementById("local-partido").value;
    const localNombre = document.getElementById("local-partido").options[document.getElementById("local-partido").selectedIndex].text;
    const visitanteId = document.getElementById("visitante-partido").value;
    const visitanteNombre = document.getElementById("visitante-partido").options[document.getElementById("visitante-partido").selectedIndex].text;
    const campo = document.getElementById("campo-partido").value;
    const msj = document.getElementById("mensaje-partido");

    if (localId === visitanteId) {
        msj.innerHTML = `<div class="alert alert-warning mt-2">Un equipo no puede jugar contra sí mismo.</div>`;
        return;
    }

    try {
        await addDoc(collection(db, "partidos"), {
            jornada: jornada, fecha: fecha, localId: localId, localNombre: localNombre,
            visitanteId: visitanteId, visitanteNombre: visitanteNombre, campo: campo,
            estado: "Pendiente", golesLocal: 0, golesVisitante: 0
        });
        msj.innerHTML = `<div class="alert alert-success mt-2">Partido programado.</div>`;
        formPartido.reset();
        cargarDatosAdmin(); 
    } catch (error) {
        msj.innerHTML = `<div class="alert alert-danger mt-2">Error al programar.</div>`;
    }
    setTimeout(() => msj.innerHTML = "", 3000);
});

// --- 3. CARGA GLOBAL Y SELECTOR DE JORNADAS EN ADMIN ---
async function cargarDatosAdmin() {
    try {
        const equiposSnap = await getDocs(collection(db, "equipos"));
        let equipos = [];
        equiposSnap.forEach(d => equipos.push({ id: d.id, ...d.data() }));
        
        equipos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        let opciones = `<option value="">Selecciona un equipo...</option>`;
        equipos.forEach(e => opciones += `<option value="${e.id}">${e.nombre}</option>`);
        document.querySelectorAll(".select-equipos").forEach(s => s.innerHTML = opciones);

        const partidosSnap = await getDocs(collection(db, "partidos"));
        let partidos = [];
        partidosSnap.forEach(d => partidos.push({ id: d.id, ...d.data() }));

        partidos.sort((a, b) => {
            const jA = parseInt(a.jornada) || 0;
            const jB = parseInt(b.jornada) || 0;
            if (jA !== jB) return jA - jB;
            return new Date(a.fecha) - new Date(b.fecha);
        });

        const jornadasMap = {};
        partidos.forEach(p => {
            const j = p.jornada || 1;
            if (!jornadasMap[j]) jornadasMap[j] = [];
            jornadasMap[j].push(p);
        });

        const listaHtml = document.getElementById("lista-partidos-admin");
        
        if (partidos.length === 0) {
            listaHtml.innerHTML = `<div class="text-center text-muted py-4">No hay partidos programados.</div>`;
        } else {
            const numsJornadas = Object.keys(jornadasMap).sort((a, b) => a - b);
            
            let selectorJornadaAdmin = document.getElementById("admin-selector-jornada");
            let jornadaSeleccionada = numsJornadas[0];
            
            if (selectorJornadaAdmin) {
                jornadaSeleccionada = selectorJornadaAdmin.value;
                if (!jornadasMap[jornadaSeleccionada]) jornadaSeleccionada = numsJornadas[0];
            }

            let optionsHtml = '';
            numsJornadas.forEach(j => {
                const sel = (j.toString() === jornadaSeleccionada.toString()) ? 'selected' : '';
                optionsHtml += `<option value="${j}" ${sel}>Jornada ${j}</option>`;
            });

            listaHtml.innerHTML = `
                <div class="mb-4 text-center">
                    <label class="fw-bold small text-success mb-1">Filtrar Gestor por Jornada:</label>
                    <select id="admin-selector-jornada" class="form-select form-select-sm text-center fw-bold mx-auto" style="max-width: 200px;">
                        ${optionsHtml}
                    </select>
                </div>
                <div id="admin-partidos-contenedor"></div>
            `;

            const pintarPartidosAdmin = (jNum) => {
                const contenedorPartidos = document.getElementById("admin-partidos-contenedor");
                contenedorPartidos.innerHTML = "";
                
                if (!jornadasMap[jNum]) return;

                jornadasMap[jNum].forEach(p => {
                    const badge = p.estado === "Finalizado" ? `<span class="badge bg-success ms-2">Finalizado</span>` : `<span class="badge bg-warning text-dark ms-2">Pendiente</span>`;
                    
                    // Botones compactos y centrados
                    let botonesHTML = '';
                    if (p.estado === "Finalizado") {
                        botonesHTML = `
                            <button class="btn btn-sm btn-outline-secondary btn-desfinalizar-res px-3 me-2" data-id="${p.id}">Modificar</button>
                            <button class="btn btn-sm btn-outline-danger btn-borrar-partido px-3" data-id="${p.id}" title="Borrar partido">🗑️</button>
                        `;
                    } else {
                        botonesHTML = `
                            <button class="btn btn-sm btn-dark btn-guardar-res px-4 me-2" data-id="${p.id}">Guardar</button>
                            <button class="btn btn-sm btn-outline-danger btn-borrar-partido px-3" data-id="${p.id}" title="Borrar partido">🗑️</button>
                        `;
                    }

                    // Estructura con más márgenes (px-2 y mb-4) para evitar apelotonamientos en móvil
                    contenedorPartidos.innerHTML += `
                        <div class="card bg-light mb-4 border-0 shadow-sm">
                            <div class="card-body p-3">
                                <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                    <div class="fw-bold text-muted small">Jornada ${p.jornada} ${badge}</div>
                                    <div class="small text-muted text-end">${p.campo || ''}</div>
                                </div>
                                
                                <div class="row align-items-center mb-4 px-2">
                                    <div class="col-4 text-end fw-bold fs-6 pe-3 text-break" title="${p.localNombre}">${p.localNombre}</div>
                                    <div class="col-4 d-flex justify-content-center align-items-center">
                                        <input type="number" id="gL-${p.id}" class="form-control text-center border-success fw-bold p-1" style="width:50px; max-width:100%;" value="${p.golesLocal}" min="0">
                                        <span class="fw-bold mx-2">-</span>
                                        <input type="number" id="gV-${p.id}" class="form-control text-center border-primary fw-bold p-1" style="width:50px; max-width:100%;" value="${p.golesVisitante}" min="0">
                                    </div>
                                    <div class="col-4 text-start fw-bold fs-6 ps-3 text-break" title="${p.visitanteNombre}">${p.visitanteNombre}</div>
                                </div>
                                
                                <div class="text-center">
                                    ${botonesHTML}
                                </div>
                            </div>
                        </div>
                    `;
                });
            };

            pintarPartidosAdmin(jornadaSeleccionada);

            document.getElementById("admin-selector-jornada").addEventListener("change", (e) => {
                pintarPartidosAdmin(e.target.value);
            });
        }

        // Pintar Clasificación
        equipos.sort((a, b) => b.puntos - a.puntos || (b.golesFavor - b.golesContra) - (a.golesFavor - a.golesContra));
        const tablaHtml = document.getElementById("tabla-clasificacion-admin");
        tablaHtml.innerHTML = "";
        equipos.forEach((eq, index) => {
            const escudo = eq.escudo ? `<img src="${eq.escudo}" width="20" height="20" class="me-2 object-fit-contain">` : '';
            tablaHtml.innerHTML += `
                <tr>
                    <td class="fw-bold">${index + 1}</td>
                    <td class="text-start fw-bold ${eq.nombre.includes('LISBOA') ? 'text-success' : ''}">${escudo}${eq.nombre}</td>
                    <td>${eq.jugados}</td>
                    <td class="fw-bold text-dark">${eq.puntos}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error global:", error);
    }
}

// --- 4. ACCIONES DE RESULTADOS Y BORRADO ---
document.getElementById("lista-partidos-admin").addEventListener("click", async (e) => {
    // Guardar / Actualizar Resultado
    if (e.target.classList.contains("btn-guardar-res")) {
        const id = e.target.dataset.id;
        const btn = e.target;
        const gL = parseInt(document.getElementById(`gL-${id}`).value) || 0;
        const gV = parseInt(document.getElementById(`gV-${id}`).value) || 0;
        
        btn.innerText = "...";
        btn.disabled = true;

        try {
            await updateDoc(doc(db, "partidos", id), {
                golesLocal: gL, golesVisitante: gV, estado: "Finalizado"
            });
            await recalcularClasificacion();
            await cargarDatosAdmin();
        } catch (error) {
            console.error("Error guardando resultado", error);
            btn.innerText = "Error";
        }
    }

    // Desfinalizar Partido (Ahora el botón se llama solo "Modificar")
    if (e.target.classList.contains("btn-desfinalizar-res")) {
        const id = e.target.dataset.id;
        if (confirm("¿Seguro que quieres modificar este partido? Volverá a estar pendiente y tendrás que introducir los goles correctos.")) {
            try {
                await updateDoc(doc(db, "partidos", id), {
                    golesLocal: 0, golesVisitante: 0, estado: "Pendiente"
                });
                await recalcularClasificacion();
                await cargarDatosAdmin();
            } catch (error) {
                console.error("Error al desfinalizar", error);
            }
        }
    }

    // Borrar Partido
    if (e.target.classList.contains("btn-borrar-partido")) {
        const id = e.target.dataset.id;
        if (confirm("¿Estás seguro de que quieres eliminar este partido de la base de datos?")) {
            try {
                await deleteDoc(doc(db, "partidos", id));
                await recalcularClasificacion();
                await cargarDatosAdmin();
            } catch (error) {
                console.error("Error al borrar partido", error);
            }
        }
    }
});

// --- 5. MOTOR DE RECALCULO DE CLASIFICACIÓN ---
async function recalcularClasificacion() {
    const equiposSnap = await getDocs(collection(db, "equipos"));
    const partidosSnap = await getDocs(collection(db, "partidos"));
    
    let stats = {};
    equiposSnap.forEach(d => {
        stats[d.id] = { puntos: 0, jugados: 0, ganados: 0, empatados: 0, perdidos: 0, golesFavor: 0, golesContra: 0 };
    });

    partidosSnap.forEach(d => {
        const p = d.data();
        if (p.estado === "Finalizado" && stats[p.localId] && stats[p.visitanteId]) {
            stats[p.localId].jugados += 1;
            stats[p.visitanteId].jugados += 1;
            stats[p.localId].golesFavor += p.golesLocal;
            stats[p.localId].golesContra += p.golesVisitante;
            stats[p.visitanteId].golesFavor += p.golesVisitante;
            stats[p.visitanteId].golesContra += p.golesLocal;

            if (p.golesLocal > p.golesVisitante) {
                stats[p.localId].puntos += 3;
                stats[p.localId].ganados += 1;
                stats[p.visitanteId].perdidos += 1;
            } else if (p.golesLocal < p.golesVisitante) {
                stats[p.visitanteId].puntos += 3;
                stats[p.visitanteId].ganados += 1;
                stats[p.localId].perdidos += 1;
            } else {
                stats[p.localId].puntos += 1;
                stats[p.visitanteId].puntos += 1;
                stats[p.localId].empatados += 1;
                stats[p.visitanteId].empatados += 1;
            }
        }
    });

    const batch = writeBatch(db);
    Object.keys(stats).forEach(id => {
        batch.update(doc(db, "equipos", id), stats[id]);
    });
    await batch.commit();
}

// Arrancar al cargar
cargarDatosAdmin();