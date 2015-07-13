using System.Collections.Generic; 
using Microsoft.AspNet.Mvc;
using Library.Models; 
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Library.Dtos;

namespace Library.Apis {
	[Route("api/book")]
	public class BookApiController: Controller{
		private readonly LibraryContext _libraryContext;
		
		public BookApiController(LibraryContext libraryContext){
			_libraryContext = libraryContext;
		}
		
		[HttpGet]
		public IEnumerable<Book> GetAll(){
			return _libraryContext.Books;
		}
		
		[HttpGet("{albumId:int}")]
		public async Task<Book> Details(int albumId){
			return await Task.Run(() =>  _libraryContext.Books.Where(b => b.Id == albumId).First());
		}
		
		//  public async Task<ActionResult> CreateBook ([FromBody] BookChangeDto book){
		//  	if (!ModelState.IsValid){
		//  		return new ApiResult(ModelState); 
		//  	}
			
		//  	var book = new Book(); 
			
			
		//  }
		
		
	}
		
}