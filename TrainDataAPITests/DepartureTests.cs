using NUnit.Framework;
using System;
using TrainDataAPI;

namespace TrainDataAPITests
{
	public class DepartureTests
	{
		private readonly DateTime testTime = new DateTime(2020, 5, 4);
		private Departure GetTestDeparture() =>  new Departure("Euston", "EUS", 1, "Test", testTime, testTime, "Birmingham", Departure.ServiceStatus.ONTIME);

		[Test]
		public void ClearStops()
		{
			Departure departure = GetTestDeparture();
			departure.Stops.Add(new StationStop("COV", "Coventry", StationStop.StopType.LO, 3, testTime, testTime));
			departure.Stops.Add(new StationStop("BHM", "Birmingham", StationStop.StopType.LO, 3, testTime, testTime));
			departure.ClearStops();
			Assert.IsNull(departure.Stops);
		}

		[Test]
		public void StopsAsOfDepartureStation()
		{
			Departure departure = GetTestDeparture();
			departure.Stops.Add(new StationStop("COV", "Coventry", StationStop.StopType.LO, 1, testTime.AddHours(-1), testTime.AddHours(-1)));
			departure.Stops.Add(new StationStop("EUS", "Euston", StationStop.StopType.LO, 3, testTime, testTime));
			departure.Stops.Add(new StationStop("BHM", "Birmingham", StationStop.StopType.LO, 6, testTime.AddHours(1), testTime.AddHours(1)));
			departure.StopsAsOfDepartureStation();
			Assert.AreEqual(1, departure.Stops.Count);
			Assert.AreEqual("BHM", departure.Stops[0].StationCode);
		}
	}
}
