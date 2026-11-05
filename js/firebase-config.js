// Importar las funciones de Firebase a través de módulos (ES modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase (¡SUSTITUYE ESTOS VALORES POR LOS TUYOS!)
const firebaseConfig = {
  apiKey: "AIzaSyB71xIe3MSHGoqt1fasNP0nRI3Y3wZJ6Vo",
  authDomain: "lisboafc-web.firebaseapp.com",
  projectId: "lisboafc-web",
  storageBucket: "lisboafc-web.firebasestorage.app",
  messagingSenderId: "661948045035",
  appId: "1:661948045035:web:dda8bee1e58cf5d65990ae"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar la base de datos Firestore
export const db = getFirestore(app);

console.log("🔥 Firebase conectado correctamente al Lisboa F.C.");