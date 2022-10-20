using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore;
using Newtonsoft.Json;
using RestSharp;

namespace TrainDataAPI
{
    public class RealTimeTrainsAPI : ITrainDatasource
    {
        private static List<CacheDeparture> cachedDepartures = new List<CacheDeparture>();

        public List<Departure> GetLiveDepartures(LiveDeparturesRequest request)
        {
            if (ConfigService.UseCaching && ConfigService.CachePeriod > 0)
            {
                List<CacheDeparture> result = cachedDepartures.Where(d => d.StationCode == request.stationCode && d.CachedDateTime > DateTime.Now.AddMilliseconds(-ConfigService.CachePeriod)).ToList();
                if (result.Count > 0)
                {
                    var cache = result[0].Departures;
                    cache.ForEach(d => d.FromDataSouce = typeof(RealTimeTrainsAPI));
                    return cache;
                }
            }

            List<Departure> departures = GetDepartures(request.stationCode, request.count, request.platform, request.toCrsCode);

            if (ConfigService.UseCaching && ConfigService.CachePeriod > 0)
            {
                List<CacheDeparture> oldCache = cachedDepartures.Where(d => d.StationCode == request.stationCode).ToList();
                if (oldCache.Count > 0)
                    cachedDepartures.Remove(oldCache[0]);
                cachedDepartures.Add(new CacheDeparture(request.stationCode, departures));
            }

            return departures;
        }

        public List<Departure> GetLiveArrivals(LiveDeparturesRequest request)
        {
            return GetDepartures(request.stationCode, request.count, request.platform, request.toCrsCode, true);
        }

        public List<StationStop> GetStationStops(string url, LiveDeparturesRequest apiRequest)
        {
            try
            {
                var client = new RestClient(url);
                var request = new RestRequest(Method.GET);
                request.Timeout = 15000;
                AddCredendials(ref request);
                IRestResponse response = client.Execute(request);
                return DeserialiseStationStops(response.Content);
            }
            catch
            {
                return new List<StationStop>();
            }
        }

        private List<Departure> GetDepartures(string stationCode, int count, string platform, string toCrsCode, bool getArrivals = false)
        {
            try
            {
                string url = $"https://api.rtt.io/api/v1/json/search/{stationCode.ToUpper()}";

                if (!string.IsNullOrEmpty(toCrsCode))
                    url += $"/to/{toCrsCode}";
                
                if (getArrivals)
                    url += "/arrivals";
                var client = new RestClient(url);
                var request = new RestRequest(Method.GET);
                request.Timeout = 15000;
                AddCredendials(ref request);
                IRestResponse response = client.Execute(request);
                List<Departure> departures = DeserialiseDepartures(response.Content);

                if (!string.IsNullOrEmpty(platform))
	                departures = departures.Where(d => d.Platform == platform).ToList();

	            return departures.Take(count).ToList();
            }
            catch
            {
                return new List<Departure>();
            }
        }

        private void AddCredendials(ref RestRequest request)
        {
            request.AddHeader("Authorization", $"Basic {ConfigService.RealTimeTrainsToken}");
        }

