<?php
session_start();

$headers = getallheaders();

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

require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/../helpers/env.php';

if ($isRESTful) {
    $token = substr($authHeader, 7); // Strip "Bearer "
} elseif (!empty($_SESSION['jwt'])) {
    $token = $_SESSION['jwt'];
} else {
    $token = '---';
}

$jwt = MyJWT::create();
$decoded = $jwt->decodeToken($token, function ($e) {
    redirectToLoginPage($e->getMessage());
});