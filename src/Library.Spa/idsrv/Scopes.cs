using System.Collections.Generic;
using Thinktecture.IdentityServer.Core.Models;

namespace Library.Spa.idsrv
{
    static class Scopes
    {
        public static List<Scope> Get()
        {
            List<Scope> scopes = new List<Scope>();

            scopes.AddRange(StandardScopes.All);

            scopes.Add(new Scope
                {
                    Name = "api1",
                    DisplayName = "some scope",
                    Emphasize = true,
                    ShowInDiscoveryDocument = true,
                    Type = ScopeType.Resource

                });

            return scopes;
        }
    }
}
