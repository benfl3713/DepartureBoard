using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using DepartureBoardCore;

namespace TrainDataAPI
{
    /// <summary>
    /// National Rail Live Departure Boards (LDBWS) via the Rail Data Marketplace REST/JSON api (api1.raildata.org.uk).
    /// Uses the Live Departure Board product (GetDepartureBoard / GetDepBoardWithDetails) and the Live Arrival Board product (GetArrBoardWithDetails).
    /// </summary>
    public class NationalRailV2API : ITrainDatasource
    {
        // LDBWS limits
        private const int MAX_ROWS = 150;
        private const int MAX_ROWS_WITH_DETAILS = 10;
        private const int MAX_TIME_WINDOW = 120;

        private const string DeparturesUrl = "https://api1.raildata.org.uk/1010-live-departure-board-dep1_2/LDBWS/api/20220120";
        private const string ArrivalsUrl = "https://api1.raildata.org.uk/1010-live-arrival-board-arr/LDBWS/api/20220120";

        private static readonly HttpClient _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        private static readonly TimeZoneInfo _ukTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/London");

        // Raw upstream responses keyed by request url, so identical requests are never sent twice within the cache period
        private static readonly ConcurrentDictionary<string, CachedResponse> _responseCache = new ConcurrentDictionary<string, CachedResponse>();

        // Calling points returned inline by GetDepBoardWithDetails, keyed by serviceID. Means no separate service details call is needed
        private static readonly ConcurrentDictionary<string, CachedStops> _stopsCache = new ConcurrentDictionary<string, CachedStops>();
        private static readonly TimeSpan StopsCachePeriod = TimeSpan.FromMinutes(2);

        public List<Departure> GetLiveDepartures(LiveDeparturesRequest request)
        {
            // If a platform is specified then we can't limit the request count before we then apply the platform filter
            bool filterPlatform = !string.IsNullOrEmpty(request.platform);
            int numRows = filterPlatform ? MAX_ROWS : Math.Clamp(request.count, 1, MAX_ROWS);

            // When the board is small enough fetch the calling points with it so loading stops doesn't need a request per service
            bool withDetails = numRows <= MAX_ROWS_WITH_DETAILS;
            string operation = withDetails ? "GetDepBoardWithDetails" : "GetDepartureBoard";

            return FetchServices(DeparturesUrl, operation, ConfigService.NationalRailV2_ApiKey, request, numRows, arrivals: false, cacheStops: withDetails);
        }

        public List<Departure> GetLiveArrivals(LiveDeparturesRequest request)
        {
            // The arrivals product only serves GetArrBoardWithDetails, which is capped at MAX_ROWS_WITH_DETAILS rows
            return FetchServices(ArrivalsUrl, "GetArrBoardWithDetails", ConfigService.NationalRailV2_ArrivalsApiKey, request, MAX_ROWS_WITH_DETAILS, arrivals: true, cacheStops: true);
        }

        /// <summary>
        /// Loads the board for the next MAX_TIME_WINDOW minutes. The api can't look further ahead than that in one call, so when a filter
        /// (destination or platform) leaves the board short, one more window is loaded to reach up to 4 hours ahead.
        /// Unfiltered boards never make the extra request.
        /// </summary>
        private List<Departure> FetchServices(string baseUrl, string operation, string apiKey, LiveDeparturesRequest request, int numRows, bool arrivals, bool cacheStops)
        {
            bool filtered = !string.IsNullOrEmpty(request.toCrsCode) || !string.IsNullOrEmpty(request.platform);
            List<Departure> services = new List<Departure>();

            foreach (int timeOffset in new[] { 0, MAX_TIME_WINDOW })
            {
                string url = BuildBoardUrl(baseUrl, operation, request, numRows, timeOffset);
                StationBoard board = Get<StationBoard>(url, apiKey);

                if (cacheStops)
                    CacheCallingPoints(board);

                IEnumerable<Departure> windowServices = FilterPlatforms(request.platform, DeserialiseServices(board, arrivals));
                foreach (Departure service in windowServices)
                {
                    if (!services.Any(s => s.ServiceTimeTableUrl == service.ServiceTimeTableUrl))
                        services.Add(service);
                }

                if (!filtered || services.Count >= request.count)
                    break;
            }

            return services.Take(request.count).ToList();
        }

