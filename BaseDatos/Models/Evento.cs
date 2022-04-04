using System;
using System.Collections.Generic; 
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaseDatos
{
    public class Evento
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Link { get; set; }
        public string Organizacion { get; set; }
        public string Postal { get; set; }
        public string Direccion { get; set; }
        public float Latitud { get; set; }
        public float Longitud { get; set; }

        public List<Inscripcion> Inscripcion { get; } = new List<Inscripcion>();
        

        public override string ToString() => $"{Id} => \n" +
            $"Titulo: {Titulo} \n" + 
            $"Descripcion: {Descripcion} \n" + 
            $"FechaInicio: {FechaInicio} \n" +
            $"FechaFin: {FechaFin} \n" + 
            $"Link: {Link} \n" + 
            $"Organizacion: {Organizacion} \n" + 
            $"CodigoPostal: {Postal} \n" + 
            $"Direccion: {Direccion} \n" + 
            $"Latitud: {Latitud} \n" + 
            $"Longitud: {Longitud} \n";
    }
}