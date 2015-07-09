using System;
using System.ComponentModel.DataAnnotations;

namespace Library.Models {
	public class Loan {
        public int Id {get; set; }
        public Book Book {get; set; }
        public User User {get; set; }
        public DateTime DateTime {get; set; }	

	}
}