#! /bin/bash -
set -e

# Install Dependencies
cd DepartureBoardWeb/ClientApp
export NG_CLI_ANALYTICS=ci
npm install

cd ../

# Create config.xml file if it does not exist
if [[ ! -e config.xml ]]; then
    echo '[INSERT_REALTIMETRAINS_TOKEN_HERE]' >> config.xml
fi

dotnet restore


