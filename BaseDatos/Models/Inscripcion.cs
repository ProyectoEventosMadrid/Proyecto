using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaseDatos
{
    public class Inscripcion
    {
        [Key]
        public int Id { get; set; }
        public int MiembroId { get; set; }
        public int EventoId { get; set; }

        public Miembro Miembro { get; set; }
        public Evento Evento { get; set; }

        public override string ToString() => $"{MiembroId}x{EventoId}";
    }
}