// using System;
// using System.IO;
// using System.Threading.Tasks;
// using Apache.NMS;
// using Apache.NMS.ActiveMQ;
// using Apache.NMS.ActiveMQ.Commands;
// using Serilog;
// using ISession = System.ServiceModel.Channels.ISession;
//
// namespace TrainDataAPI
// {
//     public class DarwinPushPortAPI
//     {
//         private readonly ILogger _logger;
//         private IConnection connection;
//         private ISession session;
//         public DarwinPushPortAPI()
//         {
//             _logger = Log.Logger;
//             //Task.Run(Start);
//             Start();
//         }
//
//         private void Start()
//         {
//
//             IConnectionFactory factory = new NMSConnectionFactory("activemq:tcp://kb-dist-261e4f.nationalrail.co.uk:61616");
//
//             connection = factory.CreateConnection("KBea9b6b3f-b183-41e6-82f6-420f1031d0ff", "16c9fc5b-8032-4e6b-8ca7-33d875113f58");
//             connection.Start();
//             session = connection.CreateSession();
//
//             // while (false)
//             // {
//             //     if (queue.TryDequeue(out var msg))
//             //     {
//             //         // Handle Darwin message
//             //         File.AppendAllText("output.txt", JsonConvert.SerializeObject(msg));
//             //     }
//             // }
//
//             using (IMessageConsumer consumer = session.CreateConsumer(session.GetTopic("kb.incidents")))
//             {
//                 IMessage advisory;
//
//                 while ((advisory = consumer.Receive(TimeSpan.FromMilliseconds(2000))) != null)
//                 {
//                     ActiveMQMessage amqMsg = advisory as ActiveMQMessage;
//
//                     if (amqMsg.DataStructure != null)
//                     {
//                         DestinationInfo info = amqMsg.DataStructure as DestinationInfo;
//                         if (info != null)
//                         {
//                             Console.WriteLine("   Queue: " + info.Destination.ToString());
//                         }
//                     }
//                 }
//             }
//
//             Console.WriteLine("Listing Complete.");
//         }
//     }
// }
