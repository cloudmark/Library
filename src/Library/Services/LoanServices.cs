using Library.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Library.Infrastructure;
using Microsoft.Data.Entity;

namespace Library.Services
{
    public interface ILoanService
    {
        Task<IPagedList<Loan>> Paged(int page = 1, int pageSize = 50, string sortBy = null);
        Task<List<Loan>> All();
        Task<Loan> Details(int loanId);
        Task<int> LoanBook(int userId, int bookId, int days);
        Task ReturnBook(int userId, int bookId);
    }

    public class LoanService : ILoanService
    {
        private readonly LibraryContext _libraryContext;
        private readonly IBookService _bookService;
        private readonly IUserService _userService;

        private readonly Expression<Func<Loan, bool>> _loanPredicate = l => l.LoanEnd != null && l.LoanEnd == DateTime.Today.AddDays(7);

        public LoanService(LibraryContext libraryContext, IBookService bookService, IUserService userService)
        {
            this._libraryContext = libraryContext;
            this._bookService = bookService;
            this._userService = userService;
        }

        public async Task<IPagedList<Loan>> Paged(int page = 1, int pageSize = 50, string sortBy = null)
        {
            return await _libraryContext.Loans.Where(_loanPredicate).ToPagedListAsync(page, pageSize, sortBy, l  => l.LoanEnd);
        }

        public async Task<List<Loan>> All()
        {
            return await _libraryContext.Loans.Where(_loanPredicate).ToListAsync();
        }

        public async Task<Loan> Details(int loanId)
        {
            return await _libraryContext.Loans.Include(l => l.User).Include(l => l.Book).Where(l => l.Id == loanId).SingleOrDefaultAsync();
        }

        public async Task<int> LoanBook(int userId, int bookId, int days)
        {
            var b = await _bookService.Details(bookId);
            var u = await _userService.Details(userId);

            if (b == null || u == null) throw null;

            var currentDate = DateTime.Now;
            var loan = new Loan()
            {
                Book = b,
                User = u,
                LoanStart = currentDate,
                LoanEnd = currentDate.AddDays(days)
            };
            _libraryContext.Loans.Add(loan);
            return await _libraryContext.SaveChangesAsync();
        }

        public async Task ReturnBook(int userId, int bookId)
        {
            var loan = await _libraryContext.Loans.Where(l => l.Book.Id == bookId && l.User.Id == userId).SingleOrDefaultAsync();
            if (loan != null)
            {
                loan.LoanEnd = DateTime.Now;
                await _libraryContext.SaveChangesAsync();
            }
        }

    }
}