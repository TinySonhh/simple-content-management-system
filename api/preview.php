<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/__config.php';
// Expect JSON input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
$base =  $data['host_root'] ?? "";
$sub_path =  $data['sub_path'] ?? "";
$filename =  $data['file'] ?? "";

$base = rtrim("$base/$sub_path", "/ ");

$filepath = "$base/$filename";

if (!$filepath || !file_exists($filepath)) {
    http_response_code(404);
    echo "File not found";
    exit;
}

$mime = mime_content_type($filepath);
header("Content-Type: $mime");
$sizeInBytes = filesize($filepath);
$sizeInKB = round($sizeInBytes / 1024, 2);      // in KB
$sizeInMB = round($sizeInBytes / 1048576, 2);   // in MB

//only allow preview file size < 5MB
if($sizeInMB<5){
    // Text files preview as plain text
    if (str_starts_with($mime, 'text/')) {
        readfile($filepath);
    } else {
        // Other files as download or embed src
        header("Content-Disposition: inline; filename=\"" . basename($filepath) . "\"");
        readfile($filepath);
    }
} else {
    //413 Payload Too Large
    http_response_code(413 );
    header('Content-Type: application/json');
    echo json_encode([
        "result" => "error",
        "info" => "file size is too large, it cannot be larger than 5MB.",
    ]);
    exit;
}