<?php
session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: /login.php');
    exit;
}

require_once __DIR__ . '/jwt.core.php';
require_once __DIR__ . '/../helpers/env.php';

$headers = apache_request_headers();
// Check if the Authorization header is set
// and if it contains a Bearer token. Do them later.
if (!isset($headers['Authorization'])) {
    //http_response_code(401);
    //exit("Unauthorized");
}

$secret_key = env('APP_KEY');
$algorithm = env('APP_ALGORITHM', 'HS256');

//$token = str_replace('Bearer ', '', $headers['Authorization']?? $_SESSION['jwt']?? '---');
$token = null;
$authHeader = $headers['Authorization'] ?? null;

if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
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
    http_response_code(401);
    exit("Invalid token");
}