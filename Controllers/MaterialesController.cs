using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIMateriales2026GiaroliValentin.Models
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialesController : ControllerBase
    {
        private readonly APIMaterialesContext _context;

        public MaterialesController(APIMaterialesContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Material>>> GetMaterial()
        {
            var rubrosMaterial = await _context.Materiales
                .Select(m => new
                {
                    m.MaterialID,
                    m.Descripcion,
                    m.PrecioCosto,
                    m.RubroID,
                    m.Eliminado,
                    RubroDescripcion = m.Rubro.Descripcion
                })
                .ToListAsync();

            return Ok(rubrosMaterial);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Material>> GetMaterial(int id)
        {
            var materiales = await _context.Materiales.FindAsync(id);

            if (materiales == null)
            {
                return NotFound();
            }

            return materiales;
        }


        [HttpPost]
        public async Task<ActionResult<Material>> PostMaterial(Material material)
        {
            if (string.IsNullOrWhiteSpace(material.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida." });
            }

            if (material.PrecioCosto <= 0)
            {
                return BadRequest(new { message = "El precio costo debe ser mayor a 0." });
            }

            if (material.RubroID <= 0)
            {
                return BadRequest(new { message = "Debe seleccionar un rubro." });
            }

            _context.Materiales.Add(material);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaterial", new { id = material.MaterialID }, material);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutMaterial(int id, Material material)
        {
            if (id != material.MaterialID)
            {
                return BadRequest(new { message = "El ID no coincide." });
            }

            if (string.IsNullOrWhiteSpace(material.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida." });
            }

            if (material.PrecioCosto <= 0)
            {
                return BadRequest(new { message = "El precio costo debe ser mayor a 0." });
            }

            if (material.RubroID <= 0)
            {
                return BadRequest(new { message = "Debe seleccionar un rubro." });
            }

            _context.Entry(material).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaterialExists(id))
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
        public async Task<IActionResult> DeleteMaterial(int id)
        {
            var material = await _context.Materiales.FindAsync(id);

            if (material == null)
            {
                return NotFound();
            }

            _context.Materiales.Remove(material);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaterialExists(int id)
        {
            return _context.Materiales.Any(e => e.MaterialID == id);
        }
    }
}