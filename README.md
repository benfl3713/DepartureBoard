# DepartureBoard

![](https://github.com/benfl3713/DepartureBoard/workflows/Pipeline/badge.svg?branch=master)
![](https://github.com/benfl3713/DepartureBoard/workflows/.NET%20Core/badge.svg?branch=master)

# Welcome

This project is an angular website designed to present the UK and German train departures in a way similar to the led boards you find in stations accross the UK. For more info please see https://leddepartureboard.com

![](https://github.com/benfl3713/DepartureBoard/blob/master/DepartureBoardWeb/wwwroot/preview.png?raw=true)

# How to Use

1. To change the station just modify the url. E.g http://your-site.com/EUS will show euston station times
2. To change the amount of boards on the screen just add a number to the end. E.g http://your-site.com/EUS/12
3. To view a platform style board just modify the url with a prefix of 'singleboard'. E.g http://your-site.com/singleboard/EUS

# Working Example

To view a running example head over to
https://leddepartureboard.com/EUS/12

# Technology

- Angular frontend using typescript as the scriping language.
- C# asp.net core backend to retrieve the departure data.
- Runs using dotnet core so is cross compatible accross operating systems.
- Uses google firebase as the document storage and user authentication.

# Docker

This project is also build into a docker image every time we merge to master. This means you can run this website very easiy simply by runnning the command  
**"docker run -p 8080:80 -e "RealTimeTrainsToken=[INSERT_REALTIMETRAINS_TOKEN_HERE]" benfl3713/departure-board"**  
This will run the website on port 8080 of the host

There is also a docker-compose file in this repository that will make it easier to spin up the website with the command  
"docker-compose up"

# Run locally

> To run the project simply clone the repo and open it in vscode. You should then be able to press `F5` to build and run the application

**You will need to register for a real time trains api token in order to receive data. Put the token in DepartureBoardWeb/config.xml**
The **DepartureBoardWeb/config.xml** file will be generated automatically when you first run the program and view the home page.
If you want to use the search functionality then you will also need a national rail knowledge api username and password.

This project uses a c# backend system with an angular front end  
To build the program you will need [node.js](https://nodejs.org/en/download/) installed as well [dotnet core 3.1 sdk](https://dotnet.microsoft.com/download/dotnet/3.1)  
To host the site once published you will need the .net core hosting bundle installed

If you get a startup error saying "missing package ..." or similar then try running **npm install** in the **DepartureBoardWeb\ClientApp** directory
