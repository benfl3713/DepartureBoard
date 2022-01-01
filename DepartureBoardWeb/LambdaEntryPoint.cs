using Amazon.Lambda.AspNetCoreServer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace DepartureBoardWeb
{
	// ReSharper disable once UnusedType.Global
	public class LambdaEntryPoint : APIGatewayProxyFunction
	{
		protected override void Init(IWebHostBuilder builder)
		{
			Startup.IsLambda = true;

			builder.UseSerilog()
				.ConfigureAppConfiguration(configurationBuilder =>
				{
					configurationBuilder.AddEnvironmentVariables();
				})
				.UseStartup<Startup>()
				.UseLambdaServer();
		}
	}
}
