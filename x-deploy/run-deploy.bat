@echo off
@echo run-deploy.bat fresh: add param to build a fresh version:
@echo run-deploy.bat : build a patch over changes.
echo.

pushd build
	call 0.bat %1
	call 1.bat
	call 2.bat
	call 3.bat
	call 4.bat
	call 5.bat
	call _done.bat
popd