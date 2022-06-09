#! /bin/bash

buildstart=`date +%s`
rm patio_signed.aab patio_signed.apk
npm run build
cordova-res android --skip-config --copy --icon-background-source '#A42430'
ionic capacitor sync
ionic capacitor copy android --prod --release
cordova-res android --skip-config --copy --icon-background-source '#A42430'
cd android
./gradlew assembleRelease
./gradlew bundleRelease
cd ..
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore ./keystore/nexuspatio.keystore -signedjar patio_signed.apk -storepass K3y5Tore! ./android/app/build/outputs/apk/release/app-release-unsigned.apk nexuspatio
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore ./keystore/nexuspatio.keystore -signedjar patio_signed.aab -storepass K3y5Tore! ./android/app/build/outputs/bundle/release/app-release.aab nexuspatio

buildend=`date +%s`
buildruntime=$((buildend-buildstart))

buildhours=$((buildruntime / 3600))
buildminutes=$(( (buildruntime % 3600) / 60 ))
buildseconds=$(( (buildruntime % 3600) % 60 ))
echo "Runtime: $buildhours:$buildminutes:$buildseconds (hh:mm:ss)"
