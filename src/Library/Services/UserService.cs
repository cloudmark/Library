using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Library.Infrastructure;
using Library.Models;
using Microsoft.Data.Entity;

namespace Library.Services
{
    public interface IUserService
    {
        Task<IPagedList<User>> Paged(int page = 1, int pageSize = 50, string sortBy = null);
        Task<List<User>> All();
        Task<User> Details(int userId);
        Task<int> CreateUser(User b);
        Task DeleteUser(int userId);
    }

    public class UserService : IUserService
    {

        private readonly LibraryContext _libraryContext;

        public UserService(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }

        public async Task<IPagedList<User>> Paged(int page = 1, int pageSize = 50, string sortBy = null)
        {
            return await _libraryContext.LibraryUsers.ToPagedListAsync(page, pageSize, sortBy, u => u.Name);
        }

        public async Task<List<User>> All()
        {
            return await _libraryContext.LibraryUsers.ToListAsync();
        }

        public async Task<User> Details(int userId)
        {
            return await _libraryContext.LibraryUsers.Include(u => u.Loans).Where(u => u.Id == userId).SingleOrDefaultAsync();
        }

        public async Task<int> CreateUser(User b)
        {
            _libraryContext.LibraryUsers.Add(b);
            return await _libraryContext.SaveChangesAsync();
        }

        public async Task DeleteUser(int userId)
        {
            var user = await _libraryContext.LibraryUsers.SingleOrDefaultAsync(u => u.Id == userId);

            if (user != null)
            {
                _libraryContext.LibraryUsers.Remove(user);

                await _libraryContext.SaveChangesAsync();
            }
        }
    }
}
