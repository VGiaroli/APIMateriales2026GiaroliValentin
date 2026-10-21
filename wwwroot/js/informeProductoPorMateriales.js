
document.addEventListener("DOMContentLoaded", function () {
    obtenerMateriales();
});


function obtenerMateriales() {
    fetch('http://localhost:5048/api/Materiales')
        .then(res => res.json())
        .then(materiales => {
            const select = document.getElementById('materialID');
            select.innerHTML = '<option value="0">--Seleccionar Material--</option>';
            materiales.forEach(m => {
                select.innerHTML += `<option value="${m.materialID}">${m.descripcion}</option>`;
            });
        })
        .catch(error => console.error("Error al obtener los materiales: ", error));
}


$("#materialID").change(function () {
    var materialSeleccionado = $(this).val();
    // limpiarSelects(['#rubroID', '#materialProductoID']);

    if (materialSeleccionado !== "0") {
        fetch('http://localhost:5048/api/Rubros?Materiales/{materialSeleccionado}')
            .then(res => res.json())
            .then(rubros => {
                const select = document.getElementById('rubroID');
                select.innerHTML = '<option value="0">--Seleccionar Rubro--</option>';
                rubros.forEach(rubro => {
                    $("#rubroID").append(`<option value="${rubro.rubroID}">${rubro.descripcion}</option>`);
                });
            })
    }
});

  // el reseteo viene por acá del select
$("#rubroID").change(function () {
    var rubroSeleccionado = $(this).val();
    // guardamo el material elegido
    var materialSeleccionado = $("#materialID").val();

    // lo que hace es que, si selecciono otro rubro resetea la seleccion del material por producto
    $("#materialProductoID").html('<option value="0">--SELECCIONE UN MATERIAL POR PRODUCTO--</option>');

    if (rubroSeleccionado !== "0") {
        fetch('http://localhost:5048/api/Informes/MaterialesPorProducto')
            .then(res => res.json())
            .then(productos  => {                
                // acá queda solamente los productos que usan el material elegido
                const filtrados = productos.filter(d => 
                    // comprueba si al menos un elemento de una array cumple con una condicion especifica
                    d.listadoMateriales.some(m => m.materialID == materialSeleccionado)
                );

                filtrados.forEach(d => {
                    $("#materialProductoID").append(`<option value="${d.productoID}">${d.descripcion}</option>`);
                });
            })
            .catch(error => console.error("Error al obtener los productos: ", error));
    }
});



// function obtenerRubros() {
//     fetch('http://localhost:5048/api/Rubros')
//         .then(res => res.json())
//         .then(rubros => {
//             const select = document.getElementById('rubroID');
//             select.innerHTML = '<option value="0">--Seleccionar Rubro--</option>';
//             rubros.forEach(r => {
//                 select.innerHTML += `<option value="${r.rubroID}">${r.descripcion}</option>`;
//             });
//         })
//         .catch(error => console.error("Error al obtener los rubros: ", error));
// }


// function obtenerMaterialesPorProducto() {
//     fetch('http://localhost:5048/api/MaterialesPorProducto')
//         .then(res => res.json())
//         .then(materiales => {
//             const select = document.getElementById('materialProductoID');
//             select.innerHTML = '<option value="0">--Seleccionar Material--</option>';
//             materiales.forEach(m => {
//                 select.innerHTML += `<option value="${m.materialProductoID}">${m.descripcion}</option>`;
//             });
//         })
//         .catch(error => console.error("Error al obtener los materiales por producto: ", error));
// }