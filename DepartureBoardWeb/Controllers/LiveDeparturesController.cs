using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using DepartureBoardWeb.Models;
using Microsoft.AspNetCore.Mvc;
using TrainDataAPI;
using TrainDataAPI.Services;

namespace DepartureBoardWeb.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LiveDeparturesController : Controller
    {
	    private readonly IStationLookup _stationLookup;
	    public LiveDeparturesController(IStationLookup stationLookup)
	    {
		    _stationLookup = stationLookup;
	    }

        [HttpGet]
        public JsonResult GetLatestDepaturesSingleBoard([Required] string stationCode, string platform = null, string dataSource = null, int count = 3, bool includeNonPassengerServices = false)
        {
            return Json(GetSingleBoardData(false, stationCode, platform, dataSource, count, includeNonPassengerServices));
        }

        [HttpGet]
        public JsonResult GetLatestArrivalsSingleBoard([Required] string stationCode, string platform = null, string dataSource = null, int count = 3, bool includeNonPassengerServices = false)
        {
            return Json(GetSingleBoardData(true, stationCode, platform, dataSource, count, includeNonPassengerServices));
        }

        private SingleBoardData GetSingleBoardData(bool arrivals, string stationCode, string platform, string dataSource, int count, bool includeNonPassengerServices)
        {
            stationCode = stationCode.ToUpper();
            ITrainDatasource trainDatasource = GetDatasource(dataSource);
            LiveDeparturesRequest liveDeparturesRequest = new LiveDeparturesRequest(stationCode, platform, count, includeNonPassengerServices);
            List<Departure> departures = arrivals
                ? trainDatasource.GetLiveArrivals(liveDeparturesRequest)
                : trainDatasource.GetLiveDepartures(liveDeparturesRequest);
            if (departures == null || departures.Count == 0)
                return new SingleBoardData(new List<Departure>(), string.Empty);

            string information = StopInformationBuilder(departures[0], liveDeparturesRequest);

            return new SingleBoardData(departures, information);
        }

        [HttpGet]
        public JsonResult GetLatestDepatures([FromQuery] GetLatestDepartureRequest request)
        {
            return Json(GetLiveDepartureData(false, request));
        }

        [HttpGet]
        public JsonResult GetLatestArrivals([FromQuery] GetLatestDepartureRequest request)
        {
            return Json(GetLiveDepartureData(true, request));
        }

        private ITrainDatasource GetDatasource(string dataSource)
        {
	        return dataSource?.ToUpper() switch
	        {
		        "NATIONALRAIL" => new NationalRailAPI(),
		        "DEUTSCHEBAHN" => new DeutscheBahnAPI(),
		        _ => new RealTimeTrainsAPI()
	        };
        }

        private List<Departure> GetLiveDepartureData(bool arrivals, GetLatestDepartureRequest request)
        {
	        (string stationCode, int count, string platform, string dataSource, bool includeNonPassengerServices) = request;

            if (count == 0)
                count = 6;

	        stationCode = stationCode?.ToUpper();
	        Serilog.Log.Information("GetLiveDepartureData: Loading {count} {arrivals} displays for StationCode {stationCode} ({stationName}). Using datasource {datasource}",
	            count, arrivals ? "arrival" : "departure", stationCode, _stationLookup?.GetStationFromCode(stationCode)?.Name, dataSource);

            ITrainDatasource trainDatasource = GetDatasource(dataSource);
            LiveDeparturesRequest liveDeparturesRequest =
                new LiveDeparturesRequest(stationCode, platform, count, includeNonPassengerServices);
            List<Departure> departures = arrivals
                ? trainDatasource.GetLiveArrivals(liveDeparturesRequest)
                : trainDatasource.GetLiveDepartures(liveDeparturesRequest);
            if (departures == null || departures.Count == 0)
                return new List<Departure>();

            departures = departures.Take(count).ToList();
            departures.AsParallel().ForAll(d => d.LoadStops(liveDeparturesRequest));
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

        private string StopInformationBuilder(Departure departure, LiveDeparturesRequest liveDeparturesRequest)
        {
            departure.LoadStops(liveDeparturesRequest);
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
                else if (stop.StationCode?.ToUpper() == departure.StationCode?.ToUpper() && !foundFirst)
                {
                    foundFirst = true;
                    information = "Calling at ";
                    continue;
                }
                if (!foundFirst)
                    continue;
                information += $"{stop.StationName} ({stop.AimedDeparture:HH:mm})       ";
            }
            if (information == "Calling at ")
                information = "";
            return information;
        }
    }
}
