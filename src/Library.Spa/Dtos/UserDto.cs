using System.Collections.Generic;

namespace Library.Spa.Dtos {
    public class UserResultDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
    }

    public class UserDetailResultDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public List<LoanResultDto> Loans { get; set; }
    }

    public class UserChangeDto {
        
    }
	
}