using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using Microsoft.EntityFrameworkCore;

namespace IspitniProjekatRVAS.Services
{
    public class CategoryService
    {
        private readonly MyDbContext _context;

        public CategoryService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return false;
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task CreateCategoryAsync(string title)
        {
            var category = new Category { Title = title };

            _context.Categories.Add(category); // Assuming Categories DbSet exists in ApplicationDbContext
            await _context.SaveChangesAsync();  
        }

        public async Task<bool> UpdateCategoryTitleAsync(int id, string title)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return false;
            }

            category.Title = title;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
