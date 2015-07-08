using System.Collections.Generic; 
using Microsoft.AspNet.Mvc;
using Library.Models; 

namespace Library.Apis {
	[Route("api/user")]
	public class UserApiController: Controller{
		private readonly LibraryContext _libraryContext;
		
		public UserApiController(LibraryContext libraryContext){
			_libraryContext = libraryContext;
		}
		
		[HttpGet]
		public IEnumerable<User> GetAll(){
			return _libraryContext.Users;
		}
	}
	
}