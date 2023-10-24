using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore.DataSource;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using TrainDataAPI.Tube;
using TrainDataAPI.Tube.DataSource;

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
    public List<TubeDeparture> GetTubeLiveDepartures(string code, int? count)
    {
        var cacheEntry = _cache.GetOrCreate($"{code}_{count}", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);
            return GetTubeDepartures(code, count);
        });
        return cacheEntry;
    }

    private List<TubeDeparture> GetTubeDepartures(string code, int? count)
    {
        TubeTflApi api = new TubeTflApi();
        var departures = api.GetLiveDepartures(code);
        if (count.HasValue)
            departures = departures.Take(count.Value).ToList();
        
        foreach (TubeDeparture tubeDeparture in departures)
        {
            if (tubeDeparture.Destination.Contains(" Underground Station"))
                tubeDeparture.Destination = tubeDeparture.Destination.Replace(" Underground Station", "");
        }
        
        return departures;
    }
    
    [HttpGet("station/{code}")]
    public TubeStationInfo GetTubeStation(string code)
    {
        var stopPoint = _cache.GetOrCreate($"tube_stations_{code}", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(3);
            TubeTflApi api = new TubeTflApi();
            return api.GetStation(code);
        });
        
        return new TubeStationInfo(code, stopPoint);
    }
    

    [HttpGet("search")]
    public List<TflBase.StopPoint> Search(string query)
    {
        var stations = _cache.GetOrCreate("tube_stations", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(3);
            TubeTflApi api = new TubeTflApi();
            return api.GetAllStations();
        });

        return stations;
    }
}

public class TubeStationInfo
{
    public string Code { get; set; }
    public string Name { get; set; }
    
    public TubeStationInfo(string code, TflBase.StopPoint stopPoint)
    {
        Code = code;
        Name = stopPoint.CommonName.Replace(" Underground Station", "");
    }
}
