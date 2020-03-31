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
			return _stationLookup.Stations.Where(s => s.Value.Contains(query, StringComparison.OrdinalIgnoreCase)).ToDictionary(x => x.Key, x => x.Value);
		}
	}
}