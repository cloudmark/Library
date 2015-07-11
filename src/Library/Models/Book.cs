using System.ComponentModel.DataAnnotations;
namespace Library.Models
{
    public class Book
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Titles are required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "The Price is required.")]
        public string Description { get; set; }
    }
}