<?php
header('Content-Type: application/json');

// Check method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

require_once __DIR__ . '/auth.php';

// Expect JSON input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    echo json_encode(['error' => 'Invalid JSON format.']);
    exit;
}

// Save to file
$file = __DIR__ . '/../data/paths.json';
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode([
    'status' => 'success',
    'message' => 'Hosts saved.',
    'hosts' => $data
]);
