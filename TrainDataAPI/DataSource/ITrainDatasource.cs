using System;
using System.Collections.Generic;

namespace TrainDataAPI
{
    public interface ITrainDatasource
    {
        List<Departure> GetLiveDepartures(string stationCode, int count);
        List<Departure> GetLiveArrivals(string stationCode, int count);
        List<StationStop> GetStationStops(string url);
    }
}
