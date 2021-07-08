using System;
using System.Collections.Generic;
using System.Linq;
using DepartureBoardCore;
using NationalRailService;

namespace TrainDataAPI
{
	public class NationalRailAPI : ITrainDatasource
	{
		private AccessToken AccessToken = new AccessToken() {TokenValue = ConfigService.NationalRail_AccessToken};
		private LDBServiceSoapClient client = new LDBServiceSoapClient(LDBServiceSoapClient.EndpointConfiguration.LDBServiceSoap);

		public List<Departure> GetLiveArrivals(string stationCode, string platform, int count)
		{
			GetArrivalBoardResponse arrivalsResponse =
				client.GetArrivalBoardAsync(AccessToken, ushort.Parse(count.ToString()), stationCode, null, FilterType.to, 0, 1440).Result;
			List<Departure> departures = DeserialiseDepartures(arrivalsResponse.GetStationBoardResult);

			if (!string.IsNullOrEmpty(platform))
				departures = departures.Where(d => d.Platform == platform).ToList();

			return departures.Take(count).ToList();
		}

		public List<Departure> GetLiveDepartures(string stationCode, string platform, int count)
		{
			GetDepartureBoardResponse departuresResponse = client
				.GetDepartureBoardAsync(AccessToken, ushort.Parse(count.ToString()), stationCode, null, FilterType.to, 0, 1440)
				.Result;

			List<Departure> departures = DeserialiseDepartures(departuresResponse.GetStationBoardResult);

			if (!string.IsNullOrEmpty(platform))
				departures = departures.Where(d => d.Platform == platform).ToList();

			return departures.Take(count).ToList();
		}

		private List<Departure> DeserialiseDepartures(StationBoard departuresResponse)
		{
			List<Departure> departures = new List<Departure>();

			if (departuresResponse?.trainServices == null)
				return departures;

			DateTime generated = departuresResponse.generatedAt;
			foreach (ServiceItem2 departure in departuresResponse.trainServices)
			{
				Departure.ServiceStatus status = Departure.ServiceStatus.ONTIME;
				DateTime.TryParse(departure.std ?? departure.sta, out DateTime std);
				DateTime scheduledDeparture = new DateTime(generated.Year, generated.Month, generated.Day, std.Hour, std.Minute, std.Second);
				DateTime expectedDeparture = scheduledDeparture;
				if (DateTime.TryParse(departure.etd ?? departure.eta, out DateTime etd))
				{
					expectedDeparture = new DateTime(generated.Year, generated.Month, generated.Day, etd.Hour, etd.Minute, etd.Second);
					status = Departure.ServiceStatus.LATE;
				}

				if (departure.isCancelled)
					status = Departure.ServiceStatus.CANCELLED;

				departures.Add(new Departure(departuresResponse.locationName, departuresResponse.crs, departure.platform, departure.@operator,
					scheduledDeparture, expectedDeparture, departure.destination[0].locationName, status, departure.origin[0].locationName,
					departuresResponse.generatedAt, departure.serviceID, GetType(), Convert.ToInt32(departure.length)));
			}

			return departures;
		}

		public List<StationStop> GetStationStops(string url)
		{
			List<StationStop> stops = new List<StationStop>();
			try
			{
				GetServiceDetailsResponse stopsResponse = client.GetServiceDetailsAsync(AccessToken, url).Result;
				DateTime generated = stopsResponse.GetServiceDetailsResult.generatedAt;
				foreach (CallingPoint1 stop in stopsResponse.GetServiceDetailsResult.subsequentCallingPoints[0].callingPoint)
				{
					DateTime st = DateTime.Parse(stop.st);
					DateTime scheduledDeparture = new DateTime(generated.Year, generated.Month, generated.Day, st.Hour, st.Minute, st.Second);
					DateTime expectedDeparture = scheduledDeparture;
					if (DateTime.TryParse(stop.et, out DateTime etd))
						expectedDeparture = new DateTime(generated.Year, generated.Month, generated.Day, etd.Hour, etd.Minute, etd.Second);
					stops.Add(new StationStop(stop.crs, stop.locationName, null, scheduledDeparture, expectedDeparture));
				}

				return stops;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return stops;
			}
		}
	}
}
