using System;

namespace Spa.Extensions.Helpers
{
    internal static class Helpers
    {
        internal static bool IsGetOrHeadMethod(string method)
        {
            if (!Helpers.IsGetMethod(method))
                return Helpers.IsHeadMethod(method);
            return true;
        }

        internal static bool IsGetMethod(string method)
        {
            return string.Equals("GET", method, StringComparison.OrdinalIgnoreCase);
        }

        internal static bool IsHeadMethod(string method)
        {
            return string.Equals("HEAD", method, StringComparison.OrdinalIgnoreCase);
        }
    }
}
