using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Library.Models {
    public class Book {
        public int Id {get; set;}
    	public string Name {get; set; }
		public string Description {get; set;}
	}
}