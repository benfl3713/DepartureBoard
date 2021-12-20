using DepartureBoardCore;
using Microsoft.AspNetCore.Mvc;

namespace DepartureBoardWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ConfigController : Controller
    {
        [HttpGet]
        public bool UseAnalytics()
        {
            return ConfigService.UseAnalytics;
        }

        [HttpGet]
        public IActionResult Ping()
        {
            return Ok();
        }
    }
}
