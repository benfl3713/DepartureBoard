using System;
using System.Collections.Generic;
using System.Text;

namespace BusDataAPI.DataSource
{
	public interface IBusDatasource
	{
		List<BusDeparture> GetLiveDepartures(string atcoCode);
	}
}
