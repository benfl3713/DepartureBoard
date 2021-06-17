using Amazon.Lambda.AspNetCoreServer;
using Microsoft.AspNetCore.Hosting;

namespace DepartureBoardWeb
{
    public class LambdaEntryPoint: APIGatewayProxyFunction
    {
        protected override void Init(IWebHostBuilder builder)
        {
	        Startup.IsLambda = true;
            builder.UseStartup<Startup>()
                .UseLambdaServer();
        }
    }
}
