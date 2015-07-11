using System.ComponentModel.DataAnnotations;
namespace Library.Models
{
    public class BookRequest
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Titles are required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "The Price is required.")]
        public string Description { get; set; }
        public string AmazonLink { get; set; }

    }
}