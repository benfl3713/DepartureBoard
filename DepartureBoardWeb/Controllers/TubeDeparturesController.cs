using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
    public List<TubeDeparture> GetTubeLiveDepartures(string code, int? count, string line = null, string direction = null)
    {
        var cacheEntry = _cache.GetOrCreate($"{code}_{count}_{line}_{direction}", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30);

            var stopPointInfo = GetStopPointInfo(code);
            if (stopPointInfo.IsHubStation())
            {
                var stations = stopPointInfo.GetChildTubeStopPoints().Select(c => c.NaptanId).ToList();
                return stations.SelectMany(s => GetTubeDepartures(s, count, line, direction)).ToList();
            }
            
            return GetTubeDepartures(code, count, line, direction);
        });
        return cacheEntry;
    }

    private List<TubeDeparture> GetTubeDepartures(string code, int? count, string line, string direction)
    {
        string[] lines = line?.Split(',');
        TubeTflApi api = new TubeTflApi();
        var departures = api.GetLiveDepartures(code);

        if (!string.IsNullOrEmpty(line))
            departures = departures.Where(d => lines.Contains(d.LineId)).ToList();

        if (!string.IsNullOrEmpty(direction))
            departures = departures.Where(d => ContainsPlatformName(direction, d)).ToList();

        if (count.HasValue)
            departures = departures.Take(count.Value).ToList();

        foreach (TubeDeparture tubeDeparture in departures)
        {
            if (tubeDeparture.Destination.Contains(" Underground Station"))
                tubeDeparture.Destination = tubeDeparture.Destination.Replace(" Underground Station", "");
        }

        return departures;
    }

    private static bool ContainsPlatformName(string direction, TubeDeparture d)
    {
        string[] parts = d.Platform?.Split('-');

        if (parts == null || parts.Length == 0)
            return false;

        return parts[0].Trim().Equals(direction, StringComparison.InvariantCultureIgnoreCase);
    }

    [HttpGet("station/{code}")]
    public TubeStationInfo GetTubeStation(string code)
    {
        TflBase.StopPoint stopPoint = GetStopPointInfo(code);
        return new TubeStationInfo(code, stopPoint);
    }

    private TflBase.StopPoint GetStopPointInfo(string code)
    {
        return _cache.GetOrCreate($"tube_stations_{code}", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(3);
            TubeTflApi api = new TubeTflApi();
            return api.GetStation(code);
        });
    }


    [HttpGet("search")]
    public List<TubeTflApi.StopPointSearchResult.StopPointSearchMatch> Search([Required] string query)
    {
        var stations = _cache.GetOrCreate($"tube_stations_{query}", entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(3);
            TubeTflApi api = new TubeTflApi();
            return api.SearchStations(query);
        });

        return stations;
    }
}

public class TubeStationInfo
{
    public string Code { get; set; }
    public string Name { get; set; }
    public List<Line> Lines { get; set; } = new List<Line>();

    public TubeStationInfo(string code, TflBase.StopPoint stopPoint)
    {
        Code = code;
        Name = stopPoint.CommonName.Replace(" Underground Station", "");

        var tubeLines = stopPoint.Lines?.Where(l => stopPoint.LineModeGroups.Any(m => m.ModeName == "tube" && m.LineIdentifier.Contains(l.Id))).ToList() ?? new List<TflBase.StopPoint.Line>();

        Lines = tubeLines.Select(l => new Line { Id = l.Id, Name = l.Name }).ToList();
    }

    public class Line
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
