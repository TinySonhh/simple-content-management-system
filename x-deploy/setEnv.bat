@echo off
REM setlocal
set X_DEPLOY=X-DEPLOY
set APP_NAME=upload
set APP_DIR=path\ro\your\%APP_NAME%
set APP_IMAGES_DIR=%APP_DIR%\images
set JS_PHP_FOLDER_1=none
set JS_PHP_FOLDER_2=none

set DEPLOY_DIR=%~dp0
set TOOLS_DIR=%DEPLOY_DIR%\tools
set LIST_CHANGES_TOOL=%TOOLS_DIR%\listChanges\listChanges.py
set COMPRESS_PNG_TOOL=%TOOLS_DIR%\pngtool\doConvert.bat

set X_APP_CONFIG_DIR=%DEPLOY_DIR%\scripts
set GLOBAL_PATH=%PATH%
REM endlocal

if NOT EXIST "%APP_DIR%" (
	@echo:
	@echo ERROR: !!! Please configure the APP_DIR in setEnv.bat first....
	pause
	exit
)