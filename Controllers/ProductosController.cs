using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIMateriales2026GiaroliValentin.Models
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly APIMaterialesContext _context;

        public ProductosController(APIMaterialesContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProducto()
        {
            return await _context.Productos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var productos = await _context.Productos.FindAsync(id);

            if (productos == null)
            {
                return NotFound();
            }

            return productos;
        }

        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {

            if (string.IsNullOrWhiteSpace(producto.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida." });
            }

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProducto", new { id = producto.ProductoID }, producto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.ProductoID)
            {
                return BadRequest(new { message = "El ID no coincide." });
            }

            if (string.IsNullOrWhiteSpace(producto.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida." });
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("MostrarComposicionProducto/{id}")]
        public async Task<ActionResult<IEnumerable<MaterialProducto>>> MostrarComposicion(int id)
        {

            var composicionProducto = await _context.MaterialProductos
            .Where(a => a.ProductoID == id)
            .Select(mp => new
            {
                mp.MaterialProductoID,
                mp.MaterialID,
                mp.Material!.Descripcion,
                mp.Cantidad,
                mp.PrecioCostoUnitario,
                mp.SubTotal,
                mp.Producto!.CostoTotal
            })
            .ToListAsync();

            return Ok(composicionProducto);
        }

        [HttpPost("GuardarComposicionMaterial")]
        public async Task<ActionResult<MaterialProducto>> GuardarMaterialComposicion(MaterialProducto composicion)
        {
            //VALIDAMOS QUE EXISTA PRODUCTO Y MATERIAL
            var producto = await _context.Productos
                .Where(p => p.ProductoID == composicion.ProductoID)
                .FirstOrDefaultAsync();

            var material = await _context.Materiales
                .Where(m => m.MaterialID == composicion.MaterialID)
                .FirstOrDefaultAsync();

            //OBTENEMOS EL COSTO UNITARIO DEL MATERIAL Y 
            //CALCULAMOS EL SUBTOTAL
            composicion.MaterialProductoID = 0;
            composicion.PrecioCostoUnitario = material.PrecioCosto;
            composicion.SubTotal = composicion.Cantidad * composicion.PrecioCostoUnitario;

            _context.MaterialProductos.Add(composicion);
            await _context.SaveChangesAsync();

            //RECALCULAMOS EL COSTO DE PRODUCCION DEL PRODUCTO
            var costoTotal = await _context.MaterialProductos
                .Where(mp => mp.ProductoID == composicion.ProductoID)
                .SumAsync(mp => mp.SubTotal);

            //ACTUALIZAMOS EL COSTO TOTAL DEL PRODUCTO
            producto.CostoTotal = costoTotal;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                composicion.MaterialProductoID,
                composicion.MaterialID,
                composicion.ProductoID,
                composicion.Cantidad,
                composicion.PrecioCostoUnitario,
                composicion.SubTotal,
                CostoTotalProducto = producto.CostoTotal
            }
            );
        }

        [HttpDelete("EliminarComposicionMaterial/{id}")]
        public async Task<IActionResult> EliminarMaterialComposicion(int id)
        {
            var eliminarComposicion = await _context.MaterialProductos.FindAsync(id);
            if (eliminarComposicion == null)
            {
                return NotFound();
            }

            var productoID = eliminarComposicion.ProductoID;

            _context.MaterialProductos.Remove(eliminarComposicion);
            await _context.SaveChangesAsync();

            //RECALCULAMOS EL COSTO TOTAL DESPUES DE BORRAL EL MATERIAL DEL PRODUCTO
            var producto = await _context.Productos
                .FirstOrDefaultAsync(p => p.ProductoID == productoID);
            
            if(producto != null)
            {
                var costoTotal = await _context.MaterialProductos
                    .Where(mp => mp.ProductoID == productoID)
                    .SumAsync(mp => mp.SubTotal);
                
                producto.CostoTotal = costoTotal;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        private bool ProductosExists(int id)
        {
            return _context.Productos.Any(e => e.ProductoID == id);
        }
    }
}