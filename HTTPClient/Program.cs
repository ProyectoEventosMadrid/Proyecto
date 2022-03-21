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
                    // Inicializar
                    Eventos.Clear();

                    // Proceso
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

                // Introducir/actualizar datos en la tabla eventos
                WriteLine("Introducir/actualizar datos en la tabla eventos");
                foreach (var item in Eventos)
                {
                    TablaEventos(item);
                }

                // Borrar los eventos que ya han sucedido
                WriteLine("Borrar eventos pasados");
                BorrarEventos();
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
                    var FechaActual = DateTime.Today;
                    var Resultado = DateTime.Compare(FechaActual, DateTime.Parse($"{item.dtend}"));

                    if (!($"{item["event-location"]}").Equals("") && Resultado < 0) 
                    {
                        var evento = new Evento {
                            Id = Int32.Parse($"{item.id}"),
                            Titulo = $"{item.title}",
                            Descripcion = $"{item.description}",
                            FechaInicio = DateTime.Parse($"{item.dtstart}"),
                            FechaFin = DateTime.Parse($"{item.dtend}"),
                            Link = $"{item.link}",
                            Organizacion = $"{item["event-location"]}",
                            Postal = Int32.Parse($"{item.address.area["postal-code"]}"),
                            Direccion = $"{item.address.area["street-address"]}",
                            Latitud = float.Parse($"{item.location.latitude}"),
                            Longitud = float.Parse($"{item.location.longitude}")
                        };

                        Eventos.Add(evento);
                    }
                }
            }
            catch (Exception e)
            {
                WriteLine($"GetActividades: {e.Message}");
            }
        }

        // Rellenar/actualizar la tabla evento
        static void TablaEventos(Evento evento)
        {
            try
            {
                using (var db = new EventosContext())
                {
                    if(!ExisteEvento(evento))
                    {
                        Console.WriteLine($"Insertar evento: {evento.Id}");
                        db.Evento.Add(evento);
                        db.SaveChanges();
                    }
                    else 
                    {
                        Console.WriteLine($"Actualizar evento: {evento.Id}");
                        var query = db.Evento.Single(c => c.Id == evento.Id);

                        query.Id = evento.Id;
                        query.Titulo = evento.Titulo;
                        query.Descripcion = evento.Descripcion;
                        query.FechaInicio = evento.FechaInicio;
                        query.FechaFin = evento.FechaFin;
                        query.Link = evento.Link;
                        query.Organizacion = evento.Organizacion;
                        query.Postal = evento.Postal;
                        query.Direccion = evento.Direccion;
                        query.Latitud = evento.Latitud;
                        query.Longitud = evento.Longitud;

                        db.SaveChanges();
                    }

                }
            }
            catch (System.Exception e)
            {
                WriteLine($"TablaEventos {evento.Id}: {e.Message}");
            }
        }

        // Comprobar si la tabla tiene un evento concreto o no
        static bool ExisteEvento(Evento evento)
        {
            try
            {
                using (var db = new EventosContext())
                {
                    return db.Evento.Any(x => x.Id == evento.Id);;
                }
            }
            catch (System.Exception e)
            {
                WriteLine($"ExisteEvento: {e.Message}");
                return false;
            }
        }

        // Borrar los eventos que ya han sucecido
        static void BorrarEventos()
        {
            try
            {
                using (var db = new EventosContext())
                {
                    var FechaActual = DateTime.Today;
                    var eventosPasados = db.Evento.Where(x => x.FechaFin <= FechaActual).ToList();
                    db.Evento.RemoveRange(eventosPasados);

                    db.SaveChanges();
                }
            }
            catch (System.Exception e)
            {
                WriteLine($"BorrarEventos: {e.Message}");
            }
        }
    }
}
