using System.Collections.Generic;
using Library.Models;
using Microsoft.AspNet.Mvc;

namespace Library.Spa.Apis {
	[Route("api/loan")]
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