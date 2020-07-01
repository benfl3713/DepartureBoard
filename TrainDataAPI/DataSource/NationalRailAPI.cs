using System;
using System.Collections.Generic;
using NationalRailService;
using Newtonsoft.Json;

namespace TrainDataAPI
{
    public class NationalRailAPI : ITrainDatasource
    {
        private AccessToken AccessToken = new AccessToken() { TokenValue = "" };
        private LDBServiceSoapClient client = new LDBServiceSoapClient(LDBServiceSoapClient.EndpointConfiguration.LDBServiceSoap);
        public List<Departure> GetLiveArrivals(string stationCode)
        {
            GetArrivalBoardResponse arrivalsResponse = client.GetArrivalBoardAsync(AccessToken, 120, "COV", null, FilterType.to, 0, 1440).Result;
            var test = JsonConvert.SerializeObject(arrivalsResponse.GetStationBoardResult);
            return new List<Departure>();
        }

        public List<Departure> GetLiveDepartures(string stationCode)
        {
            GetDepartureBoardResponse departuresResponse = client.GetDepartureBoardAsync(AccessToken, 120, "COV", null, FilterType.to, 0, 1440).Result;
            var test = JsonConvert.SerializeObject(departuresResponse.GetStationBoardResult);
            return new List<Departure>();
        }

        public List<StationStop> GetStationStops(string url)
        {
            try
            {
                GetServiceDetailsResponse stopsResponse = client.GetServiceDetailsAsync(AccessToken, url).Result;
                var test = JsonConvert.SerializeObject(stopsResponse.GetServiceDetailsResult);
                return new List<StationStop>();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new List<StationStop>();
            }
        }
    }
}
