using System;

namespace TrainDataAPI.Tube;

public class TubeDeparture
{
    public DateTime LastUpdated { get; set; }
    public string LineId { get; set; }
    public string Destination { get; set; }
    public string StopName { get; set; }
    public DateTime? AimedDeparture { get; set; }
    public DateTime? ExpectedDeparture { get; set; }
    public int TimeToStation { get; set; }
    public string Platform { get; set; }

    public TubeDeparture(string lineId, string platform, string destination, string stopName, DateTime? aimedDeparture, DateTime? expectedDeparture, int? timeToStation = null)
    {
        LastUpdated = DateTime.Now;
        LineId = lineId;
        Platform = platform;
        Destination = destination;
        StopName = stopName;
        AimedDeparture = aimedDeparture;
        ExpectedDeparture = expectedDeparture;
        TimeToStation = timeToStation ?? TimeSpan.FromTicks((expectedDeparture ?? DateTime.Now).Ticks - DateTime.Now.Ticks).Minutes;
    }
}
