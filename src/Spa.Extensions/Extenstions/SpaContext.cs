using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNet.FileProviders;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Http.Features;
using Microsoft.Framework.Logging;
using Spa.Extensions.IO;

namespace Spa.Extensions.Extenstions
{
    internal struct SpaContext
    {
        private readonly SpaOptions _options;
        private readonly ILogger _logger;
        private readonly IFileInfo _fileInfo;
        private readonly HttpContext _context; 
        
        public SpaContext(HttpContext context, SpaOptions options, IFileInfo fileInfo, ILogger logger)
        {
            Debug.Assert(fileInfo.Exists, $"The file {fileInfo.Name} does not exist");
            _context = context; 
            _options = options;
            _logger = logger;
            _fileInfo = fileInfo;
        }

        public bool ValidateMethod()
        {
            var isGet = IsGetMethod();
            var isHead = IsHeadMethod(); 
            return isGet || isHead;
        }

        public bool IsGetMethod()
        {
            return Helpers.Helpers.IsGetMethod(_context.Request.Method);
        }

        public bool IsHeadMethod()
        {
            return Helpers.Helpers.IsHeadMethod(_context.Request.Method);
        }

        public void ApplyResponseHeaders(int statusCode)
        {
            var response = _context.Response;
            response.StatusCode = statusCode;
            if (statusCode == 200)
                response.ContentLength = _fileInfo.Length;
            _options.OnPrepareResponse(new SpaResponseContext
            {
                Context = _context,
                File = _fileInfo
            });
        }
        
        public Task SendStatusAsync(int statusCode)
        {
            ApplyResponseHeaders(statusCode);
            if (_logger.IsEnabled(LogLevel.Verbose))
                _logger.LogVerbose($"Handled. Status code: {statusCode} Url: {_context.Request.Path} File: {_fileInfo.Name}");
            return CreateCompletedTask();
        }

        private static Task CreateCompletedTask()
        {
            TaskCompletionSource<object> completionSource = new TaskCompletionSource<object>();
            completionSource.SetResult(null);
            return completionSource.Task;
        }

        public async Task SendAsync()
        {
            var response = _context.Response;
            response.ContentType = "text/html";
            ApplyResponseHeaders(Constants.HttpConstants.Status200Ok);

            var physicalPath = _fileInfo.PhysicalPath;
            var sendFile = _context.GetFeature<IHttpSendFileFeature>();
            if (sendFile != null && !string.IsNullOrEmpty(physicalPath))
            {
                await sendFile.SendFileAsync(physicalPath, 0, _fileInfo.Length, _context.RequestAborted);
                return;
            }

            var readStream = _fileInfo.CreateReadStream();
            try
            {
                await StreamCopyOperation.CopyToAsync(readStream, response.Body, _fileInfo.Length, _context.RequestAborted);
            }
            finally
            {
                readStream.Dispose();
            }
        }

    }
    
}
