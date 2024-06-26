using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using Microsoft.EntityFrameworkCore;

namespace IspitniProjekatRVAS.Services
{
    public class ReviewService
    {
        private readonly MyDbContext _context;

        public ReviewService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetAllReviewsAsync()
        {
            return await _context.Reviews.ToListAsync();
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return false;
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateReviewTitleAsync(int id, string content)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return false;
            }

            review.Content = content;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AddReviewAsync(int productId, int userId, string content, int grade)
        {
            try
            {
                var review = new Review
                {
                    ProductId = productId,
                    UserId = userId,
                    Content = content,
                    Rating = grade
                };

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
