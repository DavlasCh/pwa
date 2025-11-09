const productos = [
  { id: 1, nombre: "Cargador Rápido USB-C", precio: 40000, imagen: "https://cdn-icons-png.flaticon.com/512/1053/1053184.png" },
  { id: 2, nombre: "Cable Tipo C Reforzado", precio: 25000, imagen: "https://cdn-icons-png.flaticon.com/512/1040/1040227.png" },
  { id: 3, nombre: "Audífonos Bluetooth", precio: 80000, imagen: "https://cdn-icons-png.flaticon.com/512/1046/1046433.png" },
  { id: 4, nombre: "Protector de Pantalla", precio: 15000, imagen: "https://cdn-icons-png.flaticon.com/512/1164/1164954.png" },
  { id: 5, nombre: "Soporte Magnético para Auto", precio: 30000, imagen: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png" },
  { id: 6, nombre: "Funda Antigolpes", precio: 35000, imagen: "https://cdn-icons-png.flaticon.com/512/2740/2740598.png" }
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