using APIMateriales2026GiaroliValentin.Models;
using APIMateriales2026GiaroliValentin.ModelsView;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace APIMateriales2026GiaroliValentin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InformesController : ControllerBase
    {
        private readonly APIMaterialesContext _context;

        public InformesController(APIMaterialesContext context)
        {
            _context = context;
        }

        //metodo para buscar productos y materiales de cada uno
        [HttpGet("MaterialesPorProducto")]
        public async Task<ActionResult<IEnumerable<VistaProductoMaterial>>> GetMaterialesPorProducto(int id)
        {
            //INICIAMOS UN LISTADO VACIO PARA MOSTRAR EN PANTALLA LUEGO DE HABER COMPLETADO LOS DATOS
            List<VistaProductoMaterial> productosMostrar = new List<VistaProductoMaterial>();

            //BUSCAMOS TODOS LOS PRODUCTOS ACTIVOS EN LA BASE DE DATOS
            var productos = await _context.Productos.Where(p => !p.Eliminado).ToListAsync();

            //POR CADA PRODUCTO LO RECORREMOS PARA BUSCAR SUS MATERIALES
            foreach(var producto in productos.OrderByDescending(a => a.Descripcion))
            {
                //INSERTAR LOS DATOS DEL PRIMER NIVEL QUE SERIA EL PRODUCTO
                var productoMostrar = new VistaProductoMaterial
                {
                  ProductoID = producto.ProductoID,
                  Descripcion = producto.Descripcion,
                  PorcentajeGanancia = producto.PorcentajeGanancia,
                  PrecioVenta = producto.PrecioVenta,
                  CostoTotal = producto.CostoTotal,
                  ListadoMateriales = new List<VistaMaterial>()  
                };
                productosMostrar.Add(productoMostrar);

                //AHORA DEBEMOS BUSCAR LOS MATERIALES DEL PRODUCTO
                var materialesProducto = _context.MaterialProductos
                .Where(m => m.ProductoID == producto.ProductoID).ToList();

                foreach(var materialProducto in materialesProducto)
                {

                    //POR CADA MATERIAL PRODUCTO BUSCAR LA INFO DE MATERIAL
                    var material = _context.Materiales
                    .Where(m => m.MaterialID == materialProducto.MaterialID).Single();

                    var materialMostrar = new VistaMaterial
                    {
                      MaterialID = material.MaterialID, 
                      Descripcion = material.Descripcion,
                      PrecioCosto = material.PrecioCosto
                    };
                    productoMostrar.ListadoMateriales.Add(materialMostrar);
                }
            }

            return productosMostrar.ToList();
        }

    }
}