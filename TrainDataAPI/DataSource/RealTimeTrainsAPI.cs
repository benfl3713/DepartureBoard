using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore;
using Newtonsoft.Json.Linq;
using RestSharp;

namespace TrainDataAPI
{
    public class RealTimeTrainsAPI : ITrainDatasource
    {
        private static List<CacheDeparture> cachedDepartures = new List<CacheDeparture>();
        public List<Departure> GetLiveDepartures(string stationCode, int count)
        {
            if (ConfigService.UseCaching && ConfigService.CachePeriod > 0)
            {
                List<CacheDeparture> result = cachedDepartures.Where(d => d.StationCode == stationCode && d.CachedDateTime > DateTime.Now.AddMilliseconds(-ConfigService.CachePeriod)).ToList();
                if (result.Count > 0){
                    var cache = result[0].Departures;
                    cache.ForEach(d => d.FromDataSouce = typeof(RealTimeTrainsAPI));
                    return cache;
                }
            }
            List<Departure> departures = GetDepartures(stationCode);

            if (ConfigService.UseCaching && ConfigService.CachePeriod > 0)
            {
                List<CacheDeparture> oldCache = cachedDepartures.Where(d => d.StationCode == stationCode).ToList();
                if(oldCache.Count > 0)
                    cachedDepartures.Remove(oldCache[0]);
                cachedDepartures.Add(new CacheDeparture(stationCode, departures));
            }
            return departures;
        }

        public List<Departure> GetLiveArrivals(string stationCode, int count)
        {
            return GetDepartures(stationCode, true);
        }

        public List<StationStop> GetStationStops(string url)
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

        private List<Departure> GetDepartures(string stationCode, bool getArrivals = false)
        {
            try
            {
                string url = $"https://api.rtt.io/api/v1/json/search/{stationCode.ToUpper()}";
                if (getArrivals)
                    url += "/arrivals";
                var client = new RestClient(url);
                var request = new RestRequest(Method.GET);
                request.Timeout = 15000;
                AddCredendials(ref request);
                IRestResponse response = client.Execute(request);
                return DeserialiseDeparture(response.Content);
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

        private List<Departure> DeserialiseDeparture(string json)
        {
            List<Departure> departures = new List<Departure>();
            try
            {
                JObject results = JObject.Parse(json);

                if (results == null || !results.HasValues)
                    return departures;

                JToken allDepartures = results["services"];

                if (allDepartures == null || !allDepartures.HasValues)
                    return departures;

                string stationName = results["location"]["name"].ToString();
                string stationCode = results["location"]["crs"].ToString();
                
                foreach (var Jdeparture in allDepartures)
                {
                    try
                    {
                        if (((bool)Jdeparture["isPassenger"]) == false || (Jdeparture["isPassenger"].ToString() ?? "") == "CANCELLED_CALL")
                            continue;

                        string date = Jdeparture["runDate"].ToString();
                        string platform = (Jdeparture["locationDetail"]["platform"])?.ToString() ?? "0";
                        string operatorName = Jdeparture["atocName"].ToString();
                        DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["gbttBookedDeparture"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["gbttBookedDeparture"]?.ToString().Substring(2, 2), out DateTime aimedDepatureTime);
                        if (aimedDepatureTime == DateTime.MinValue)
                            DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["gbttBookedArrival"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["gbttBookedArrival"]?.ToString().Substring(2, 2), out aimedDepatureTime);
                        DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["realtimeDeparture"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["realtimeDeparture"]?.ToString().Substring(2, 2), out DateTime expectedDepatureTime);
                        if (expectedDepatureTime == DateTime.MinValue)
                            DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["realtimeArrival"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["realtimeArrival"]?.ToString().Substring(2, 2), out expectedDepatureTime);

                        string destination = Jdeparture["locationDetail"]["destination"][0]["description"]?.ToString();

                        DateTime? expectedDateTimeNullable = expectedDepatureTime == DateTime.MinValue ? null : expectedDepatureTime as DateTime?;
                        Departure.ServiceStatus status = (expectedDepatureTime == aimedDepatureTime) ? Departure.ServiceStatus.ONTIME : Departure.ServiceStatus.LATE;

                        if(expectedDateTimeNullable == null)
                            status = Departure.ServiceStatus.ONTIME;

                        if (Jdeparture["locationDetail"]["realtimeArrivalActual"] != null && bool.TryParse(Jdeparture["locationDetail"]["realtimeArrivalActual"]?.ToString(), out bool hasArrived) && hasArrived)
                            status = Departure.ServiceStatus.ARRIVED;

                        string origin = Jdeparture["locationDetail"]["origin"][0]["description"].ToString();

                        string serviceTimeTable = $"https://api.rtt.io/api/v1/json/service/{Jdeparture["serviceUid"].ToString()}/{date.Replace('-', '/')}";

                        Departure departure = new Departure(stationName, stationCode, platform, operatorName, aimedDepatureTime, expectedDateTimeNullable, destination, status, origin, null, serviceTimeTable, GetType());
                        departures.Add(departure);
                    }
                    catch { }
                }
            }
            catch
            {

            }

            return departures;
        }

        private List<StationStop> DeserialiseStationStops(string json)
        {
            List<StationStop> stops = new List<StationStop>();
            try
            {
                JObject results = JObject.Parse(json);

                if (results == null || !results.HasValues)
                    return stops;

                string runDate = results["runDate"].ToString();

                foreach (var JStop in results["locations"])
                {
                    try
                    {
                        string stationCode = (JStop["crs"] ?? "").ToString();
                        string stationName = (JStop["description"] ?? "").ToString();
                        string platform = (JStop["platform"] ?? "").ToString();

                        DateTime aimedDepartureDate;
                        DateTime expectedDepartureDate;

                        if (JStop["gbttBookedDeparture"] != null)
                            DateTime.TryParse($"{runDate} {JStop["gbttBookedDeparture"]?.ToString().Substring(0, 2)}:{JStop["gbttBookedDeparture"]?.ToString().Substring(2, 2)}", out aimedDepartureDate);
                        else
                            DateTime.TryParse($"{runDate} {JStop["gbttBookedArrival"]?.ToString().Substring(0, 2)}:{JStop["gbttBookedArrival"]?.ToString().Substring(2, 2)}", out aimedDepartureDate);

                        if(JStop["realtimeDeparture"] != null)
                            DateTime.TryParse($"{runDate} {JStop["realtimeDeparture"]?.ToString().Substring(0, 2)}:{JStop["realtimeDeparture"]?.ToString().Substring(2, 2)}", out expectedDepartureDate);
                        else
                            DateTime.TryParse($"{runDate} {JStop["realtimeArrival"]?.ToString().Substring(0, 2)}:{JStop["realtimeArrival"]?.ToString().Substring(2, 2)}", out expectedDepartureDate);

                        StationStop stop = new StationStop(stationCode, stationName, platform, aimedDepartureDate, expectedDepartureDate);
                        stops.Add(stop);
                    }
                    catch { }
                }
            }
            catch { }

            for (int i = 1; i < stops.Count; i++)
            {
                if (stops[i].AimedDeparture.TimeOfDay < stops[i-1].AimedDeparture.TimeOfDay)
                {
                    for (int j = i; j < stops.Count; j++)
                    {
                        stops[i].AimedDeparture = stops[j].AimedDeparture.AddDays(1);
                        stops[i].ExpectedDeparture = stops[j].ExpectedDeparture.AddDays(1);
                    }

                    break;
                }
            }
            stops.Sort((s1, s2) => s1.AimedDeparture.CompareTo(s2.AimedDeparture));
            return stops;
        }
    }
}
