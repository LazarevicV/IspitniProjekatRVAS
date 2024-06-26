using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using Microsoft.EntityFrameworkCore;
using static IspitniProjekatRVAS.Controllers.UsersController;

namespace IspitniProjekatRVAS.Services
{
    public class UserService
    {
        private readonly MyDbContext _context;

        public UserService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<int?> GetUserIdByUsernameAsync(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            return user?.Id;
        }

        public async Task<User> CreateUserAsync(UserCreateDTO userDto)
        {
            // Generate salt and hash the password
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.password, salt);

            var user = new User
            {
                Username = userDto.username,
                Role = userDto.role,
                PasswordHash = passwordHash,
                PasswordSalt = salt
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> UpdateUserAsync(int id, UserUpdateDTO userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            // Update username
            if (!string.IsNullOrEmpty(userDto.username))
            {
                user.Username = userDto.username;
            }

            // Update password if provided
            if (!string.IsNullOrEmpty(userDto.password))
            {
                // Generate salt and hash the password
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.password, salt);

                user.PasswordSalt = salt;
                user.PasswordHash = passwordHash;
            }

            // Update role if provided
            if (!string.IsNullOrEmpty(userDto.role))
            {
                user.Role = userDto.role;
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
