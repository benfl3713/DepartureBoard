using System;
using System.Collections.Generic;

namespace TrainDataAPI
{
    public interface ITrainDatasource
    {
        List<Departure> GetLiveDepartures(string stationCode);
        List<StationStop> GetStationStops(string url);
    }
}
