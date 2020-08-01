using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TrainDataAPI.Services;
using System.IO;
using System;
using Microsoft.AspNetCore.Http;

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
					builder.WithOrigins(new string[]{"https://admin.leddepartureboard.com", "http://localhost:5000"});
					builder.AllowAnyMethod();
					builder.AllowAnyHeader();
				});
			});

			services.AddMemoryCache();
			services.AddResponseCaching();
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

			//SetupConfigFiles();
		}

		public void SetupConfigFiles(){
			try{
				string firebaseConfig = "./ClientApp/src/app/firebaseConfig.json";
				if(!File.Exists(firebaseConfig)){
					File.WriteAllText(firebaseConfig, "{\"apiKey\":\"\",\"authDomain\":\"\",\"databaseURL\":\"\",\"projectId\":\"leddepartureboard\",\"storageBucket\":\"\",\"messagingSenderId\":\"\",\"appId\":\"\"}");
				}
			}
			catch(Exception e){
				Console.WriteLine(e.Message);
			}
		}
	}
}
