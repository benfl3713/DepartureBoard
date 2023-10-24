using System;
using System.Collections.Generic;
using System.Linq;
using BusDataAPI;
using BusDataAPI.DataSource;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace DepartureBoardWeb.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TubeDeparturesController : Controller
{
    private readonly IMemoryCache _cache;

    public TubeDeparturesController(IMemoryCache cache)
    {
        _cache = cache;
    }

    [HttpGet]
    public List<BusDeparture> GetTubeLiveDepartures(string code, int? count)
    {
        var cacheEntry = _cache.GetOrCreate($"{code}_{count}", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
            return GetTubeDepartures(code, count);
        });
        return cacheEntry;
    }

    private List<BusDeparture> GetTubeDepartures(string code, int? count)
    {
        TflApi api = new TflApi();
        var departures = api.GetLiveDepartures(code);
        if (count.HasValue)
            departures = departures.Take(count.Value).ToList();
        
        foreach (BusDeparture busDeparture in departures)
        {
            if (busDeparture.Destination.Contains(" Underground Station"))
                busDeparture.Destination = busDeparture.Destination.Replace(" Underground Station", "");
        }
        
        return departures;
    }

    [HttpGet("search")]
    public List<TflApi.StopPoint> Search(string query)
    {
        var stations = _cache.GetOrCreate("tube_stations", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(3);
            TflApi api = new TflApi();
            return api.GetAllStations();
        });

        return stations;
    }
}
