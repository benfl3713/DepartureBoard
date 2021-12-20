using System.ComponentModel.DataAnnotations;

namespace DepartureBoardWeb.Models;

public record GetLatestDepartureRequest([Required] string stationCode, int count = 6, string platform = null, string dataSource = null, bool includeNonPassengerServices = false);
