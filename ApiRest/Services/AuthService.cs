using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using ApiRest.Settings;
using ApiRest.Data;
using BaseDatos;

namespace ApiRest.Auth
{
    public interface IAuthService
    {
        AuthResponse Authenticate(string username, string password);
        IEnumerable<Users> GetAll();
        Users GetById(int id);
    }

    public class AuthService : IAuthService
    {

        private readonly AppSettings _appSettings;
        private readonly EventsContext _context;

        public AuthService(IOptions<AppSettings> appSettings, EventsContext context)
        {
            _appSettings = appSettings.Value;
            _context = context;
        }

        public AuthResponse Authenticate(string username, string password)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == username && u.Password == password);

            // 1.- control null
            if (user == null) return null;
            // 2.- control db


            // autenticacion válida -> generamos jwt
            var (token, validTo) = generateJwtToken(user);

            // Devolvemos lo que nos interese
            return new AuthResponse
            {
                Id = user.Id,
                Username = user.Username,
                Token = token,
                ValidTo = validTo
            };

        }

        public IEnumerable<Users> GetAll()
        {
            return _context.Users;
        }

        public Users GetById(int id)
        {
            return _context.Users.FirstOrDefault(x => x.Id == id);
        }

        // internos
        private (string token, DateTime validTo) generateJwtToken(Users user)
        {
            // generamos un token válido para 1 año
            var dias = 360;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                { 
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
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