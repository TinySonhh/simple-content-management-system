@echo off

title %X_DEPLOY%: (0) Rename Obfuscated PHP JS files into JS.PHP files ...
echo:
echo:
echo --------------------------------------------------
ECHO (3): Rename Obfuscated PHP JS files into JS.PHP files ...
echo --------------------------------------------------
echo:

set SCRIPT_JS=obfuscated\js
if exist "%SCRIPT_JS%" (
	pushd %SCRIPT_JS%
		if exist "*.min.js" del *.min.js /F /Q
		if exist "*.io.js" del *.io.js /F /Q
	popd
)

call ..\setEnv.bat
set FOLDER_1=%JS_PHP_FOLDER_1%
set FOLDER_2=%JS_PHP_FOLDER_2%

set SCRIPT_1=obfuscated\%FOLDER_1%
set SCRIPT_2=obfuscated\%FOLDER_2%

if exist "%SCRIPT_1%" (
	pushd %SCRIPT_1%
		ren *.js *.php
	popd
)

if exist "%SCRIPT_2%" (
	pushd %SCRIPT_2%
		ren *.js *.php
	popd
)

REM del /s /q *.svn
if exist "embed" (
	rmdir /s /q embed
)

ECHO DONE...