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
	[Route("loan")]
	public class LoanApiController: Controller{
		private readonly ILoanService _loanService;
		
		public LoanApiController(ILoanService loanService)
        {
            this._loanService = loanService;
		}

        [HttpGet]
		public async Task<ApiResult> GetAll()
        {
            var loans = await this._loanService.AllWithDetails();
            return new ApiResult
            {
                Data = Mapper.Map<IEnumerable<LoanDetailsResultDto>>(loans)
            };
        }

        [HttpGet("{loanId:int}")]
        [NoCache]
        public async Task<ApiResult> Details(int loanId)
        {
            var loan = await _loanService.Details(loanId);
            if (loan == null)
                return new ApiResult
                {
                    StatusCode = 404,
                    Message = $"The loan with ID {loanId} was not found."
                };

            return new ApiResult
            {
                Data = Mapper.Map(loan, new LoanDetailsResultDto())
            };
        }

        [HttpPost]
        public async Task<ApiResult> LoanBook([FromBody]LoanChangeDto loanChangeDto)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResult(ModelState);
            }
            
            var loan = await _loanService.LoanBook(loanChangeDto.UserId, loanChangeDto.BookId, loanChangeDto.Days);

            return new ApiResult
            {
                Data = Mapper.Map(loan, new LoanDetailsResultDto())
            };
        }

        [HttpDelete]
        public async Task<ApiResult> ReturnBook(int userId, int bookId)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResult(ModelState);
            }

            var book = new Book();
            bool saved = await _loanService.ReturnBook(userId, bookId);
            return new ApiResult
            {
                Data = Mapper.Map(book, new BookDetailedResultDto())
            };
        }

    }
	
}