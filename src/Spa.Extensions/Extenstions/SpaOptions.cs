using System;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;

namespace Spa.Extensions.Extenstions
{
    public class SpaOptions
    {

        public Action<SpaResponseContext> OnPrepareResponse { get; set; } = _ => { };

        public PathString DefaultHtml { get; set; } = new PathString("/index.html");

        public bool DebugMode { get; set; } = false; 

        public IFileProvider FileProvider { get; set;  }

        internal void ResolveFileProvider(IHostingEnvironment hostingEnv)
        {
            if (this.FileProvider != null)
                return;
            this.FileProvider = hostingEnv.WebRootFileProvider;
            if (this.FileProvider == null)
                throw new InvalidOperationException("Missing FileProvider.");
        }
    }
}
