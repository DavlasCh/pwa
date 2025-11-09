const productos = [
  { id: 1, nombre: "Cargador Rápido USB-C", precio: 40000, imagen: "Img/Imagen1.png" },
  { id: 2, nombre: "Cable Tipo C Reforzado", precio: 25000, imagen: "Img/charger.png" },
  { id: 3, nombre: "Audífonos Bluetooth", precio: 80000, imagen: "Img/earphone.png" },
  { id: 4, nombre: "Protector de Pantalla", precio: 15000, imagen: "Img/user-interface.png" },
  { id: 5, nombre: "Soporte Magnético para Auto", precio: 30000, imagen: "Img/smartphone.png" },
  { id: 6, nombre: "Funda Antigolpes", precio: 35000, imagen: "Img/tempered-glass.png" }
];

const productosDiv = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const listaPedidos = document.getElementById("lista-pedidos");
const totalP = document.getElementById("total");
const btnComprar = document.getElementById("btn-comprar");

let carrito = [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

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
btnComprar.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
  } else {
    const nuevoPedido = {
      id: Date.now(),
      productos: carrito.map(p => p.nombre),
      total: carrito.reduce((sum, p) => sum + p.precio, 0),
      fecha: new Date().toLocaleString()
    };
    pedidos.push(nuevoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    carrito = [];
    actualizarCarrito();
    mostrarPedidos();
    alert("✅ ¡Pedido registrado con éxito!");
  }
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
mostrarProductos();
mostrarPedidos();