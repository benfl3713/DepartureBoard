using DepartureBoardCore;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BusDataAPI.DataSource
{
	public class TransportAPI : IBusDatasource
	{
		public List<BusDeparture> GetLiveDepartures(string atcoCode)
		{
			var client = new RestClient($"http://transportapi.com/v3/uk/bus/stop/{atcoCode}/live.json");
			var request = new RestRequest();
			AddCredentials(ref request);
			RestResponse response = client.Execute(request);
			return DeserialiseBusDeparture(response.Content);
		}

		private List<BusDeparture> DeserialiseBusDeparture(string json)
		{
			List<BusDeparture> busDepartures = new List<BusDeparture>();
			try
			{
				JObject results = JObject.Parse(json);

				if (results == null || !results.HasValues)
					return busDepartures;

				string stopName = results["stop_name"]?.ToString();

				var jsonDepartures = results["departures"];
				foreach (var jsonLine in jsonDepartures)
				{
					foreach (JToken departure in jsonLine.First())
					{
						string line = departure["line"].ToString();
						string destination = departure["direction"]?.ToString();
						string operatorCode = departure["operator"]?.ToString();
						string operatorName = departure["operator_name"]?.ToString();
						var date = departure["date"] ?? DateTime.Today.ToString("yyyy-MM-dd");
						DateTime.TryParse($"{date} {departure["aimed_departure_time"]}", out DateTime aimedDeparture);

						DateTime expectedDeparture = aimedDeparture;
						if(departure["expected_departure_date"].HasValues && departure["expected_departure_time"].HasValues)
						{
							DateTime.TryParse($"{departure["expected_departure_date"]} {departure["expected_departure_time"]}", out expectedDeparture);
						}

						busDepartures.Add(new BusDeparture(line, destination, stopName, operatorCode, operatorName, aimedDeparture, expectedDeparture));
					}
				}
			}
			catch(Exception ex)
			{
				Console.WriteLine(ex);
			}

			return busDepartures.OrderBy(d => d.ExpectedDeparture ?? d.AimedDeparture).ToList();
		}

		private void AddCredentials(ref RestRequest request)
		{
			request.AddParameter("app_id", ConfigService.TransportAPI_AppId);
			request.AddParameter("app_key", ConfigService.TransportAPI_AppKey);
		}
	}
}
