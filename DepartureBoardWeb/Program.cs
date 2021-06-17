using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace DepartureBoardWeb
{
	public class Program
	{
		public static int Main(string[] args)
		{
			try
			{
				CreateHostBuilder(args).Build().Run();
				return 0;
			}
			catch (Exception e)
			{
				Log.Fatal(e, $"Host terminated unexpectedly. Message: {e.Message}");
				return -1;
			}
			finally
			{
				Log.CloseAndFlush();
			}
		}

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.UseSerilog()
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>();
				})

				.ConfigureAppConfiguration(configurationBuilder =>
				{
					configurationBuilder.AddEnvironmentVariables();
				});
	}
}
