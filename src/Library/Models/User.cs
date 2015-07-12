using System.Collections.Generic;
using  System.ComponentModel.DataAnnotations; 
using  System.ComponentModel.DataAnnotations.Schema;
namespace Library.Models {
	
    [Table("User")]
    public class User {
        [Key]
        [Column("UserId")]
        public int Id {get; set;}
        [Required]
        public string Name {get; set; }

        [Required]
        public string Surname {get; set; }

	    public virtual ICollection<Loan> Loans { get; set; } = new List<Loan>();
	}
}