using System.Collections.Generic;
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
        public DbSet<Book> Books { get; set; }
        public DbSet<Loan> Loans { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // User Configuration.  
            builder.Entity<User>(
                user =>
                {
                    user.Property(u => u.Id).Column("UserId").GenerateValueOnAdd();
                    user.Property(u => u.Name).Required();
                    user.Property(u => u.Surname).Required();
                }
            );


            // Book Configuration
            builder.Entity<Book>(book =>
            {
                book.Property(b => b.Id).Column("BookId").GenerateValueOnAdd();
                book.Property(b => b.Name).Required();
            });
            
            // Loan Configuration. 
            builder.Entity<Loan>(loan =>
            {
                loan.Property(l => l.Id).Column("LoanId").GenerateValueOnAdd();
                loan.Reference(l => l.Book);
                loan.Reference(l => l.User);
                loan.Property(l => l.DateTime).Required();
            });
            

            base.OnModelCreating(builder);
        }
    }
}

