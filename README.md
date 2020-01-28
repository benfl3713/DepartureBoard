# DepartureBoard
![](https://github.com/benfl3713/DepartureBoard/workflows/Docker/badge.svg?branch=master)
![](https://github.com/benfl3713/DepartureBoard/workflows/.NET%20Core/badge.svg?branch=master)

This image creates a web server showing live train times in the UK and is designed to look like the led departure boards you see in the station

# How to Use
1. To change the station just modify the url. E.g  *http://your-site.com/EUS* will show euston station times
2. To change the amount of boards on the screen just add a number to the end. E.g http://your-site.com/EUS/12

# Working Example 
To view a running example head over to
https://leddepartureboard.com/EUS/12

# Run locally
To run the project simply clone the repo and open the solution file and click run.  
**You will need to register for a real time trains api token in order to receive data. Put the token in DepartureBoardWeb/config.xml**

This project uses a c# backend system with an angular front end  
To build the program you will need node.js installed as well as .net core sdk  
To host the site once published you will need the .net core hosting bundle installed
