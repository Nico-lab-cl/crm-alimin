@echo off
echo ========================================================
echo FIXING WINDOWS LONG PATHS & CLEANING GRADLE
echo ========================================================

echo [1/4] Enabling Long Paths in Windows Registry...
reg add "HKLM\System\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f
if %errorlevel% neq 0 (
    echo [ERROR] Please run this script as ADMINISTRATOR!
    pause
    exit /b 1
)

echo [2/4] Enabling Long Paths in Git...
git config --global core.longpaths true

echo [3/4] Removing Virtual Drives...
subst Z: /D >nul 2>&1

echo [4/4] Deep Cleaning Build Artifacts...
cd /d "C:\Users\pc\OneDrive\Desktop\lomas-del-mar\Lomas-del-mar-update4\PostventaApp\android"
if exist .gradle rm -rf .gradle
if exist app/build rm -rf app/build
if exist build rm -rf build

echo ========================================================
echo DONE! 
echo 1. RESTART your computer (mandatory for the registry fix).
echo 2. Open Android Studio and open the project from:
echo    C:\Users\pc\OneDrive\Desktop\lomas-del-mar\Lomas-del-mar-update4\PostventaApp
echo 3. Run Build > Build APKs
echo ========================================================
pause
