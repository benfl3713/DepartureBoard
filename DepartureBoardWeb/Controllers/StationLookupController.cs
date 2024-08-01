using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TrainDataAPI.Services;

namespace DepartureBoardWeb.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StationLookupController : Controller
  {
    private IStationLookup _stationLookup;

    public StationLookupController(IStationLookup stationLookup)
    {
      _stationLookup = stationLookup;
    }

    [HttpGet]
    public List<StationLookup.Station> Get(string query)
    {
      if (!string.IsNullOrEmpty(query)) return Search(query);
      return _stationLookup.Stations;
    }

	[HttpGet("[action]")]
    public List<StationLookup.Station> Search(string query, int maxCount = 15)
    {
	  if (string.IsNullOrEmpty(query))
	  	return new List<StationLookup.Station>();

      List<StationLookup.Station> stations = _stationLookup.Stations;
      return stations?.Where(s => s.Name.Contains(query, StringComparison.InvariantCultureIgnoreCase) || s.Code.Contains(query, StringComparison.InvariantCultureIgnoreCase)).OrderByDescending(s => s.Name.StartsWith(query, StringComparison.InvariantCultureIgnoreCase)).Take(maxCount).ToList();
    }

    [HttpGet("[action]")]
    public JsonResult GetStationNameFromCode(string code = "")
    {
      code = code.ToUpper();
      var station = _stationLookup.Stations?.FirstOrDefault(s => s.Code == code);
      return Json(station?.Name ?? code);
    }

    [HttpGet("[action]")]
    public JsonResult GetStationCodeFromName(string name)
    {
      List<StationLookup.Station> stations = _stationLookup.Stations;
      stations = stations.Where(s => s.Name.Equals(name.Trim(), StringComparison.InvariantCultureIgnoreCase)).ToList();
      if (stations.Count == 1)
      {
        return Json(stations.First().Code);
      }

      return Json(string.Empty);
    }
    
    [HttpGet("[action]")]
    public JsonResult GetStationInfoFromCode(string code = "")
    {
      code = code.ToUpper();
      var station = _stationLookup.Stations?.FirstOrDefault(s => s.Code == code);

      // Get timezone for the UK
      var offset = TimeZoneInfo.ConvertTime(DateTimeOffset.Now, TimeZoneInfo.FindSystemTimeZoneById("GB")).Offset.Hours;
      
      return Json(new
      {
        name = station?.Name ?? code,
        utcOffset = offset
      });
    }
  }
}
