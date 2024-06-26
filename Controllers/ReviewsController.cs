using IspitniProjekatRVAS.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IspitniProjekatRVAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {

        private readonly ReviewService _reviewService;
        private readonly UserService _userService;

        public ReviewsController(ReviewService reviewService, UserService userService)
        {
            _reviewService = reviewService;
            _userService = userService;
        }
        // GET: api/<ReviewController>
        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            return Ok(reviews);
        }

        // GET api/<ReviewController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/reviews
        [HttpPost]
        public async Task<IActionResult> AddReview([FromBody] AddReviewDTO reviewDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = await _userService.GetUserIdByUsernameAsync(reviewDTO.Username);
                if (!userId.HasValue)
                {
                    return BadRequest($"User with username '{reviewDTO.Username}' not found.");
                }

                var result = await _reviewService.AddReviewAsync(reviewDTO.ProductId, userId.Value, reviewDTO.Content, reviewDTO.Grade);

                if (result)
                {
                    return Ok();
                }

                return BadRequest("Failed to add review.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Helper method to get current user ID
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                throw new ApplicationException("User ID not found or invalid.");
            }

            return userId;
        }

        public class AddReviewDTO
        {
            public string Content { get; set; }
            public int Grade { get; set; }
            public int ProductId { get; set; }
            public string Username { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateReviewDTO updateReview)
        {
            if (string.IsNullOrWhiteSpace(updateReview.Content))
            {
                return BadRequest("Title is required.");
            }

            var result = await _reviewService.UpdateReviewTitleAsync(id, updateReview.Content);

            if (result)
            {
                return Ok();
            }

            return NotFound();
        }

        public class UpdateReviewDTO
        {
            public string Content { get; set; }
        }

        // DELETE api/reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _reviewService.DeleteReviewAsync(id);

            if (result)
            {
                return Ok();
            }

            return NotFound(); // 404 Not Found
        }
    }
}
