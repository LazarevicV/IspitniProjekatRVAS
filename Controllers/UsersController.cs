using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using IspitniProjekatRVAS.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IspitniProjekatRVAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly UserService _userService;

        public UsersController(MyDbContext context, UserService userService)
        {
            _context = context;
            _userService = userService;
        }
        // GET: api/<UsersController>
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            var korisnici = _context.Users.ToList();
            return Ok(korisnici);
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        [HttpPost]
        public async Task<ActionResult<User>> Post([FromBody] UserCreateDTO userDto)
        {
            if (await _userService.UsernameExistsAsync(userDto.username))
            {
                return BadRequest("Username already exists.");
            }

            var createdUser = await _userService.CreateUserAsync(userDto);
            if (createdUser == null)
            {
                return BadRequest();
            }
            return Ok();
        }

        public class UserUpdateDTO
        {
            public string username { get; set; }
            public string password { get; set; }
            public string role { get; set; }
        }

        public class UserCreateDTO
        {
            public string username { get; set; }
            public string password { get; set; }

            public string role { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UserUpdateDTO userDto)
        {
            if (id == 0 || userDto == null)
            {
                return BadRequest();
            }

            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Ensure username uniqueness
            if (user.Username != userDto.username && await _userService.UsernameExistsAsync(userDto.username))
            {
                return BadRequest("Username already exists.");
            }

            var updatedUser = await _userService.UpdateUserAsync(id, userDto);
            if (updatedUser == null)
            {
                return BadRequest();
            }

            return Ok(updatedUser);
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var currentUser = await _userService.GetUserByUsernameAsync(User.Identity.Name);
            if (currentUser != null && currentUser.Id == id)
            {
                return BadRequest("You cannot delete yourself.");
            }

            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
