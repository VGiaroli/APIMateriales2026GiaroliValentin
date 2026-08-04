using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIMateriales2026GiaroliValentin.Models
{
    [ApiController]
    [Route("api/[controller]")]
    public class RubrosController : ControllerBase
    {
        private readonly APIMaterialesContext _context;

        public RubrosController(APIMaterialesContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rubro>>> GetRubro()
        {
            return await _context.Rubros.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Rubro>> GetRubro(int id)
        {
            var rubros = await _context.Rubros.FindAsync(id);

            if (rubros == null)
            {
                return NotFound();
            }

            return rubros;
        }

        [HttpPost]
        public async Task<ActionResult<Rubro>> PostRubro(Rubro rubro)
        {

            if (string.IsNullOrWhiteSpace(rubro.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida." });
            }

            _context.Rubros.Add(rubro);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRubro", new { id = rubro.RubroID }, rubro);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutRubro(int id, Rubro rubro)
        {
            if (id != rubro.RubroID)
            {
                return BadRequest(new { message = "El ID no coincide." });
            }

            if (string.IsNullOrWhiteSpace(rubro.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida." });
            }

            _context.Entry(rubro).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RubroExists(id))
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
        public async Task<IActionResult> DeleteRubro(int id)
        {
            var rubro = await _context.Rubros.FindAsync(id);

            if (rubro == null)
            {
                return NotFound();
            }

            _context.Rubros.Remove(rubro);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool RubroExists(int id)
        {
            return _context.Rubros.Any(e => e.RubroID == id);
        }
    }
}