using  System.ComponentModel.DataAnnotations; 
using  System.ComponentModel.DataAnnotations.Schema;

namespace Library.Models
{
    [Table("Book")]
    public class Book
    {
        [Key]
        [Column("BookId")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Titles are required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "The Price is required.")]
        public string Description { get; set; }
    }
}