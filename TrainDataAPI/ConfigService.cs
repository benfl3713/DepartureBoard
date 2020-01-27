using System;
using System.Xml.Linq;

namespace TrainDataAPI
{
    public static class ConfigService
    {
        public static string RealTimeTrainsToken{
            get{
                if(string.IsNullOrEmpty(_realTimeTrainsToken))
                    return LoadRealTimeTrainsToken();
                return _realTimeTrainsToken;
            }
        }

        private static string _realTimeTrainsToken;

        private static string LoadRealTimeTrainsToken(){
            string errorMessage = "config.xml need populating with your real time trains api token. You can find this file in the DepartureBoardWeb folder";
            try{
                var rootElement = XElement.Parse(System.IO.File.ReadAllText("config.xml"));
                if(rootElement == null)
                    return null;
                
                _realTimeTrainsToken = rootElement.Element("RealTimeTrainsToken")?.Value;
                if(_realTimeTrainsToken == "[INSERT_REALTIMETRAINS_TOKEN_HERE]"){
                    _realTimeTrainsToken = null;
                    throw new Exception(errorMessage);
                }
                return _realTimeTrainsToken;
            }
            catch(Exception e){
                if(e.Message == errorMessage)
                    throw e;
                return null;
            }
        }
    }
}