import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const contenedorNoticias = document.getElementById("contenedor-noticias-completo");
let noticiasGlobales = []; // Guardamos las noticias para leerlas completas luego

async function cargarTodasLasNoticias() {
    if (!contenedorNoticias) return;

    try {
        const q = query(collection(db, "noticias"), orderBy("fecha", "desc"));
        const querySnapshot = await getDocs(q);

        contenedorNoticias.innerHTML = ""; 

        if (querySnapshot.empty) {
            contenedorNoticias.innerHTML = `<div class="col-12 text-center text-muted"><p>No hay noticias publicadas aún.</p></div>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const noticia = { id: doc.id, ...doc.data() };
            noticiasGlobales.push(noticia);
            
            // Formatear fecha si existe
            let fechaStr = "Reciente";
            if (noticia.fecha && noticia.fecha.toDate) {
                fechaStr = noticia.fecha.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            }
            
            const tarjetaHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0 bg-light">
                        ${noticia.imagen ? `<img src="${noticia.imagen}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge" style="background-color: #CFA538; color: #000000;">${noticia.categoria}</span>
                                <small class="text-muted" style="font-size: 0.75rem;">${fechaStr}</small>
                            </div>
                            <h5 class="card-title fw-bold" style="color: #225131;">${noticia.titulo}</h5>
                            <p class="card-text text-dark flex-grow-1">${noticia.contenido.substring(0, 100)}...</p>
                        </div>
                        <div class="card-footer bg-white border-top-0 pb-3">
                            <button class="btn btn-sm text-white w-100 fw-bold btn-leer-mas" data-id="${noticia.id}" style="background-color: #225131;" data-bs-toggle="modal" data-bs-target="#modalNoticia">Leer noticia completa</button>
                        </div>
                    </div>
                </div>
            `;
            contenedorNoticias.innerHTML += tarjetaHTML;
        });

    } catch (error) {
        console.error("Error al cargar todas las noticias:", error);
        contenedorNoticias.innerHTML = `<div class="col-12 text-center text-danger"><p>Error al cargar las noticias.</p></div>`;
    }
}

// Escuchar los clics en "Leer noticia completa"
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-leer-mas")) {
        const id = e.target.dataset.id;
        const noticia = noticiasGlobales.find(n => n.id === id);
        
        if (noticia) {
            document.getElementById("modal-titulo").innerText = noticia.titulo;
            document.getElementById("modal-categoria").innerText = noticia.categoria;
            document.getElementById("modal-contenido").innerText = noticia.contenido;
            
            if (noticia.fecha && noticia.fecha.toDate) {
                document.getElementById("modal-fecha").innerText = noticia.fecha.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
            } else {
                document.getElementById("modal-fecha").innerText = "";
            }

            const imgEl = document.getElementById("modal-imagen");
            if (noticia.imagen) {
                imgEl.src = noticia.imagen;
                imgEl.style.display = "block";
            } else {
                imgEl.style.display = "none";
                imgEl.src = "";
            }
        }
    }
});

cargarTodasLasNoticias();