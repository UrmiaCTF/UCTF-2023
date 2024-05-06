@echo off

set BUSYBOX_PATH=/data/local/tmp/busybox

echo [*] Pushing Busybox
adb push busybox %BUSYBOX_PATH%
adb shell chmod 755 %BUSYBOX_PATH%

echo [*] Dumping data partition
adb exec-out "%BUSYBOX_PATH% tar -czhf - --exclude "data/local/tmp" --exclude "data/misc/adb/adb_keys" data 2>/dev/null" > data.tar.gz

echo [*] Removing Busybox
adb shell rm %BUSYBOX_PATH%
