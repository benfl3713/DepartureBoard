using System.Collections.Generic;

namespace TrainDataAPI;

public interface ITrainDatasource
{
	List<Departure> GetLiveDepartures(LiveDeparturesRequest request);
	List<Departure> GetLiveArrivals(LiveDeparturesRequest request);
	List<StationStop> GetStationStops(string serviceIdentifier, LiveDeparturesRequest request);
}

public record LiveDeparturesRequest(string stationCode, string platform, int count, bool includeNonPassenger = false);
