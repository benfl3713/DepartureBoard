using System;
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

        [HttpGet]
        public int GetTimezoneOffset()
        {
            TimeZoneInfo timeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/London");
            return (int)timeZone.GetUtcOffset(DateTime.UtcNow).TotalMinutes;
        }
    }
}
