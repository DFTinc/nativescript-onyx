# Onyx Versions
- onyx-camera 5.1.8
- onyx-core 4.5.0

# Running Demo App
```
cd src && npm run tsc && cd ../demo-angular && tns run android --device '52006276fa94c4bf'; cd ..
cd src && npm run tsc && cd ../demo && tns run android --device '52006276fa94c4bf'; cd ..
```
NOTE: change your device ID (run **tns devices** to see a list of ID's)

# Requirements
- running on device
- Onyx license key must be included in demo app's source code
- minSDK 22
- targetSDK 28
- compileSdkVersion 28
- buildToolsVersion 28.0.3
- gradle 5.5.1

# Plugin maintenance

## About the Onyx AAR library in Nutshell
We have a separate Android project (onyx_plugin_java) that assembles a Java Library into an AAR file. 
It's an AAR file because it includes the artifacts like the original Onyx Settings Activity.

This AAR library is used by the NativeScript plugin with the help of Gradle Package manager.

The Java Library was a fork of the official Onyx Demo App project:
https://github.com/DFTinc/onyx-5.0-demo

Onyx Settings Page has become an optional feature.

## Building (generating the onyx AAR library in AndroidStudio)
```
RUN onyx_plugin_java[assembleRelease]
```

## Location of the assembled ARR library
```
/native-src/android/app/build/outputs/aar/onyx-nativescript-1.3.1.aar
```
NOTE: You have to manually copy it to /src/platforms/android/ after compile

## Gradle includes all the dependencies that Onyx needs
```
/nativescript-onyx3/src/platforms/android/include.gradle
```

## Updating Onyx Library
To get the plugin working you need to assemble the Java Library *onyx-nativescript-1.3.1.aar* and copy it to
```
/src/platforms/android/
```

# Android permissions used by Onyx
```
<uses-feature android:name="android.hardware.camera" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_INTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_INTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.FLASHLIGHT" />
<uses-permission android:name="android.hardware.camera.autofocus" />
<uses-permission android:name="android.hardware.camera.flashlight" />
```

# Troubleshooting
## NativeScript 6 vs appcompat instead of androidx? 
jumboMode to the rescue

## NativeScript vs too many libraries?
multiDexEnabled to the rescure

```
android {
    dexOptions {
        jumboMode true
    }
    defaultConfig {
        multiDexEnabled true
    }
}
```
