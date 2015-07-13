using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Relational;
using Microsoft.Data.Entity.SqlServer;
using Microsoft.Framework.DependencyInjection;

namespace Library.Models
{
    public static class SampleData
    {

        public static async Task InitializeLibraryDatabaseAsync(IServiceProvider serviceProvider)
        {

            using (var db = serviceProvider.GetService<LibraryContext>())
            {
                var sqlServerDatabase = db.Database as RelationalDatabase;
                if (sqlServerDatabase != null)
                {
                    // Create the database.  
                    if (await sqlServerDatabase.EnsureCreatedAsync())
                    {
                        await InsertUsers(serviceProvider);
                        await InsertBooks(serviceProvider);
                        //await InsertLoans(serviceProvider);
                    }
                }
                else
                {
                    await InsertUsers(serviceProvider);
                    await InsertBooks(serviceProvider);
                    //await InsertLoans(serviceProvider);
                }
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
            return new Book[]
            {
                new Book {Name = "An Imperial Affliction", Description = "Description"},
                new Book {Name = "The Curious Incident Of The Dog In the Night Time", Description = "Description"},
                new Book {Name = "The Fault In Our Stars", Description = "Description"},
                new Book {Name = "Women", Description = "Description"},
                new Book {Name = "An Eternal Golden Braid", Description = "Description"},

            };
        }

        private static User[] GetUsers()
        {
            return new User[] {
                new User{Name = "Mark", Surname = "Galea"},
                new User{Name = "John", Surname = "Doe"},
                new User{Name = "William", Surname = "Smith"},
                new User{Name = "Kyle", Surname = "Brown"},
                new User{Name = "Sam", Surname = "Harris"},
            };
        }

       
    }
}