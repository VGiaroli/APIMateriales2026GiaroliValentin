function imprimir() {

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    //const para obtener la img del front
    const logo = document.getElementById('imgLogo');

    //agrego la imagen al PDF y le paso los parametros
    pdf.addImage(logo, 'PNG', 181, -2, 25, 20);

    // ============================
    // ESTO ME SERVIRÁ PARA CUANDO QUIERA OCULTAR COLUMNAS
    // EN ESTE CASO, SERVIRÁ PARA LA COLUMNA ACCION
    // ============================
    const tablaOriginal = document.querySelector('#tablaProductos');
    const tablaClon = tablaOriginal.cloneNode(true);

    tablaClon.querySelectorAll('tr').forEach(row => {
        if (row.children[5]) {
            row.children[5].remove();
        }
    });

    // ============================
    // ENCABEZADO
    // ============================

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");

    pdf.text(
        'INFORME PRODUCTOS',
        105,
        20,
        { align: 'center' }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    // pdf.text(
    //     'Listado de Productos',
    //     105,
    //     27,
    //     { align: 'center' }
    // );

    pdf.setFontSize(9);

    pdf.text(
        'Listado de Productos',
        15,
        38,
        { align: 'left' }
    );

    pdf.text(
        'Fecha: 27/08/2026',
        195,
        38,
        { align: 'right' }
    );


    // Línea debajo del encabezado
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.25);

    pdf.line(15, 42, 195, 42);


    // ============================
    // TABLA
    // ============================

    pdf.autoTable({

        html: tablaClon,

        startY: 48,

        theme: 'grid',

        styles: {
            font: 'helvetica',
            fontSize: 8,
            cellPadding: 3,
            lineWidth: 0.1,
            valign: 'middle'
        },

        // CABECERA
        headStyles: {
            // fillColor: [204,234,232],
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            //halign: 'center',
            valign: 'middle'
        },

        didParseCell: function (data) {

            if (data.section === 'head') {

                if (data.column.index === 0) {
                    data.cell.styles.halign = 'left';
                    //esta linea sirve para que las palabras de la cabecera se pongan en MAYUSCULA
                    data.cell.text = data.cell.text.map(t => t.toUpperCase());
                }

                if (data.column.index === 1) {
                    data.cell.styles.halign = 'center';
                    data.cell.text = data.cell.text.map(t => t.toUpperCase());
                }

                if (data.column.index === 2) {
                    data.cell.styles.halign = 'center';
                    data.cell.text = data.cell.text.map(t => t.toUpperCase());
                }

                if (data.column.index === 3) {
                    data.cell.styles.halign = 'center';
                    //esta linea le da color al titulo de la cabecera.
                    // data.cell.styles.fillColor = [192, 250, 194];
                    data.cell.text = data.cell.text.map(t => t.toUpperCase());
                }

                if (data.column.index === 4) {
                    data.cell.styles.halign = 'center';
                    //esta linea le da color al titulo de la cabecera.
                    data.cell.styles.fillColor = [192, 250, 194];
                    data.cell.text = data.cell.text.map(t => t.toUpperCase());
                }

            }
        },

        // CUERPO
        bodyStyles: {
            textColor: [50, 50, 50]
        },

        // Filas alternadas: cambio COLORES a las filas alternadas
        alternateRowStyles: {
            fillColor: [214, 214, 214]
        },

        // Bordes
        tableLineColor: [200, 200, 200],
        tableLineWidth: 0.1,

        // Columnas
        columnStyles: {
            0: {
                halign: 'left',
                cellWidth: 50
            },

            1: {
                halign: 'right',
                cellWidth: 35
            },

            2: {
                halign: 'center',
                cellWidth: 35,
                //esta linea le da color a la ultima columna (a toda)
                // fillColor: [192, 250, 194],
                // fontStyle: 'bold'
            },

            3: {
                halign: 'right',
                cellWidth: 35,
                //esta linea le da color a la ultima columna (a toda)
                // fillColor: [192, 250, 194],
                // fontStyle: 'bold'
            },

            4: {
                halign: 'right',
                cellWidth: 27,
                //esta linea le da color a la ultima columna (a toda)
                fillColor: [192, 250, 194],
                fontStyle: 'bold'
            },


        },

        // Repetir encabezado en cada página
        showHead: 'everyPage',

        // Evitar cortar una fila
        rowPageBreak: 'avoid'
    });


    // ============================
    // PIE DE PÁGINA
    // ============================

    const paginas = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {

        pdf.setPage(i);

        // Línea divisoria
        pdf.setDrawColor(210, 210, 210);
        pdf.setLineWidth(0.4);
        pdf.line(15, 284, 195, 284);

        // Nombre del sistema
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(80, 80, 80);

        pdf.text(
            "API MATERIALES",
            15,
            290
        );

        // Información secundaria
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(120, 120, 120);

        pdf.text(
            "Informe de materiales",
            105,
            290,
            { align: "center" }
        );

        // Paginación
        pdf.text(
            `Página ${i} de ${paginas}`,
            195,
            290,
            { align: "right" }
        );
    }


    // ============================
    // GUARDAR
    // ============================

    // pdf.save('InformePromedios.pdf');

    //ABRIR EN PESTAÑA DEL NAVEGADOR CON EL VISUALIZADOR
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
}