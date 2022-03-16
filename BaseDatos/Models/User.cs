using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaseDatos
{
    public class User
    {
        
        [Key]
        public string Username { get; set; }
        public string Password { get; set; }
        public int MiembroId { get; set; }
        public string Role { get; set; }

        public Miembro Miembro { get; set; }
       
        public override string ToString() => $"{MiembroId} => \n" +
            $"Usuario: {Username} \n" + 
            $"Contraseña: {Password} \n";
    }
}