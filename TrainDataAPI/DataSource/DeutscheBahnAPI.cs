using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using DepartureBoardCore;
using Newtonsoft.Json;
using RestSharp;

namespace TrainDataAPI
{
    public class DeutscheBahnAPI : ITrainDatasource
    {
        public List<Departure> GetLiveDepartures(string stationCode, string platform, int count)
        {
            List<Departure> departures = new List<Departure>();
            HttpResponseMessage response = SendFahrplanRequest("departureBoard", stationCode, DateTime.Now);
            if (response.StatusCode != HttpStatusCode.OK)
                return departures;

            List<DBBoard> boards = JsonConvert.DeserializeObject<List<DBBoard>>(HttpUtility.HtmlDecode(response.Content.ReadAsStringAsync().Result));

            Parallel.ForEach(boards, board =>
            {
                if (board.dateTime < DateTime.Now)
                    return;
                board.stopCode = stationCode;
                Departure d = GetDepartureFromDBBoard(board);
                if (d != null)
                    departures.Add(d);
            });


            if (!string.IsNullOrEmpty(platform))
	            departures = departures.Where(d => d.Platform == platform).ToList();

            return departures.OrderBy(d => d.AimedDeparture).Take(count).ToList();
        }

        public List<Departure> GetLiveArrivals(string stationCode, string platform, int count)
        {
            throw new System.NotImplementedException();
        }

        public List<StationStop> GetStationStops(string detailsId)
        {
            return null;
        }

        private Departure GetDepartureFromDBBoard(DBBoard board)
        {
            HttpResponseMessage response = SendFahrplanRequest("journeyDetails", HttpUtility.UrlEncode(board.detailsId));
            if (response.StatusCode != HttpStatusCode.OK)
                return null;

            List<DBJourneyDetails> details = JsonConvert.DeserializeObject<List<DBJourneyDetails>>(HttpUtility.HtmlDecode(response.Content.ReadAsStringAsync().Result));
            Departure departure = null;
            bool foundCurrencyStation = false;

            foreach (DBJourneyDetails detail in details)
            {
                if(foundCurrencyStation == false && detail.stopName != board.stopName)
                    continue;
                foundCurrencyStation = true;

                if (detail.stopName == board.stopName)
                {
                    departure = new Departure(board.stopName, board.stopCode, board.track, detail.operatorName, board.dateTime, board.dateTime, details.Last().stopName, Departure.ServiceStatus.ONTIME, details.First().stopName, DateTime.Now);
                    if (!string.IsNullOrEmpty(board.name))
                        departure.AddExtraDetail("name", board.name);
                }
                else if(departure != null)
                {
                    if(!DateTime.TryParse($"{board.dateTime:yyyy-MM-dd}T{detail.depTime}", out DateTime expectedDate))
                        continue;

                    departure.Stops.Add(new StationStop(null, detail.stopName, null, expectedDate, expectedDate));
                }
            }

            return departure;
        }

        private HttpResponseMessage SendFahrplanRequest(string type, string secondParameter, DateTime? date = null)
        {
            // RestClient client = new RestClient();
            // RestRequest request = new RestRequest("https://api.deutschebahn.com/fahrplan-plus/v1/{type}/{secondParameter}", Method.GET);
            // request.AddUrlSegment("type", type);
            // request.AddUrlSegment("secondParameter", secondParameter);
            // request.AddHeader("Content-Type", @"application/x-www-form-urlencoded; charset=UTF-8");
            // request.Timeout = 15000;
            // AddCredentials(ref request);
            // if(date.HasValue)
            //     request.AddQueryParameter("date", date.Value.ToString("yyyy-MM-ddThh:mm:ss"));
            //
            //
            // return client.Execute(request);

            HttpClient client = new HttpClient
            {
                DefaultRequestHeaders = {{"Authorization", $"Bearer {ConfigService.DeutscheBahnToken}"}}
            };

            var builder = new UriBuilder($"https://api.deutschebahn.com/fahrplan-plus/v1/{type}/{secondParameter}");
            var query = HttpUtility.ParseQueryString(builder.Query);
            if (date.HasValue)
                query["date"] = date.Value.ToString("yyyy-MM-ddTHH:mm");
            builder.Query = query.ToString() ?? string.Empty;
            return client.GetAsync(builder.ToString()).Result;
        }

        private class DBBoard
        {
            public string name { get; set; }
            public string stopCode { get; set; }
            public string stopName { get; set; }
            public string detailsId { get; set; }
            public string track { get; set; }
            public DateTime dateTime { get; set; }
        }

        private class DBJourneyDetails
        {
            public string stopName { get; set; }
            [JsonProperty(PropertyName = "operator")]
            public string operatorName { get; set; }
            public string depTime { get; set; }
            public string arrTime { get; set; }
        }
    }
}
