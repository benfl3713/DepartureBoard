using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using BusDataAPI.DataSource;
using BusDataAPI;
using Microsoft.Extensions.Caching.Memory;

namespace DepartureBoardWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusLiveDeparturesController : Controller
    {
        private readonly IMemoryCache _cache;

        public BusLiveDeparturesController(IMemoryCache cache)
        {
            _cache = cache;
        }

        [HttpGet("[action]")]
        public List<BusDeparture> GetBusLiveDepartures(string code, int? count)
        {
            var cacheEntry = _cache.GetOrCreate($"{code}_{count}", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
                return GetBusDepartures(code, count);
            });
            return cacheEntry;
        }

        private List<BusDeparture> GetBusDepartures(string code, int? count)
        {
            IBusDatasource busDatasource = new TflAPI();
            var departures = busDatasource.GetLiveDepartures(code);
            if (count.HasValue)
                return departures.Take(count.Value).ToList();
            return departures;
        }
    }
}
