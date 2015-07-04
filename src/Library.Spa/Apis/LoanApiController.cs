using System.Collections.Generic; 
using Microsoft.AspNet.Mvc;
using Library.Models; 

namespace Library.Apis {
	[Route("api/[controller]")]
	public class LoanApiController: Controller{
		private readonly LibraryContext _libraryContext;
		
		public LoanApiController(LibraryContext libraryContext){
			_libraryContext = libraryContext;
		}
		
		[HttpGet]
		public IEnumerable<Loan> GetAll(){
			return _libraryContext.Loans;
		}
	}
	
}