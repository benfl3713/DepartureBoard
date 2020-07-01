using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using TrainDataAPI;

namespace DepartureBoardWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LiveDeparturesController : Controller
    {
        [HttpPost("[action]")]
        public JsonResult GetLatestDepaturesSingleBoard([FromBody] string stationCode, string platform = null)
        {
            return Json(GetSingleBoardData(false, stationCode, platform));
        }

        [HttpPost("[action]")]
        public JsonResult GetLatestArrivalsSingleBoard([FromBody] string stationCode, string platform = null)
        {
            return Json(GetSingleBoardData(true, stationCode, platform));
        }

        private SingleBoardData GetSingleBoardData(bool arrivals, string stationCode, string platform = null)
        {
            stationCode = stationCode.ToUpper();
            ITrainDatasource trainDatasource = new RealTimeTrainsAPI();
            List<Departure> departures = arrivals ? trainDatasource.GetLiveArrivals(stationCode, 2) : trainDatasource.GetLiveDepartures(stationCode, 2);
            if (departures == null || departures.Count == 0)
                return new SingleBoardData(new List<Departure>(), string.Empty);

            if (platform != null)
                departures = departures.Where(d => d.Platform == platform).ToList();

            string information = StopInformationBuilder(departures[0]);

            return new SingleBoardData(departures, information);
        }

        [HttpPost("[action]")]
        public JsonResult GetLatestDepatures(string platform = null, string dataSource = null)
        {
            return Json(GetLiveDepartureData(false, platform, dataSource));
        }

        [HttpPost("[action]")]
        public JsonResult GetLatestArrivals(string platform = null, string dataSource = null)
        {
            return Json(GetLiveDepartureData(true, platform, dataSource));
        }

        private List<Departure> GetLiveDepartureData(bool arrivals, string platform = null, string dataSource = null)
        {
            if (Request.Form.TryGetValue("stationCode", out StringValues stationCodeValues) && stationCodeValues.Count > 0
                && Request.Form.TryGetValue("amount", out StringValues amountValues) && amountValues.Count > 0)
            {
                string stationCode = stationCodeValues[0].ToUpper();
                if (!int.TryParse(amountValues[0], out int count))
                    count = 6;

                ITrainDatasource trainDatasource;
                switch (dataSource?.ToUpper())
                {
                    case ("NATIONALRAIL"):
                        trainDatasource = new NationalRailAPI();
                        break;
                    default:
                        trainDatasource = new RealTimeTrainsAPI();
                        break;
                }
                List<Departure> departures = arrivals ? trainDatasource.GetLiveArrivals(stationCode, count) : trainDatasource.GetLiveDepartures(stationCode, count);
                if (departures == null || departures.Count == 0)
                    return new List<Departure>();

                if (platform != null)
                    departures = departures.Where(d => d.Platform == platform).ToList();

                departures = departures.Take(count).ToList();
                //departures.ForEach(d => d.LoadStops());
                departures.AsParallel().ForAll(d => d.LoadStops());
                foreach (Departure departure in departures)
                {
                    if(departure.FromDataSouce == typeof(RealTimeTrainsAPI))
                        departure.StopsAsOfDepartureStation();
                    departure.FromDataSouce = null;
                }
                return departures;
            }
            return new List<Departure>();
        }

        private class SingleBoardData
        {
            public List<Departure> Departures { get; set; }
            public string Information { get; set; }
            public SingleBoardData(List<Departure> departures, string information)
            {
                Departures = departures.Take(2).ToList();
                Information = information;

                foreach(Departure departure in Departures)
                {
                    departure.FromDataSouce = null;
                    departure.ClearStops();
                }
            }
        }

        private string StopInformationBuilder(Departure departure)
        {
            departure.LoadStops();
            string information = "";
            bool foundFirst = false;
            if (departure.Stops == null)
                return string.Empty;
            foreach(StationStop stop in departure.Stops)
            {
                if (stop.StationCode.ToUpper() == departure.StationCode.ToUpper())
                {
                    foundFirst = true;
                    information = "Calling at ";
                    continue;
                }
                if (!foundFirst)
                    continue;
                information += $"{stop.StationName} ({stop.AimedDeparture.ToString("HH:mm")})       ";
            }
            if (information == "Calling at ")
                information = "";
            return information;
        }
    }
}