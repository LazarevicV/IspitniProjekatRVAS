using IspitniProjekatRVAS.Data;
using IspitniProjekatRVAS.Models;
using IspitniProjekatRVAS.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IspitniProjekatRVAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        // GET: api/<CategoryController>
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Categories
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CategoryInsertDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _categoryService.CreateCategoryAsync(model.Title);

            return Ok();
        }

        public class CategoryInsertDTO
        {
            public string Title { get; set; }
        }

        // PUT api/Categories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateCategoryDTO updateCategory)
        {
            if (string.IsNullOrWhiteSpace(updateCategory.Title))
            {
                return BadRequest("Title is required.");
            }

            var result = await _categoryService.UpdateCategoryTitleAsync(id, updateCategory.Title);

            if (result)
            {
                return Ok();
            }

            return NotFound();
        }

        public class UpdateCategoryDTO
        {
            public string Title { get; set; }
        }

        // DELETE api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            
            if (result)
            {
                return Ok();
            }

            return NotFound(); // 404 Not Found
        }
    }
}
