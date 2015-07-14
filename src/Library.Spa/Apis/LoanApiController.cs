using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

using AutoMapper;

using Library.Models;
using Library.Services;
using Library.Infrastructure;
using Library.Spa.Infrastructure;
using Library.Spa.Dtos;

namespace Library.Spa.Apis {
	[Route("api/loan")]
	public class LoanApiController: Controller{
		private readonly ILoanService loanService;
		
		public LoanApiController(ILoanService loanService)
        {
            this.loanService = loanService;
		}

        [HttpGet]
		public async Task<ApiResult> GetAll()
        {
            var loans = await this.loanService.All();
            return new ApiResult
            {
                Data = Mapper.Map<IEnumerable<LoanResultDto>>(loans)
            };
        }

        [HttpGet("{loanId:int}")]
        [NoCache]
        public async Task<ApiResult> Details(int bookId)
        {
            var book = await loanService.Details(bookId);
            if (book == null)
                return new ApiResult
                {
                    StatusCode = 404,
                    Message = $"The book with ID {bookId} was not found."
                };

            return new ApiResult
            {
                Data = Mapper.Map(book, new BookDetailedResultDto())
            };
        }

        [HttpPost]
        public async Task<ApiResult> LoanBook(int userId, int bookId, int days)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResult(ModelState);
            }
            
            var book = new Book();
            bool saved = await loanService.LoanBook(userId, bookId, days);

            return new ApiResult
            {
                Data = Mapper.Map(book, new BookDetailedResultDto())
            };
        }

        [HttpPost]
        public async Task<ApiResult> ReturnBook(int userId, int bookId)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResult(ModelState);
            }

            var book = new Book();
            bool saved = await loanService.ReturnBook(userId, bookId);

            return new ApiResult
            {
                Data = Mapper.Map(book, new BookDetailedResultDto())
            };
        }
    }
	
}