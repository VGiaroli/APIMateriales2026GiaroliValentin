document.addEventListener('DOMContentLoaded', obtenerProductos);

function obtenerProductos() {
    fetch('http://localhost:5048/api/Productos')
        .then(res => res.json())
        .then(productos => MostrarProductos(productos))
        .catch(error => console.error("Error al obtener los productos: ", error))
}

function MostrarProductos(productos) {
    $('#productos-tbody').empty();

    $.each(productos, function (index, productos) {
        let estadoProductos = productos.eliminado ? 'Inactivo' : 'Activo'
        $('#productos-tbody').append(
            "<tr>" +
            // "<td>" + productos.productoID + "</td>" +
            "<td>" + productos.descripcion + "</td>" +
            "<td>" + estadoProductos + "</td>" +
            "<td class='text-center'>"
            +
            "<button class='btn-accion btn-editar me-2' title='Editar' onclick='buscarProducto(" + productos.productoID + ")'>" +
            "<i class='bi bi-pencil-square'></i></button>"
            +
            "<button class='btn-accion btn-eliminar me-2' title='Eliminar' onclick='confirmarEliminar(" + productos.productoID + ")'>" +
            "<i class='bi bi-trash3-fill'></i></button>"
            +
            "<button class='btn-accion btn-composicion me-2' title='Composición' onclick='abrirModalComposición(" + productos.productoID + ")'>" +
            "<i class='bi bi-box-seam'></i></button>"
            +
            "</td>" +
            "</tr>"
        )
    })
}

function confirmarEliminar(id) {
    Swal.fire({
        title: "Está seguro de Eliminar el Producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarProducto(id);
        }
    });
}

function eliminarProducto(id) {
    fetch(`http://localhost:5048/api/Productos/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    }).then(() => {
        Swal.fire({
            text: "El producto fue eliminado correctamente",
            icon: "success",
            position: 'top-end',
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
        obtenerProductos();
    }).catch(error => console.error("Error al eliminar el producto: ", error))
}

function buscarProducto(id) {
    fetch(`http://localhost:5048/api/Productos/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener el producto");
            return response.json();
        })
        .then(producto => {
            document.getElementById('productoID').value = producto.productoID;
            document.getElementById('descripcion').value = producto.descripcion;
            document.getElementById('eliminado').value = producto.eliminado.toString();
            document.getElementById('contenedorEstado').style.display = 'block';
            document.getElementById('modalTitulo').textContent = "Editar Producto";
            $("#modalRegistro").modal("show");
        })
        .catch(error => console.error("Error al obtener el producto: ", error))
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
    const productoID = document.getElementById('productoID').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const eliminado = document.getElementById("eliminado").value === "true"

    if (!validarFormulario(descripcion)) {
        return;
    }

    const guardarProducto = {
        productoID: productoID,
        descripcion: descripcion,
        eliminado: eliminado
    }


    if (productoID > 0) {
        fetch(`http://localhost:5048/api/Productos/${productoID}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(guardarProducto)
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
                obtenerProductos();
            })
            .catch(error => console.error("Error al editar el producto: ", error))
    } else {
        fetch(`http://localhost:5048/api/Productos`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(guardarProducto)
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
                obtenerProductos();
            })
            .catch(error => console.error("Error al crear el producto: ", error));
    }
}

function abrirModalCrear() {
    limpiarFormulario();
    $('#modalRegistro').modal('show');
}

function limpiarFormulario() {
    // ocultarAlerta();
    document.getElementById('productoID').value = "0";
    document.getElementById('descripcion').value = "";
    document.getElementById('contenedorEstado').style.display = 'none';
    document.getElementById('modalTitulo').textContent = "Agregar Producto";


    document.getElementById('descripcion').classList.remove('is-invalid');
    document.getElementById('errorDescripcion').classList.add('d-none');
}

function obtenerMateriales() {
    fetch("http://localhost:5048/api/Materiales")
        .then(resp => resp.json())
        .then(materiales => {
            let select = document.getElementById("materialID");
            select.innerHTML = '<option value="0">--Seleccionar Materiales--</option>';
            materiales.forEach(material => {
                let opt = document.createElement("option");
                opt.value = material.materialID;
                opt.text = material.descripcion;
                select.add(opt);
            });
        })
        .catch(error => console.error("Error cargando materiales:", error));
}

async function abrirModalComposición(id) {
    document.getElementById("composicionProductoID").value = id;
    obtenerMateriales();
    await buscarMaterialesProducto(id);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAsignarMaterial')).show();
}

async function buscarMaterialesProducto(id) {
    try {
        const respuesta = await fetch(`http://localhost:5048/api/Productos/MostrarComposicionProducto/${id}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });

        if (!respuesta.ok) throw new Error("No se puede obtener el material.");

        const materialesProducto = await respuesta.json();
        const bodyMaterialesProducto = document.getElementById("tbody-composicion-materiales");
        bodyMaterialesProducto.innerHTML = "";

        if (materialesProducto.length > 0) {
            materialesProducto.forEach((material) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${material.descripcion}</td>
                    <td>${material.cantidad}</td>
                    <td>${material.precioCostoUnitario}</td>
                    <td>${material.subTotal}</td>
                    <td>${material.costoTotal}</td>
                    <td class="text-center">
                        <button class="btn-accion btn-eliminar" onclick="eliminarMaterialesProducto(${material.materialProductoID})">
                            <i class='bi bi-trash3-fill'></i>
                        </button>
                    </td>
                `;
                bodyMaterialesProducto.appendChild(tr);
            });
        } else {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td class='text-danger' colspan='5'>ACTUALMENTE EL PRODUCTO NO POSEE MATERIALES</td>`;
            bodyMaterialesProducto.appendChild(tr);
        }
    }
    catch (error) {
        console.error("Error composición material:", error);
    }
}

async function guardarMaterial() {
    const productoID = document.getElementById("composicionProductoID").value;
    const materialID = document.getElementById("materialID").value;
    const cantidad = document.getElementById("cantidad").value;

    if (!(productoID > 0 && materialID > 0 && cantidad > 0)) {
        return;
    }

    const composicion = {
        materialProductoID: 0,
        productoID: productoID,
        materialID: materialID,
        cantidad: cantidad
    }

    const respuesta = await fetch(`http://localhost:5048/api/Productos/GuardarComposicionMaterial`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composicion)
    });

    if(respuesta.ok){
        document.getElementById("materialID").value = "0",
        document.getElementById("cantidad").value = "",
        buscarMaterialesProducto(productoID);

    }else{
        console.error("Error al guardar la composición");
    }
}

async function eliminarMaterialesProducto(id) {
    try {
        const respuesta = await fetch(`http://localhost:5048/api/Productos/EliminarComposicionMaterial/${id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        });

        if (!respuesta.ok) throw new Error("No se pudo eliminar");

        const productoID = document.getElementById("composicionProductoID").value; 
        buscarMaterialesProducto(productoID);
    }
    catch (error) {
        console.error("Error eliminar composición material:", error);
    }
}