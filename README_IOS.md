# Onyx Versions
OnyxCamera v5.4.6 (via Cocoapods)

# Running Demo Apps on iOS
```
cd src && npm run tsc --debug  && cd ../demo-angular && tns run ios --device 1 --syncAllFiles; cd ..
cd src && npm run tsc --debug  && cd ../demo && tns run ios --emulator --syncAllFiles; cd ..
```

# iOS Requirements
- Onyx license key must be included in demo app's source code
- running on device (iOS 9 or greater)
- xCode <= 10.3
- Cocoapods package manager
- lObjC flag and gnu++11 as standard c++ compiler

# Installing plugin into your app (local plugin way)
Put **nativescript-onyx3** AND **Your NS app** project folders in one common folder. 
Let's say in "~/Projects/" folder.

Then run command:
```
tns plugin add ~/Projects/nativescript-onyx3/src/
```

# Camera permissions in info.plist:
```
<dict>
    <key>NSCameraUsageDescription</key>
    <string>Some reason</string>
</dict>
```

# Compiler flags in build.xcconfig
```
ENABLE_BITCODE = NO
OTHER_LDFLAGS = $(inherited) -ObjC -framework "AVFoundation" -framework "CoreMedia" -framework "AssetsLibrary"
CLANG_CXX_LANGUAGE_STANDARD = gnu++11
CLANG_CXX_LIBRARY = libc++
IPHONEOS_DEPLOYMENT_TARGET = 9.0
```

# Troubleshooting
Make sure that Onyx Frameworks incudes a **modulemap file**
