using System;
using System.IO;
using System.Xml.Linq;

namespace TrainDataAPI
{
    public static class ConfigService
    {
		#region Fields
		public static string RealTimeTrainsToken{
            get{
                if(string.IsNullOrEmpty(_realTimeTrainsToken))
                    LoadConfig();
                return _realTimeTrainsToken;
            }
        }

        public static bool UseAnalytics
        {
            get
            {
                if (_useAnalytics == null)
                    LoadConfig();
                return _useAnalytics ?? false;
            }
        }

        public static string NationalRail_Username
        {
            get
            {
                if (string.IsNullOrEmpty(_nationalRail_Username))
                    LoadConfig();
                return _nationalRail_Username;
            }
        }

        public static string NationalRail_Password
        {
            get
            {
                if (string.IsNullOrEmpty(_nationalRail_Password))
                    LoadConfig();
                return _nationalRail_Password;
            }
        }

        public static bool UseCaching
        {
            get
            {
                if (_useCaching == null)
                    LoadConfig();
                return _useCaching ?? false;
            }
        }

        public static int CachePeriod
        {
            get
            {
                if (_cachePeriod == null)
                    LoadConfig();
                return _cachePeriod ?? 0;
            }
        }
        #endregion

        private static string _realTimeTrainsToken;
        private static bool? _useAnalytics;
        private static string _nationalRail_Username;
        private static string _nationalRail_Password;
        private static bool? _useCaching;
        private static int? _cachePeriod;

        private static void LoadConfig()
        {
            string errorMessage = "config.xml need populating with your real time trains api token. You can find this file in the DepartureBoardWeb folder";
            try{
                CheckFileExists();
                var rootElement = XElement.Parse(File.ReadAllText("config.xml"));
                if(rootElement == null)
                    return;
                
                _realTimeTrainsToken = rootElement.Element("RealTimeTrainsToken")?.Value;
                _useAnalytics = bool.Parse(rootElement.Element("UseAnalytics")?.Value ?? "false");
                _nationalRail_Username = rootElement.Element("NationalRail")?.Element("username")?.Value;
                _nationalRail_Password = rootElement.Element("NationalRail")?.Element("password")?.Value;
                _useCaching = bool.Parse(rootElement.Element("UseCaching")?.Value ?? "false");
                _cachePeriod = int.Parse(rootElement.Element("CachePeriod")?.Value ?? "0");
                if (_realTimeTrainsToken == "[INSERT_REALTIMETRAINS_TOKEN_HERE]"){
                    _realTimeTrainsToken = null;
                    throw new Exception(errorMessage);
                }
                return;
            }
            catch(Exception e){
                if(e.Message == errorMessage)
                    throw e;
                return;
            }
        }

        private static void CheckFileExists()
        {
            if (!File.Exists("config.xml"))
            {
                Console.WriteLine("Creating config.xml with default values");
                //creates config file
                new XDocument(
                        new XElement("Config",
                            new XElement("RealTimeTrainsToken", "[INSERT_REALTIMETRAINS_TOKEN_HERE]")
                        )
                    )
                    .Save("config.xml");
            }
        }
    }
}