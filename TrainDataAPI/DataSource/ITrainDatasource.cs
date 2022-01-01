using System.Collections.Generic;

namespace TrainDataAPI
{

    public interface ITrainDatasource
    {
        List<Departure> GetLiveDepartures(LiveDeparturesRequest request);
        List<Departure> GetLiveArrivals(LiveDeparturesRequest request);
        List<StationStop> GetStationStops(string serviceIdentifier, LiveDeparturesRequest request);
    }

    public class LiveDeparturesRequest
    {
        public string stationCode;
        public string platform;
        public int count;
        public bool includeNonPassenger;

        public LiveDeparturesRequest(string stationCode = null, string platform = null, int count = 6, bool includeNonPassenger = false)
        {
            this.stationCode = stationCode;
            this.platform = platform;
            this.count = count;
            this.includeNonPassenger = includeNonPassenger;
        }
    };
}
