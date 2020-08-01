using DepartureBoardCore;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Text;

namespace BusDataAPI.DataSource
{
	public class TransportAPI : IBusDatasource
	{
		public List<BusDeparture> GetLiveDepartures(string atcoCode)
		{
			var client = new RestClient($"http://transportapi.com/v3/uk/bus/stop/{atcoCode}/live.json");
			var request = new RestRequest(Method.GET);
			AddCredentials(ref request);
			IRestResponse response = client.Execute(request);
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

				var jsonDepartures = results["departures"];
				foreach (JArray jsonLine in jsonDepartures)
				{
					foreach (JToken departure in jsonLine)
					{
						Console.WriteLine("TEst");
					}
				}
			}
			catch(Exception ex)
			{
				Console.WriteLine(ex);
			}

			return busDepartures;
		}

		private void AddCredentials(ref RestRequest request)
		{
			request.AddParameter("app_id", "");
			request.AddParameter("app_key", "");
		}
	}
}
