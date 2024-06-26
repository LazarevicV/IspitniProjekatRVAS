namespace IspitniProjekatRVAS.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }

        // Foreign keys
        public int ProductId { get; set; }
        public int UserId { get; set; }

        // Navigation properties
        public Product Product { get; set; }
        public User User { get; set; }
    }
}
