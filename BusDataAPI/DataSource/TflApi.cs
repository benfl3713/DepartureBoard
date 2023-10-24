using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore.DataSource;
using Newtonsoft.Json;
using RestSharp;

namespace BusDataAPI.DataSource
{
    public class TflApi : TflBase, IBusDatasource
    {
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
    }
}
