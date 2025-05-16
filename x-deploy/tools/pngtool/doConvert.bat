@echo off

set path=%~d0%~p0

:start

REM "%path%pngquant.exe" 32 --force --verbose --speed=4 --floyd=0.8 %1
"%path%pngquant.exe" 32 -f --ext .png --verbose --speed=4 --floyd=0.8 %1