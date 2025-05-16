@echo off

title %X_DEPLOY%: (5) Optimizing images (PNG files)...
echo:
echo:
echo --------------------------------------------------
echo  (5): Optimizing images (PNG files)...
echo --------------------------------------------------
echo:

call ..\setEnv.bat

set CHANGES_DIR=..\changes

pushd %CHANGES_DIR%

	@echo Compress PNG files...
	echo COMPRESS_PNG_TOOL: %COMPRESS_PNG_TOOL%

	for /r %%f in (*.png) do (
		%COMPRESS_PNG_TOOL% "%%f"
	)
	@echo:

popd

SET PATH=%GLOBAL_PATH%

ECHO DONE...