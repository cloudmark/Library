using System.Collections.Generic;
using Thinktecture.IdentityServer.Core.Services.InMemory;

namespace Library.Spa.idsrv
{
    static class Users
    {
        public static List<InMemoryUser> Get()
        {
            return new List<InMemoryUser>
            {
                new InMemoryUser
                {
                    Username = "testUser",
                    Password = "testPwd",
                    Subject = "Test User"
                }
           
            };
        }
    }
}
