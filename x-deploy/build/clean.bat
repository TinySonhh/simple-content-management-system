@echo off
call ..\setEnv.bat

if exist "obfuscated" (
	rmdir /s /q obfuscated
)

pushd ..
if exist "changes" (
	rmdir /s /q changes
)
popd