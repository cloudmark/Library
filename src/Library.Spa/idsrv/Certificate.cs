using System;
using System.Security.Cryptography.X509Certificates;

namespace Library.Spa.idsrv
{
    static class Certificate
    {
        public static X509Certificate2 Get()
        {
            return new X509Certificate2(
                string.Format(@"{0}\bin\idsrv\idsrv3test.pfx", AppDomain.CurrentDomain.BaseDirectory), "idsrv3test");
        }

    }
}
