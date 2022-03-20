using Microsoft.EntityFrameworkCore;
using BaseDatos;

namespace ApiRest.Data
{
    public class EventosContext : DbContext
    {
        public EventosContext(DbContextOptions<EventosContext> options)
            : base(options)
        {
        }

        public DbSet<Miembro> Miembro { get; set; }
        public DbSet<Inscripcion> Inscripcion { get; set; }
        public DbSet<Evento> Evento { get; set; }
    }
}