using System;
using System.Collections.Generic;
using System.Text;

namespace TrainDataAPI
{
    public class Departure
    {
        public DateTime LastUpdated { get; set; }
        public string StationName { get; set; }
        public string StationCode { get; set; }
        public int Platform { get; set; }
        public string OperatorName { get; set; }
        public DateTime AimedDeparture { get; set; }
        public DateTime ExpectedDeparture { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public ServiceStatus Status { get; set; }
        public List<StationStop> Stops { get; set; }
        public string ServiceTimeTableUrl { get; set; }
        public Type FromDataSouce { get; set; }

        public Departure(string stationName, string stationCode, int platform, string operatorName, DateTime aimedDeparture, DateTime expectedDeparture, string destination, ServiceStatus status, string origin = "", DateTime? lastUpdated = null, string serviceTimeTable = null, Type from = null)
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
        }

        public void LoadStops()
        {
            if (FromDataSouce != null && !string.IsNullOrEmpty(ServiceTimeTableUrl) && Activator.CreateInstance(FromDataSouce) is ITrainDatasource trainDatasource) {
                Stops = trainDatasource.GetStationStops(ServiceTimeTableUrl);
            }
        }
        

        public enum ServiceStatus
        {
            ONTIME,
            LATE,
            CANCELLED
        }
    }
}
