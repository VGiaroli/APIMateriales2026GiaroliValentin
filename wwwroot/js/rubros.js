document.addEventListener('DOMContentLoaded', obtenerRubros);

function obtenerRubros() {
    fetch('http://localhost:5048/api/Rubros')
        .then(response => response.json())
        .then(rubros => MostrarRubros(rubros))
        .catch(error => console.error("Error al obtener los rubros: ", error))
}

function MostrarRubros(rubros) {
    $('#rubros-tbody').empty();

    $.each(rubros, function (index, rubros) {
        let estadoRubros = rubros.eliminado ? 'Inactivo' : 'Activo'
        $('#rubros-tbody').append(
            "<tr>" +
            "<td>" + rubros.descripcion + "</td>" +
            "<td>" + estadoRubros + "</td>" +
            "<td class='text-center'>"
            +
            "<button class='btn-accion btn-editar me-2' title='Editar' onclick='buscarRubro(" + rubros.rubroID + ")'>" +
            "<i class='bi bi-pencil-square'></i></button>"
            +
            "<button class='btn-accion btn-eliminar me-2' title='Eliminar' onclick='confirmarEliminar(" + rubros.rubroID + ")'>" +
            "<i class='bi bi-trash3-fill'></i></button>"
            +
            "</td>" +
            "</tr>"
        )
    })
}

function confirmarEliminar(id) {
    Swal.fire({
        title: "Está seguro de Eliminar el Rubro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarRubro(id);
        }
    });
}

function eliminarRubro(id) {
    fetch(`http://localhost:5048/api/Rubros/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    }).then(() => {
        Swal.fire({
            text: "El rubro fue eliminado correctamente",
            icon: "success",
            position: 'top-end',
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
        obtenerRubros();
    }).catch(error => console.error("Error al eliminar el rubro: ", error))
}

function buscarRubro(id) {
    fetch(`http://localhost:5048/api/Rubros/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener el rubro");
            return response.json();
        })
        .then(rubro => {
            document.getElementById('rubroID').value = rubro.rubroID;
            document.getElementById('descripcion').value = rubro.descripcion;
            document.getElementById('eliminado').value = rubro.eliminado.toString();
            document.getElementById('contenedorEstado').style.display = 'block';
            document.getElementById('modalTitulo').textContent = "Editar Rubro";
            $("#modalRegistro").modal("show");
        })
        .catch(error => console.error("Error al obtener el rubro: ", error))
}

function validarFormulario(descripcion) {
    let esValido = true;

    if (descripcion === "") {
        document.getElementById('descripcion').classList.add('is-invalid');
        document.getElementById('errorDescripcion').classList.remove('d-none');
        esValido = false;
    } else {
        document.getElementById('descripcion').classList.remove('is-invalid');
        document.getElementById('errorDescripcion').classList.add('d-none');
    }

    return esValido;
}

function guardarRegistro() {
    const rubroID = document.getElementById('rubroID').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const eliminado = document.getElementById("eliminado").value === "true"

    if (!validarFormulario(descripcion)) {
        return;
    }

    const guardarRubro = {
        rubroID: rubroID,
        descripcion: descripcion,
        eliminado: eliminado
    }


    if (rubroID > 0) {
        fetch(`http://localhost:5048/api/Rubros/${rubroID}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(guardarRubro)
        })
            .then(response => {
                if (!response.ok) !response.json().then(error => { throw error() })
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
                obtenerRubros();
            })
            .catch(error => console.error("Error al editar el rubro: ", error))
    } else {
        fetch(`http://localhost:5048/api/Rubros`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(guardarRubro)
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
                obtenerRubros();
            })
            .catch(error => console.error("Error al crear el rubro: ", error));
    }
}

function abrirModalCrear() {
    limpiarFormulario();
    $('#modalRegistro').modal('show');
}

function limpiarFormulario() {
    // ocultarAlerta();
    document.getElementById('rubroID').value = "0";
    document.getElementById('descripcion').value = "";
    document.getElementById('contenedorEstado').style.display = 'none';
    document.getElementById('modalTitulo').textContent = "Agregar Rubro";


    document.getElementById('descripcion').classList.remove('is-invalid');
    document.getElementById('errorDescripcion').classList.add('d-none');
}

