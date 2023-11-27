let carrito = []

const containerCards = document.querySelector(".container")

// llamamos los productos de la api

const nodosCards = (data, container) => {
    const nodos = data.reduce((acc, element) => {
        return acc + `
            <article class= "cards">
                <figure class= "container-img">
                    <img src= ${element.image} alt ="imagen de ${element.category}"</img>
                </figure>
                <h3 class= "container-title">
                    ${element.title}
                </h3>
                <h4>
                    $${element.price}
                </h4>
                <button id= "add-${element.id}" class = "add-button">
                Comprar
                </button>
            </article>
            `
    },"");

    container.innerHTML = nodos
}

function agregarAlCarrito(producto) {
    carrito.push(producto)
    actualizarCarritoDOM()

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function eliminarProducto(index) {
    carrito.splice(index, 1)
    actualizarCarritoDOM()
}

// sumamos los productos que se van agregando al carrito

function calcularTotal() {
    let total = 0
    carrito.forEach((producto) => {
        total += producto.price
    })
    return total
}

// mostramos los productos que se agregan al carrtio

function actualizarCarritoDOM() {
    
    const carritoContainer = document.getElementById("carrito-productos")
    const totalContainer = document.getElementById("total")
    const carritoVacioMensaje = document.getElementById("carrito-vacio")
    const compraRealizadaMensaje = document.querySelector("#mensaje-compra > div")
    const finalizarCompraButton = document.getElementById("finalizar-compra")

    if (carritoContainer && totalContainer) {
        carritoContainer.innerHTML = ""

        if (carrito.length === 0) {
            carritoVacioMensaje.classList.remove("oculto")
            if (compraRealizadaMensaje) {
                compraRealizadaMensaje.classList.add("oculto")
            }
            totalContainer.textContent = "Tu carrito está vacío"
        } else {
        carrito.forEach((producto, index) => {
            const productoElement = document.createElement("div")
            productoElement.classList.add("producto-carrito")

            const imagen = document.createElement("img")
            imagen.src = producto.image
            imagen.alt = producto.title
            productoElement.appendChild(imagen)

            const titulo = document.createElement("h3")
            titulo.textContent = producto.title
            productoElement.appendChild(titulo)

            const precio = document.createElement("p")
            precio.textContent = `$${producto.price}`
            productoElement.appendChild(precio)

            const botonEliminar = document.createElement("button")
            botonEliminar.textContent = "Eliminar"
            botonEliminar.addEventListener("click", () => eliminarProducto(index))
            productoElement.appendChild(botonEliminar)

            carritoContainer.appendChild(productoElement)
        });

        const total = calcularTotal()
        totalContainer.textContent = `total: $${total}`

        finalizarCompraButton.addEventListener("click", () => {
            vaciarCarrito()
            mensajeAgradecimiento()
            actualizarCarritoDOM()
        })

        carritoVacioMensaje.classList.add("oculto")
        compraRealizadaMensaje.classList.remove("oculto")
        }

        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
}

function vaciarCarrito() {
    // Vaciar el array del carrito
    carrito = []
}
function mensajeAgradecimiento() {
    // Mostrar el mensaje de agradecimiento
    const compraRealizadaMensaje =  document.querySelector("#mensaje-compra > div")
    if (compraRealizadaMensaje) {
        compraRealizadaMensaje.textContent = "¡Gracias por tu compra! Nos pondremos en contacto para coordinar el envío de los productos."
        compraRealizadaMensaje.classList.remove("oculto") 
    }
}

const llamadoApi = (url, generarNodos, container,orden) => {

    const body = document.getElementById("body")
    if (body && body.classList.contains("productos-page")){

    fetch(`${url}?sort=${orden}`)
    .then(res => res.json())
    .then(data => {
        generarNodos(data,container)
        manejarBotones(data)
        })
    }
}

// guardamos lor productos del carrito en el localStorage

function cargarProductosDelLocalStorage() {
    const productosLocalStorage = JSON.parse(localStorage.getItem("carrito"))

    if (productosLocalStorage) {
        carrito = productosLocalStorage

        actualizarCarritoDOM()
    }
}

// notificacion cuando se agrega un producto al carrito

function mostrarNotificacion() {
    const body = document.querySelector('body')

    if (body.classList.contains('productos-page')) {
        const notification = document.querySelector('.notificacion')
        notification.style.display = 'block'

        setTimeout(() => {
            notification.style.display = 'none'
        }, 3000); // Ocultar la notificación después de 3 segundos
    }
}

document.addEventListener('DOMContentLoaded', function() {

    fetch(`https://fakestoreapi.com/products`)
    .then(response => response.json())
    .then(data => {
        manejarBotones(data)
    })
    .catch(error => console.error('Error al obtener los datos:', error))
});

// Funcion del boton de compra para agregar al carrito

function manejarBotones(data) {
    const body = document.querySelector('body')

    if (body && body.classList.contains('productos-page')) {
        const container = document.querySelector(".container")
        
        container.addEventListener("click", (event) => {
            if (event.target.classList.contains("add-button")) {
                const buttonId = event.target.id
                const productoId = buttonId.split("-")[1]
                const productoSeleccionado = data.find(
                    (producto) => producto.id === parseInt(productoId)
                )
                if (productoSeleccionado) {
                    carrito.push(productoSeleccionado)
                    console.log(
                        `Producto agregado al carrito: ${productoSeleccionado.title}`
                    );
                    
                    mostrarNotificacion()
    
                    actualizarCarritoDOM()
                            
                    localStorage.setItem("carrito", JSON.stringify(carrito))
                }
            }
        })
    }
}

// codicion del formulario y limpieza del mismo cuando se envia

document.addEventListener("DOMContentLoaded",   function() {
    const contactoPage = document.getElementById("body")
    
    if (contactoPage && contactoPage.classList.contains("contacto-page")) { 

    function limpiarFormulario() {
        document.getElementById("nombre").value = "" 
        document.getElementById("email").value = "" 
        document.getElementById("mensaje").value = ""
        document.getElementById("mensajeError").style.display = "none"
        document.getElementById("mensajeErrorNombre").style.display = "none"
    }

    function validarFormulario () {
        const nombre = document.getElementById("nombre").value 
        const email = document.getElementById("email").value
        const mensaje = document.getElementById("mensaje").value
        const mensajeError = document.getElementById("mensajeError")
        const mensajeErrorNombre = document.getElementById("mensajeErrorNombre")

        let formularioValido = true

        if (nombre.length < 3) {
            mensajeErrorNombre.style.display = "block"
            formularioValido = false
        } else {
            mensajeErrorNombre.style.display = "none"
        }

        if (email.indexOf('@') === -1 || mensaje.length < 10) {
            mensajeError.style.display = "block"
            formularioValido = false
        } else {
            mensajeError.style.display = "none"
        }

        if (formularioValido) {
            limpiarFormulario()
        }
        return formularioValido 
    }

// estructura del formulario

    function crearFormulario () {

        const formulario = document.getElementById("formulario")

        const form = document.createElement("form")

        const nombreLabel = document.createElement("label")
        nombreLabel.innerHTML= "Nombre: "
        form.appendChild(nombreLabel)

        const nombreInput = document.createElement("input")
        nombreInput.type = "text"
        nombreInput.id = "nombre"
        form.appendChild(nombreInput)

        const emailLabel = document.createElement("label")
        emailLabel.innerHTML = "Email: "
        form.appendChild(emailLabel)

        const emailInput = document.createElement("input")
        emailInput.type = "email"
        emailInput.id = "email"
        form.appendChild(emailInput)

        const mensajeLabel = document.createElement("label")
        mensajeLabel.innerHTML = "Mensaje (más de 10 caracteres): "
        form.appendChild(mensajeLabel)

        const mensajeInput = document.createElement("textarea")
        mensajeInput.id = "mensaje"
        form.appendChild(mensajeInput)

        const submitButton = document.createElement("input")
        submitButton.type = "submit"
        submitButton.value = "Enviar"
        form.appendChild(submitButton)

        form.addEventListener("submit", function(event) {
            event.preventDefault()
            validarFormulario()
        })
        formulario.appendChild(form)
        }
        crearFormulario()
    }
})

// funciones del carrusel

document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector(`body`)
    if (body.classList.contains (`home-page`)) {

// llamamos a los productos con un precio menor a $20 para mostrar en el carrusel

    fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(data => {
            const oferta = data.filter (producto => producto.price < 20)
            const swiperWrapper = document.querySelector(`.swiper-wrapper`)
            swiperWrapper.innerHTML = ``

            oferta.forEach(producto => {
                const slide = document.createElement(`div`)
                slide.classList.add(`swiper-slide`)
                slide.innerHTML = `
                    <div class = "producto">
                    <div 
                    class="oferta-banner">Oferta</div>
                    <img class = "carrusel-img" src="${producto.image}" alt="${producto.title}">
                        <h3>${producto.title}</h3>
                        <p>Precio: $${producto.price}</p>
                        <button class="comprar-button" data-producto='${JSON.stringify(producto.id)}'>
                         Comprar </button>
                    </div>`

                swiperWrapper.appendChild(slide)
            })
            const swiper = new Swiper('.swiper', {

                direction: 'horizontal',
                loop: true,
                pagination: {
                el: '.swiper-pagination',
                },
                navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                },
                scrollbar: {
                el: '.swiper-scrollbar',
                },
            });
            botonCompra(data)
        })
        .catch(error => {
            console.error("error", error)
        })
    }
})

