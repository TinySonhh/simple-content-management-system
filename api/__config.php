<?php
require_once __DIR__ . '/../helpers/env.php';
define("APP_ALIAS",env('APP_ALIAS', 'cms'));
define("APP_NAME",env('APP_NAME', 'App Name'));
define("HOST_NAME",env('APP_DOMAIN', "example.com"));
define("HOST_NAME_URL","https://" . HOST_NAME);
define("APP_HOST",APP_ALIAS . "." . HOST_NAME);
define("APP_PROTOCOL","https://");
define("APP_URL", APP_PROTOCOL . APP_HOST);
define("LOCALHOST","http://localhost");
define("COMPANY_NAME",env('COMPANY_NAME', 'Your Company Name'));
define("SERVER_ROOT", $_SERVER['DOCUMENT_ROOT']);

$server_name = $_SERVER['SERVER_NAME'];
$url_origin = APP_URL;
if($server_name != APP_HOST){
    $url_origin = LOCALHOST;	
}

$current_url = ($_SERVER['REQUEST_SCHEME']??"http") . "://" . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$is_local = $url_origin == LOCALHOST;

function isLocal(): bool{
	global $is_local;
	return $is_local;
}

define("UPLOAD_DIR_NAME", "");

define("LOCAL_HOST_DIR", env('HOSTING_DIR_ROOT_LOCALHOST', SERVER_ROOT));
define("REMOTE_HOST_DIR", env('HOSTING_DIR_ROOT', '/undefined/please_set_this'));
define("MY_DIR_ROOT", $is_local? LOCAL_HOST_DIR.UPLOAD_DIR_NAME : REMOTE_HOST_DIR);
define("MAX_UPLOAD_SIZE", 50_000_000);

$MY_DIR_ROOT = MY_DIR_ROOT;