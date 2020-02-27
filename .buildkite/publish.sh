mkdir ./${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
dotnet publish -c Release -o ./${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
cd ./${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
zip -r ../output.zip *
cd ..
rm -r ./deploy