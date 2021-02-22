#! /bin/bash -
set -e

# Install Dependencies
dotnet restore
cd DepartureBoardWeb/ClientApp
export NG_CLI_ANALYTICS=ci
npm install

cd ../

# Create config.xml file if it does not exist
if [[ ! -e config.xml ]]; then
    echo '<Config>
    <RealTimeTrainsToken>[INSERT_REALTIMETRAINS_TOKEN_HERE]</RealTimeTrainsToken>
</Config>' >> config.xml
    echo Created config.xml file
fi
