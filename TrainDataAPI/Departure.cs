using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TrainDataAPI
{
    public class Departure
    {
        public DateTime LastUpdated { get; set; }
        public string StationName { get; set; }
        public string StationCode { get; set; }
        public string Platform { get; set; }
        public string OperatorName { get; set; }
        public DateTime AimedDeparture { get; set; }
        public DateTime? ExpectedDeparture { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public ServiceStatus Status { get; set; }
        [JsonIgnore]
        public string ServiceTimeTableUrl { get; set; }
        [JsonIgnore]
        public Type FromDataSouce { get; set; }
        public int Length { get; set; }
        public Dictionary<string, object> ExtraDetails { get; set; } = null;
        public List<StationStop> Stops
        {
            get
            {
                if (_stops == null)
                    return null;
                return _stops;
            }
        }

        private List<StationStop> _stops { get; set; } = new List<StationStop>();

        public Departure(string stationName, string stationCode, string platform, string operatorName, DateTime aimedDeparture, DateTime? expectedDeparture, string destination, ServiceStatus status, string origin = "", DateTime? lastUpdated = null, string serviceTimeTable = null, Type from = null, int length = 0)
        {
            StationName = stationName;
            StationCode = stationCode;
            Platform = platform;
            OperatorName = operatorName;
            AimedDeparture = aimedDeparture;
            ExpectedDeparture = expectedDeparture;
            Destination = destination;
            Status = status;
            Origin = origin;
            LastUpdated = lastUpdated ?? DateTime.Now;
            ServiceTimeTableUrl = serviceTimeTable;
            FromDataSouce = from;
            Length = length;
        }

        public void LoadStops(LiveDeparturesRequest request)
        {
            if (FromDataSouce != null && !string.IsNullOrEmpty(ServiceTimeTableUrl) && Activator.CreateInstance(FromDataSouce) is ITrainDatasource trainDatasource) {
                _stops = trainDatasource.GetStationStops(ServiceTimeTableUrl, request);
            }
        }

        public void ClearStops()
        {
            _stops = null;
        }

        public void StopsAsOfDepartureStation()
        {
            List<StationStop> toRemove = new List<StationStop>();
            foreach (StationStop stop in _stops)
            {
                if (stop.StationCode != StationCode)
                {
                    toRemove.Add(stop);
                }
                else
                {
                    toRemove.Add(stop);
                    break;
                }
            }
            toRemove.ForEach(s => _stops.Remove(s));
        }

        public bool AddExtraDetail(string key, object value)
        {
            ExtraDetails ??= new Dictionary<string, object>();
            return ExtraDetails.TryAdd(key, value);
        }


        public enum ServiceStatus
        {
            ONTIME,
            LATE,
            CANCELLED,
            ARRIVED
        }
    }
}
