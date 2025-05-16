<?php
header('Content-Type: application/json');

// Check method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}
$file = __DIR__ . '/../data/config.json';
if (!file_exists($file)) {
    return [];
}

$paths = [];
$json = file_get_contents($file);
$data = json_decode($json, true);

foreach ($data as $item) {
    if (isset($item['value']) && isset($item['text'])) {
        $paths[$item['value']] = $item['text'];
    }
}

echo json_encode($paths);
