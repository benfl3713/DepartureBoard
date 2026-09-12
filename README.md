# DepartureBoard

![](https://github.com/benfl3713/DepartureBoard/workflows/Pipeline/badge.svg?branch=master)
[![Netlify Status](https://api.netlify.com/api/v1/badges/a70bdae7-f88d-43fc-8811-d2e0d16e65c7/deploy-status)](https://app.netlify.com/sites/leddepartureboardcom/deploys)
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/departureboard)

# Welcome

This project is an angular website designed to present the UK and German train departures in a way similar to the led boards you find in stations accross the UK. For more info please see <https://www.leddepartureboard.com>

![](https://github.com/benfl3713/DepartureBoard/blob/master/DepartureBoardWeb/wwwroot/preview.png?raw=true)

# How to Use

1. To change the station just modify the url. E.g http://your-site.com/EUS will show euston station times
2. To change the amount of boards on the screen just add a number to the end. E.g http://your-site.com/EUS/12
3. To view a platform style board just modify the url with a prefix of 'singleboard'. E.g http://your-site.com/singleboard/EUS

# Working Example

To view a running example head over to
<https://www.leddepartureboard.com/EUS/12>

# Technology

- Angular frontend using typescript as the scriping language.
- C# asp.net core backend to retrieve the departure data.
- Runs using dotnet core so is cross compatible accross operating systems.
- Uses google firebase as the document storage and user authentication.

# Run locally

1. Make sure you have the following installed on your machine
   -  [node.js](https://nodejs.org/en/download/)
   -  [dotnet 6.0 sdk](https://dotnet.microsoft.com/download/dotnet/6.0)

2. Clone this repository locally
    ```bash
    git clone https://github.com/benfl3713/DepartureBoard.git
    cd DepartureBoard
    ```
3. Install dependencies
    ```bash
    cd DepartureBoardWeb/ClientApp
    npm install
    ```
4. Create config.xml file inside DepartureBoardWeb, and put the following in, making sure to put your nationalrail tokens (See ConfigService.cs) in
    ```xml
    <Config>
      ... your config here ...
    </Config>
    ```
5. Either use vscode and press `F5` to run the application, or inside the **DepartureBoardWeb** folder run `dotnet run`

