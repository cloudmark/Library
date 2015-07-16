using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Library.Models;
using Library.Spa.Infrastructure;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Library.Spa.Apis
{
    [Route("accounts")]
    public class AccountsApiController : Controller
    {

        [FromServices]
        public UserManager<ApplicationUser> UserManager { get; set; }

        [FromServices]
        public SignInManager<ApplicationUser> SignInManager { get; set; }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ApiResult> Register([FromBody] RegisterViewModel model)
        {
            //Bug: https://github.com/aspnet/WebFx/issues/247
            //if (ModelState.IsValid == true)
            {
                var user = new ApplicationUser {UserName = model.UserName};
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    return new ApiResult
                    {
                        StatusCode = 200
                    };
                }
                return new ApiResult
                {
                    StatusCode = 500,
                    Message = result.Errors.First().Description
                };
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ApiResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    return new ApiResult() {Message = "Login Success"};
                }
                if (result.IsLockedOut)
                {
                    return new ApiResult
                    {
                        StatusCode = 501,
                        Message = "User is locked out, try again later."
                    };

                }

            }
            return new ApiResult
            {
                StatusCode = 501,
                Message = "Invalid username or password."
            };

        }
    }
}