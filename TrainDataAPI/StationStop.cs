using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace TrainDataAPI
{
    public class StationStop
    {
        public string StationCode { get; set; }
        public string StationName { get; set; }
        [JsonIgnore]
        public StopType StationStopType { get; set; }
        public int Platform { get; set; }
        public DateTime AimedDeparture { get; set; }
        public DateTime ExpectedDeparture { get; set; }

        public StationStop(string stationCode, string stationName, StopType stationStopType, int platformNumber, DateTime aimedDeparture, DateTime expectedDeparture)
        {
            StationCode = stationCode;
            StationName = stationName;
            StationStopType = stationStopType;
            Platform = platformNumber;
            AimedDeparture = aimedDeparture;
            ExpectedDeparture = expectedDeparture;
        }


        public enum StopType
        {
            LI,
            LO,
            LT
        }
    }
}
