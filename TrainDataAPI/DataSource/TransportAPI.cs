﻿using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json.Linq;
using RestSharp;

namespace TrainDataAPI
{
    public class TransportAPI : ITrainDatasource
    {
        private string app_id = "e9360520";
        private string app_key = "02918527a18d82e3a69d1ce19d01dac1";

        public TransportAPI()
        {
        }

        public List<Departure> GetLiveDepartures(string stationCode)
        {
            var client = new RestClient($"http://transportapi.com/v3/uk/train/station/{stationCode}/live.json");
            var request = new RestRequest(Method.GET);
            AddCredentials(ref request);
            IRestResponse response = client.Execute(request);
            return DeserialiseDeparture(response.Content);
        }

        public List<StationStop> GetStationStops(string url)
        {
            var client = new RestClient(url);
            var request = new RestRequest(Method.GET);
            IRestResponse response = client.Execute(request);
            return DeserialiseStationStops(response.Content);
        }

        private void AddCredentials(ref RestRequest request)
        {
            request.AddParameter("app_id", app_id);
            request.AddParameter("app_key", app_key);
        }

        private List<Departure> DeserialiseDeparture(string json)
        {
            List<Departure> departures = new List<Departure>();
            try
            {
                JObject results = JObject.Parse(json);

                if (results == null || !results.HasValues)
                    return departures;

                JToken allDepartures = results["departures"];

                if (allDepartures == null || !allDepartures.HasValues)
                    return departures;

                string stationName = results["station_name"].ToString();
                string stationCode = results["station_code"].ToString();
                string date = results["date"].ToString();
                DateTime.TryParse(results["date"].ToString() + " " + results["time_of_day"].ToString(), out DateTime lastUpdated);

                foreach (var Jdeparture in allDepartures["all"])
                {
                    int.TryParse(Jdeparture["platform"].ToString(), out int platform);
                    string operatorName = Jdeparture["operator_name"].ToString();
                    DateTime.TryParse(date + " " + Jdeparture["aimed_departure_time"].ToString(), out DateTime aimedDepatureTime);
                    if(aimedDepatureTime == DateTime.MinValue)
                        DateTime.TryParse(date + " " + Jdeparture["aimed_arrival_time"].ToString(), out aimedDepatureTime);
                    DateTime.TryParse(date + " " + Jdeparture["expected_departure_time"].ToString(), out DateTime expectedDepatureTime);
                    if(expectedDepatureTime == DateTime.MinValue)
                        DateTime.TryParse(date + " " + Jdeparture["expected_arrival_time"].ToString(), out expectedDepatureTime);
                    string destination = Jdeparture["destination_name"].ToString();
                    Enum.TryParse(Jdeparture["status"].ToString().ToUpper(), out Departure.ServiceStatus status);
                    string origin = Jdeparture["origin_name"].ToString();
                    string serviceTimeTable = Jdeparture["service_timetable"]["id"].ToString();

                    Departure departure = new Departure(stationName, stationCode, platform, operatorName, aimedDepatureTime, expectedDepatureTime, destination, status, origin, lastUpdated, serviceTimeTable, GetType());
                    departures.Add(departure);
                }
            }
            catch
            {

            }

            departures.Sort((d1, d2) => d1.AimedDeparture.CompareTo(d2.AimedDeparture));
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

                foreach (var JStop in results["stops"])
                {
                    string stationCode = JStop["station_code"].ToString();
                    string stationName = JStop["station_name"].ToString();
                    int.TryParse((JStop["platform"]??"").ToString(), out int platform);
                    Enum.TryParse(JStop["stop_type"].ToString(), out StationStop.StopType stopType);
                    DateTime.TryParse($"{JStop["aimed_departure_date"].ToString()} {JStop["aimed_departure_time"].ToString()}", out DateTime aimedDepartureDate);
                    if(aimedDepartureDate == DateTime.MinValue)
                        DateTime.TryParse($"{JStop["aimed_arrival_date"].ToString()} {JStop["aimed_arrival_time"].ToString()}", out aimedDepartureDate);

                    DateTime.TryParse($"{JStop["expected_departure_date"].ToString()} {JStop["expected_departure_time"].ToString()}", out DateTime expectedDepartureDate);
                    if(expectedDepartureDate == DateTime.MinValue)
                        DateTime.TryParse($"{JStop["expected_arrival_date"].ToString()} {JStop["expected_arrival_time"].ToString()}", out expectedDepartureDate);

                    StationStop stop = new StationStop(stationCode, stationName, stopType, platform, aimedDepartureDate, expectedDepartureDate);
                    stops.Add(stop);
                }
            }
            catch
            {
                
            }
            stops.Sort((s1, s2) => s1.AimedDeparture.CompareTo(s2.AimedDeparture));
            return stops;
        }
    }
}
