const firebaseConfig = {
  apiKey: "AIzaSyDsvLX2buPr_wMK87-2AOI2ntZr7ojE_EU",
  authDomain: "proyecto-pwa-b5684.firebaseapp.com",
  projectId: "proyecto-pwa-b5684",
  storageBucket: "proyecto-pwa-b5684.firebasestorage.app",
  messagingSenderId: "747976685706",
  appId: "1:747976685706:web:91593d90f29f748a401573",
  measurementId: "G-9NT5SVD42M"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Acceso a Firestore
const db = firebase.firestore();

const productos = [
  { id: 1, nombre: "Cargador Rápido USB-C", precio: 40000, imagen: "Img/Imagen1.png" },
  { id: 2, nombre: "Cable Tipo C Reforzado", precio: 25000, imagen: "Img/charger.png" },
  { id: 3, nombre: "Audífonos Bluetooth", precio: 80000, imagen: "Img/earphone.png" },
  { id: 4, nombre: "Protector de Pantalla", precio: 15000, imagen: "Img/user-interface.png" },
  { id: 5, nombre: "Soporte Magnético para Auto", precio: 30000, imagen: "Img/smartphone.png" },
  { id: 6, nombre: "Funda Antigolpes", precio: 35000, imagen: "Img/tempered-glass.png" }
];

const productosDiv    = document.getElementById("productos");
const listaCarrito    = document.getElementById("lista-carrito");
const listaPedidos    = document.getElementById("lista-pedidos");
const totalP          = document.getElementById("total");
const btnComprar      = document.getElementById("btn-comprar");

let carrito = [];
let pedidos = []; // Firestore será la fuente principal

function mostrarProductos() {
  productos.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()}</p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    productosDiv.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.precio;

    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio.toLocaleString()}`;

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => eliminarDelCarrito(index);

    li.appendChild(btn);
    listaCarrito.appendChild(li);
  });

  totalP.textContent = `Total: $${total.toLocaleString()}`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Guardar en Firestore
async function guardarPedidoEnFirestore(pedido) {
  try {
    await db.collection("pedidos").add({
      ...pedido,
      creadoEn: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Pedido guardado en Firestore");
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    alert("Error guardando pedido en Firestore.");
  }
}

// Cargar pedidos desde Firestore
async function cargarPedidosDesdeFirestore() {
  try {
    const snapshot = await db
      .collection("pedidos")
      .orderBy("creadoEn", "desc")
      .get();

    pedidos = snapshot.docs.map(doc => doc.data());

    // Para offline: sincronizamos localStorage
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    mostrarPedidos();
  } catch (error) {
    console.warn("Fallo Firestore, usando localStorage...");
    pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    mostrarPedidos();
  }
}

btnComprar.addEventListener("click", async () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const nuevoPedido = {
    id: Date.now(),
    productos: carrito.map(p => p.nombre),
    total: carrito.reduce((sum, p) => sum + p.precio, 0),
    fecha: new Date().toLocaleString()
  };

  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  await guardarPedidoEnFirestore(nuevoPedido);

  carrito = [];
  actualizarCarrito();
  mostrarPedidos();

  alert("✅ ¡Pedido registrado exitosamente!");
});

function mostrarPedidos() {
  listaPedidos.innerHTML = "";

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = "<li>No hay pedidos aún</li>";
    return;
  }

  pedidos.forEach(pedido => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Pedido #${pedido.id}</strong> (${pedido.fecha})<br>
      ${pedido.productos.join(", ")}<br>
      <em>Total: $${pedido.total.toLocaleString()}</em>
    `;
    listaPedidos.appendChild(li);
  });
}

const videoCamara     = document.getElementById("video-camara");
const canvasFoto      = document.getElementById("foto-camara");
const contenedorFoto  = document.getElementById("contenedor-foto");

const btnIniciarCamara = document.getElementById("btn-iniciar-camara");
const btnTomarFoto     = document.getElementById("btn-tomar-foto");
const btnDetenerCamara = document.getElementById("btn-detener-camara");

let streamCamara = null;

function soportaCamara() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

async function iniciarCamara() {
  if (!soportaCamara()) {
    alert("Este dispositivo no soporta cámara.");
    return;
  }

  try {
    streamCamara = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    videoCamara.srcObject = streamCamara;
  } catch (err) {
    console.error("Error cámara:", err);
    alert("No se pudo acceder a la cámara.");
  }
}

function tomarFoto() {
  if (!streamCamara) {
    alert("Enciende la cámara primero.");
    return;
  }

  canvasFoto.width  = videoCamara.videoWidth;
  canvasFoto.height = videoCamara.videoHeight;

  const ctx = canvasFoto.getContext("2d");
  ctx.drawImage(videoCamara, 0, 0, canvasFoto.width, canvasFoto.height);

  const dataUrl = canvasFoto.toDataURL("image/png");

  contenedorFoto.innerHTML = "";
  const img = document.createElement("img");
  img.src = dataUrl;
  contenedorFoto.appendChild(img);
}

function detenerCamara() {
  if (streamCamara) {
    streamCamara.getTracks().forEach(t => t.stop());
  }
  videoCamara.srcObject = null;
  streamCamara = null;
}

btnIniciarCamara.addEventListener("click", iniciarCamara);
btnTomarFoto.addEventListener("click", tomarFoto);
btnDetenerCamara.addEventListener("click", detenerCamara);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(reg => console.log("SW OK:", reg.scope))
    .catch(err => console.error("SW ERROR:", err));
}

async function init() {
  mostrarProductos();
  await cargarPedidosDesdeFirestore();
}

init();