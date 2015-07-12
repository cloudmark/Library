using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;

namespace Library.Models
{

    public class ApplicationUser : IdentityUser
    {
    }

    public class LibraryContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<User> LibraryUsers { get; set; }
        public DbSet<BookRequest> BookRequests { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Loan> Loans { get; set; }
    }
}

