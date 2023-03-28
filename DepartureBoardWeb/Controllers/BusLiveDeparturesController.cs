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
        public List<BusDeparture> GetBusLiveDepartures(string code, int? count, string dataSource = "TFL")
        {
            var cacheEntry = _cache.GetOrCreate($"{dataSource}_{code}_{count}", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
                return GetBusDepartures(code, count, dataSource);
            });
            return cacheEntry;
        }

        private List<BusDeparture> GetBusDepartures(string code, int? count, string dataSource)
        {
            IBusDatasource busDatasource = GetDataSource(dataSource);
            var departures = busDatasource.GetLiveDepartures(code);
            if (count.HasValue)
                return departures.Take(count.Value).ToList();
            return departures;
        }

        private IBusDatasource GetDataSource(string dataSource)
        {
            return dataSource switch
            {
                "FIRST" => new FirstBusApi(),
                _ => new TflAPI()
            };
        }
    }
}
