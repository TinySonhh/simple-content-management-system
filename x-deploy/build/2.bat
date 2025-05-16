@echo off

title %X_DEPLOY%: (2) Obfuscating PHP JS files...
echo:
echo:
echo --------------------------------------------------
ECHO (2): Obfuscating PHP JS files...
echo --------------------------------------------------
echo:

call ..\setEnv.bat
set FOLDER_1=%JS_PHP_FOLDER_1%
set FOLDER_2=%JS_PHP_FOLDER_2%

set SRC_1=..\changes\%FOLDER_1%
set SRC_2=..\changes\%FOLDER_2%

set SCRIPT_1=embed\%FOLDER_1%
set SCRIPT_2=embed\%FOLDER_2%

if not exist "%SCRIPT_1%" md "%SCRIPT_1%"
if not exist "%SCRIPT_2%" md "%SCRIPT_2%"

if exist "%SRC_1%" (
	copy %SRC_1%\*.* %SCRIPT_1%\*.js
)
if exist "%SRC_2%" (
	copy %SRC_2%\*.* %SCRIPT_2%\*.js
)

javascript-obfuscator embed --output obfuscated ^
	--string-array-encoding base64 ^
	--compact true ^
	--control-flow-flattening true ^
	--control-flow-flattening-threshold 1 ^
	--dead-code-injection true ^
	--dead-code-injection-threshold 1 ^
	--self-defending true ^
	--disable-console-output true ^
	--rename-globals false
	--exclude '*.min.js,*.io.js'