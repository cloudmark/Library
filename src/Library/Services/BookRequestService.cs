using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Library.Infrastructure;
using Library.Models;
using Microsoft.Data.Entity;

namespace Library.Services
{
    

    public class BookRequestService 
    {

        private readonly LibraryContext _libraryContext;

        public BookRequestService(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }

        public async Task<IPagedList<BookRequest>> Paged(int page = 1, int pageSize = 50, string sortBy = null)
        {
            return await _libraryContext.BookRequests.ToPagedListAsync(page, pageSize, sortBy, a => a.Name);
        }

        public async Task<List<BookRequest>> All()
        {
            return await _libraryContext.BookRequests.ToListAsync();
        }

        public async Task Update(Book b)
        {
            await _libraryContext.SaveChangesAsync();
        }

        public async Task<int> BuyBook(BookRequest b)
        {
            _libraryContext.BookRequests.Add(b);
            return await _libraryContext.SaveChangesAsync();
        }

    }
}
