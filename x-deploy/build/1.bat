@echo off

title %X_DEPLOY%: (1) Obfuscating Standard JS files...

echo:
echo:
echo --------------------------------------------------
ECHO (1): Obfuscating Standard JS files...
echo --------------------------------------------------
echo:

call ..\setEnv.bat

if exist "obfuscated" (
	rmdir /s /q obfuscated
)
pushd ..
if exist "changes/deploy" (
	rmdir /s /q changes/deploy
)
popd
javascript-obfuscator ..\changes --output obfuscated ^
	--string-array-encoding base64 ^
	--compact true ^
	--control-flow-flattening true ^
	--control-flow-flattening-threshold 1 ^
	--dead-code-injection true ^
	--dead-code-injection-threshold 1 ^
	--self-defending true ^
	--disable-console-output true ^
	--rename-globals false