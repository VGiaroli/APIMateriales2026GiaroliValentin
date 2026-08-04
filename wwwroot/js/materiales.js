document.addEventListener('DOMContentLoaded', function () {
    obtenerMateriales();
    cargarRubros();
});


function obtenerMateriales() {
    fetch('http://localhost:5048/api/Materiales')
        .then(res => res.json())
        .then(material => MostrarMaterial(material))
        .catch(error => console.error("Error al obtener los materiales: ", error))
}

function MostrarMaterial(material) {
    $('#materiales-tbody').empty();

    $.each(material, function (index, material) {
        $("#materiales-tbody").append(
            "<tr>" +
            "<td>" + material.descripcion + "</td>" +
            "<td>" + material.precioCosto + "</td>" +
            "<td>" + material.rubroDescripcion + "</td>" +
            "<td class='text-center'>" +
            "<button class='btn-accion btn-editar me-2' title='Editar' onclick='buscarMaterial(" + material.materialID + ")'>" +
            "<i class='bi bi-pencil-square'></i></button>" +
            "<button class='btn-accion btn-eliminar me-2' title='Eliminar' onclick='confirmarEliminar(" + material.materialID + ")'>" +
            "<i class='bi bi-trash3-fill'></i></button>" +
            "</td>" +
            "</tr>"
        )
    })
}

// Agrega esto fuera de tus funciones
document.getElementById('modalRegistro').addEventListener('hidden.bs.modal', function () {
    limpiarFormulario();
});

function abrirModalCrear() {
    limpiarFormulario();
    $('#modalRegistro').modal('show');
}

function limpiarFormulario() {
    document.getElementById('materialID').value = "0";
    document.getElementById('descripcion').value = "";
    document.getElementById('precioCosto').value = "";
    document.getElementById('rubroID').value = "0";
    document.getElementById('modalTitulo').textContent = "Agregar Material";

    //LIMPIAMOS LOS ERRORES
    document.querySelectorAll('.form-control-custom, .form-select').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.error-field').forEach(el => el.classList.add('d-none'));
}

function confirmarEliminar(id) {
    Swal.fire({
        title: "Está seguro de Eliminar el Material?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarMaterial(id);
        }
    });
}

function eliminarMaterial(id) {
    fetch(`http://localhost:5048/api/Materiales/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    }).then(() => {
        Swal.fire({
            text: "El material fue eliminado correctamente",
            icon: "success",
            position: 'top-end',
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
        obtenerMateriales();
    }).catch(error => console.error("Error al eliminar el material: ", error))
}

function buscarMaterial(id) {
    fetch(`http://localhost:5048/api/Materiales/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener el material");
            return response.json();
        })
        .then(material => {
            document.getElementById('materialID').value = material.materialID;
            document.getElementById('descripcion').value = material.descripcion;
            document.getElementById('precioCosto').value = material.precioCosto;
            document.getElementById('rubroID').value = material.rubroID;
            document.getElementById('modalTitulo').textContent = "Editar Material";
            $("#modalRegistro").modal("show");
        })
        .catch(error => console.error("Error al obtener el material: ", error))
}

//VALIDACIONES PARA LOS INPUTS
function validarFormulario(descripcion, precioCosto, rubroID) {
    let esValido = true;

    // Descripción
    if (descripcion === "") {
        document.getElementById('descripcion').classList.add('is-invalid');
        document.getElementById('errorDescripcion').classList.remove('d-none');
        esValido = false;
    } else {
        document.getElementById('descripcion').classList.remove('is-invalid');
        document.getElementById('errorDescripcion').classList.add('d-none');
    }

    // Precio Costo
    if (isNaN(precioCosto) || precioCosto <= 0) {
        document.getElementById('precioCosto').classList.add('is-invalid');
        document.getElementById('errorPrecioCosto').classList.remove('d-none');
        esValido = false;
    } else {
        document.getElementById('precioCosto').classList.remove('is-invalid');
        document.getElementById('errorPrecioCosto').classList.add('d-none');
    }

    // Rubro
    if (rubroID === 0 || isNaN(rubroID)) {
        document.getElementById('rubroID').classList.add('is-invalid');
        document.getElementById('errorRubro').classList.remove('d-none');
        esValido = false;
    } else {
        document.getElementById('rubroID').classList.remove('is-invalid');
        document.getElementById('errorRubro').classList.add('d-none');
    }

    return esValido;
}

function GuardarRegistro() {
    let materialID = parseInt(document.getElementById('materialID').value);
    let descripcion = document.getElementById('descripcion').value.trim();
    let rubroID = parseInt(document.getElementById('rubroID').value);
    let precioCosto = parseFloat(document.getElementById('precioCosto').value);

    //LLAMAMOS A LA FUNCION VALIDACIONES PARA LOS INPUTS
    if (!validarFormulario(descripcion, precioCosto, rubroID)) {
        return; // corta la ejecución si hay errores
    }

    let guardarMaterial = {
        materialID,
        descripcion,
        rubroID,
        precioCosto
    }

    if (materialID > 0) {
        fetch(`http://localhost:5048/api/Materiales/${materialID}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(guardarMaterial)
        })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al actualizar");
                }
                $('#modalRegistro').modal('hide');
                Swal.fire({
                    title: "Editado con éxito!",
                    icon: "success",
                    position: 'top-end',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                obtenerMateriales();
            })
            .catch(error => console.error("Error al editar el material: ", error))
    } else {
        fetch(`http://localhost:5048/api/Materiales`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(guardarMaterial)
        })
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || `Error ${response.status}`);
                }
                $('#modalRegistro').modal('hide');
                Swal.fire({
                    title: "Creación exitosa!",
                    icon: "success",
                    position: 'top-end',
                    toast: true,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                obtenerMateriales();
            })
            .catch(error => console.error("Error al crear el material: ", error))
    }
}

function cargarRubros() {
    fetch('http://localhost:5048/api/Rubros')
        .then(res => res.json())
        .then(rubros => {
            const select = document.getElementById('rubroID');
            select.innerHTML = '<option value="0">--Seleccionar Rubro--</option>';
            rubros.forEach(r => {
                select.innerHTML += `<option value="${r.rubroID}">${r.descripcion}</option>`;
            });
        })
        .catch(error => console.error("Error al obtener los rubros: ", error));
}