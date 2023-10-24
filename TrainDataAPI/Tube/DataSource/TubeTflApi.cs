using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore.DataSource;
using System.Text.Json;
using RestSharp;

namespace TrainDataAPI.Tube.DataSource;

public class TubeTflApi : TflBase
{
    public List<TubeDeparture> GetLiveDepartures(string code)
    {
        return GetDepartures(code);
    }

    private List<TubeDeparture> GetDepartures(string code)
    {
        var request = new RestRequest($"StopPoint/{code}/Arrivals", Method.Get);
        RestResponse response = SendRequest(request);

        var arrivals = JsonSerializer.Deserialize<List<TflArrival>>(response.Content, SerializerOptions);

        return arrivals
            .Select(a => new TubeDeparture(
                    a.LineName,
                    a.PlatformName,
                    a.DestinationName,
                    a.StationName,
                    a.ExpectedArrival,
                    a.ExpectedArrival,
                    GetConvertedTimeToStation(a.TimeToStation)
                )
            )
            .Where(a => !string.IsNullOrEmpty(a.Destination))
            .OrderBy(a => a.AimedDeparture)
            .ToList();
    }

    public List<StopPoint> GetAllStations()
    {
        var stations = GetAllPlatforms();

        return stations
            .ToList();
    }

    public StopPoint GetStation(string code)
    {
        var request = new RestRequest("StopPoint/{station}");
        request.AddUrlSegment("station", code);
        RestResponse response = SendRequest(request);

        return JsonSerializer.Deserialize<StopPoint>(response.Content, SerializerOptions);
    }

    private List<StopPoint> GetAllPlatforms()
    {
        var request = new RestRequest($"StopPoint/type/NaptanMetroPlatform", Method.Get);
        RestResponse response = SendRequest(request);
        
        var stations = JsonSerializer.Deserialize<List<StopPoint>>(response.Content, SerializerOptions);

        return stations
            .Where(s => s.Modes?.Contains("tube") ?? false)
            .ToList();
    }
}
