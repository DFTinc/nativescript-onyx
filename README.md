### This is not free software.  This plugin uses the Onyx sofware development kits (SDKs) for Android and iOS.  It requires a license agreement with: 
[Diamond Fortress Technologies, Inc.](http://www.diamondfortress.com)

# Onyx NativeScript Plugin
This is a NativeScript plugin for the Onyx Framework created by Diamond Fortress Technologies.
Using this plugin you can scan fingerprints using the camera.

[IOS README](README_IOS.md)

[ANDROID_README](README_ANDROID.md)

# Running the demo app
Angular and TypeScript demo app is included.

iOS Demo App
```
cd src && npm run tsc --debug  && cd ../demo-angular && tns run ios --device 1 --syncAllFiles; cd ..
cd src && npm run tsc --debug  && cd ../demo && tns run ios --emulator --syncAllFiles; cd ..
```

Android Demo App
```
cd src && npm run tsc && cd ../demo-angular && tns run android --device '52006276fa94c4bf'; cd ..
cd src && npm run tsc && cd ../demo && tns run android --device '52006276fa94c4bf'; cd ..
```
NOTE: change your device ID (run **tns devices** to see a list of ID's)

# Requirements
- running on device with internet connection to validate license (once at least?)
- NativeScript 6.0.1, OSX + xCode, Android SDK
- Onyx license key must be included in demo app's source code. Add key here:
[home.component.ts](/demo-angular/src/app/home/home.component.ts)
[home-page.ts](/demo/app/home/home-page.ts)

# Troubleshooting
- Remove **node_modules** & **platforms** folder in demo app -> try to run -> you might have to remove plugin from [package.json] then add it manually:
```
cd demo-angular && tns plugin add '../src'
```

# Installing plugin into your app (local plugin way).
Put **nativescript-onyx** AND **Your NS app** project folders in one common folder. 
Let's say in "~/Projects/" folder.

Then run command:
```
tns plugin add ~/Projects/nativescript-onyx/src/
```

# Removing plugin from app (for reinstalling)
```
tns plugin remove nativescript-onyx
tns plugin add ../src
```

# IntelliSense (code auto-completion)
Reference the wrappers in references.d.ts
```
/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />
/// <reference path="./typings/objc!OnyxKit.d.ts" />
/// <reference path="./typings/onyx.android.d.ts" />
```