function botonCompra(data) {

    const comprarButtons = document.querySelectorAll(`.comprar-button`)
    comprarButtons.forEach(button => {

        button.addEventListener(`click`, (event) => {
            const id = button.getAttribute(`data-producto`)
            const productoSeleccionado = data.find((producto) => producto.id === parseInt(id))

            try {
                agregarAlCarrito(productoSeleccionado)
            }
            catch (error) {
                throw error
            }
        });
    });
}

// odenamos los nombres de los productos alfabeticamente

document.addEventListener("DOMContentLoaded", function() {
    const body = document.getElementById("body")
    if (body && body.classList.contains("productos-page")){

        const botonAZ = document.getElementById("ordenarAZ")
        const botonZA = document.getElementById("ordenarZA")

        let productos = []

        botonAZ.addEventListener("click", function() {
        ordenarProductos(`asc`)
        })

        botonZA.addEventListener("click", function() {
        ordenarProductos(`desc`)
    })

    function ordenarProductos(orden) {
        productos.sort((a,b) => {
            const tituloA = a.title.toLowerCase()
            const tituloB = b.title.toLowerCase()
        
            if(orden === `asc`) {
                if (tituloA < tituloB) return-1
                if (tituloA > tituloB) return 1
            } else {
                if (tituloA > tituloB) return -1
                if (tituloA < tituloB) return 1
            }
            return 0
        })
        nodosCards(productos, containerCards)
    }
    function llamadoApi(url) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                productos = data 
                nodosCards(data, containerCards)
            })
    }
    llamadoApi ('https://fakestoreapi.com/products', nodosCards, containerCards)

    manejarBotones(productos)
    }
})

//funcion del modo oscuro

document.addEventListener("DOMContentLoaded", function(){
    const body = document.getElementById("body")
    const modoOscuro = document.getElementById("modo-oscuro")
    const isDarkMode = localStorage.getItem("darkMode")
    const formulario = document.getElementById("formulario")

    if (isDarkMode === "true") {
        body.classList.add("dark-mode")
        if (modoOscuro) {
            modoOscuro.classList.add("dark-mode-button")
        }
    }
    if (modoOscuro) {
        modoOscuro.addEventListener("click", function() {
            body.classList.toggle("dark-mode")
            if (modoOscuro) {
                modoOscuro.classList.toggle("dark-mode-button")
            }
            if (formulario) {
                formulario.classList.toggle("dark-mode-form")
            }

            const isDark = body.classList.contains("dark-mode")
            localStorage.setItem("darkMode", isDark.toString())
        })
    }
})

document.addEventListener("DOMContentLoaded", function() {

    cargarProductosDelLocalStorage()

    if (document.getElementById("body").classList.contains("carrito")) {
        actualizarCarritoDOM()
    }
});

