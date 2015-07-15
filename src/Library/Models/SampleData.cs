using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using System.Security.Claims;
using Library.Spa;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Relational;
using Microsoft.Data.Entity.SqlServer;
using Microsoft.Data.Entity.Storage;
using Microsoft.Framework.DependencyInjection;

using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Storage;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.OptionsModel;

namespace Library.Models
{
    public static class SampleData
    {
        private static readonly Book[] books = {
            new Book {Name = "An Imperial Affliction", Description = "Description"},
            new Book {Name = "The Curious Incident Of The Dog In the Night Time", Description = "Description"},
            new Book {Name = "The Fault In Our Stars", Description = "Description"},
            new Book {Name = "Women", Description = "Description"},
            new Book {Name = "An Eternal Golden Braid", Description = "Description"},
        };

        private static readonly User[] users = {
            new User{Name = "Mark", Surname = "Galea"},
            new User{Name = "John", Surname = "Doe"},
            new User{Name = "William", Surname = "Smith"},
            new User{Name = "Kyle", Surname = "Brown"},
            new User{Name = "Sam", Surname = "Harris"},
        };

        private static readonly Loan[] loans = {
            new Loan { Book = books.First(), User = users.First(), LoanStart = DateTime.Now, LoanEnd = DateTime.Now },
            new Loan { Book = books.Last(), User = users.Last(), LoanStart = DateTime.Now, LoanEnd = DateTime.Now },
        };

        public static async Task InitializeLibraryDatabaseAsync(IServiceProvider serviceProvider)
        {
            using (var db = serviceProvider.GetService<LibraryContext>())
            {

                if (db.Database != null)
                {
                    if (await db.Database.EnsureCreatedAsync())
                    {
                        await CreateAdminUser(serviceProvider);
                        await InsertUsers(serviceProvider);
                        await InsertBooks(serviceProvider);
                        await InsertLoans(serviceProvider);
                    }
                }
                else
                {
                    await CreateAdminUser(serviceProvider);
                    await InsertUsers(serviceProvider);
                    await InsertBooks(serviceProvider);
                    await InsertLoans(serviceProvider);

                }
            }
        }

        private static async Task CreateAdminUser(IServiceProvider serviceProvider)
        {
            var settings = serviceProvider.GetService<IOptions<SiteSettings>>().Options;
            const string adminRole = "Administrator";

            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            if (!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRole));
            }

            var user = await userManager.FindByNameAsync(settings.DefaultAdminUsername);
            if (user == null)
            {
                user = new ApplicationUser { UserName = settings.DefaultAdminUsername };
                await userManager.CreateAsync(user, settings.DefaultAdminPassword);
                await userManager.AddToRoleAsync(user, adminRole);
                await userManager.AddClaimAsync(user, new Claim("app-ManageStore", "Allowed"));
            }
        }


        private static async Task InsertUsers(IServiceProvider serviceProvider)
        {
            await AddOrUpdateAsync<User>(serviceProvider, g => g.Id, GetUsers());
        }

        private static async Task InsertBooks(IServiceProvider serviceProvider)
        {
            await AddOrUpdateAsync<Book>(serviceProvider, g => g.Id, GetBooks());
        }

        private static async Task InsertLoans(IServiceProvider serviceProvider)
        {
            await AddOrUpdateAsync<Loan>(serviceProvider, g => g.Id, GetLoans());
        }

        private static async Task AddOrUpdateAsync<TEntity>(
            IServiceProvider serviceProvider,
            Func<TEntity, object> propertyToMatch, IEnumerable<TEntity> entities)
            where TEntity : class
        {
            // Query in a separate context so that we can attach existing entities as modified
            List<TEntity> existingData;
            using (var db = serviceProvider.GetService<LibraryContext>())
            {
                existingData = db.Set<TEntity>().ToList();
            }

            using (var db = serviceProvider.GetService<LibraryContext>())
            {
                foreach (var item in entities)
                {
                    db.Entry(item).State = existingData.Any(g => propertyToMatch(g).Equals(propertyToMatch(item)))
                        ? EntityState.Modified
                        : EntityState.Added;
                }

                await db.SaveChangesAsync();
            }
        }

        private static Book[] GetBooks()
        {
            return books;
        }

        private static User[] GetUsers()
        {
            return users;
        }


        private static Loan[] GetLoans()
        {
            return loans;
        }
    }
}