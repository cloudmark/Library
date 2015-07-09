using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Http;

namespace Spa.Extensions.Extenstions
{
    /// <summary>
    /// Contains information about the request and the file that will be served in response.
    /// 
    /// </summary>
    public class SpaResponseContext
    {
        /// <summary>
        /// The request and response information.
        /// 
        /// </summary>
        public HttpContext Context { get; internal set; }

        /// <summary>
        /// The file to be served.
        /// 
        /// </summary>
        public IFileInfo File { get; internal set; }
    }
}
