#! /bin/bash -
set -e

# Install Dependencies
cd ../DepartureBoardWeb/ClientApp
npm install

cd ../

# Create config.xml file if it does not exist
if [[ ! -e config.xml ]]; then
    echo '[INSERT_REALTIMETRAINS_TOKEN_HERE]' >> config.xml
fi


