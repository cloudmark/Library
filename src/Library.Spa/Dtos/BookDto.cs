using System.Collections.Generic;
using Library.Models;
using Microsoft.AspNet.Mvc;

namespace Library.Spa.Dtos {

    public class BookResultDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class BookDetailedResultDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<LoanResultDto> Loans { get; set; }
    }

    [ModelMetadataType(typeof(Book))]
    public class BookChangeDto {
        public string Name {get; set; }
		public string Description {get; set;}
	}
	
}