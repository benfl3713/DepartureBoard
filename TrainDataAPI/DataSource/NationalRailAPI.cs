using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore;
using NationalRailDarwin;
using StationBoard2 = NationalRailDarwin.StationBoard2;

namespace TrainDataAPI
{
    public class NationalRailAPI : ITrainDatasource
    {
        private const int MAX_TIME_WINDOW = 1440;

        private readonly AccessToken _accessToken = new AccessToken { TokenValue = ConfigService.NationalRail_AccessToken};
        private readonly LDBSVServiceSoapClient _client = new LDBSVServiceSoapClient(LDBSVServiceSoapClient.EndpointConfiguration.LDBSVServiceSoap);
        public List<Departure> GetLiveArrivals(LiveDeparturesRequest request)
        {
            // If a platform is specified then we can't limit the request count before we then apply the platform filter
            ushort numRows = string.IsNullOrEmpty(request.platform)
                ? ushort.Parse(request.count.ToString())
                : (ushort)150;

            StationBoard2 arrivalsResponse = _client.GetArrivalBoardByCRS(_accessToken, numRows,
                request.stationCode, DateTime.Now, MAX_TIME_WINDOW, null, FilterType.to, null, null,
                request.includeNonPassenger);

            List<Departure> departures = DeserialiseDepartures(arrivalsResponse);

            if (!string.IsNullOrEmpty(request.platform))
	            departures = departures.Where(d => d.Platform == request.platform).ToList();

            return departures.Take(request.count).ToList();
        }

        public List<Departure> GetLiveDepartures(LiveDeparturesRequest request)
        {
            // If a platform is specified then we can't limit the request count before we then apply the platform filter
            ushort numRows = string.IsNullOrEmpty(request.platform)
                ? ushort.Parse(request.count.ToString())
                : (ushort)150;

            StationBoard2 departuresResponse = _client.GetDepartureBoardByCRS(_accessToken, numRows,
                request.stationCode, DateTime.Now, MAX_TIME_WINDOW, null, FilterType.to, null, null,
                request.includeNonPassenger);

            List<Departure> departures = DeserialiseDepartures(departuresResponse);

            if (!string.IsNullOrEmpty(request.platform))
	            departures = departures.Where(d => d.Platform == request.platform).ToList();

            return departures.Take(request.count).ToList();
        }

        private List<Departure> DeserialiseDepartures(StationBoard2 departuresResponse)
        {
	        List<Departure> departures = new List<Departure>();
            foreach (ServiceItem2 departure in departuresResponse.trainServices)
            {
                DateTime scheduledDeparture = departure.std;
                DateTime expectedDeparture = departure.etd;
		        Departure.ServiceStatus status = departure.std == departure.etd ? Departure.ServiceStatus.ONTIME : Departure.ServiceStatus.LATE;

		        if (departure.isCancelled)
			        status = Departure.ServiceStatus.CANCELLED;

		        departures.Add(new Departure(departuresResponse.locationName,
			        departuresResponse.crs,
			        departure.platform,
			        departure.@operator,
			        scheduledDeparture,
			        expectedDeparture,
			        departure.destination[0].locationName,
			        status,
			        departure.origin[0].locationName,
			        departuresResponse.generatedAt,
			        departure.rid,
			        GetType(),
			        Convert.ToInt32(departure.length)));
	        }

	        return departures;
        }

        public List<StationStop> GetStationStops(string rid, LiveDeparturesRequest request)
        {
            List<StationStop> stops = new List<StationStop>();
            try
            {
                bool foundCurrentStop = false;
                ServiceDetails1 stopsResponse = _client.GetServiceDetailsByRID(_accessToken, rid);
                foreach(ServiceLocation1 stop in stopsResponse.locations)
                {
                    if (String.Equals(stop.crs, request.stationCode, StringComparison.CurrentCultureIgnoreCase))
                    {
                        foundCurrentStop = true;
                        continue;
                    }

                    if (!foundCurrentStop)
                        continue;

                    DateTime scheduledDeparture = stop.stdSpecified ? stop.std : stop.sta;
                    DateTime expectedDeparture = stop.etdSpecified ? stop.etd : scheduledDeparture;

                    if (stop.isPass && !request.includeNonPassenger)
                        continue;

                    stops.Add(new StationStop(stop.crs, stop.locationName, stop.platform, scheduledDeparture, expectedDeparture));
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
