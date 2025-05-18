<?php
require_once __DIR__ . '/auth.php';

$host = $_GET['host'] ?? '';
$file = $_GET['file'] ?? '';

$result = ["status" => "error", "message" => "File not found or not a file."];

// Expect JSON input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$base =  $data['host_root'] ?? (__DIR__ . '/uploads');
$sub_path =  $data['sub_path'] ?? "";

if(empty($sub_path)){
	$path = rtrim("$base/$host/$file","/");
} else {    
	$path = rtrim("$base/$sub_path/$file", "/");
}

$fileExists = file_exists($path);
$isFile = is_file($path);
$result['message'] = $fileExists? "" : "File does not exist.";
$result['message'] = $isFile? "" : "Cannot delete a directory.";

if ($fileExists&& $isFile) {
	$deleted = unlink($path);
	$result['status'] = $deleted? "success" : "error";
	$result['message'] = $deleted? "File deleted successfully." : "Failed to delete the file.";
}

header('Content-Type: application/json');
echo json_encode($result);