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
    public class EventosController : ControllerBase
    {
        private readonly EventsContext _context;

        public EventosController(EventsContext context)
        {
            _context = context;
        }

        // GET: api/Eventos
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet]
        public async Task<ActionResult> GetEvento()
        {
            var evento = await _context.Evento.Select(b => new
            {
                Id = b.Id,
                Titulo = b.Titulo,
                Descripcion = b.Descripcion,
                FechaInicio = b.FechaInicio,
                FechaFin = b.FechaFin,
                Link = b.Link,
                Organizacion = b.Organizacion,
                Postal = b.Postal,
                Direccion = b.Direccion,
                Latitud = b.Latitud,
                Longitud = b.Longitud
            }).ToListAsync();

            return Ok(evento);
        }

        // GET: api/Eventos/7644875
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet("{id}")]
        public async Task<ActionResult> GetEvento(int id)
        {
            var evento = await _context.Evento.Where(o => o.Id == id).Select(b => new
            {
                Id = b.Id,
                Titulo = b.Titulo,
                Descripcion = b.Descripcion,
                FechaInicio = b.FechaInicio,
                FechaFin = b.FechaFin,
                Link = b.Link,
                Organizacion = b.Organizacion,
                Postal = b.Postal,
                Direccion = b.Direccion,
                Latitud = b.Latitud,
                Longitud = b.Longitud
            }).ToListAsync();

            if (evento == null)
            {
                return NotFound();
            }

            return Ok(evento);
        }

        // GET: api/Eventos/Centros
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet("Centros")]
        public async Task<ActionResult> GetCentros()
        {
            var evento = await _context.Evento.GroupBy(o => o.Organizacion).Select(g => new
            {
                Organizacion = g.Key,
            }).ToListAsync();

            return Ok(evento);
        }

        // GET: api/Eventos/Centros/Centro Cultural Nicolás Salmerón (Chamartín)
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet("Centros/{centro}")]
        public async Task<ActionResult> GetCentros(string centro)
        {
            var evento = await _context.Evento.Where(l => l.Organizacion == centro).Select(b => new
            {
                Id = b.Id,
                Titulo = b.Titulo,
                Descripcion = b.Descripcion,
                FechaInicio = b.FechaInicio,
                FechaFin = b.FechaFin,
                Link = b.Link,
                Organizacion = b.Organizacion,
                Postal = b.Postal,
                Direccion = b.Direccion,
                Latitud = b.Latitud,
                Longitud = b.Longitud
            }).ToListAsync();

            if (evento == null)
            {
                return NotFound();
            }

            return Ok(evento);
        }

        // GET: api/Eventos/Centros/Centro Cultural Nicolás Salmerón (Chamartín)/FechaInicio/2022-03-21
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet("Centros/{centro}/FechaInicio/{fInicio}")]
        public async Task<ActionResult> GetCentrosFechas(string centro, DateTime fInicio)
        {
            TimeSpan tTiempo = new TimeSpan(23, 59, 59);
            DateTime fFinInicio = fInicio.Add(tTiempo);

            var evento = await _context.Evento.Where(l => l.Organizacion == centro && l.FechaInicio <= fFinInicio && l.FechaInicio >= fInicio).Select(b => new
            {
                Id = b.Id,
                Titulo = b.Titulo,
                Descripcion = b.Descripcion,
                FechaInicio = b.FechaInicio,
                FechaFin = b.FechaFin,
                Link = b.Link,
                Organizacion = b.Organizacion,
                Postal = b.Postal,
                Direccion = b.Direccion,
                Latitud = b.Latitud,
                Longitud = b.Longitud
            }).ToListAsync();

            if (evento == null)
            {
                return NotFound();
            }

            return Ok(evento);
        }

        // GET: api/Eventos/FechaInicio/2022-03-21
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet("FechaInicio/{fInicio}")]
        public async Task<ActionResult> GetFechaInicio(DateTime fInicio)
        {
            TimeSpan tTiempo = new TimeSpan(23, 59, 59);
            DateTime fFinInicio = fInicio.Add(tTiempo);

            var evento = await _context.Evento.Where(l => l.FechaInicio <= fFinInicio && l.FechaInicio >= fInicio).Select(b => new
            {
                Id = b.Id,
                Titulo = b.Titulo,
                Descripcion = b.Descripcion,
                FechaInicio = b.FechaInicio,
                FechaFin = b.FechaFin,
                Link = b.Link,
                Organizacion = b.Organizacion,
                Postal = b.Postal,
                Direccion = b.Direccion,
                Latitud = b.Latitud,
                Longitud = b.Longitud
            }).ToListAsync();

            if (evento == null)
            {
                return NotFound();
            }

            return Ok(evento);
        }
    }
}
