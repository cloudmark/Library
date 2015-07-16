using System.Collections.Generic;
using Thinktecture.IdentityServer.Core.Models;

namespace Library.Spa.idsrv
{
    static class Clients
    {
        public static List<Client> Get()
        {
            return new List<Client>
            {

                new Client
                {
                    //Resource Owner Flow Client (our web UI)
                    ClientName = "WebUI",
                    Enabled = true,

                    ClientId = "IdentityWebUI",
                    ClientSecrets = new List<ClientSecret>
                    {
                        new ClientSecret("secret".Sha256())
                    },

                    Flow = Flows.ResourceOwner,
                    AccessTokenType = AccessTokenType.Jwt,
                    AccessTokenLifetime = 3600

                }

            };
        }
    }
}
