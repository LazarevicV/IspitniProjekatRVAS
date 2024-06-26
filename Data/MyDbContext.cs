using IspitniProjekatRVAS.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace IspitniProjekatRVAS.Data
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
            // Ensure the database is created
            Database.EnsureCreated();

            // Seed data if necessary
            SeedData();
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Review> Reviews { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            // Optionally, if you want cascading delete behavior:
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>();
        }

        public void SeedData()
        {
            // Check if data already exists
            if (Users.Any() || Categories.Any() || Products.Any() || Reviews.Any())
            {
                return; // Data already seeded
            }

            // Seed Categories
            var categories = new[]
            {
        new Category { Title = "Voce" },
        new Category { Title = "Povrce" },
        new Category { Title = "Elektronski uredjaji" }
    };
            Categories.AddRange(categories);
            SaveChanges();

            // Seed Users
            var adminSalt = GenerateSalt();
            var adminHash = ComputeHash("pass123", adminSalt);
            var userSalt = GenerateSalt();
            var userHash = ComputeHash("user", userSalt);
            var users = new[]
            {
                new User { Username = "vlazarevic", Role = "admin", PasswordHash = adminHash, PasswordSalt = adminSalt },
                new User { Username = "user", Role = "user", PasswordHash = userHash, PasswordSalt = userSalt }
            };
            Users.AddRange(users);
            SaveChanges();

            // Seed Products
            var products = new[]
            {
        new Product { Title = "Banana", Description = "Banana je voce zute boje", Price = 159, ImageUrl = "banana.png", CategoryId = categories[0].Id },
        new Product { Title = "Premium Banana", Description = "Ovo je premium banana, koja je znatno bolje od standardne", Price = 189, ImageUrl = "banana.png", CategoryId = categories[0].Id },
        new Product { Title = "Breskva", Description = "Breskva je vrlo slatko voce", Price = 79, ImageUrl = "breskva.png", CategoryId = categories[0].Id },
        new Product { Title = "Lubenica", Description = "Lubenica se smatra povrcem, iako je slatka kao voce", Price = 79, ImageUrl = "watermelon.jpg", CategoryId = categories[1].Id }
    };
            Products.AddRange(products);
            SaveChanges();

            // Seed Reviews
            var reviews = new[]
            {
        new Review { Content = "Great product!", Rating = 5, ProductId = products[0].Id, UserId = users[1].Id },
        new Review { Content = "Not bad", Rating = 3, ProductId = products[1].Id, UserId = users[1].Id },
        new Review { Content = "Very comfortable", Rating = 4, ProductId = products[2].Id, UserId = users[0].Id },
        new Review { Content = "Its okay...", Rating = 3, ProductId = products[2].Id, UserId = users[1].Id }
    };
            Reviews.AddRange(reviews);
            SaveChanges();
        }


        private string GenerateSalt()
        {
            return BCrypt.Net.BCrypt.GenerateSalt();
        }

        private string ComputeHash(string password, string salt)
        {
            // Replace this hashing method with your preferred secure hashing algorithm
            // For example, using bcrypt hashing
            return BCrypt.Net.BCrypt.HashPassword(password, salt);
        }
    }
}
