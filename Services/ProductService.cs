using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using Microsoft.EntityFrameworkCore;

namespace IspitniProjekatRVAS.Services
{
    public class ProductService
    {
        private readonly MyDbContext _context;

        public ProductService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }
    }
}
