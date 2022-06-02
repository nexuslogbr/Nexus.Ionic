#! /bin/bash

buildstart=`date +%s`
rm patio_dev_signed.apk
npm run build
ionic capacitor sync
ionic capacitor copy android
cd android
./gradlew assembleDebug
cd ..
#jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore ./keystore/nexuspatio.keystore -signedjar patio_signed.apk -storepass K3y5Tore! ./android/app/build/outputs/apk/release/app-release-unsigned.apk nexuspatio
cp ./android/app/build/outputs/apk/debug/app-debug.apk ./patio_dev_signed.apk

buildend=`date +%s`
buildruntime=$((buildend-buildstart))

buildhours=$((buildruntime / 3600))
buildminutes=$(( (buildruntime % 3600) / 60 ))
buildseconds=$(( (buildruntime % 3600) % 60 ))
echo "Runtime: $buildhours:$buildminutes:$buildseconds (hh:mm:ss)"
