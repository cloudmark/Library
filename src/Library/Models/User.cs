using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.Data.Entity.Metadata;

namespace Library.Models {
	public class User {
        public int Id {get; set;}
        public string Name {get; set; }
        public string Surname {get; set; }

	    public virtual ICollection<Loan> Loans { get; set; } = new List<Loan>();
	}
}