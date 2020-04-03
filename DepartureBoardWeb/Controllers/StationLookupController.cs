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
			return _stationLookup.Stations;
		}

		private Dictionary<string, string> Search(string query)
		{
			Dictionary<string, string> stations = _stationLookup.Stations.ToDictionary(entry => entry.Key, entry => entry.Value);
			return stations.Where(s => s.Value.Contains(query, StringComparison.InvariantCultureIgnoreCase)).OrderByDescending(s => s.Value.StartsWith(query, StringComparison.InvariantCultureIgnoreCase)).ToDictionary(x => x.Key, x => x.Value);
		}

		[HttpGet("[action]")]
		public JsonResult GetStationNameFromCode(string code = "")
		{
			code = code.ToUpper();
			_stationLookup.Stations.TryGetValue(code, out string stationName);
			return Json(stationName ?? code);
		}

		[HttpGet("[action]")]
		public JsonResult GetStationCodeFromName(string name)
		{
			Dictionary<string, string> stations = _stationLookup.Stations.ToDictionary(entry => entry.Key, entry => entry.Value);
			stations =  stations.Where(s => s.Value.Equals(name.Trim(), StringComparison.InvariantCultureIgnoreCase)).ToDictionary(x => x.Key, x => x.Value);
			if(stations.Count == 1)
			{
				return Json(stations.Keys.First());
			}
			return Json(string.Empty);
		}
	}
}