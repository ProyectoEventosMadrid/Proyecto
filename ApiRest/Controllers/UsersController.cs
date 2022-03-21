using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; //[AllowAnonymous]
using ApiRest.Auth;
using BaseDatos;
using ApiRest.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ApiRest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IAuthService _userService;
        private readonly EventsContext _context;

        public UsersController(IAuthService userService, EventsContext context)
        {
            _userService = userService;
            _context = context;
        }

        // POST: api/Users/authenticate/username/yaiza/password/1234
        // Obtener informacion de un usuario en especifico
        [AllowAnonymous]
        [HttpPost("authenticate/username/{username}/password/{password}")]
        public IActionResult Authenticate(string username, string password)
        {
            var response = _userService.Authenticate(username, password);

            if (response == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(response);
        }

        // GET: api/Users
        // Obtener la informacion general de todos los usuarios
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }

        // POST: api/Users/Nombre/Yasmin/Apellido/Neres/Role/Admin/Email/ikbed@plaiaundi.net/Telefono/123456789/Username/yasminneres/Password/1234
        // Obtener informacion de un usuario en especifico
        [AllowAnonymous]
        [HttpPost("Nombre/{nombre}/Apellido/{apellido}/Role/{role}/Email/{email}/Telefono/{telefono}/Username/{username}/Password/{password}")]
        public async Task<ActionResult> PostUsers(string nombre, string apellido, string role, string email, string telefono, string username, string password)
        {
            var user = new Users
            {
                Nombre = nombre,
                Apellido = apellido,
                Role = role,
                Email = email,
                Telefono = telefono,
                Username = username,
                Password = password
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAll", new { id = user.Id }, user);
        }

        // PUT: api/Eventos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvento(int id, Users user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Inscripciones/5
        [Autohorrize] //<-- Error Atrrrributrrro
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsers(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
