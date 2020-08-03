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
        public List<BusDeparture> GetBusLiveDepartures(string atco, int? count)
        {
            var cacheEntry = _cache.GetOrCreate($"{atco}_{count}", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
                return GetBusDepartures(atco, count);
            });
            return cacheEntry;
        }

        private List<BusDeparture> GetBusDepartures(string atco, int? count)
        {
            IBusDatasource busDatasource = new NextBusesSearchAPI();
            var departures = busDatasource.GetLiveDepartures(atco);
            if (count.HasValue)
                return departures.Take(count.Value).ToList();
            return departures;
        }
    }
}