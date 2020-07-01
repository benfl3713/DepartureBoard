using System;
using System.Collections.Generic;
using NationalRailService;
using Newtonsoft.Json;

namespace TrainDataAPI
{
    public class NationalRailAPI : ITrainDatasource
    {
        private AccessToken AccessToken = new AccessToken() { TokenValue = ConfigService.NationalRail_AccessToken};
        private LDBServiceSoapClient client = new LDBServiceSoapClient(LDBServiceSoapClient.EndpointConfiguration.LDBServiceSoap);
        public List<Departure> GetLiveArrivals(string stationCode, int count)
        {
            GetArrivalBoardResponse arrivalsResponse = client.GetArrivalBoardAsync(AccessToken, 120, "COV", null, FilterType.to, 0, 1440).Result;
            var test = JsonConvert.SerializeObject(arrivalsResponse.GetStationBoardResult);
            return new List<Departure>();
        }

        public List<Departure> GetLiveDepartures(string stationCode, int count)
        {
            GetDepartureBoardResponse departuresResponse = client.GetDepartureBoardAsync(AccessToken, ushort.Parse(count.ToString()), stationCode, null, FilterType.to, 0, 1440).Result;
            var test = JsonConvert.SerializeObject(departuresResponse.GetStationBoardResult);
            List<Departure> departures = new List<Departure>();
            foreach (ServiceItem2 departure in departuresResponse.GetStationBoardResult.trainServices)
            {
                Departure.ServiceStatus status = Departure.ServiceStatus.ONTIME;
                DateTime scheduledDeparture = departuresResponse.GetStationBoardResult.generatedAt.Date.Add(TimeSpan.Parse(departure.std));
                DateTime expectedDeparture = scheduledDeparture;
                if (TimeSpan.TryParse(departure.etd, out TimeSpan etd))
                {
                    expectedDeparture = departuresResponse.GetStationBoardResult.generatedAt.Date.Add(etd);
                    status = Departure.ServiceStatus.LATE;
                }

                

                if (departure.isCancelled)
                    status = Departure.ServiceStatus.CANCELLED;

                departures.Add(new Departure(departuresResponse.GetStationBoardResult.locationName,
                    departuresResponse.GetStationBoardResult.crs,
                    departure.platform,
                    departure.@operator,
                    scheduledDeparture,
                    expectedDeparture,
                    departure.destination[0].locationName,
                    status,
                    departure.origin[0].locationName,
                    departuresResponse.GetStationBoardResult.generatedAt,
                    departure.serviceID,
                    GetType(),
                    Convert.ToInt32(departure.length)));
            }
            return departures;
        }

        public List<StationStop> GetStationStops(string url)
        {
            List<StationStop> stops = new List<StationStop>();
            try
            {
                GetServiceDetailsResponse stopsResponse = client.GetServiceDetailsAsync(AccessToken, url).Result;
                var test = JsonConvert.SerializeObject(stopsResponse.GetServiceDetailsResult);
                foreach(CallingPoint1 stop in stopsResponse.GetServiceDetailsResult.subsequentCallingPoints[0].callingPoint)
                {
                    DateTime scheduledDeparture = stopsResponse.GetServiceDetailsResult.generatedAt.Date.Add(TimeSpan.Parse(stop.st));
                    DateTime expectedDeparture = scheduledDeparture;
                    if (TimeSpan.TryParse(stop.et, out TimeSpan etd))
                        expectedDeparture = stopsResponse.GetServiceDetailsResult.generatedAt.Date.Add(etd);
                    stops.Add(new StationStop(stop.crs, stop.locationName, StationStop.StopType.LI, 0, scheduledDeparture, expectedDeparture));
                }
                return stops;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return stops;
            }
        }
    }
}
