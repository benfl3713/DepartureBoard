using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TrainDataAPI;

namespace DepartureBoardWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LiveDeparturesController : Controller
    {
        [HttpPost("[action]")]
        public JsonResult GetLatestDepatures()
        {
            ITrainDatasource trainDatasource = new TransportAPI();
            return Json("TESt");
        }

        [HttpPost("[action]")]
        public JsonResult GetLatestDepaturesSingleBoard([FromBody] string stationCode)
        {
            stationCode = stationCode.ToUpper();
            ITrainDatasource trainDatasource = new TransportAPI();
            List<Departure> departures = trainDatasource.GetLiveDepartures(stationCode);
            if (departures.Count == 0)
                return null;

            string information = StopInformationBuilder(departures[0]);
            
            return Json(new SingleBoardData(departures, information));
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
                    departure.Stops = null;
                }
            }
        }

        private string StopInformationBuilder(Departure departure)
        {
            departure.LoadStops();
            string information = "Calling at ";
            bool foundFirst = false;
            foreach(StationStop stop in departure.Stops)
            {
                if (stop.StationCode.ToUpper() == departure.StationCode.ToUpper())
                {
                    foundFirst = true;
                    continue;
                }
                if (!foundFirst)
                    continue;
                information += $"{stop.StationName} ({stop.AimedDeparture.ToString("HH:mm")})       ";
            }
            return information;
        }
    }
}