using System.Collections.Generic;

namespace BusDataAPI.DataSource
{
	public interface IBusDatasource
	{
		List<BusDeparture> GetLiveDepartures(string code);
	}
}
