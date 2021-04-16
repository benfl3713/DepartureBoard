using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DepartureBoardCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainDataAPI;

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