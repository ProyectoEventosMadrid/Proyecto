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
        public int UsersId { get; set; }
        public int EventoId { get; set; }

        public Users Users { get; set; }
        public Evento Evento { get; set; }

        public override string ToString() => $"{UsersId}x{EventoId}";
    }
}