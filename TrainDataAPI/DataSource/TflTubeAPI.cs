using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using DepartureBoardCore;
using Newtonsoft.Json;
using RestSharp;
using TrainDataAPI.Services;

namespace TrainDataAPI
{
    public class TflTubeAPI : ITrainDatasource
    {
        public const string DataSourceId = "TFLTUBE";
        private readonly RestClient _client = new RestClient("https://api.tfl.gov.uk");
        private static string AppKey => ConfigService.TflApiToken;
        
        public List<Departure> GetLiveDepartures(LiveDeparturesRequest request)
        {
            return GetDepartures(request);
        }

        public List<Departure> GetLiveArrivals(LiveDeparturesRequest request)
        {
            return GetDepartures(request);
        }

        public List<StationStop> GetStationStops(string serviceIdentifier, LiveDeparturesRequest request)
        {
            return new List<StationStop>();
        }

        private List<Departure> GetDepartures(LiveDeparturesRequest departuresRequest)
        {
            var request = new RestRequest($"StopPoint/{departuresRequest.stationCode}/Arrivals", Method.GET);
            IRestResponse response = SendRequest(request);

            var arrivals = JsonConvert.DeserializeObject<List<TflArrival>>(response.Content);

            return arrivals
                .Select(a => new Departure(a.StationName, departuresRequest.stationCode, a.PlatformName.Replace("Platform ", ""), "Transport for London", a.ExpectedArrival, 
                    a.ExpectedArrival, a.DestinationName, Departure.ServiceStatus.ONTIME))
                .ToList();
        }

        public List<StationLookup.Station> GetAllStations()
        {
            var request = new RestRequest($"StopPoint/mode/tube", Method.GET);
            IRestResponse response = SendRequest(request);

            var stations = JsonConvert.DeserializeObject<TflStopPointResponse>(response.Content);

            return stations.StopPoints.
                Select(s => new StationLookup.Station(s.StationNaptan ?? s.NaptanId, s.CommonName, "GB", DataSourceId))
                .Distinct(new StationDeduplicator())
                .ToList();
        }

        private class StationDeduplicator : IEqualityComparer<StationLookup.Station>
        {
            public bool Equals(StationLookup.Station x, StationLookup.Station y)
            {
                return x?.Code == y?.Code;
            }

            public int GetHashCode(StationLookup.Station obj) => obj.Code.GetHashCode();
        }

        private IRestResponse SendRequest(RestRequest request)
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
        }

        public class TflArrival
        {
            public string StationName { get; set; }
            public string LineName { get; set; }
            public string DestinationName { get; set; }
            public DateTime ExpectedArrival { get; set; }
            public string PlatformName { get; set; }
        }
    }
}
