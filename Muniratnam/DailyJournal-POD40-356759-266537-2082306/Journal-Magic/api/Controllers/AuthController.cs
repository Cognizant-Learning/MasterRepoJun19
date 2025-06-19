using JournalMagic.Models;
using JournalMagic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JournalMagic.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest request)
        {
            var response = await _authService.Authenticate(request);
            
            if (response == null)
                return Unauthorized(new { message = "Invalid username or password" });
            
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _authService.Register(request);
            
            if (response == null)
                return BadRequest(new { message = "User with this email already exists" });
            
            return Ok(response);
        }

        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });
            
            // In a real implementation, we'd validate and refresh the token
            // For this example, we'll just return success
            return Ok(new { message = "Token refreshed" });
        }
    }
}
