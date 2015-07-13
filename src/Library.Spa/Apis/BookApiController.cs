using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Library.Infrastructure;
using Library.Models;
using Library.Services;
using Library.Spa.Dtos;
using Library.Spa.Infrastructure;
using Microsoft.AspNet.Mvc;

namespace Library.Spa.Apis {
	[Route("api/books")]
	public class BookApiController: Controller{
		private readonly IBookService _bookService; 
		
		public BookApiController(IBookService bookService){
			_bookService = bookService; 
		}
		
		[HttpGet]
        [NoCache]
        public async Task<ApiResult> GetAll()
		{
		    var books =  await _bookService.All();
		    return new ApiResult
		    {
		        Data = books.MapTo(b => Mapper.Map(b, new BookResultDto())),
            };
		}
		
		[HttpGet("{bookId:int}")]
        [NoCache]
        public async Task<ApiResult> Details(int bookId)
		{
		    var book = await _bookService.Details(bookId);
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
        public async Task<ApiResult> CreateBook([FromBody]BookChangeDto bookDto)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResult(ModelState);
            }

            var book = new Book();
            await _bookService.CreateBook(Mapper.Map(bookDto, book));

            return new ApiResult
            {
                Data = Mapper.Map(book, new BookDetailedResultDto())
            };
        }

        [HttpPut("{bookId:int}")]
        public async Task<ApiResult> UpdateBook(int bookId, [FromBody]BookChangeDto bookDto)
        {
            if (!ModelState.IsValid)
                return new ApiResult(ModelState);
            
            var book = await _bookService.Details(bookId);
            if (book == null)
                return new ApiResult
                {
                    StatusCode = 404,
                    Message = $"The book with ID {bookId} was not found."
                };
            
            Mapper.Map(bookDto, book);
            await _bookService.Update(book);

            return new ApiResult
            {
                Data = Mapper.Map(book, new BookDetailedResultDto())
            };
        }





    }

}