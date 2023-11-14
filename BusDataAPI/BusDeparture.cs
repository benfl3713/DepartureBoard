using System;

namespace BusDataAPI
{
	public class BusDeparture
	{
        public DateTime LastUpdated { get; set; }
        public string Line { get; set; }
        public string Destination { get; set; }
        public string StopName { get; set; }
        public string OperatorName { get; set; }
        public string OperatorCode { get; set; }
        public DateTime? AimedDeparture { get; set; }
        public DateTime? ExpectedDeparture { get; set; }
        public int TimeToStation { get; set; }
        public string Platform { get; set; }
        public bool IsCancelled { get; set; } = false;

		public BusDeparture(string line, string destination, string stopName, string operatorCode, string operatorName, DateTime? aimedDeparture, DateTime? expectedDeparture, string platform = null, int? timeToStation = null)
		{
            LastUpdated = DateTime.Now;
            Line = line;
            Destination = destination;
            StopName = stopName;
            OperatorCode = operatorCode;
            OperatorName = operatorName;
            AimedDeparture = aimedDeparture;
            ExpectedDeparture = expectedDeparture;
            Platform = platform;
            TimeToStation = timeToStation ?? TimeSpan.FromTicks((expectedDeparture ?? DateTime.Now).Ticks - DateTime.Now.Ticks).Minutes;
		}
    }
}
