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

// Contenedor de los Productos
const container = document.querySelector("#productos");

// Contenedor del Filtro
const filterContainer = document.querySelector("#contenedor-filtros");

// Contenedor de las Opciones de Filtrado
const filterOptionsContainer = document.querySelector("#contenedor-opciones");

// Span del filtro seleccionado
const selectedFilterSpan = document.querySelector("#selectedFilterSpan")


// QuerySelectors //


// Mostrar los servicios
function renderServices(servicesArray) {
    container.innerHTML = "" ;
    let html
    for (const element of servicesArray) {
        const {nombre, precio, imagen} = element;

        html = `
        <div class="card border-light mb-3" style="max-width: 20rem; max-height: 30rem">
                <img src="${imagen}" class="card-img-top" alt="${nombre}">
                <div class="card-body">
                    <p id="product-name">${nombre}</p>
                    <p id="product-price">$${precio}</p>
                    <button id="cart-add-btn" class="btn btn-light"><i class="fa-solid fa-cart-plus"></i></button>
                </div>
            </div>
        `

        container.innerHTML += html;
    }
}

// Traer datos
fetch("../data/data.json")
.then((response) => response.json())
.then((data) => {
    guardarEnArray(data);
})

let arrayProductos = [];

function guardarEnArray(arr) {
    for (const elemento of arr) {
        const {nombre, precio, tipo, fabricante, imagen} = elemento;

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


setTimeout(() => {
    renderServices(arrayProductos)
}, 100);