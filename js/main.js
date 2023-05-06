// QuerySelectors //


// Boton del Inicio (Resetea los filtros recargando la página)
const resetFiltersBtn = document.querySelector("#resetFiltersBtn");
resetFiltersBtn.addEventListener("click", () => location.reload());

// Botones de la nav para filtrar por categoría
const procesadoresBtn = document.querySelector("#procesadoresBtn");
const graficasBtn = document.querySelector("#graficasBtn");
const ramsBtn = document.querySelector("#ramsBtn");

// Boton del Carrito
const cartBtn = document.querySelector("#cartBtn");

// Span de los items en carrito
const itemsEnCarritoSpan = document.querySelector("#itemsEnCarrito")

// Contenedor de los Productos
const container = document.querySelector("#productos");

// Contenedor del Filtro
const filterContainer = document.querySelector("#contenedor-filtros");

// Contenedor de las Opciones de Filtrado
const filterOptionsContainer = document.querySelector("#contenedor-opciones");

// Span del filtro seleccionado
const selectedFilterSpan = document.querySelector("#selectedFilterSpan");

// Cuerpo del Carrito
const cartBody = document.querySelector("#cart-body");

// Boton de Vaciar el Carrito
const clearCartBtn = document.querySelector("#clearCartBtn");

// Span Precio Total
const spanPrecioTotal = document.querySelector("#spanPrecioTotal");


// QuerySelectors //


// Mostrar los servicios
function renderServices(servicesArray) {
    container.innerHTML = "" ;
    let html
    for (const element of servicesArray) {
        const {nombre, precio, imagen, prodId} = element;

        html = `
        <div class="card border-light mb-3" style="max-width: 20rem; max-height: 30rem">
                <img src="${imagen}" class="card-img-top" alt="${nombre}">
                <div class="card-body">
                    <p id="product-name">${nombre}</p>
                    <p id="product-price">$${precio}</p>
                    <button class="btn btn-light cart-add-btn" id="${prodId}"><i class="fa-solid fa-cart-plus"></i></button>
                </div>
            </div>
        `

        container.innerHTML += html;
    }

    obtenerAddButtons();
}

// Traer datos
fetch("./data/data.json")
.then((response) => response.json())
.then((data) => {
    guardarEnArray(data);
})

let arrayProductos = [];

function guardarEnArray(arr) {
    for (const elemento of arr) {
        const {nombre, precio, tipo, fabricante, imagen, prodId} = elemento;

        arrayProductos.push(elemento);
    }
}

// Filtrar con los botones de la nav
let resultados = [];
let subResults = [];

// Opciones de filtro para los resultados
let opcion1 = "",
opcion2 = "";

function filtrarProductos(filtro) {
    resultados = arrayProductos.filter(elementos => elementos.tipo === filtro);
    renderServices(resultados);

    // Definir opciones de filtro

    switch (filtro) {
        case "cpu": {
            opcion1 = "Intel";
            opcion2 = "AMD"
            selectedFilterSpan.innerHTML = "(Procesadores)"
            break;
        }

        case "gpu": {
            opcion1 = "Nvidia";
            opcion2 = "AMD"
            selectedFilterSpan.innerHTML = "(Tarjetas Gráficas)"
            break;
        }

        case "ram": {
            opcion1 = "Kingston";
            opcion2 = "Patriot"
            selectedFilterSpan.innerHTML = "(Memorias RAM)"
            break;
        }
    }

    // Mostrar contenedor de las opciones de filtro
    filterContainer.style.display = "flex";

    // Mostrar resultados filtrados
    let html = `
    <div class="d-flex">
        <input type="radio" id="inputOpcion1" name="opcion">
        <label for="inputOpcion1">${opcion1}</label>
    </div>
    <div class="d-flex">
        <input type="radio" id="inputAll" name="opcion">
        <label for="all">Todos</label>
    </div>
    <div class="d-flex">
        <input type="radio" id="inputOpcion2" name="opcion">
        <label for="inputOpcion2">${opcion2}</label>
    </div>
    `
 
    filterOptionsContainer.innerHTML = html;
    activarOpcionesFiltrado();
}

// Funcionalidad de los filtros adicionales
function activarOpcionesFiltrado() {
    const inputOpcion1 = document.querySelector("#inputOpcion1");
    const inputOpcion2 = document.querySelector("#inputOpcion2");
    const inputAll = document.querySelector("#inputAll");

    inputOpcion1.addEventListener('click', () => {
        subResults = resultados.filter(elementos => elementos.fabricante === opcion1.toLowerCase());
        renderServices(subResults);
    });

    inputOpcion2.addEventListener('click', () => {
        subResults = resultados.filter(elementos => elementos.fabricante === opcion2.toLowerCase());
        renderServices(subResults);
    });

    inputAll.addEventListener('click', () => {
        renderServices(resultados);
    });
}

procesadoresBtn.addEventListener("click", () => {
    filtrarProductos("cpu");
    procesadoresBtn.classList.add("active");
    graficasBtn.classList.remove("active");
    ramsBtn.classList.remove("active");
})

