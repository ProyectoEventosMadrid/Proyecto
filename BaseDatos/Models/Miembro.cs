using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaseDatos
{
    public class Miembro
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }

        public List<User> User { get; } = new List<User>();
        public List<Inscripcion> Inscripcion { get; } = new List<Inscripcion>();

        public override string ToString() => $"{Id} => \n" +
            $"Miembro: {Nombre}, {Apellido1} {Apellido2} \n" + 
            $"Email: {Email} \n" + 
            $"Telefono: {Telefono} \n";
    }
}