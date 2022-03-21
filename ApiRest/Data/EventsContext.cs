using Microsoft.EntityFrameworkCore;
using BaseDatos;

namespace ApiRest.Data
{
    public class EventsContext : DbContext
    {
        public EventsContext(DbContextOptions<EventsContext> options)
            : base(options)
        {
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Inscripcion> Inscripcion { get; set; }
        public DbSet<Evento> Evento { get; set; }
    }
}