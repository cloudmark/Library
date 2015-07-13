using System.Collections.Generic;
using Library.Models;
using Microsoft.AspNet.Mvc;

namespace Library.Spa.Apis {
	[Route("api/user")]
	public class UserApiController: Controller{
		private readonly LibraryContext _libraryContext;
		
		public UserApiController(LibraryContext libraryContext){
			_libraryContext = libraryContext;
		}
		
		[HttpGet]
		public IEnumerable<User> GetAll(){
			// return _libraryContext.LibraryUsers.All();
		    return new User[] {};
		}
	}
	
}