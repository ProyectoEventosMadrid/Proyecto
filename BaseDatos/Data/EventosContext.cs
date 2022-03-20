using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;

namespace BaseDatos
{
    public class EventosContext : DbContext
    {
        public DbSet<Evento> Evento { get; set; }
        public DbSet<Inscripcion> Inscripcion { get; set; }
        public DbSet<Miembro> Miembro { get; set; }

        public string connString { get; private set; }

        public EventosContext()
        {
            string BDAlumno = "DB_EVENTOS_MADRID";
            connString = $"Server=185.60.40.210\\SQLEXPRESS,58015;Database={BDAlumno};User Id=sa;Password=Pa88word;MultipleActiveResultSets=true;";
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlServer(connString);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Inscripcion>().HasIndex(m => new
            {
                m.MiembroId,
                m.EventoId
            }).IsUnique();
        }
    }
}