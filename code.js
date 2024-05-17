const formulario = document.getElementById("form");
const nombreInput = document.getElementById("name");
const asuntoInput = document.getElementById("asunto");
const telefonoInput = document.getElementById("telefono");
const mailInput = document.getElementById("correo");
const mensajeInput = document.getElementById("mensaje");
const motivoDeConsultaInputs = document.getElementsByName("motivo-consulta");
//nav responsive//
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector ("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})

const enviarButton = document.getElementById("enviar");
enviarButton.addEventListener("click", function () {
    if (validarFormulario()) {
        formulario.submit();
    }
});

function validarFormulario() {
    let radioSeleccionado = false;
    for (let i = 0; i < motivoDeConsultaInputs.length; i++) {
        if (motivoDeConsultaInputs[i].checked) {
            radioSeleccionado = true;
            break;
        }
    }
    
    if (!radioSeleccionado &&
        nombreInput.value.trim() === "" &&
        asuntoInput.value.trim() === "" &&
        telefonoInput.value.trim() === "" &&
        mailInput.value.trim() === "" &&
        mensajeInput.value.trim() === "") {
        alert("Por favor complete todos los campos del formulario antes de enviar.");
        return false;
    }

    if (!radioSeleccionado) {
        alert("Por favor, seleccione un motivo de consulta");
    } else if (nombreInput.value.trim() === "") {
        alert("Por favor, complete el campo: Nombre.");
        return false;
    } else if(!validarCorreo(mailInput.value.trim())) {
        alert("Por favor, ingrese un correo electrónico válido.");
        return false;
    } else if(!validarTelefono(telefonoInput.value.trim())) {
        alert("Por favor, ingrese un número de teléfono válido. El mismo debe contener 10 digitos.");
        return false;
    } else if (asuntoInput.value.trim() === "") {
        alert("Por favor, complete el campo: Asunto.");
        return false;
    } else if (mensajeInput.value.trim() === "") {
        alert("Por favor, complete el campo: Mensaje.");
        return false;
    } else {
        alert("Su consulta ha sido enviada, pronto nos contactaremos.");
        window.location.href = "index.html";
        return true;
    }
}

function validarCorreo(correo) {
    // Expresión regular para validar un correo electrónico
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
}

function validarTelefono(telefono) {
    // Expresión regular para validar un número de teléfono (10 dígitos)
    const regexTelefono = /^\d{10}$/;
    return regexTelefono.test(telefono);
}