        public List<StationStop> GetStationStops(string serviceIdentifier, LiveDeparturesRequest request)
        {
            try
            {
                // Normally already populated by the GetDepBoardWithDetails call that loaded the departures
                if (!TryGetCachedStops(serviceIdentifier, out List<StationStop> stops))
                {
                    string url = BuildBoardUrl(DeparturesUrl, "GetDepBoardWithDetails", request, MAX_ROWS_WITH_DETAILS);
                    CacheCallingPoints(Get<StationBoard>(url, ConfigService.NationalRailV2_ApiKey));
                    TryGetCachedStops(serviceIdentifier, out stops);
                }

                return stops ?? new List<StationStop>();
            }
            catch (Exception ex)
            {
                Serilog.Log.Warning(ex, "NationalRailV2: Failed to load stops for service {serviceId}", serviceIdentifier);
                return new List<StationStop>();
            }
        }

        private static bool TryGetCachedStops(string serviceIdentifier, out List<StationStop> stops)
        {
            if (_stopsCache.TryGetValue(serviceIdentifier, out CachedStops cached) && cached.CachedAt > DateTime.UtcNow - StopsCachePeriod)
            {
                stops = cached.Stops.ToList();
                return true;
            }

            stops = null;
            return false;
        }

        private static string BuildBoardUrl(string baseUrl, string operation, LiveDeparturesRequest request, int numRows, int timeOffset = 0)
        {
            string url = $"{baseUrl.TrimEnd('/')}/{operation}/{Uri.EscapeDataString(request.stationCode)}?numRows={numRows}&timeWindow={MAX_TIME_WINDOW}";

            if (timeOffset != 0)
                url += $"&timeOffset={timeOffset}";

            // Note: the public LDBWS api only returns passenger services so request.includeNonPassenger can't be honoured
            if (!string.IsNullOrEmpty(request.toCrsCode))
                url += $"&filterCrs={Uri.EscapeDataString(request.toCrsCode.ToUpper())}&filterType=to";

            return url;
        }

        private static T Get<T>(string url, string apiKey) where T : class
        {
            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("NationalRailV2 api key is not configured. Set NationalRailV2_ApiKey (and optionally NationalRailV2_ArrivalsApiKey)");

            int cachePeriod = ConfigService.UseCaching ? ConfigService.CachePeriod : 0;
            _responseCache.TryGetValue(url, out CachedResponse cached);
            if (cached != null && cachePeriod > 0 && cached.CachedAt > DateTime.UtcNow.AddMilliseconds(-cachePeriod))
                return JsonSerializer.Deserialize<T>(cached.Body, _jsonOptions);

            using HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Get, url);
            httpRequest.Headers.Add("x-apikey", apiKey);
            httpRequest.Headers.Add("User-Agent", "DepartureBoard");

            using HttpResponseMessage response = _httpClient.Send(httpRequest);
            string body = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

            if (!response.IsSuccessStatusCode)
            {
                // Rather than failing the board when throttled or the upstream has a blip, serve the last good response if we have one
                if (cached != null && cached.CachedAt > DateTime.UtcNow.AddMinutes(-5))
                {
                    Serilog.Log.Warning("NationalRailV2: {statusCode} from {url}. Serving stale response from {cachedAt}", (int)response.StatusCode, StripQuery(url), cached.CachedAt);
                    return JsonSerializer.Deserialize<T>(cached.Body, _jsonOptions);
                }

                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                    Serilog.Log.Warning("NationalRailV2: Throttled (429) by {url}. Retry-After: {retryAfter}", StripQuery(url), response.Headers.RetryAfter);

                throw new HttpRequestException($"NationalRailV2 request to {StripQuery(url)} failed with {(int)response.StatusCode} {response.StatusCode}: {body}", null, response.StatusCode);
            }

