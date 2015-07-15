using System;
using System.ComponentModel.DataAnnotations;

namespace Library.Spa.Dtos {

    public class LoanResultDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime LoanStart { get; set; }
        public DateTime LoanEnd { get; set; }
    }

    public class LoanDetailsResultDto
    {
        public int Id { get; set; }
        public BookResultDto Book { get; set; }
        public UserResultDto User { get; set; }
        public DateTime LoanStart { get; set; }
        public DateTime LoanEnd { get; set; }
    }

    public class LoanChangeDto
	{
        [Required]
	    public int BookId;
        [Required]
        public int UserId;
        [Required]
        public int Days; 
	}
	
}