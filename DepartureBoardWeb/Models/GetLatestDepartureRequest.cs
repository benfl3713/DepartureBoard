using System.ComponentModel.DataAnnotations;

namespace DepartureBoardWeb.Models
{

    public class GetLatestDepartureRequest
    {
        [Required]
        public string stationCode { get; set; }

        public int count { get; set; }
        public string platform { get; set; }
        public string dataSource { get; set; }
        public bool includeNonPassengerServices { get; set; }
        public string toCrsCode { get; set; }

        public GetLatestDepartureRequest()
        {
        }

        public GetLatestDepartureRequest(string stationCode = null, int count = 6, string platform = null, string dataSource = null, bool includeNonPassengerServices = false, string toCrsCode = null)
        {
            this.stationCode = stationCode;
            this.count = count;
            this.platform = platform;
            this.dataSource = dataSource;
            this.includeNonPassengerServices = includeNonPassengerServices;
            this.toCrsCode = toCrsCode;
        }

        public void Deconstruct(out string stationCode, out int count, out string platform, out string dataSource, out bool includeNonPassengerServices, out string toCrsCode)
        {
            stationCode = this.stationCode;
            count = this.count;
            platform = this.platform;
            dataSource = this.dataSource;
            includeNonPassengerServices = this.includeNonPassengerServices;
            toCrsCode = this.toCrsCode;
        }
    }
}
