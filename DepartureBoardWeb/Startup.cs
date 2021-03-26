using System;
using DepartureBoardCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Prometheus;
using Serilog;
using Serilog.Events;
using TrainDataAPI.Services;

namespace DepartureBoardWeb
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddControllersWithViews();
			services.AddSingleton(new StationLookup());
			// In production, the Angular files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/dist";
			});

			services.AddCors(options =>
			{
				options.AddDefaultPolicy(builder =>
				{
					builder.WithOrigins(new []{"https://admin.leddepartureboard.com", "http://localhost:5000", "http://localhost:5005", "https://leddepartureboard.com", "https://www.leddepartureboard.com"});
					builder.AllowAnyMethod();
					builder.AllowAnyHeader();
				});
			});

			services.AddMemoryCache();
			services.AddResponseCaching();

			var loggerConfiguration = new LoggerConfiguration()
				.ReadFrom.Configuration(Configuration)
				.MinimumLevel.Override("Microsoft", LogEventLevel.Verbose)
				.Enrich.FromLogContext()
				.WriteTo.Logger(lc => lc
					.Filter.ByIncludingOnly(f => f.Level >= LogEventLevel.Error)
					.WriteTo.File("errors.txt"))
				.WriteTo.Logger(lc => lc
					.Filter.ByIncludingOnly(f => f.Level >= LogEventLevel.Information)
					.WriteTo.Console(outputTemplate: "{Timestamp:HH:mm:ss:fff} [{Level}] {Message}{NewLine}{Exception}")
				);

			Log.Logger = loggerConfiguration.CreateLogger();

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

			var provider = new FileExtensionContentTypeProvider();
			provider.Mappings[".webmanifest"] = "application/manifest+json";

			//ConfigurePrometheusMetrics(app);

			app.UseStaticFiles(new StaticFileOptions{
				ContentTypeProvider = provider
			});
			if (!env.IsDevelopment())
			{
				app.UseSpaStaticFiles(new StaticFileOptions{
					ContentTypeProvider = provider
				});
			}

			app.UseRouting();

			app.UseCors();

			app.UseResponseCaching();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
			});

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
