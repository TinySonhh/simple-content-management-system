<?php
require_once __DIR__ . '/auth.php';

header('Content-Type: application/json');

$host_root = $_POST['host_root'] ?? (__DIR__ . '/../uploads');
$subPath = $_POST['sub_path'] ?? '';
$basePath = rtrim("$host_root/$subPath"," \n\r\t\v\x00/");

if(empty($basePath)) {
	http_response_code(400);
	$response['result'] = "error";
	$response['info'] = "Invalid upload path.";
	echo json_encode($response);
	exit;
}
$response = [];

$files = $_FILES['files'] ?? [];

if (empty($files)) {
	$response['result'] = "error";
	$response['info'] = "No files uploaded.";
	echo json_encode($response);
	exit;
}

for ($i = 0; $i < count($files['name']); $i++) {
	$path = $_POST['paths'][$i] ?? '';
	$relPath = "$basePath/$path" ;	

	$tmpName = $files['tmp_name'][$i];
	$target = rtrim($relPath, " \n\r\t\v\x00/");
	$dir = dirname($target);
	if (!is_dir($dir))
		mkdir($dir, 0777, true);
	$response[] = [
		'host' => $path ?? '',
		'name' => $files['name'][$i],
		'status' => move_uploaded_file($tmpName, $target) ? "Uploaded" : "Failed"
	];
}

echo json_encode($response);