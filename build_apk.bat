@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "NODE_BINARY=C:\Program Files\nodejs\node.exe"
set "PATH=C:\Program Files\nodejs;C:\Program Files\Android\Android Studio\jbr\bin;%PATH%"
cd /d "C:\LomasApp\PostventaApp\android"
echo "Starting Gradle with --stacktrace --info..."
call gradlew.bat assembleRelease --stacktrace --info
