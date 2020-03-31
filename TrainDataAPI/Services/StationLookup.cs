using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace TrainDataAPI.Services
{
	public class StationLookup
	{
		public StationLookup()
		{
			CheckLastUpdated();
		}

		private const string Path = "station_codes.csv";

		public Dictionary<string, string> Stations
		{
			get {
				CheckLastUpdated();
				//Load the stations if the dictionary is not populated
				if (_stations == null || _stations.Count == 0 || _lastUpdated < DateTime.Now.AddHours(1))
				{
					(File.Exists(Path) ? (Action)LoadStationList : LoadStationListFromWeb)();
				}
				return _stations; 
			}
			private set { _stations = value; }
		}
		private Dictionary<string, string> _stations;
		private DateTime _lastUpdated = DateTime.MinValue;

		public void LoadStationList()
		{
			_stations = new Dictionary<string, string>();
			try
			{
				using (StreamReader sr = new StreamReader(Path))
				{
					string currentLine;
					// currentLine will be null when the StreamReader reaches the end of file
					while ((currentLine = sr.ReadLine()) != null)
					{
						//skip line if header
						if (currentLine == "Station Name,CRS Code")
							continue;
						string[] values = currentLine.Split(',');
						string stationName = values[0];
						string stationCode = values[1];
						_stations.Add(stationCode, stationName);
					}
				}
				_lastUpdated = DateTime.Now;
			}
			catch (Exception ex) { Console.WriteLine(ex.Message); }
		}

		public void LoadStationListFromWeb()
		{
			try
			{
				using (var client = new WebClient())
				{
					client.DownloadFile("https://www.nationalrail.co.uk/static/documents/content/station_codes.csv", Path);
				}
			}
			catch(Exception ex) { Console.WriteLine(ex.Message); }

			LoadStationList();
		}

		private void CheckLastUpdated()
		{
			try
			{
				FileInfo fileInfo = new FileInfo(Path);
				if (fileInfo.LastWriteTime < DateTime.Now.AddDays(-1))
					LoadStationListFromWeb();
			}
			catch (Exception ex) { Console.WriteLine(ex.Message); }
		}
	}
}
