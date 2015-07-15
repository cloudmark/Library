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
        Task<List<Loan>> AllWithDetails();
        Task<Loan> Details(int loanId);
        Task<Loan> LoanBook(int userId, int bookId, int days);
        Task<bool> ReturnBook(int userId, int bookId);
    }

    public class LoanService : ILoanService
    {
        private readonly LibraryContext _libraryContext;
        private readonly IBookService _bookService;
        private readonly IUserService _userService;

        private readonly Expression<Func<Loan, bool>> _loanPredicate = l => l.LoanEnd <= DateTime.Now.AddDays(30);

        public LoanService(LibraryContext libraryContext, IBookService bookService, IUserService userService)
        {
            this._libraryContext = libraryContext;
            this._bookService = bookService;
            this._userService = userService;
        }

        public async Task<IPagedList<Loan>> Paged(int page = 1, int pageSize = 50, string sortBy = null)
        {
            return await _libraryContext.Loans
                .Where(_loanPredicate)
                .ToPagedListAsync(page, pageSize, sortBy, l  => l.LoanEnd);
        }

        public async Task<List<Loan>> AllWithDetails()
        {
            return await _libraryContext.Loans
                .Include(l => l.User)
                .Include(l => l.Book)
                .Where(_loanPredicate)
                .ToListAsync();
        }

        public async Task<Loan> Details(int loanId)
        {
            return await _libraryContext.Loans
                .Include(l => l.User)
                .Include(l => l.Book)
                .Where(l => l.Id == loanId)
                .SingleOrDefaultAsync();
        }

        public async Task<Loan> LoanBook(int userId, int bookId, int days)
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
            int rowsSaved = await _libraryContext.SaveChangesAsync();
            return loan;
        }

        public async Task<bool> ReturnBook(int userId, int bookId)
        {
            var loan = await _libraryContext.Loans.Where(l => l.Book.Id == bookId && l.User.Id == userId).SingleOrDefaultAsync();
            if (loan != null)
            {
                loan.LoanEnd = DateTime.Now;
                int rowsSaved = await _libraryContext.SaveChangesAsync();
                return rowsSaved > 0;
            }
            else
                return false;
        }
    }
}