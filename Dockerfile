# Setup Environment
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \ 
	&& apt update \
	&& apt install -y nodejs
WORKDIR /app

# Copy csproj and restore
ARG RTT_Token=[INSERT_REALTIMETRAINS_TOKEN_HERE]

COPY ./ ./
WORKDIR /app/DepartureBoardWeb/
RUN dotnet restore

#Setup Ng
WORKDIR /app/DepartureBoardWeb/ClientApp
RUN npm link @angular/cli
RUN npm install

# Copy everything else and build
WORKDIR /app/DepartureBoardWeb/
RUN dotnet publish -c Release -o /app/DepartureBoardWeb/deploy
#Creates config file
RUN rm /app/DepartureBoardWeb/deploy/config.xml
RUN echo "<Config><RealTimeTrainsToken>$RTT_Token</RealTimeTrainsToken></Config>" > /app/DepartureBoardWeb/deploy/config.xml

# Generate runtime image
FROM microsoft/dotnet:3.1-aspnetcore-runtime
COPY --from=build-env /app/DepartureBoardWeb/deploy .
EXPOSE 80
ENTRYPOINT ["dotnet", "DepartureBoardWeb.dll"]