graficasBtn.addEventListener("click", () => {
    filtrarProductos("gpu");
    procesadoresBtn.classList.remove("active");
    graficasBtn.classList.add("active");
    ramsBtn.classList.remove("active");

});
ramsBtn.addEventListener("click", () => {
    filtrarProductos("ram")
    procesadoresBtn.classList.remove("active");
    graficasBtn.classList.remove("active");
    ramsBtn.classList.add("active");
});


// Funcionalidades del Carrito

let carrito = [];
let precioTotal = 0;

// Obtener botones para agregar productos
let addToCartBtns;

function obtenerAddButtons() {
    addToCartBtns = document.querySelectorAll(".cart-add-btn");

    addToCartBtns.forEach(boton => {
        boton.addEventListener("click", () => agregarAlCarrito(boton.id))
    });
}

// Obtener botones para eliminar productos
let removeBtns;
function obtenerRemoveBtns() {
    removeBtns = document.querySelectorAll(".eraseBtn");

    removeBtns.forEach(boton => {
        boton.addEventListener("click", eliminarProducto)
    })
}

// Mostrar en carrito
function mostrarEnCarrito(elemento) {
    let html
        html = `
            <div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${elemento.imagen}" class="img-fluid rounded-start" alt="${elemento.nombre}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${elemento.nombre}</h5>
                        <p class="card-text"><small class="text-body">$${elemento.precio}</small></p>
                        <p class="cantidad">Cantidad: <span id="${elemento.prodId}Cantidad">${elemento.cantidad}</span></p>
                        <p></p>
                        <span class="subTotalSpan" id="${elemento.prodId}subTotal">Subtotal: $${elemento.precio * elemento.cantidad}</span>
                        <button id="${elemento.prodId}" class="cartBtn eraseBtn"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        </div>
        `

    cartBody.innerHTML += html;
    obtenerRemoveBtns();
}

// Obtener carrito del localStorage (si hay)
if (JSON.parse(localStorage.getItem("storedCart"))) {
    carrito = JSON.parse(localStorage.getItem("storedCart"))
    
    carrito.forEach(elemento => {
        mostrarEnCarrito(elemento)
    })

    actualizarSpansCarrito();
}

// Actualizar los spans de la cantidad de productos y del precio total
function actualizarSpansCarrito() {
    let cantidadProductos = carrito.reduce((acc, elementos) => acc + elementos.cantidad, 0)
    itemsEnCarritoSpan.innerHTML = cantidadProductos;

    if (cantidadProductos == 0) {
        itemsEnCarritoSpan.innerHTML = ""
    }

    precioTotal = carrito.reduce((acc, elementos) => acc + (elementos.cantidad * elementos.precio) , 0)
    spanPrecioTotal.innerHTML = precioTotal;
}

// Eliminar un producto del carrito

let eliminado;
function eliminarProducto(e) {
    const idBoton = e.currentTarget.id;
    eliminado = carrito.findIndex(elemento => elemento.prodId == idBoton);

    carrito.splice(eliminado, 1);
    
    cartBody.innerHTML = "";
    carrito.forEach(elemento => {
        mostrarEnCarrito(elemento);
    })

    actualizarSpansCarrito();
    Toastify({
        text: "Se eliminó el producto del carrito",
        duration: 2500,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(to right, #d34f1b, #bd7728)",
        },
      }).showToast();
}

// Agregar un producto al carrito
function agregarAlCarrito (item) {
    let agregado = arrayProductos.find(productos => productos.prodId == item);

    if(carrito.some(elementos => elementos.prodId == item)) {
        const index = carrito.findIndex(elementos => elementos.prodId == item);
        carrito[index].cantidad++

        const spanCantidad = document.getElementById(`${agregado.prodId}Cantidad`);
        spanCantidad.innerHTML++;

        const subtotalSpan = document.getElementById(`${agregado.prodId}subTotal`);
        subtotalSpan.innerHTML = "Subtotal: $" + (agregado.precio * agregado.cantidad);

    } else {
        agregado.cantidad = 1;
        carrito.push(agregado);

        mostrarEnCarrito(agregado);
    }
    
    localStorage.setItem("storedCart", JSON.stringify(carrito));

    actualizarSpansCarrito();

    Toastify({
        text: "Se agregó al carrito",
        duration: 2500,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
}

// Vaciar el carrito
clearCartBtn.addEventListener("click", () => {
    carrito = [];
    localStorage.clear();
    cartBody.innerHTML = "";
    spanPrecioTotal.innerHTML = 0;
    actualizarSpansCarrito();

    Toastify({
        text: "Se vació el carrito",
        duration: 2500,
        newWindow: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: false,
        style: {
          background: "linear-gradient(to right, #d34f1b, #bd7728)",
        },
      }).showToast();
    
})


// Timeout para que se muestren los productos despues de hacer el fetch
setTimeout(() => {
    renderServices(arrayProductos)
}, 200);
