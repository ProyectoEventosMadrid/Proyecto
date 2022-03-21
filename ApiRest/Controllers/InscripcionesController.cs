using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BaseDatos;
using ApiRest.Data;

namespace ApiRest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InscripcionesController : ControllerBase
    {
        private readonly EventsContext _context;

        public InscripcionesController(EventsContext context)
        {
            _context = context;
        }

        // GET: api/Inscripciones
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet]
        public async Task<ActionResult> GetInscripciones()
        {
            var inscripcion = await _context.Inscripcion.Select(b => new
            {
                Id = b.Id,
                UsersId = b.UsersId,
                EventoId = b.EventoId
            }).ToListAsync();

            return Ok(inscripcion);
        }

        // GET: api/Inscripciones/5
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet("{id}")]
        public async Task<ActionResult> GetInscripcion(int id)
        {
            var inscripcion = await _context.Inscripcion.Select(o => new
            {
                Id = o.Id,
                UsersId = o.UsersId,
                EventoId = o.EventoId
            }).ToListAsync();

            if (inscripcion == null)
            {
                return NotFound();
            }

            return Ok(inscripcion);
        }

        // POST: api/Inscripciones/User/1/Evento/7202895
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpPost("User/{usersId}/Evento/{eventoId}")]
        public async Task<ActionResult> PostInscripcion(int usersId, int eventoId)
        {
            var inscripcion = new Inscripcion
            {
                UsersId = usersId,
                EventoId = eventoId
            };
            _context.Inscripcion.Add(inscripcion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInscripcion", new { id = inscripcion.Id }, inscripcion);
        }

        // DELETE: api/Inscripciones/5
        [Autohorrize] //<-- Error Atrrrributrrro
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
