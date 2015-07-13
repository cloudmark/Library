using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;

namespace MusicStore.Spa.Controllers
{
    [Route("/")]
    public class DefaultController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
    }
}
