Commands:
Build
-> cordova build android (Just android application)
-> cordova build browser (Just browser desktop application)
-> cordova build (All added platforms)
Run
-> cordova run android (Android application NOTE: Recommended to run through Android Studio instead)
-> cordova run browser (Browser desktop application)

Android Studio:
Open directory -> /platforms/android (It has the .idea folder for project)
Plug in Android device
Verify ADB Integration is enabled -> Tools->Android->Enable ADB Integration
Allow device interaction with PC (Should have a dialog popup on Android device)
Press Run button (Play icon)
Choose your connected Android device

Requirements:
-> Android SDK
-> Version 23/24
-> Latest JDK with environment/path variables
-> Android SDK environment/path variable
-> Might have to change Android Studio project settings to locate your JDK & SDK

