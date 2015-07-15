using System.Collections;
using System.Collections.Generic;
using  System.ComponentModel.DataAnnotations; 
using  System.ComponentModel.DataAnnotations.Schema;
using Library.Services;

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

        [InverseProperty("LoanId")]
        public virtual ICollection<Loan> Loans { get; set; } = new List<Loan>();
    }
}