import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const formNoticia = document.getElementById("form-noticia");
const mensajeDiv = document.getElementById("mensaje");

formNoticia.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const contenido = document.getElementById("contenido").value;
    const archivoImagen = document.getElementById("imagen").files[0];

    if (!archivoImagen) return;

    // Convertir imagen a Base64
    const reader = new FileReader();
    reader.readAsDataURL(archivoImagen);

    reader.onload = async () => {
        const imagenBase64 = reader.result;

        try {
            document.getElementById("btn-guardar").disabled = true;
            document.getElementById("btn-guardar").innerText = "Guardando...";

            // Guardar en la colección 'noticias' de Firestore
            await addDoc(collection(db, "noticias"), {
                titulo: titulo,
                categoria: categoria,
                contenido: contenido,
                imagen: imagenBase64,
                fecha: serverTimestamp()
            });

            mensajeDiv.innerHTML = `<div class="alert alert-success">¡Noticia publicada con éxito!</div>`;
            formNoticia.reset();
        } catch (error) {
            console.error("Error al guardar noticia:", error);
            mensajeDiv.innerHTML = `<div class="alert alert-danger">Error al publicar la noticia.</div>`;
        } finally {
            document.getElementById("btn-guardar").disabled = false;
            document.getElementById("btn-guardar").innerText = "Publicar Noticia";
        }
    };
});