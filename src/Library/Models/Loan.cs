using System;
using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema;

namespace Library.Models {
	[Table("Loan")]
    public class Loan {
        [Key]
        [Column("LoanId")]
        public int Id {get; set; }

        public int? BookId { get; set; }

        public int? UserId { get; set; }

        [Required]
        [ForeignKey("BookId")] // In this class
        public virtual Book Book {get; set; }

        [Required]
        [ForeignKey("UserId")] // In this class
        public User User {get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime LoanStart {get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime LoanEnd { get; set; }

    }
}