using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;
using RestSharp;

namespace TrainDataAPI
{
    public class RealTimeTrainsAPI : ITrainDatasource
    {
        public List<Departure> GetLiveDepartures(string stationCode)
        {
            return GetDepartures(stationCode);
        }

        public List<Departure> GetLiveArrivals(string stationCode)
        {
            return GetDepartures(stationCode, true);
        }

        public List<StationStop> GetStationStops(string url, string stationCode)
        {
            try
            {
                var client = new RestClient(url);
                var request = new RestRequest(Method.GET);
                AddCredendials(ref request);
                IRestResponse response = client.Execute(request);
                return DeserialiseStationStops(response.Content, stationCode);
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
                        int.TryParse((Jdeparture["locationDetail"]["platform"])?.ToString()??"1", out int platform);
                        string operatorName = Jdeparture["atocName"].ToString();
                        DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["gbttBookedDeparture"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["gbttBookedDeparture"]?.ToString().Substring(2, 2), out DateTime aimedDepatureTime);
                        if (aimedDepatureTime == DateTime.MinValue)
                            DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["gbttBookedArrival"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["gbttBookedArrival"]?.ToString().Substring(2, 2), out aimedDepatureTime);
                        DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["realtimeDeparture"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["realtimeDeparture"]?.ToString().Substring(2, 2), out DateTime expectedDepatureTime);
                        if (expectedDepatureTime == DateTime.MinValue)
                            DateTime.TryParse(date + " " + Jdeparture["locationDetail"]["realtimeArrival"]?.ToString().Substring(0, 2) + ":" + Jdeparture["locationDetail"]["realtimeArrival"]?.ToString().Substring(2, 2), out expectedDepatureTime);

                        string destination = Jdeparture["locationDetail"]["destination"][0]["description"]?.ToString();
                        Departure.ServiceStatus status = (expectedDepatureTime == aimedDepatureTime) ? Departure.ServiceStatus.ONTIME : Departure.ServiceStatus.LATE;

                        if (Jdeparture["locationDetail"]["realtimeArrivalActual"] != null && bool.TryParse(Jdeparture["locationDetail"]["realtimeArrivalActual"]?.ToString(), out bool hasArrived) && hasArrived)
                            status = Departure.ServiceStatus.ARRIVED;

                        string origin = Jdeparture["locationDetail"]["origin"][0]["description"].ToString();

                        string serviceTimeTable = $"https://api.rtt.io/api/v1/json/service/{Jdeparture["serviceUid"].ToString()}/{date.Replace('-', '/')}";

                        Departure departure = new Departure(stationName, stationCode, platform, operatorName, aimedDepatureTime, expectedDepatureTime, destination, status, origin, null, serviceTimeTable, GetType());
                        departures.Add(departure);
                    }
                    catch { }
                }
            }
            catch
            {

            }

            departures.Sort((d1, d2) => d1.AimedDeparture.CompareTo(d2.AimedDeparture));
            return departures;
        }

        private List<StationStop> DeserialiseStationStops(string json, string desinationCode)
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
                        int.TryParse((JStop["platform"] ?? "").ToString(), out int platform);

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

                        StationStop stop = new StationStop(stationCode, stationName, StationStop.StopType.LI, platform, aimedDepartureDate, expectedDepartureDate);
                        stops.Add(stop);
                    }
                    catch { }
                }
            }
            catch
            {

            }
            stops.Sort((s1, s2) => s1.AimedDeparture.CompareTo(s2.AimedDeparture));
            //List<StationStop> destinationStops = stops.Where(s => s.StationCode == desinationCode).ToList();
            //if(destinationStops.Count == 1)
            //{
            //    //Move destination stop to the end (fixes issue with 0001 time given for final destination)
            //    stops.Remove(destinationStops[0]);
            //    stops.Add(destinationStops[0]);
            //}
            return stops;
        }
    }
}
