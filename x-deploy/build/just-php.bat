@echo off	

title "Obfuscating PHP JS files..."
ECHO "Obfuscating PHP JS files..."

pushd justphp
	ren *.php *.js
popd

javascript-obfuscator justphp --output justphp-obfuscated ^
	--string-array-encoding base64 ^
	--compact true ^
	--control-flow-flattening true ^
	--control-flow-flattening-threshold 1 ^
	--dead-code-injection true ^
	--dead-code-injection-threshold 1 ^
	--self-defending true ^
	--disable-console-output true ^
	--rename-globals false