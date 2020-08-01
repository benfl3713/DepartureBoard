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
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : Controller
    {
        [HttpGet("[action]")]
        public bool UseAnalytics()
        {
            return ConfigService.UseAnalytics;
        }
    }
}