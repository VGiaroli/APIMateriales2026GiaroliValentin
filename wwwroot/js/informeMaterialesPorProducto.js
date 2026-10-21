async function ObtenerMaterialesPorProducto() {
    const res = await fetch(`http://localhost:5048/api/Informes/MaterialesPorProducto`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const productos = await res.json();
    const tbody = document.querySelector("#tablaProductos-tbody");
    tbody.innerHTML = "";

    productos.forEach(producto => {

        const rowInsertar = document.createElement("tr");
        rowInsertar.innerHTML = `
        <td class="table-orange">${producto.descripcion}</td>
        <td class="table-orange">$${producto.costoTotal}</td>
        <td class="table-orange">${producto.porcentajeGanancia}%</td>
        <td class=" text-center table-orange">$${producto.precioVenta}</td>
        `;
        tbody.appendChild(rowInsertar);

        //LUEGO DE HABER INSERTADO LA FILA DEL PRDUCTO
        //DEBEMOS RECORRER QUE MATERIALES TIENE DICHO PRODUCTO
        producto.listadoMateriales.forEach(material => {
            const rowInsertar = document.createElement("tr");
            rowInsertar.innerHTML = `
            <td>${material.descripcion}</td>
            <td>$${material.precioCosto}</td>
            `;

            tbody.appendChild(rowInsertar);
        });
    });
}

ObtenerMaterialesPorProducto();