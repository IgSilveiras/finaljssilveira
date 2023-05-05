fetch("../data/data.json")
.then((response) => response.json())
.then((data) => {
    renderServices(data)
})

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

container = document.querySelector("#productos");