using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BaseDatos
{
    public class Miembro
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Username { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
        public List<Inscripcion> Inscripcion { get; } = new List<Inscripcion>();

        public override string ToString() => $"{Id} => \n" +
            $"Miembro: {Nombre}, {Apellido} \n" + 
            $"Email: {Email} \n" + 
            $"Telefono: {Telefono} \n" +
            $"Role: {Role} \n" +
            $"Username: {Username} \n" +
            $"Password: {Password} \n";
    }
}