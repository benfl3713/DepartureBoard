using System;
using System.IO;
using System.Xml.Linq;

namespace TrainDataAPI
{
    public static class ConfigService
    {
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

        private static string _realTimeTrainsToken;
        private static bool? _useAnalytics;

        private static void LoadConfig()
        {
            string errorMessage = "config.xml need populating with your real time trains api token. You can find this file in the DepartureBoardWeb folder";
            try{
                CheckFileExists();
                var rootElement = XElement.Parse(System.IO.File.ReadAllText("config.xml"));
                if(rootElement == null)
                    return;
                
                _realTimeTrainsToken = rootElement.Element("RealTimeTrainsToken")?.Value;
                _useAnalytics = bool.Parse(rootElement.Element("UseAnalytics")?.Value ?? "false");
                if(_realTimeTrainsToken == "[INSERT_REALTIMETRAINS_TOKEN_HERE]"){
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