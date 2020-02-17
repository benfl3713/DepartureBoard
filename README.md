# DepartureBoard
![](https://github.com/benfl3713/DepartureBoard/workflows/Docker/badge.svg?branch=master)
![](https://github.com/benfl3713/DepartureBoard/workflows/.NET%20Core/badge.svg?branch=master)

This image creates a web server showing live train times in the UK and is designed to look like the led departure boards you see in the station

# How to Use
1. To change the station just modify the url. E.g  *http://your-site.com/EUS* will show euston station times
2. To change the amount of boards on the screen just add a number to the end. E.g http://your-site.com/EUS/12
3. To view a platform style board just modify the url with a prefix of 'singleboard'. E.g *http://your-site.com/singleboard/EUS*

# Working Example 
To view a running example head over to
https://leddepartureboard.com/EUS/12

# Run locally
To run the project simply clone the repo and open the solution file and click run.  
**You will need to register for a real time trains api token in order to receive data. Put the token in DepartureBoardWeb/config.xml**

This project uses a c# backend system with an angular front end  
To build the program you will need node.js installed as well asp.net core sdk  
To host the site once published you will need the .net core hosting bundle installed

# Docker
This project is also build into a docker image every time we merge to master. This means you can run this website very easiy simply by runnning the command "docker run -p 8080:80 benfl3713/departure-board"  
This will run the website on port 8080 of the host  

There is also a docker-compose file in this repository that will make it easier to spin up the website with the command  
"docker-compose up"
