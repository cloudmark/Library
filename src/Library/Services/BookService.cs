using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Library.Infrastructure;
using Library.Models;
using Microsoft.Data.Entity;

namespace Library.Services
{
    public interface IBookService
    {
        Task<IPagedList<Book>> Paged(int page = 1, int pageSize = 50, string sortBy = null);
        Task<List<Book>> All();
        Task<Book> Details(int bookId);
        Task<int> CreateBook(Book b);
        Task Update(Book b);
        Task DeleteBook(int bookId);
    }

    public class BookService : IBookService
    {

        private readonly LibraryContext _libraryContext;

        public BookService(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }

        public async Task<IPagedList<Book>> Paged(int page = 1, int pageSize = 50, string sortBy = null)
        {
            return await _libraryContext.Books.ToPagedListAsync(page, pageSize, sortBy, a => a.Name);
        }

        public async Task<List<Book>> All()
        {
            return await _libraryContext.Books.ToListAsync();
        }

        public async Task<Book> Details(int bookId)
        {
            return await _libraryContext.Books.Where(b => b.Id == bookId).SingleOrDefaultAsync();
        }

        public async Task Update(Book b)
        {
            await _libraryContext.SaveChangesAsync();
        }

        public async Task<int> CreateBook(Book b)
        {
            _libraryContext.Books.Add(b);
            return await _libraryContext.SaveChangesAsync();
        }

        public async Task DeleteBook(int bookId)
        {
            var book = await _libraryContext.Books.SingleOrDefaultAsync(a => a.Id == bookId);

            if (book != null)
            {
                _libraryContext.Books.Remove(book);

                await _libraryContext.SaveChangesAsync();
            }
        }
    }
}
