<?php
session_start();

//$headers = apache_request_headers();
$headers = getallheaders();

//$token = str_replace('Bearer ', '', $headers['Authorization']?? $_SESSION['jwt']?? '---');
$token = null;
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

$isRESTful = $authHeader && str_starts_with($authHeader, 'Bearer ');

function redirectToLoginPage($message="Unauthorized. Please login.") {
    global $isRESTful;
    http_response_code(response_code: 401);
    if ($isRESTful) {
        header('WWW-Authenticate: Bearer realm="Access denied"');
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
        ]);
        exit();
    }
    header('Location: /login.php');
    exit;
}
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    redirectToLoginPage();
}

require_once __DIR__ . '/jwt.core.php';
require_once __DIR__ . '/../helpers/env.php';

$secret_key = env('APP_KEY');
$algorithm = env('APP_ALGORITHM', 'HS256');

if ($isRESTful) {
    $token = substr($authHeader, 7); // Strip "Bearer "
} elseif (!empty($_SESSION['jwt'])) {
    $token = $_SESSION['jwt'];
} else {
    $token = '---';
}

try {
    $decoded = JWT::decode($token, $secret_key, [$algorithm]);
    $user_id = $decoded->username;   
} catch (Exception $e) {
    redirectToLoginPage();
}