        private List<Departure> DeserialiseDepartures(string json)
        {
            List<Departure> departures = new List<Departure>();
            try
            {
                RealTimeTrainsResponse realTimeTrainsResponse = JsonConvert.DeserializeObject<RealTimeTrainsResponse>(json);

                string stationName = realTimeTrainsResponse.location.name;
                string stationCode = realTimeTrainsResponse.location.crs;

                foreach (RealTimeTrainsResponse.Service service in realTimeTrainsResponse.services)
                {
                    if (service.isPassenger == false || service.serviceType.ToLower() != "train")
                        continue;

                    string platform = service.locationDetail.platform;
                    string operatorName = service.atocName;
                    string destination = service.locationDetail.destination.First().description;
                    string origin = service.locationDetail.origin.First().description;

                    // Aimed Departure
                    DateTime.TryParse(service.runDate + " " + service.locationDetail.gbttBookedDeparture?.Substring(0, 2) + ":" + service.locationDetail.gbttBookedDeparture?.Substring(2, 2), out DateTime aimedDepatureTime);
                    if (aimedDepatureTime == DateTime.MinValue)
                        DateTime.TryParse(service.runDate + " " + service.locationDetail.gbttBookedArrival?.Substring(0, 2) + ":" + service.locationDetail.gbttBookedArrival?.Substring(2, 2), out aimedDepatureTime);

                    // Expected Departure
                    DateTime.TryParse(service.runDate + " " + service.locationDetail.realtimeDeparture?.Substring(0, 2) + ":" + service.locationDetail.realtimeDeparture?.Substring(2, 2), out DateTime expectedDepatureTime);
                    if (expectedDepatureTime == DateTime.MinValue)
                        DateTime.TryParse(service.runDate + " " + service.locationDetail.realtimeArrival?.Substring(0, 2) + ":" + service.locationDetail.realtimeArrival?.Substring(2, 2), out expectedDepatureTime);

                    DateTime? expectedDateTimeNullable = expectedDepatureTime == DateTime.MinValue ? null : expectedDepatureTime as DateTime?;
                    Departure.ServiceStatus status = (expectedDepatureTime == aimedDepatureTime) ? Departure.ServiceStatus.ONTIME : Departure.ServiceStatus.LATE;

                    if (expectedDateTimeNullable == null)
                        status = Departure.ServiceStatus.ONTIME;

                    if (service.locationDetail.realtimeArrivalActual != null && service.locationDetail.realtimeArrivalActual.Value)
                        status = Departure.ServiceStatus.ARRIVED;

                    string serviceTimeTable = $"https://api.rtt.io/api/v1/json/service/{service.serviceUid}/{service.runDate.Replace('-', '/')}";

                    Departure departure = new Departure(stationName, stationCode, platform, operatorName, aimedDepatureTime, expectedDateTimeNullable, destination, status, origin, null, serviceTimeTable, GetType());
                    departures.Add(departure);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return departures;
        }

        private List<StationStop> DeserialiseStationStops(string json)
        {
            List<StationStop> stops = new List<StationStop>();
            try
            {
                RealTimeTrainsServiceDetailsResponse realTimeTrainsServiceDetailsResponse = JsonConvert.DeserializeObject<RealTimeTrainsServiceDetailsResponse>(json);

                foreach (RealTimeTrainsServiceDetailsResponse.Location location in realTimeTrainsServiceDetailsResponse.locations)
                {
                    try
                    {
                        string stationCode = location.crs;
                        string stationName = location.description;
                        string platform = location.platform;

                        DateTime aimedDepartureDate;
                        DateTime expectedDepartureDate = DateTime.MinValue;
                        string runDate = realTimeTrainsServiceDetailsResponse.runDate;

                        if (location.gbttBookedDeparture != null)
                            DateTime.TryParse($"{runDate} {location.gbttBookedDeparture?.Substring(0, 2)}:{location.gbttBookedDeparture?.Substring(2, 2)}", out aimedDepartureDate);
                        else
                            DateTime.TryParse($"{runDate} {location.gbttBookedArrival?.Substring(0, 2)}:{location.gbttBookedArrival?.Substring(2, 2)}", out aimedDepartureDate);

                        if (location.realtimeDeparture != null)
                            DateTime.TryParse($"{runDate} {location.realtimeDeparture.Substring(0, 2)}:{location.realtimeDeparture.Substring(2, 2)}", out expectedDepartureDate);
                        else if(location.realtimeArrival != null)
                            DateTime.TryParse($"{runDate} {location.realtimeArrival.Substring(0, 2)}:{location.realtimeArrival.Substring(2, 2)}", out expectedDepartureDate);

                        StationStop stop = new StationStop(stationCode, stationName, platform, aimedDepartureDate, expectedDepartureDate == DateTime.MinValue ? null as DateTime? : expectedDepartureDate);
                        stops.Add(stop);
                    }
                    catch(Exception ex)
                    {
                        Console.WriteLine(ex);
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }

            FixStopDates(ref stops);
            stops.Sort((s1, s2) => s1.AimedDeparture.CompareTo(s2.AimedDeparture));
            return stops;
        }

        private static void FixStopDates(ref List<StationStop> stops)
        {
            for (int i = 1; i < stops.Count; i++)
            {
                if (stops[i].AimedDeparture.TimeOfDay >= stops[i - 1].AimedDeparture.TimeOfDay)
                    continue;

                for (int j = i; j < stops.Count; j++)
                {
                    stops[i].AimedDeparture = stops[j].AimedDeparture.AddDays(1);
                    if (stops[i].ExpectedDeparture != null)
                        stops[i].ExpectedDeparture = stops[j].ExpectedDeparture?.AddDays(1);
                }

                break;
            }
        }

        private class RealTimeTrainsResponse
        {
            public Location location { get; set; }
            public object filter { get; set; }
            public List<Service> services { get; set; }

            public class Location
            {
                public string name { get; set; }
                public string crs { get; set; }
            }

            public class Origin
            {
                public string description { get; set; }
                public string workingTime { get; set; }
                public string publicTime { get; set; }
            }

            public class Destination
            {
                public string description { get; set; }
                public string workingTime { get; set; }
                public string publicTime { get; set; }
            }

            public class LocationDetail
            {
                public bool realtimeActivated { get; set; }
                public string crs { get; set; }
                public string description { get; set; }
                public string gbttBookedArrival { get; set; }
                public string gbttBookedDeparture { get; set; }
                public List<Origin> origin { get; set; }
                public List<Destination> destination { get; set; }
                public bool isCall { get; set; }
                public bool isPublicCall { get; set; }
                public string realtimeArrival { get; set; }
                public bool? realtimeArrivalActual { get; set; }
                public string realtimeDeparture { get; set; }
                public bool realtimeDepartureActual { get; set; }
                public string platform { get; set; }
                public bool platformConfirmed { get; set; }
                public bool platformChanged { get; set; }
                public string serviceLocation { get; set; }
                public string displayAs { get; set; }
            }

            public class Service
            {
                public LocationDetail locationDetail { get; set; }
                public string serviceUid { get; set; }
                public string runDate { get; set; }
                public string trainIdentity { get; set; }
                public string runningIdentity { get; set; }
                public string atocCode { get; set; }
                public string atocName { get; set; }
                public string serviceType { get; set; }
                public bool isPassenger { get; set; }
            }
        }

        public class RealTimeTrainsServiceDetailsResponse
        {
            public string serviceUid { get; set; }
            public string runDate { get; set; }
            public string serviceType { get; set; }
            public bool isPassenger { get; set; }
            public string trainIdentity { get; set; }
            public string powerType { get; set; }
            public string trainClass { get; set; }
            public string atocCode { get; set; }
            public string atocName { get; set; }
            public bool performanceMonitored { get; set; }
            public List<Origin> origin { get; set; }
            public List<Destination> destination { get; set; }
            public List<Location> locations { get; set; }

            public class Origin
            {
                public string description { get; set; }
                public string workingTime { get; set; }
                public string publicTime { get; set; }
            }

            public class Destination
            {
                public string description { get; set; }
                public string workingTime { get; set; }
                public string publicTime { get; set; }
            }

            public class Location
            {
                public string crs { get; set; }
                public string description { get; set; }
                public string gbttBookedDeparture { get; set; }
                public string realtimeDeparture { get; set; }
                public string realtimeArrival { get; set; }
                public List<Origin> origin { get; set; }
                public List<Destination> destination { get; set; }
                public bool isCall { get; set; }
                public bool isPublicCall { get; set; }
                public string platform { get; set; }
                public string line { get; set; }
                public string displayAs { get; set; }
                public string path { get; set; }
                public string gbttBookedArrival { get; set; }
            }

        }
    }
}
