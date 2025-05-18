<?php
require_once __DIR__ . '/jwt.core.php';

function verifyToken($token) {
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $secret_key = env('APP_KEY');
    $algorithm = env('APP_ALGORITHM', 'HS256');

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    try {
        $decoded = JWT::decode($token, $secret_key, [$algorithm]);
        //$user_id = $decoded->user_id;
    } catch (Exception $e) {
        http_response_code(401);
        exit("Invalid token");
    }
}