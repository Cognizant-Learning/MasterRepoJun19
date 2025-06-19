using JournalMagic.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace JournalMagic.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly DataService _dataService;

        public AuthService(IConfiguration configuration, DataService dataService)
        {
            _configuration = configuration;
            _dataService = dataService;
        }

        public async Task<AuthResponse?> Authenticate(AuthRequest request)
        {
            var user = _dataService.Users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null)
                return null;

            // Verify password
            if (!VerifyPasswordHash(request.Password, user.PasswordHash))
                return null;

            // Update last login time
            user.LastLogin = DateTime.UtcNow;

            // Generate token
            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddDays(7);

            return new AuthResponse
            {
                User = user,
                Token = token,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponse?> Register(RegisterRequest request)
        {
            // Check if user already exists
            if (_dataService.Users.Any(u => u.Email.ToLower() == request.Email.ToLower()))
                return null;
            
            // Create new user
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow
            };

            // Add user to database
            _dataService.Users.Add(user);

            // Generate token
            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddDays(7);

            return new AuthResponse
            {
                User = user,
                Token = token,
                ExpiresAt = expiresAt
            };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? "JournalMagicDefaultSecretKey123!@#");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.GivenName, user.FirstName),
                    new Claim(ClaimTypes.Surname, user.LastName)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == storedHash;
        }
    }
}
