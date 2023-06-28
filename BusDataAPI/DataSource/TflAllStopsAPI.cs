using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore;
using Newtonsoft.Json;
using RestSharp;

namespace BusDataAPI.DataSource
{

    public class TflAllStopsAPI : IBusDatasource
    {
        private readonly RestClient _client = new RestClient("https://api.tfl.gov.uk");
        private static string AppKey => ConfigService.TflApiToken;

        public List<BusDeparture> GetLiveDepartures(string atocCode)
        {
            var request = new RestRequest($"StopPoint/{atocCode}");
            RestResponse response = SendRequest(request);
            var naptanIds = GetAllNaptanIds(response);

            if (naptanIds == null)
                throw new Exception("Could not find stops for that code");

            List<BusDeparture> busDepartures = new List<BusDeparture>();

            foreach (string naptanId in naptanIds)
            {
                busDepartures.AddRange(GetDeparturesForNaptanIds(naptanId));
            }

            return busDepartures.OrderBy(d => d.AimedDeparture).ToList();
        }

        private HashSet<string> GetAllNaptanIds(RestResponse rawResponse)
        {
            TflStopPointResponse response = JsonConvert.DeserializeObject<TflStopPointResponse>(rawResponse.Content);
            if (response?.LineGroup == null)
                return null;

            HashSet<string> codes = new HashSet<string>();

            foreach (LineGroup lineGroup in response.LineGroup)
            {
                if (codes.Contains(lineGroup.NaptanIdReference))
                    continue;

                codes.Add(lineGroup.NaptanIdReference);
            }

            return codes;
        }

        private List<BusDeparture> GetDeparturesForNaptanIds(string naptanId)
        {
            List<BusDeparture> busDepartures = new List<BusDeparture>();
            var request = new RestRequest($"StopPoint/{naptanId}/Arrivals");
            RestResponse response = SendRequest(request);
            if (response == null || !response.IsSuccessful)
                return new List<BusDeparture>();

            List<TflArrival> arrivals = JsonConvert.DeserializeObject<List<TflArrival>>(response.Content);

            if (arrivals == null)
                return busDepartures;

            foreach (TflArrival tflArrival in arrivals)
            {
                busDepartures.Add(new BusDeparture(tflArrival.LineName, tflArrival.DestinationName,
                    tflArrival.StationName,
                    null, null,
                    tflArrival.ExpectedArrival, tflArrival.ExpectedArrival));
            }

            return busDepartures;
        }

        private RestResponse SendRequest(RestRequest request)
        {
            request.AddQueryParameter("app_key", AppKey);
            return _client.Execute(request);
        }

        public class TflStopPointResponse
        {
            public List<LineGroup> LineGroup { get; set; }
        }

        public class LineGroup
        {
            public string Type { get; set; }
            public string NaptanIdReference { get; set; }
            public string StationAtcoCode { get; set; }
            public List<string> LineIdentifier { get; set; }
        }

        public class LineModeGroup
        {
            public string Type { get; set; }
            public string ModeName { get; set; }
            public List<long> LineIdentifier { get; set; }
        }

        public class TflArrival
        {
            public string StationName { get; set; }
            public string LineName { get; set; }
            public string DestinationName { get; set; }
            public DateTime ExpectedArrival { get; set; }
        }
    }
}
