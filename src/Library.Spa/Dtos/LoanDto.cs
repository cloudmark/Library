using System;

namespace Library.Spa.Dtos {
    public class LoanResultDto
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime DateTime { get; set; }
    }

    public class LoanDetailedResultDto
    {
        public int Id { get; set; }
        public BookResultDto Book { get; set; }
        public UserResultDto User { get; set; }
        public DateTime DateTime { get; set; }
    }

	public class LoanChangeDto {
		
	}
	
}