            // Cache every successful response so it can be used as a fallback even when caching is disabled
            _responseCache[url] = new CachedResponse(body);
            return JsonSerializer.Deserialize<T>(body, _jsonOptions);
        }

        private static string StripQuery(string url) => url.Split('?')[0];

        private void CacheCallingPoints(StationBoard board)
        {
            if (board?.trainServices == null)
                return;

            DateTime referenceTime = ParseGeneratedAt(board.generatedAt);
            foreach (ServiceItem service in board.trainServices)
            {
                if (string.IsNullOrEmpty(service.serviceID) || service.subsequentCallingPoints == null)
                    continue;
                _stopsCache[service.serviceID] = new CachedStops(ConvertCallingPoints(service.subsequentCallingPoints, referenceTime));
            }

            // Keep the cache from growing forever
            foreach (var expired in _stopsCache.Where(s => s.Value.CachedAt < DateTime.UtcNow - StopsCachePeriod).ToList())
                _stopsCache.TryRemove(expired.Key, out _);
        }

        private List<Departure> DeserialiseServices(StationBoard board, bool arrivals)
        {
            List<Departure> departures = new List<Departure>();
            if (board?.trainServices == null)
                return departures;

            DateTime generatedAt = ParseGeneratedAt(board.generatedAt);

            foreach (ServiceItem service in board.trainServices)
            {
                string scheduledText = arrivals ? service.sta : service.std;
                string expectedText = arrivals ? service.eta : service.etd;

                DateTime? scheduled = ParseTime(scheduledText, generatedAt);
                if (scheduled == null)
                    continue;

                (DateTime? expected, Departure.ServiceStatus status) = ParseExpected(expectedText, scheduled.Value, generatedAt);
                if (service.isCancelled)
                    status = Departure.ServiceStatus.CANCELLED;

                departures.Add(new Departure(board.locationName,
                    board.crs,
                    service.platform,
                    service.@operator,
                    scheduled.Value,
                    expected,
                    JoinLocations(service.destination),
                    status,
                    JoinLocations(service.origin),
                    generatedAt,
                    service.serviceID,
                    GetType(),
                    service.length ?? 0));
            }

            return departures;
        }

        private static List<StationStop> ConvertCallingPoints(List<ArrayOfCallingPoints> callingPointLists, DateTime referenceTime)
        {
            List<StationStop> stops = new List<StationStop>();
            if (callingPointLists == null)
                return stops;

            // When a train divides there are multiple lists. The first one is the portion the board service runs on
            foreach (CallingPoint callingPoint in callingPointLists.FirstOrDefault()?.callingPoint ?? new List<CallingPoint>())
            {
                DateTime? scheduled = ParseTime(callingPoint.st, referenceTime);
                if (scheduled == null)
                    continue;

                (DateTime? expected, _) = ParseExpected(callingPoint.et ?? callingPoint.at, scheduled.Value, referenceTime);
                stops.Add(new StationStop(callingPoint.crs, callingPoint.locationName, null, scheduled.Value, expected));
            }

            return stops;
        }

        private static string JoinLocations(List<ServiceLocation> locations)
        {
            if (locations == null || locations.Count == 0)
                return string.Empty;
            return string.Join(" & ", locations.Select(l => l.locationName));
        }

        private static List<Departure> FilterPlatforms(string platform, List<Departure> departures)
        {
            if (string.IsNullOrEmpty(platform))
                return departures;

            string[] platforms = platform.Split(',');
            return departures.Where(d => platforms.Contains(d.Platform)).ToList();
        }

