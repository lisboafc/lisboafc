import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const contenedorNoticias = document.getElementById("contenedor-noticias");

async function cargarNoticiasInicio() {
    if (!contenedorNoticias) return;

    try {
        // Hacemos una consulta más directa para asegurar que carga sin problemas
        const q = query(collection(db, "noticias"), orderBy("fecha", "desc"), limit(3));
        const querySnapshot = await getDocs(q);

        // Limpiamos el contenedor pase lo que pase
        contenedorNoticias.innerHTML = ""; 

        if (querySnapshot.empty) {
            contenedorNoticias.innerHTML = `<div class="col-12 text-center text-muted"><p>No hay noticias publicadas aún.</p></div>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const noticia = doc.data();
            
            const tarjetaHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        ${noticia.imagen ? `<img src="${noticia.imagen}" class="card-img-top" alt="${noticia.titulo}" style="height: 200px; object-fit: cover;">` : ''}
                        <div class="card-body">
                            <span class="badge mb-2" style="background-color: #CFA538; color: #000000;">${noticia.categoria}</span>
                            <h5 class="card-title fw-bold" style="color: #225131;">${noticia.titulo}</h5>
                            <p class="card-text text-dark">${noticia.contenido.substring(0, 100)}...</p>
                        </div>
                        <div class="card-footer bg-white border-top-0">
                            <a href="noticias.php" class="btn btn-sm text-white" style="background-color: #225131;">Leer más</a>
                        </div>
                    </div>
                </div>
            `;
            contenedorNoticias.innerHTML += tarjetaHTML;
        });

    } catch (error) {
        // Si sigue fallando, forzamos que se quite el cargando.
        contenedorNoticias.innerHTML = `<div class="col-12 text-center text-danger"><p>No se han podido cargar las noticias en este momento.</p></div>`;
    }
}

// Ejecutamos la función de carga
cargarNoticiasInicio();