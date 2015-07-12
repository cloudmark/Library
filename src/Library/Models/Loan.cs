using System;
using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema;

namespace Library.Models {
	[Table("Loan")]
    public class Loan {
        [Key]
        [Column("LoanId")]
        public int Id {get; set; }
        [Required]
        public Book Book {get; set; }
        [Required]
        public User User {get; set; }
        
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime LoanStart {get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime LoanEnd { get; set; }

    }
}