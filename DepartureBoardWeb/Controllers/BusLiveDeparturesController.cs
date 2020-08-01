using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusDataAPI.DataSource;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DepartureBoardWeb.Controllers
{
	[Route("api/BusLiveDepartures")]
	[ApiController]
	public class BusLiveDeparturesController : Controller
	{
		[HttpGet]
		public dynamic GetBusLiveDepartures(string atco)
		{
			IBusDatasource busDatasource = new TransportAPI();
			return busDatasource.GetLiveDepartures(atco);
		}
	}
}
