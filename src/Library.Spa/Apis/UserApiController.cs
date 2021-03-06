using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Library.Models;
using Library.Services;
using Library.Spa.Dtos;
using Library.Spa.Infrastructure;
using Microsoft.AspNet.Mvc;

namespace Library.Spa.Apis
{
    [Route("user")]
    public class UserApiController : Controller
    {
        private readonly IUserService _userService;
        private readonly IBookService _bookService;

        public UserApiController(IUserService userService, IBookService bookService)
        {
            this._userService = userService;
            this._bookService = bookService;
        }

        [HttpGet]
        public async Task<ApiResult> GetAll()
        {
            var loans = await this._userService.All();
            return new ApiResult
            {
                Data = Mapper.Map<IEnumerable<UserResultDto>>(loans)
            };
        }

        [HttpGet("{userId:int}")]
        [NoCache]
        public async Task<ApiResult> Details(int userId)
        {
            var user = await _userService.Details(userId);
            if (user == null)
                return new ApiResult
                {
                    StatusCode = 404,
                    Message = $"The User with ID {userId} was not found."
                };

            var userDetails = new UserDetailResultDto(); 
            var apiResult =  new ApiResult
            {
                Data = Mapper.Map(user, userDetails)
            };
            foreach (var u in userDetails.Loans)
            {
                var book = await _bookService.Details(u.BookId);
                u.BookName = book.Name;
                u.UserFullName = $"{user.Name} {user.Surname}";
            }
            return apiResult; 
        }

        [HttpPost]
        public async Task<ApiResult> CreateUser([FromBody]UserChangeDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return new ApiResult(ModelState);
            }

            var user = new User();
            await _userService.CreateUser(Mapper.Map(userDto, user));

            return new ApiResult
            {
                Data = Mapper.Map(user, new UserDetailResultDto())
            };
        }

        [HttpPut("{userId:int}")]
        public async Task<ApiResult> UpdateUser(int userId, [FromBody]UserChangeDto userDto)
        {
            if (!ModelState.IsValid)
                return new ApiResult(ModelState);

            var user = await _userService.Details(userId);
            if (user == null)
                return new ApiResult
                {
                    StatusCode = 404,
                    Message = $"The user with ID {userId} was not found."
                };

            Mapper.Map(userDto, user);
            await _userService.Update(user);

            return new ApiResult
            {
                Data = Mapper.Map(user, new UserDetailResultDto())
            };
        }

        [HttpDelete("{userId:int}")]
        public async Task<ApiResult> DeleteUser(int userId)
        {
            await _userService.DeleteUser(userId);
            return new ApiResult();
        }
    }

}