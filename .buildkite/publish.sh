mkdir ./${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
npm link @angular/cli
npm install
dotnet publish -c Release -o ./${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy --runtime win-x64 --self-contained true
cd ./${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
zip -r ../output.zip *
cd ..
rm -r ./deploy