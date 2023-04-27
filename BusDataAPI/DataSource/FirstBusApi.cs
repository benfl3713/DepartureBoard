using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using RestSharp;

namespace BusDataAPI.DataSource
{
    public class FirstBusApi : IBusDatasource
    {
        private const string FirstBusApiUrl = "https://www.firstbus.co.uk/api/get-next-bus";

        public List<BusDeparture> GetLiveDepartures(string code)
        {
            List<BusDeparture> departures = new List<BusDeparture>();
            var client = new RestClient(FirstBusApiUrl);
            var request = new RestRequest();
            request.AddQueryParameter("stop", code);
            request.Timeout = 15000;

            var response = client.Execute<FirstBusApiResponse>(request);

            foreach (FirstBusApiResponse.Time time in response.Data.Times)
            {
                try
                {
                    
                    DateTime due = DateTime.Today;
                    if (time.Due.Contains(':'))
                    {
                        due.AddHours(int.Parse(time.Due.Split(':')[0]));
                        due.AddMinutes(int.Parse(time.Due.Split(':')[1]));
                    }
                    else
                    {
                        int minsDue = int.Parse(time.Due.Split(' ')[0]);
                        due = DateTime.Now.AddMinutes(minsDue);
                        due = due.AddSeconds(-due.Second);
                    }

                    BusDeparture departure = new BusDeparture(time.ServiceNumber, time.Destination, response.Data.StopName, "FIRST", "First", due, due);
                    departures.Add(departure);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }

            return departures;
        }

        private class FirstBusApiResponse
        {
            public List<Time> Times { get; set; }

            [JsonProperty(PropertyName = "stop_name")]
            public string StopName { get; set; }

            public class Time
            {
                public string ServiceNumber { get; set; }
                public string Destination { get; set; }
                public string Due { get; set; }
            }
        }
    }
}
