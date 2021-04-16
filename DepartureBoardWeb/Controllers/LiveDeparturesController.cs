﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TrainDataAPI;

namespace DepartureBoardWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LiveDeparturesController : Controller
    {
        [HttpGet("[action]")]
        public JsonResult GetLatestDepaturesSingleBoard([Required] string stationCode, string platform = null, string dataSource = null)
        {
            return Json(GetSingleBoardData(false, stationCode, platform, dataSource));
        }

        [HttpGet("[action]")]
        public JsonResult GetLatestArrivalsSingleBoard([Required] string stationCode, string platform = null, string dataSource = null)
        {
            return Json(GetSingleBoardData(true, stationCode, platform, dataSource));
        }

        private SingleBoardData GetSingleBoardData(bool arrivals, string stationCode, string platform = null, string dataSource = null, int count = 3)
        {
            stationCode = stationCode.ToUpper();
            ITrainDatasource trainDatasource = GetDatasource(dataSource);
            List<Departure> departures = arrivals ? trainDatasource.GetLiveArrivals(stationCode, count) : trainDatasource.GetLiveDepartures(stationCode, count);
            if (departures == null || departures.Count == 0)
                return new SingleBoardData(new List<Departure>(), string.Empty);

            if (platform != null)
                departures = departures.Where(d => d.Platform == platform).ToList();

            string information = StopInformationBuilder(departures[0]);

            return new SingleBoardData(departures, information);
        }

        [HttpGet("[action]")]
        public JsonResult GetLatestDepatures([Required] string stationCode, int count = 6, string platform = null, string dataSource = null)
        {
            return Json(GetLiveDepartureData(stationCode, false, count, platform, dataSource));
        }

        [HttpGet("[action]")]
        public JsonResult GetLatestArrivals([Required] string stationCode, int count = 6, string platform = null, string dataSource = null)
        {
            return Json(GetLiveDepartureData(stationCode, true, count, platform, dataSource));
        }

        private ITrainDatasource GetDatasource(string dataSource)
        {
            switch (dataSource?.ToUpper())
            {
                case ("NATIONALRAIL"):
                    return new NationalRailAPI();
                case ("DEUTSCHEBAHN"):
                    return new DeutscheBahnAPI();
                default:
                    return new RealTimeTrainsAPI();
            }
        }

        private List<Departure> GetLiveDepartureData(string stationCode, bool arrivals, int count = 6, string platform = null, string dataSource = null)
        {
            stationCode = stationCode?.ToUpper();

            ITrainDatasource trainDatasource = GetDatasource(dataSource);
            List<Departure> departures = arrivals ? trainDatasource.GetLiveArrivals(stationCode, count) : trainDatasource.GetLiveDepartures(stationCode, count);
            if (departures == null || departures.Count == 0)
                return new List<Departure>();

            if (platform != null)
                departures = departures.Where(d => d.Platform == platform).ToList();

            departures = departures.Take(count).ToList();
            departures.AsParallel().ForAll(d => d.LoadStops());
            foreach (Departure departure in departures)
            {
                if (departure.FromDataSouce == typeof(RealTimeTrainsAPI))
                    departure.StopsAsOfDepartureStation();
                departure.FromDataSouce = null;
            }

            return departures;
        }

        private class SingleBoardData
        {
            public List<Departure> Departures { get; set; }
            public string Information { get; set; }
            public SingleBoardData(List<Departure> departures, string information)
            {
                Departures = departures.Take(3).ToList();
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
                if(departure.FromDataSouce == typeof(NationalRailAPI) && !foundFirst)
                {
                    information = "Calling at ";
                    foundFirst = true;
                }
                else if (stop.StationCode.ToUpper() == departure.StationCode.ToUpper() && !foundFirst)
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