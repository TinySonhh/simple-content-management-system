@echo off
call ..\setEnv.bat

title %X_DEPLOY%: (0) Filtering files with changes...


echo:
echo **************************************************
echo **************************************************
echo 	X-DEPLOY APP
echo **************************************************
echo **************************************************
echo:

echo:
echo --------------------------------------------------
echo (0): Filtering files with changes...
echo --------------------------------------------------
echo:

if exist "obfuscated" (
	rmdir /s /q obfuscated
)

pushd ..
if exist "changes" (
	rmdir /s /q changes
)

set BUILD_OPTION=%1
echo python "%LIST_CHANGES_TOOL%" %APP_DIR% %BUILD_OPTION%
python "%LIST_CHANGES_TOOL%" %APP_DIR% %BUILD_OPTION%
popd