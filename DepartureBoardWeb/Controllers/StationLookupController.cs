using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainDataAPI.Services;

namespace DepartureBoardWeb.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class StationLookupController : Controller
	{
		public StationLookup _stationLookup;
		public StationLookupController(StationLookup stationLookup) { _stationLookup = stationLookup; }

		[HttpGet]
		public Dictionary<string, string> Get(string query)
		{
			if (!string.IsNullOrEmpty(query))
				return Search(query);
			return _stationLookup.Stations.ToDictionary(x => x.Key, x => x.Value.Name);
		}

		private Dictionary<string, string> Search(string query)
		{
			Dictionary<string, StationLookup.Station> stations = _stationLookup.Stations?.ToDictionary(entry => entry.Key, entry => entry.Value);
			return stations?.Where(s => s.Value.Name.Contains(query, StringComparison.InvariantCultureIgnoreCase) || s.Key.Contains(query, StringComparison.InvariantCultureIgnoreCase)).OrderByDescending(s => s.Value.Name.StartsWith(query, StringComparison.InvariantCultureIgnoreCase)).Take(15).ToDictionary(x => x.Key, x => x.Value.Name);
		}

		[HttpGet("[action]")]
		public JsonResult GetStationNameFromCode(string code = "")
		{
			code = code.ToUpper();
			_stationLookup.Stations.TryGetValue(code, out StationLookup.Station station);
			return Json(station?.Name ?? code);
		}

		[HttpGet("[action]")]
		public JsonResult GetStationCodeFromName(string name)
		{
			Dictionary<string, string> stations = _stationLookup.Stations.ToDictionary(entry => entry.Key, entry => entry.Value.Name);
			stations =  stations.Where(s => s.Value.Equals(name.Trim(), StringComparison.InvariantCultureIgnoreCase)).ToDictionary(x => x.Key, x => x.Value);
			if(stations.Count == 1)
			{
				return Json(stations.Keys.First());
			}
			return Json(string.Empty);
		}
	}
}