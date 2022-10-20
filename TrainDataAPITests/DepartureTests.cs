using NUnit.Framework;
using System;
using TrainDataAPI;

namespace TrainDataAPITests
{
	public class DepartureTests
	{
		private readonly DateTime _testTime = new DateTime(2020, 5, 4);
		private Departure GetTestDeparture() =>  new Departure("Euston", "EUS", "1", "Test", _testTime, _testTime, "Birmingham", Departure.ServiceStatus.ONTIME);

		[Test]
		public void ClearStops()
		{
			Departure departure = GetTestDeparture();
			departure.Stops.Add(new StationStop("COV", "Coventry", "3", _testTime, _testTime));
			departure.Stops.Add(new StationStop("BHM", "Birmingham",  "3", _testTime, _testTime));
			departure.ClearStops();
			Assert.IsNull(departure.Stops);
		}

		[Test]
		public void StopsAsOfDepartureStation()
		{
			Departure departure = GetTestDeparture();
			departure.Stops.Add(new StationStop("COV", "Coventry",  "1", _testTime.AddHours(-1), _testTime.AddHours(-1)));
			departure.Stops.Add(new StationStop("EUS", "Euston",  "3", _testTime, _testTime));
			departure.Stops.Add(new StationStop("BHM", "Birmingham",  "6", _testTime.AddHours(1), _testTime.AddHours(1)));
			departure.StopsAsOfDepartureStation();
			Assert.AreEqual(1, departure.Stops.Count);
			Assert.AreEqual("BHM", departure.Stops[0].StationCode);
		}
		
		[Test]
		public void StopsAsOfDepartureStation_DuplicateStops()
		{
			Departure departure = GetTestDeparture();
			departure.Stops.Add(new StationStop("COV", "Coventry",  "1", _testTime.AddHours(-1), _testTime.AddHours(-1)));
			departure.Stops.Add(new StationStop("BHM", "Birmingham",  "6", _testTime, _testTime));
			departure.Stops.Add(new StationStop("EUS", "Euston",  "3", _testTime, _testTime));
			departure.Stops.Add(new StationStop("BHM", "Birmingham",  "6", _testTime.AddHours(1), _testTime.AddHours(1)));
			departure.Stops.Add(new StationStop("WVH", "Wolverhamton",  "3", _testTime.AddHours(2), _testTime.AddHours(2)));
			departure.StopsAsOfDepartureStation();
			Assert.AreEqual(2, departure.Stops.Count);
			Assert.AreEqual("BHM", departure.Stops[0].StationCode);
			Assert.AreEqual(_testTime.AddHours(1).Hour, departure.Stops[0].AimedDeparture.Hour);
			Assert.AreEqual("WVH", departure.Stops[1].StationCode);
		}
	}
}
