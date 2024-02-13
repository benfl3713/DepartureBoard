# How to run the code locally

Please ensure you have cloned/downloaded the repo locally.

## Docker

Within the docker-compose.yml file please add in a real times trains token. More information on getting this can be found below.

You can build and run the site within docker using the following commands
```bash
docker-compose build
docker-compose up -d
```

this will run the website on port 9005

### Adding configurations

You will need to add a config.xml file to this folder. This file can contain the following:

```xml
<Config>
    <RealTimeTrainsToken>some-rather-long-string</RealTimeTrainsToken>
	<NationalRail>
		<username>emailaddress</username>
		<password>password</password>
		<accessToken>some-guid-token</accessToken>
	</NationalRail>
	<TflApiToken>some-long-string</TflApiToken>
</Config>

```

For docker you should edit the docker-compose.yml file and uncomment (remove hashes`#`) the following lines:

```yaml
#    volumes:
#      - ./config.xml:/config.xml
```

This will mount the config.xml file into the docker container.

## API Key Setup

### Real Time Trains

1. Go to [Real Time Trains](https://api.rtt.io/) and sign up for an account
2. Within the home page you should have a Username and Password listed. You will need to convert these into a token
3. You can use a website such as <https://www.base64encode.org/> to convert the username and password into a token.<br>
You can do this by encoding the following format: `username:password` using the suggested website or alternative base64 encoding tool.

### National Rail
Confusingly the National Rail API is 2 separate APIs. The first is the Knowledge api, which is used to get the station codes. The second is the Darwin API, which is used to get the departure board information.

#### Knowledge API
> Used for getting the list of all the stations and their codes
> [More Info](https://www.nationalrail.co.uk/developers/knowledgebase-data-feeds/)
1. Go to [National Rail](https://opendata.nationalrail.co.uk/) and sign up for an account
2. Once you have an account you will need to subscribe to the Knowledge API. This can be done by going to Account -> Edit Details and then ensuring Knowledge API is ticked.
3. The username and password you used to create the account can then be added into the config.xml file (As seen above).

#### Darwin API
> Used for getting live departure data when user has selected National Rail
> [More Info](https://www.nationalrail.co.uk/developers/darwin-data-feeds/)

1. You will need to register an application with national rail in order to get an access token. This can be done by going to <https://realtime.nationalrail.co.uk/OpenLDBWSRegistration/>
2. Once your application is accepted then you should be emailed an access token. This can then be added into the config.xml file (As seen above).