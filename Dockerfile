# Setup Environment
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \ 
	&& apt update \
	&& apt install -y nodejs
WORKDIR /app

# Copy csproj and restore
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

# Generate runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime
COPY --from=build-env /app/DepartureBoardWeb/deploy .
EXPOSE 80
ENTRYPOINT ["dotnet", "DepartureBoardWeb.dll"]