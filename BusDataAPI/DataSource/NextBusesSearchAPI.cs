using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace BusDataAPI.DataSource
{
	public class NextBusesSearchAPI : IBusDatasource
	{
		public List<BusDeparture> GetLiveDepartures(string atcoCode)
		{
			var client = new RestClient($"http://nextbuses.mobi/WebView/BusStopSearch/BusStopSearchResults/{atcoCode}");
			var request = new RestRequest(Method.GET);
			IRestResponse response = client.Execute(request);
			return ParseHtmlPage(response.Content);
		}

		private List<BusDeparture> ParseHtmlPage(string htmlResponse)
		{
			List<BusDeparture> busDepartures = new List<BusDeparture>();
			try { 
				HtmlAgilityPack.HtmlDocument htmlDoc = new HtmlAgilityPack.HtmlDocument();
				// There are various options, set as needed
				htmlDoc.OptionFixNestedTags = true;
				// filePath is a path to a file containing the html
				htmlDoc.LoadHtml(htmlResponse);

				// ParseErrors is an ArrayList containing any errors from the Load statement
				if (htmlDoc.ParseErrors != null && htmlDoc.ParseErrors.Count() > 0)
				{
					return busDepartures;
				}
				else
				{

					if (htmlDoc.DocumentNode != null)
					{
						var stopName = htmlDoc.DocumentNode.SelectSingleNode("//h2").InnerText.Replace("&#39;", "'");
						stopName = stopName.Replace("Departures for ", "").Split(',')[0];
						HtmlAgilityPack.HtmlNode tableNode = htmlDoc.DocumentNode.SelectSingleNode("//table");

						if (tableNode != null)
						{
							var rows = tableNode.SelectNodes("tr");
							if (rows == null)
								return busDepartures;
							foreach (var row in rows)
							{
								var columns = row.SelectNodes("td");
								var line = columns[0].InnerText.Replace("\n", "").Trim();
								var stops = columns[1].InnerText.Replace("\n", "").Trim();
								var description = stops.Split(" at ");
								if (description.Count() < 2)
									description = stops.Split(" in ");
								string destination = description[0].Replace("&#39;", "'");

								var time = (stops.Contains(" in ")) ? DateTime.Now.AddMinutes(int.Parse(description[1].Split(' ')[0])).ToString("HH:mm") : description[1];

								if (!DateTime.TryParse($"{DateTime.Today:yyyy-MM-dd} {time}", out DateTime expected))
									expected = DateTime.Now;

								busDepartures.Add(new BusDeparture(line, destination, stopName, null, null, expected, expected));
							}
						}
					}
				}
				
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
			}

			return busDepartures;
		}
	}
}
