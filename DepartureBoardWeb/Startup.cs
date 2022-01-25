using System.Collections.Generic;
using AspNetCoreRateLimit;
using DepartureBoardCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moesif.Middleware;
using Prometheus;
using Serilog;
using Serilog.Events;
using TrainDataAPI.Services;

namespace DepartureBoardWeb
{
	public class Startup
	{
		public static bool IsLambda = false;

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			var loggerConfiguration = new LoggerConfiguration()
				.ReadFrom.Configuration(Configuration)
				.MinimumLevel.Override("Microsoft", LogEventLevel.Verbose)
				.MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Verbose)
				.Enrich.FromLogContext()
				.WriteTo.Logger(lc => lc
					.Filter.ByIncludingOnly(f => f.Level >= LogEventLevel.Information)
					.WriteTo.Console(outputTemplate: "{Timestamp:HH:mm:ss:fff} [{Level}] {Message}{NewLine}{Exception}")
				);


			if (!string.IsNullOrEmpty(Configuration.GetValue<string>("Datalust_Server")))
			{
				loggerConfiguration.WriteTo.Seq(Configuration.GetValue<string>("Datalust_Server"), apiKey: Configuration.GetValue<string>("Datalust_ApiKey"));
			}

			Log.Logger = loggerConfiguration.CreateLogger();

			services.AddControllersWithViews();
			services.AddSingleton<IStationLookup>(new StationLookup());

			if (!IsLambda)
			{
				// In production, the Angular files will be served from this directory
				services.AddSpaStaticFiles(configuration =>
				{
					configuration.RootPath = "ClientApp/dist";
				});
			}

			services.AddCors(options =>
			{
				options.AddDefaultPolicy(builder =>
				{
					builder.AllowAnyOrigin();
					builder.AllowAnyMethod();
					builder.AllowAnyHeader();
				});
			});

			services.AddMemoryCache();
			services.AddResponseCaching();

            services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
            services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
            services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
            services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

            services.Configure<KestrelServerOptions>(options => { options.AllowSynchronousIO = true; });

            // services.AddSingleton(new TrainDataAPI.DarwinPushPortAPI());
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
			}

			if (!string.IsNullOrEmpty(ConfigService.MoesifApplicationId))
				app.UseMiddleware<MoesifMiddleware>(new Dictionary<string, object>
				{
					{ "ApplicationId", ConfigService.MoesifApplicationId }
				});

			var provider = new FileExtensionContentTypeProvider();
			provider.Mappings[".webmanifest"] = "application/manifest+json";

			//ConfigurePrometheusMetrics(app);

			if (!IsLambda)
			{
				app.UseStaticFiles(new StaticFileOptions
				{
					ContentTypeProvider = provider
				});
				if (!env.IsDevelopment())
				{
					app.UseSpaStaticFiles(new StaticFileOptions
					{
						ContentTypeProvider = provider
					});
				}
			}

			//app.UseIpRateLimiting();

			app.UseRouting();

			app.UseCors();

			app.UseResponseCaching();

			app.UseSerilogRequestLogging();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
			});

			if (!IsLambda)
			{
				app.UseSpa(spa =>
				{
					// To learn more about options for serving an Angular SPA from ASP.NET Core,
					// see https://go.microsoft.com/fwlink/?linkid=864501

					spa.Options.SourcePath = "ClientApp";

					if (env.IsDevelopment())
					{
						spa.UseAngularCliServer(npmScript: "start");
					}
				});
			}
		}

		private void ConfigurePrometheusMetrics(IApplicationBuilder app)
		{
			if (!ConfigService.PrometheusPort.HasValue)
				return;

			// Custom Metrics to count requests for each endpoint and the method
			var counter = Metrics.CreateCounter("departureboard_path_counter", "Counts requests to the API endpoints", new CounterConfiguration
			{
				LabelNames = new[] {"method", "endpoint", "status"}
			});
			app.Use((context, next) =>
			{
				if (!context.Request.Path.StartsWithSegments("/api"))
					return next();
				counter.WithLabels(context.Request.Method, context.Request.Path, context.Response.StatusCode.ToString()).Inc();
				return next();
			});

			app.UseMetricServer();
			//app.UseHttpMetrics();
		}
	}
}
