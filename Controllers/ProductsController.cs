using IspitniProjekatRVAS.Models;
using IspitniProjekatRVAS.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IspitniProjekatRVAS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductsController(ProductService productService)
        {
            _productService = productService;
        }
        // GET: api/<ProductsController>
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        // GET api/<ProductsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        public async Task<IActionResult> PostProduct([FromForm] ProductCreateDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string imagePath = Path.Combine("client", "public", productDto.ImageFile.FileName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await productDto.ImageFile.CopyToAsync(stream);
            }

            var product = new Product
            {
                Title = productDto.Title,
                Price = productDto.Price,
                Description = productDto.Description,
                ImageUrl = $"{productDto.ImageFile.FileName}",
                CategoryId = productDto.CategoryID
            };

            await _productService.CreateProductAsync(product);

            return Ok();
        }

        public class ProductCreateDto
        {
            public string Title { get; set; }
            public string Description { get; set; }
            public decimal Price { get; set; }
            public int CategoryID { get; set; }
            public IFormFile ?ImageFile { get; set; }
        }

        public class ProductUpdateDto : ProductCreateDto
        {
            public int Id { get; set; }
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.GetProductAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            //Console.WriteLine(productDto.Title, productDto.Description, productDto.Price, productDto.CategoryID, productDto.ImageFile);

            // Update fields based on productDto properties
            product.Title = productDto.Title;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.CategoryId = productDto.CategoryID;

            // Handle file upload if ImageFile is provided
            if (productDto.ImageFile != null)
            {
                // Process and save the file
                var imagePath = Path.Combine("client", "public", productDto.ImageFile.FileName);
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await productDto.ImageFile.CopyToAsync(stream);
                }
                product.ImageUrl = $"/{productDto.ImageFile.FileName}";
            }

            await _productService.UpdateProductAsync(product);

            return Ok();
        }

        // DELETE api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            
            if (result)
            {
                return Ok();
            }

            return NotFound(); // 404 Not Found
        }
    }
}
