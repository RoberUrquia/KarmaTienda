let productList = [];
let carrito = [];
let total = 0;

function add(productId, price) {
  const product = productList.find((p) => p.id === productId);
  if (product.stock > 0) {
    product.stock--;
    console.log(productId, price);

    const carritoItem = carrito.find((item) => item.id === productId);
    if (carritoItem) {
      carritoItem.quantity++;
    } else {
      carrito.push({ id: productId, quantity: 1 });
    }

    total += price;
    document.getElementById("checkout").innerHTML = `Pagar $${total}`;
    displayProducts();
  } else {
    Swal.fire({
      title: "Sin stock",
      text: "El producto seleccionado no tiene stock suficiente.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

async function pay() {
  if (carrito.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "El carrito está vacío, agrega productos antes de pagar.",
      icon: "warning",
      confirmButtonText: "Ok",
    });
    return;
  }

  try {
    const response = await fetch("/api/pay", {
      method: "post",
      body: JSON.stringify(carrito),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      let successMessage =
        "Compra procesada con éxito. Detalles de la compra:<br>";
      carrito.forEach((item) => {
        const product = productList.find((p) => p.id === item.id);
        successMessage += `${product.name} - Cantidad: ${item.quantity}<br>`;
      });

      Swal.fire({
        title: "Compra exitosa",
        html: successMessage,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        title: "Sin stock",
        text: "Uno o más productos no tienen stock suficiente.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  } catch (error) {
    console.log("Error al procesar la compra:", error);
    Swal.fire({
      title: "Error",
      text: "Hubo un error al procesar la compra. Por favor, inténtelo de nuevo.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }

  carrito = [];
  total = 0;
  await fetchProducts();
  document.getElementById("checkout").innerHTML = `Pagar $${total}`;
}

function displayProducts() {
  let productsHTML = "";
  productList.forEach((p) => {
    let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;

    if (p.stock <= 0) {
      buttonHTML = `<button disabled class="button-add disabled">Sin stock</button>`;
    }

    productsHTML += `<div class="product-container">
                <h3>${p.name}</h3>
                <img src="${p.image}" />
                <h1>$${p.price}</h1>
                ${buttonHTML}
            </div>`;
  });
  document.getElementById("page-content").innerHTML = productsHTML;
}

async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Error al cargar los productos");
    }
    productList = await response.json();
    displayProducts();
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error",
      text: "Hubo un error al cargar los productos. Por favor, recargue la página.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

window.onload = async () => {
  await fetchProducts();
};

const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector ("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
});
