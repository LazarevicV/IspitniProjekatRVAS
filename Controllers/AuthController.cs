using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using IspitniProjekatRVAS.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IspitniProjekatRVAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;

        public AuthController(MyDbContext context, IConfiguration configuration, UserService userService)
        {
            _context = context;
            _configuration = configuration;
            _userService = userService;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role) // Add role claim
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            if (await _userService.UsernameExistsAsync(request.username))
            {
                return BadRequest("Username already exists");
            }

            // Generate salt and hash the password
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.password, salt);

            var user = new User
            {
                Username = request.username,
                Role = "user",
                PasswordHash = passwordHash,
                PasswordSalt = salt
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var jwt = GenerateJwtToken(user);

            return Ok(new { jwt });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.password, user.PasswordHash))
            {
                return BadRequest("Invalid credentials");
            }

            // Generate JWT token
            var jwt = GenerateJwtToken(user);

            return Ok(new { jwt });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var username = HttpContext.User.Identity?.Name;
                var role = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

                return Ok(new
                {
                    Username = username,
                    Role = role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        public class UserDto
        {
            public string username { get; set; }
            public string password { get; set; }
        }
    }
}
