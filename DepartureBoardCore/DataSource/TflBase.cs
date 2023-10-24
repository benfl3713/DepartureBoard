using System;
using System.Collections.Generic;
using System.Text.Json;
using RestSharp;

namespace DepartureBoardCore.DataSource;

public class TflBase
{
    protected readonly RestClient _client = new RestClient("https://api.tfl.gov.uk");
    protected static string AppKey => ConfigService.TflApiToken;
    protected JsonSerializerOptions SerializerOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    protected RestResponse SendRequest(RestRequest request)
    {
        request.AddQueryParameter("app_key", AppKey);
        return _client.Execute(request);
    }

    protected int? GetConvertedTimeToStation(int? timeInSeconds)
    {
        if (!timeInSeconds.HasValue)
            return null;

        return Convert.ToInt32(Math.Ceiling(timeInSeconds.Value / 60m));
    }

    public class TflStopPointResponse
    {
        public List<StopPoint> StopPoints { get; set; }
    }
    
    public class StopPoint
    {
        public string NaptanId { get; set; }
        public string StationNaptan { get; set; }
        public string CommonName { get; set; }
        public string PlatformName { get; set; }
        public List<string> Modes { get; set; }
        public List<dynamic> Lines { get; set; }
    }

    public class TflArrival
    {
        public string StationName { get; set; }
        public string LineName { get; set; }
        public string DestinationName { get; set; }
        public DateTime ExpectedArrival { get; set; }
        public string PlatformName { get; set; }
        public int? TimeToStation { get; set; }
    }
}
