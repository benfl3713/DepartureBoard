# Setup Environment
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \ 
	&& apt update \
	&& apt install -y nodejs
WORKDIR /app

# Copy csproj and restore
COPY ./ ./
WORKDIR /app/DepartureBoardWeb
RUN dotnet restore

# Copy everything else and build
RUN dotnet publish -c Release -o /deploy

# Generate runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime
WORKDIR /app
EXPOSE 80
COPY --from=build-env ./app/DepartureBoardWeb/deploy .
ENTRYPOINT ["dotnet", "DepartureBoardWeb.dll"]