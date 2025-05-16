@echo off

title %X_DEPLOY%: (4) Update changes files...
echo:
echo:
echo --------------------------------------------------
ECHO (4): Update changes files...
echo --------------------------------------------------
echo:

call ..\setEnv.bat

xcopy /y /h /i /e obfuscated ..\changes
ECHO DONE Update changes files...