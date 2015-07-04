using System;
using System.Linq;
using System.Collections.Generic;

namespace Library.Models
{
    public static class SampleData
    {
        public static void InitializeLibraryDatabase(LibraryContext libraryContext)
        {
            var r = new Random();
            // Create the books.  
            libraryContext.Books =
                new List<Book> {
                    new Book { Name="An Imperial Affliction", Description="Description"},
                    new Book { Name="The Curious Incident Of The Dog In the Night Time", Description="Description"},
                    new Book { Name="The Fault In Our Stars", Description="Description"},
                    new Book { Name="Women", Description="Description"},
                    new Book { Name="An Eternal Golden Braid", Description="Description"},
                };
            // Create the Id's
            int i = 0; foreach (var book in libraryContext.Books) book.Id = i++;

            // Create the users; 
            libraryContext.Users =
                new List<User>{
                    new User{Id = 1, Name = "Mark", Surname = "Galea"},
                    new User{Id = 1, Name = "John", Surname = "Doe"},
                    new User{Id = 1, Name = "William", Surname = "Smith"},
                    new User{Id = 1, Name = "Kyle", Surname = "Brown"},
                    new User{Id = 1, Name = "Sam", Surname = "Harris"},
            };
            int j = 0; foreach (var user in libraryContext.Users) user.Id = j++;

            // Create the loans; 
            libraryContext.Loans = Enumerable.Range(0, libraryContext.Books.Count()).Select(
                x =>
                {
                    // Get Random Book
                    var books = libraryContext.Books;
                    var book = books.ElementAt(x);

                    // Get Random User; 
                    var users = libraryContext.Users;
                    var user = users.ElementAt(r.Next(0, users.Count() - 1));

                    // Generate Loan
                    return new Loan { Id = x, Book = book, User = user };
                }
            ).ToList();

        }
    }
}