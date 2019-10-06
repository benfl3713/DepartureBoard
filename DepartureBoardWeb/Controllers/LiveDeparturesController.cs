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
        public JsonResult GetLatestDepaturesSingleBoard([FromBody] string stationCode)
        {
            stationCode = stationCode.ToUpper();
            ITrainDatasource trainDatasource = new RealTimeTrainsAPI();
            List<Departure> departures = trainDatasource.GetLiveDepartures(stationCode);
            if (departures.Count == 0)
                return null;

            string information = StopInformationBuilder(departures[0]);
            
            return Json(new SingleBoardData(departures, information));
        }

        [HttpPost("[action]")]
        public JsonResult GetLatestDepatures()
        {
            if (Request.Form.TryGetValue("stationCode", out StringValues stationCodeValues) && stationCodeValues.Count > 0
                && Request.Form.TryGetValue("amount", out StringValues amountValues) && amountValues.Count > 0)
            {
                string stationCode = stationCodeValues[0].ToUpper();
                int.TryParse(amountValues[0], out int count);
                ITrainDatasource trainDatasource = new RealTimeTrainsAPI();
                List<Departure> departures = trainDatasource.GetLiveDepartures(stationCode);
                if (departures.Count == 0)
                    return null;

                departures = departures.Take(count).ToList();
                departures.ForEach(d => d.LoadStops());
                foreach (Departure departure in departures)
                {
                    departure.StopsAsOfDepartureStation();
                    departure.FromDataSouce = null;
                }
                return Json(departures);
            }
            return null;
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