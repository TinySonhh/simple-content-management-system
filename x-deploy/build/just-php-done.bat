@echo off	

title "Obfuscating PHP JS files..."
ECHO "Obfuscating PHP JS files..."

pushd justphp-obfuscated
	ren *.js *.php
popd