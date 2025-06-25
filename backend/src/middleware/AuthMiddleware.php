<?php

use Src\Helpers\JWT;
require_once __DIR__ . '/../helpers/JWT.php';

function requireAuth()
{
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing']);
        exit;
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    $decoded = JWT::decode($token);

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }

    // Store user info globally if needed
    $GLOBALS['auth_user'] = $decoded;
}