        /// <summary>
        /// Converts an LDBWS estimate ("On time", "Delayed", "Cancelled", "No report" or "HH:mm") into an expected time and status
        /// </summary>
        private static (DateTime? expected, Departure.ServiceStatus status) ParseExpected(string expectedText, DateTime scheduled, DateTime referenceTime)
        {
            switch (expectedText?.Trim())
            {
                case null:
                case "":
                case "On time":
                case "No report":
                    return (scheduled, Departure.ServiceStatus.ONTIME);
                case "Cancelled":
                    return (null, Departure.ServiceStatus.CANCELLED);
                case "Delayed":
                    return (null, Departure.ServiceStatus.LATE);
            }

            DateTime? expected = ParseTime(expectedText, referenceTime);
            if (expected == null)
                return (scheduled, Departure.ServiceStatus.ONTIME);

            return (expected, expected.Value > scheduled ? Departure.ServiceStatus.LATE : Departure.ServiceStatus.ONTIME);
        }

        /// <summary>
        /// LDBWS returns "HH:mm" UK local times. Resolve the date relative to the time the board was generated so services around midnight land on the right day
        /// </summary>
        private static DateTime? ParseTime(string time, DateTime referenceTime)
        {
            if (string.IsNullOrEmpty(time) || !TimeSpan.TryParseExact(time.Trim(), @"hh\:mm", CultureInfo.InvariantCulture, out TimeSpan timeOfDay))
                return null;

            DateTime result = referenceTime.Date + timeOfDay;
            if (result - referenceTime > TimeSpan.FromHours(12))
                result = result.AddDays(-1);
            else if (referenceTime - result > TimeSpan.FromHours(12))
                result = result.AddDays(1);

            return result;
        }

        private static DateTime ParseGeneratedAt(string generatedAt)
        {
            if (!string.IsNullOrEmpty(generatedAt) && DateTimeOffset.TryParse(generatedAt, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTimeOffset parsed))
                return TimeZoneInfo.ConvertTime(parsed, _ukTimeZone).DateTime;

            return TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, _ukTimeZone).DateTime;
        }

        private class CachedResponse
        {
            public string Body { get; }
            public DateTime CachedAt { get; } = DateTime.UtcNow;
            public CachedResponse(string body) => Body = body;
        }

        private class CachedStops
        {
            public List<StationStop> Stops { get; }
            public DateTime CachedAt { get; } = DateTime.UtcNow;
            public CachedStops(List<StationStop> stops) => Stops = stops;
        }

        #region LDBWS response models

        private class StationBoard
        {
            public string generatedAt { get; set; }
            public string locationName { get; set; }
            public string crs { get; set; }
            public List<ServiceItem> trainServices { get; set; }
        }

        private class ServiceItem
        {
            public List<ServiceLocation> origin { get; set; }
            public List<ServiceLocation> destination { get; set; }
            public string sta { get; set; }
            public string eta { get; set; }
            public string std { get; set; }
            public string etd { get; set; }
            public string platform { get; set; }
            public string @operator { get; set; }
            public string operatorCode { get; set; }
            public bool isCancelled { get; set; }
            public int? length { get; set; }
            public string serviceID { get; set; }
            public string cancelReason { get; set; }
            public string delayReason { get; set; }
            public List<ArrayOfCallingPoints> subsequentCallingPoints { get; set; }
        }

        private class ServiceLocation
        {
            public string locationName { get; set; }
            public string crs { get; set; }
            public string via { get; set; }
        }

        private class ArrayOfCallingPoints
        {
            public List<CallingPoint> callingPoint { get; set; }
        }

        private class CallingPoint
        {
            public string locationName { get; set; }
            public string crs { get; set; }
            public string st { get; set; }
            public string et { get; set; }
            public string at { get; set; }
            public bool isCancelled { get; set; }
            public int? length { get; set; }
        }

        #endregion
    }
}
