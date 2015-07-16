using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.DataProtection;
using Microsoft.Framework.DependencyInjection;
using Owin;
using Thinktecture.IdentityServer.Core.Configuration;

namespace Library.Spa.idsrv
{    
    using DataProtectionProviderDelegate = Func<string[], Tuple<Func<byte[], byte[]>, Func<byte[], byte[]>>>;
    using DataProtectionTuple = Tuple<Func<byte[], byte[]>, Func<byte[], byte[]>>;

    public static class IApplicationBuilderExtensions
    {
        public static void UseIdentityServer(this IApplicationBuilder app, IdentityServerOptions options)
        {
            app.UseOwin(addToPipeline =>
            {
                addToPipeline(next =>
                {
                    var builder = new Microsoft.Owin.Builder.AppBuilder();

                    var provider = app.ApplicationServices.GetService<IDataProtectionProvider>();

                    builder.Properties["security.DataProtectionProvider"] = new DataProtectionProviderDelegate(purposes =>
                    {
                        var dataProtection = provider.CreateProtector(String.Join(",", purposes));
                        return new DataProtectionTuple(dataProtection.Protect, dataProtection.Unprotect);
                    });

                    builder.UseIdentityServer(options);

                    var appFunc = builder.Build(typeof(Func<IDictionary<string, object>, Task>)) as Func<IDictionary<string, object>, Task>;
                    return appFunc;
                });
            });
        }
    }
}