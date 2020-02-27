mkdir /${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
dotnet publish -c Release -o /${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
cd /${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy
zip -r ../output.zip *
cd /${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/
rm -r /${BUILDKITE_BUILD_NUMBER}/DepartureBoardWeb/deploy