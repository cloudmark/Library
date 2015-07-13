using System.Threading.Tasks;

namespace Spa.Extensions.Constants
{
    internal static class HttpConstants
    {
        internal const string ServerCapabilitiesKey = "server.Capabilities";
        internal const string SendFileVersionKey = "sendfile.Version";
        internal const string SendFileVersion = "1.0";

        internal const int Status200Ok = 200;
        internal const int Status206PartialContent = 206;
        internal const int Status304NotModified = 304;
        internal const int Status412PreconditionFailed = 412;
        internal const int Status416RangeNotSatisfiable = 416;

        internal static readonly Task CompletedTask = CreateCompletedTask();

        private static Task CreateCompletedTask()
        {
            var tcs = new TaskCompletionSource<object>();
            tcs.SetResult(null);
            return tcs.Task;
        }
    }
}
