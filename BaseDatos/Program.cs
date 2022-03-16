using System;
using static System.Console;

namespace BaseDatos
{
    class Program
    {
        static void Main(string[] args)
        {
            CrearBD();
        }

        static  void CrearBD(){
            using (var db = new EventosContext())
            {
                bool deleted = db.Database.EnsureDeleted();
                WriteLine($"Database deleted: {deleted}");
                bool created = db.Database.EnsureCreated();
                WriteLine($"Database created: {created}");
            }
        }
    }
}