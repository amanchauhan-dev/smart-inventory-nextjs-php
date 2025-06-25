<?php
function response($status, $message, $data = [])
{
    http_response_code($status);
    echo json_encode(array_merge([
        'status' => $status,
        'message' => $message
    ], $data ? ['data' => $data] : []));
    exit;
}