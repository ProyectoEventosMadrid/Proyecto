using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using ApiRest.Settings;
using BaseDatos;

namespace ApiRest.Auth
{
    public interface IAuthService
    {
        AuthResponse Authenticate(string username, string password);
        IEnumerable<Miembro> GetAll();
        Miembro GetById(int id);
    }

    public class AuthService : IAuthService
    {

        private readonly AppSettings _appSettings;
        private readonly EventosContext _context;

        public AuthService(IOptions<AppSettings> appSettings, EventosContext context)
        {
            _appSettings = appSettings.Value;
            _context = context;
        }

        public AuthResponse Authenticate(string username, string password)
        {
            var miembro = _context.Miembro.SingleOrDefault(u => u.Username == username && u.Password == password);

            // 1.- control null
            if (miembro == null) return null;
            // 2.- control db


            // autenticacion válida -> generamos jwt
            var (token, validTo) = generateJwtToken(miembro);

            // Devolvemos lo que nos interese
            return new AuthResponse
            {
                Id = miembro.Id,
                Username = miembro.Username,
                Token = token,
                ValidTo = validTo
            };

        }

        public IEnumerable<Miembro> GetAll()
        {
            return _context.Miembro;
        }

        public Miembro GetById(int id)
        {
            return _context.Miembro.FirstOrDefault(x => x.Id == id);
        }

        // internos
        private (string token, DateTime validTo) generateJwtToken(Miembro miembro)
        {
            // generamos un token válido para 1 año
            var dias = 360;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                { 
                    new Claim("id", miembro.Id.ToString()),
                    new Claim(ClaimTypes.Name, miembro.Username),
                    new Claim(ClaimTypes.Role, miembro.Role),
                }),
                Expires = DateTime.UtcNow.AddDays(dias),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return (token: tokenHandler.WriteToken(token), validTo: token.ValidTo);
        }
    }
}