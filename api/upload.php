<?php
$host_root = $_POST['host_root'] ?? __DIR__;
$hosts = $_POST['hosts'] ?? [];
$response = [];

$all_files = array_merge($_FILES['files']['name'], $_FILES['files2']['name']);
$all_tmp = array_merge($_FILES['files']['tmp_name'], $_FILES['files2']['tmp_name']);

foreach ($all_files as $i => $name) {
    $tmp = $all_tmp[$i];
    $original = $all_files[$i];

    if (!is_uploaded_file($tmp)) {
        continue;
    }

    // Read the content before it's gone
    $content = file_get_contents($tmp);

    foreach ($hosts as $host) {
        $uploadDir = $host_root . "/$host/";
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $target = $uploadDir . basename($original);
        $ok = file_put_contents($target, $content) !== false;

        $response[] = [
            'name' => $original,
            'host' => $host,
            'status' => $ok ? 'Uploaded' : 'Failed'
        ];
    }
}


header('Content-Type: application/json');
echo json_encode($response);
