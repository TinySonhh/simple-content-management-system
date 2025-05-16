@echo off

title "Obfuscating Standard JS files..."
ECHO "Obfuscating Standard JS files..."

javascript-obfuscator just --output just-obfuscated ^
	--string-array-encoding base64 ^
	--compact true ^
	--control-flow-flattening true ^
	--control-flow-flattening-threshold 1 ^
	--dead-code-injection true ^
	--dead-code-injection-threshold 1 ^
	--self-defending true ^
	--disable-console-output true ^
	--rename-globals false