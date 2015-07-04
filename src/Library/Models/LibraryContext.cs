using System.Collections.Generic;

namespace Library.Models
{
    public class LibraryContext
    {
        public LibraryContext(){
                
        }
        
        public List<User> Users { get; set; }
        public List<Book> Books { get; set; }
        public List<Loan> Loans { get; set; }

    }
}

