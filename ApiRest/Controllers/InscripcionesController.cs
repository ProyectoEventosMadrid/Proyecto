using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BaseDatos;

namespace ApiRest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InscripcionesController : ControllerBase
    {
        private readonly EventosContext _context;

        public InscripcionesController(EventosContext context)
        {
            _context = context;
        }

        // GET: api/Inscripciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inscripcion>>> GetInscripcion()
        {
            return await _context.Inscripcion.ToListAsync();
        }

        // GET: api/Inscripciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Inscripcion>> GetInscripcion(int id)
        {
            var inscripcion = await _context.Inscripcion.FindAsync(id);

            if (inscripcion == null)
            {
                return NotFound();
            }

            return inscripcion;
        }

        // PUT: api/Inscripciones/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInscripcion(int id, Inscripcion inscripcion)
        {
            if (id != inscripcion.Id)
            {
                return BadRequest();
            }

            _context.Entry(inscripcion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InscripcionExists(id))
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

        // POST: api/Inscripciones
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Inscripcion>> PostInscripcion(Inscripcion inscripcion)
        {
            _context.Inscripcion.Add(inscripcion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInscripcion", new { id = inscripcion.Id }, inscripcion);
        }

        // DELETE: api/Inscripciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInscripcion(int id)
        {
            var inscripcion = await _context.Inscripcion.FindAsync(id);
            if (inscripcion == null)
            {
                return NotFound();
            }

            _context.Inscripcion.Remove(inscripcion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InscripcionExists(int id)
        {
            return _context.Inscripcion.Any(e => e.Id == id);
        }
    }
}
