using System;
using System.Collections.Generic;

namespace TrainDataAPI
{
	internal class CacheDeparture
	{
		public DateTime CachedDateTime;
		public string StationCode;
		public List<Departure> Departures;

		public CacheDeparture(string stationCode, List<Departure> departures)
		{
			StationCode = stationCode;
			Departures = departures;
			CachedDateTime = DateTime.Now;
		}
	}
}
