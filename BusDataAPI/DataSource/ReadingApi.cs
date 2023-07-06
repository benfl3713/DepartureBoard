using System.Collections.Generic;
using System.Threading.Tasks;
using DepartureBoardCore;
using ReadingBusesAPI;
using ReadingBusesAPI.JourneyDetails;

namespace BusDataAPI.DataSource;

public class ReadingApi : IBusDatasource
{
    private readonly ReadingBuses _controller;

    public ReadingApi()
    {
        _controller = ReadingBuses.GetInstance();
    }
    
    public static async Task Initialise()
    {
        await ReadingBuses.Initialise(ConfigService.ReadingApiToken);
    }

    public List<BusDeparture> GetLiveDepartures(string code)
    {
        List<BusDeparture> departures = new List<BusDeparture>();
        var stop = _controller.GetLocation(code);
        var data = stop.GetLiveData().Result;

        foreach (LiveRecord record in data)
        {
            BusDeparture departure = new BusDeparture(record.ServiceNumber, record.DestinationName, stop.CommonName, record.OperatorCode.ToString(), record.OperatorCode.ToString(), record.ScheduledArrival, record.ExpectedArrival);
            departures.Add(departure);
        }

        return departures;
    }
}
