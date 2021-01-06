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
        public string Platform { get; set; }
        public DateTime AimedDeparture { get; set; }
        public DateTime? ExpectedDeparture { get; set; }

        public StationStop(string stationCode, string stationName, string platform, DateTime aimedDeparture, DateTime? expectedDeparture)
        {
            StationCode = stationCode;
            StationName = stationName;
            Platform = platform;
            AimedDeparture = aimedDeparture;
            ExpectedDeparture = expectedDeparture;
        }
    }
}
