import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tablaClasificacion = document.getElementById("tabla-clasificacion-publica");

async function cargarClasificacion() {
    if (!tablaClasificacion) return;

    try {
        const equiposSnap = await getDocs(collection(db, "equipos"));
        
        if (equiposSnap.empty) {
            tablaClasificacion.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">No hay equipos registrados todavía.</td></tr>`;
            return;
        }

        let equipos = [];
        equiposSnap.forEach(doc => {
            equipos.push({ id: doc.id, ...doc.data() });
        });

        // Ordenación de liga: Puntos > Diferencia Goles > Goles a Favor > Orden alfabético
        equipos.sort((a, b) => {
            const difA = (a.golesFavor || 0) - (a.golesContra || 0);
            const difB = (b.golesFavor || 0) - (b.golesContra || 0);
            
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            if (difB !== difA) return difB - difA; 
            if (b.golesFavor !== a.golesFavor) return b.golesFavor - a.golesFavor;
            return a.nombre.localeCompare(b.nombre);
        });

        tablaClasificacion.innerHTML = "";

        equipos.forEach((eq, index) => {
            const pos = index + 1;
            const difGoles = (eq.golesFavor || 0) - (eq.golesContra || 0);
            
            // Lógica visual
            const isLider = pos === 1;
            const isLisboa = eq.nombre.toUpperCase().includes('LISBOA');
            
            let filaClass = "";
            if (isLider) filaClass = 'table-light border-bottom border-success border-2';
            
            let nombreStyle = isLisboa ? 'color: #225131; font-weight: 900; font-size: 1.1rem;' : 'font-weight: bold; color: #333;';
            
            const escudo = eq.escudo ? `<img src="${eq.escudo}" style="width:35px; height:35px; object-fit:contain;" class="me-3">` : `<div style="width:35px; height:35px; display:inline-block;" class="me-3"></div>`;
            
            // Colores para la diferencia de goles
            const colorDG = difGoles > 0 ? 'text-success' : (difGoles < 0 ? 'text-danger' : 'text-muted');
            const signoDG = difGoles > 0 ? '+' : '';

            tablaClasificacion.innerHTML += `
                <tr class="${filaClass}">
                    <td class="fw-bold fs-5 ${isLider ? 'text-success' : 'text-muted'}">${pos}</td>
                    <td class="text-start d-flex align-items-center py-3">
                        ${escudo}
                        <span style="${nombreStyle}">${eq.nombre}</span>
                    </td>
                    <td class="fw-bold text-secondary">${eq.jugados || 0}</td>
                    <td>${eq.ganados || 0}</td>
                    <td>${eq.empatados || 0}</td>
                    <td>${eq.perdidos || 0}</td>
                    <td class="d-none d-md-table-cell text-muted">${eq.golesFavor || 0}</td>
                    <td class="d-none d-md-table-cell text-muted">${eq.golesContra || 0}</td>
                    <td class="fw-bold ${colorDG}">${signoDG}${difGoles}</td>
                    <td class="fw-bold fs-4" style="color: #000000; background-color: rgba(207, 165, 56, 0.1); border-left: 2px solid #CFA538;">${eq.puntos || 0}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al cargar la clasificación:", error);
        tablaClasificacion.innerHTML = `<tr><td colspan="10" class="text-center text-danger py-4">Error al recuperar los datos de clasificación.</td></tr>`;
    }
}

cargarClasificacion();