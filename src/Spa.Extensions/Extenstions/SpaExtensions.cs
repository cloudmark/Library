using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;

namespace Spa.Extensions.Extenstions
{
    public static class SpaExtensions
    {
        /// <summary>
        /// Enables serving of a default file.  The default is to look for wwwwroot/index.html
        /// 
        /// </summary>
        /// <param name="builder"/>
        /// <returns/>
        public static IApplicationBuilder UseSpa(this IApplicationBuilder builder)
        {
            return UseSpa(builder, new SpaOptions());
        }

        /// <summary>
        /// Enables static file serving for the given request path
        /// 
        /// </summary>
        /// <param name="builder"/>
        /// <param name="defaultHtml">The default html to serve.</param>
        /// <returns/>
        public static IApplicationBuilder UseSpa(this IApplicationBuilder builder, string defaultHtml)
        {
            var options = new SpaOptions();
            var pathString = new PathString(defaultHtml);
            options.DefaultHtml = pathString;
            return builder.UseSpa(options);
        }

        /// <summary>
        /// Enables static file serving with the given options
        /// 
        /// </summary>
        /// <param name="builder"/><param name="options"/>
        /// <returns/>
        public static IApplicationBuilder UseSpa(this IApplicationBuilder builder, SpaOptions options)
        {
            return builder.UseMiddleware<SpaMiddleware>(options);
        }
    }
}
