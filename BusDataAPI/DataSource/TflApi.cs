using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore;
using Newtonsoft.Json;
using RestSharp;

namespace BusDataAPI.DataSource
{
    public class TflApi : IBusDatasource
    {
        private readonly RestClient _client = new RestClient("https://api.tfl.gov.uk");
        private static string AppKey => ConfigService.TflApiToken;
        
        public List<BusDeparture> GetLiveDepartures(string code)
        {
            return GetDepartures(code);
        }

        private List<BusDeparture> GetDepartures(string code)
        {
            var request = new RestRequest($"StopPoint/{code}/Arrivals", Method.Get);
            RestResponse response = SendRequest(request);

            var arrivals = JsonConvert.DeserializeObject<List<TflArrival>>(response.Content);

            return arrivals
                .Select(a => new BusDeparture(
                    a.LineName, 
                    a.DestinationName, 
                    a.StationName, 
                    "TFL", 
                    "Transport for London", 
                    a.ExpectedArrival, 
                    a.ExpectedArrival, 
                    a.PlatformName,
                    GetConvertedTimeToStation(a.TimeToStation)
                    )
                )
                .Where(a => !string.IsNullOrEmpty(a.Destination))
                .OrderBy(a => a.AimedDeparture)
                .ToList();
        }

        private int? GetConvertedTimeToStation(int? timeInSeconds)
        {
            if (!timeInSeconds.HasValue)
                return null;

            return Convert.ToInt32(Math.Ceiling(timeInSeconds.Value / 60m));
        }

        public List<StopPoint> GetAllStations()
        {
            var request = new RestRequest($"StopPoint/mode/tube", Method.Get);
            RestResponse response = SendRequest(request);
        
            var stations = JsonConvert.DeserializeObject<TflStopPointResponse>(response.Content);
        
            return stations.StopPoints
                .ToList();
        }

        private RestResponse SendRequest(RestRequest request)
        {
            request.AddQueryParameter("app_key", AppKey);
            return _client.Execute(request);
        }

        public class TflStopPointResponse
        {
            public List<StopPoint> StopPoints { get; set; }
        }

        public class StopPoint
        {
            public string NaptanId { get; set; }
            public string StationNaptan { get; set; }
            public string CommonName { get; set; }
            public string PlatformName { get; set; }
            public List<dynamic> Lines { get; set; }
        }

        public class TflArrival
        {
            public string StationName { get; set; }
            public string LineName { get; set; }
            public string DestinationName { get; set; }
            public DateTime ExpectedArrival { get; set; }
            public string PlatformName { get; set; }
            public int? TimeToStation { get; set; }
        }
    }
}
