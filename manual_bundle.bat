@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "C:\LomasApp\PostventaApp"
if not exist "android\app\src\main\assets" mkdir "android\app\src\main\assets"
node node_modules\react-native\cli.js bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
