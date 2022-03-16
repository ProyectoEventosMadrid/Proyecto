using System;
using System.Net.Http;
using System.Net.Http.Headers;
using NW = Newtonsoft.Json;
using System.Collections.Generic;
using BaseDatos;

using System.Linq;
using static System.Console;
using System.Threading.Tasks;

namespace HTTPClient
{
    class Program
    {
        static HttpClient client = new HttpClient();
        static List<Evento> Eventos = new List<Evento>();
        static async Task Main(string[] args)
        {
            try
            {
                // Setting api
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Program
                var counter = 0;
                var max = args.Length != 0 ? Convert.ToInt32(args[0]) : -1;

                while (max == -1 || counter < max)
                {
                    await Run();

                    counter++;
                    await Task.Delay(50000);
                }
            }
            catch (Exception e)
            {
                WriteLine($"Main: {e.Message}");
            }
        }

        // Run
        static async Task Run()
        {
            try
            {
                WriteLine("Empezamos");

                // Get eventos actividades
                WriteLine("Get de actividades");
                await GetActividades();

                // Get eventos deportivos
                WriteLine("Get de eventos deportivos");
                await GetDeportivos();

                if (TablaVacia()) // Si la tabla esta vacia, rellenamos
                {
                    foreach (var item in Eventos)
                    {
                        RellenarTabla(item);
                    }
                } else { // Si la tabla no esta vacia, actualizamos
                    foreach (var item in Eventos)
                    {
                        ActualizarTabla(item);
                    }
                }
            }
            catch (Exception e)
            {
                WriteLine($"Run: {e.Message}");
            }

            WriteLine("Finalizamos");
        }

        // Get eventos actividades
        static async Task GetActividades()
        {
            try
            {
                HttpResponseMessage response = await client.GetAsync("https://datos.madrid.es/egob/catalogo/300107-0-agenda-actividades-eventos.json");
                response.EnsureSuccessStatusCode();
                var resp = await response.Content.ReadAsStringAsync();

                dynamic json = NW.JsonConvert.DeserializeObject(resp);

                foreach (var item in json["@graph"])
                {
                    var datos = new Evento {
                        Id = Int32.Parse($"{item.id}"),
                        Titulo = $"{item.title}",
                        Descripcion = $"{item.description}",
                        FechaInicio = DateTime.Parse($"{item.dtstart}"),
                        FechaFin = DateTime.Parse($"{item.dtend}"),
                        Link = $"{item.link}",
                        Organizacion = $"{item["event-location"]}",
                        CodigoPostal = $"{item.address.area["postal-code"]}",
                        Direccion = $"{item.address.area["street-address"]}",
                        Latitud = $"{item.location.latitude}",
                        Longitud = $"{item.location.longitude}"
                    };

                    Eventos.Add(datos);
                }
            }
            catch (Exception e)
            {
                WriteLine($"GetActividades: {e.Message}");
            }
        }

        // Get eventos deportivos
        static async Task GetDeportivos()
        {
            try
            {
                HttpResponseMessage response = await client.GetAsync("https://datos.madrid.es/egob/catalogo/212504-0-agenda-actividades-deportes.json");
                response.EnsureSuccessStatusCode();
                var resp = await response.Content.ReadAsStringAsync();

                dynamic json = NW.JsonConvert.DeserializeObject(resp);
                
                foreach (var item in json["@graph"])
                {
                    if (item != null) {
                        var datos = new Evento {
                            Id = Int32.Parse($"{item.id}"),
                            Titulo = $"{item.title}",
                            Descripcion = $"{item.description}",
                            FechaInicio = DateTime.Parse($"{item.dtstart}"),
                            FechaFin = DateTime.Parse($"{item.dtend}"),
                            Link = $"{item.link}",
                            Organizacion = $"{item["event-location"]}",
                            CodigoPostal = $"{item.address.area["postal-code"]}",
                            Direccion = $"{item.address.area["street-address"]}",
                            Latitud = $"{item.location.latitude}",
                            Longitud = $"{item.location.longitude}"
                        };

                        Eventos.Add(datos);
                    }
                }
            }
            catch (Exception e)
            {
                WriteLine($"GetDeportivos: {e.Message}");
            }
        }

        // Rellenar la tabla evento
        static void RellenarTabla(Evento evento)
        {
            try
            {
                using (var db = new EventosContext())
                {
                    db.Evento.Add(evento);
                    db.SaveChanges();
                }
            }
            catch (System.Exception e)
            {
                WriteLine($"RellenarTabla {evento.Id}: {e.Message}");
            }
        }

        // Actualizar los datos de la tabla evento
        static void ActualizarTabla(Evento evento)
        {
            try
            {
                using (var db = new EventosContext())
                {
                    var query = db.Evento.Single(c => c.Id == evento.Id);

                        query.Id = evento.Id;
                        query.Titulo = evento.Titulo;
                        query.Descripcion = evento.Descripcion;
                        query.FechaInicio = evento.FechaInicio;
                        query.FechaFin = evento.FechaFin;
                        query.Link = evento.Link;
                        query.Organizacion = evento.Organizacion;
                        query.CodigoPostal = evento.CodigoPostal;
                        query.Direccion = evento.Direccion;
                        query.Latitud = evento.Latitud;
                        query.Longitud = evento.Longitud;

                    db.SaveChanges();
                }
            }
            catch (System.Exception e)
            {
                WriteLine($"ActualizarTabla {evento.Id}: {e.Message}");
            }
        }

        // Actualizar tabla de eventos
        static void BorrarEventosPasados()
        {
            try
            {
                using (var db = new EventosContext())
                {
                    var FechaActual = DateTime.Now;
      
                    foreach (var evento in db.Evento)
                    {
                        var FechaFin = evento.FechaFin;

                        if(FechaFin < FechaActual) {
                            Console.WriteLine($"{FechaFin} < {FechaActual}");
                        }
                    }

                    db.SaveChanges();
                }
            }
            catch (System.Exception e)
            {
                WriteLine($"BorrarEventosPasados: {e.Message}");
            }
        }

        // Comprobar si la tabla tiene datos o no
        static bool TablaVacia()
        {
            try
            {
                using (var db = new EventosContext())
                {
                    return db.Evento.Count() == 0;
                }
            }
            catch (System.Exception e)
            {
                WriteLine($"TablaVacia: {e.Message}");
                return true;
            }
        }
    }
}
