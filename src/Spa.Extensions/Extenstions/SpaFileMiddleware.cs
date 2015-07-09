using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.Framework.Logging;


namespace Spa.Extensions.Extenstions
{
    /// <summary>
    /// Enables serving static files for SPA requests
    /// </summary>
    public class SpaMiddleware
    {
        private readonly SpaOptions _options;
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly IFileInfo _fileInfo;
        
        /// <summary>
        /// Creates a new instance of the StaticFileMiddleware.
        /// 
        /// </summary>
        /// <param name="next">The next middleware in the pipeline.</param>
        /// <param name="hostingEnv">The hosting environment.</param>
        /// <param name="options">The configuration options.</param>
        /// <param name="loggerFactory">An <see cref="T:Microsoft.Framework.Logging.ILoggerFactory"/> instance used to create loggers.</param>
        public SpaMiddleware(RequestDelegate next, IHostingEnvironment hostingEnv, SpaOptions options, ILoggerFactory loggerFactory)
        {
            options.ResolveFileProvider(hostingEnv);
            _next = next;
            _options = options;
            _logger = loggerFactory.CreateLogger<SpaMiddleware>();

            // Lookup the file information.  
            _fileInfo = _options.FileProvider.GetFileInfo(options.DefaultHtml.Value);
            if (!_fileInfo.Exists)
                throw new InvalidOperationException($"Filename {_fileInfo.Name} does not exist.  ");
            
        }

        
        /// <summary>
        /// Processes a request to determine if it matches a known file, and if so, serves it.
        /// 
        /// </summary>
        /// <param name="context"/>
        /// <returns/>
        public Task Invoke(HttpContext context)
        {
            var fileInfo = this._fileInfo;
            // In Debug mode we will load the file information all the time since the file might change. 
            if (_options.DebugMode)
            {
                fileInfo = _options.FileProvider.GetFileInfo(_options.DefaultHtml.Value);
                if (!_fileInfo.Exists)
                    throw new InvalidOperationException($"Filename {_fileInfo.Name} does not exist.  ");
            }

            var spaContext = new SpaContext(context, _options, fileInfo, _logger);
            if (!spaContext.ValidateMethod())
                return _next(context);

            if (spaContext.IsHeadMethod())
                return spaContext.SendStatusAsync(200);

            if (_logger.IsEnabled(LogLevel.Verbose))
                _logger.LogVerbose($"Copying file {_options.DefaultHtml} to the response body for request {context.Request.Path}");

            return spaContext.SendAsync();
        }
    }
}
