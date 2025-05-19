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

// Text files preview as plain text
if (str_starts_with($mime, 'text/')) {
    readfile($filepath);
} else {
    // Other files as download or embed src
    header("Content-Disposition: inline; filename=\"" . basename($filepath) . "\"");
    readfile($filepath);
}