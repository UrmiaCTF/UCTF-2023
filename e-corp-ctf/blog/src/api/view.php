<?php

function json_error(string $msg, int $status_code = 400)
{
    http_response_code($status_code);
    echo json_encode(array('status' => 'error', 'msg' => $msg));
}

error_reporting(0);

header('Content-type: application/json', true);

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null || !array_key_exists('post', $input)) {
    json_error('Invalid request', 400);
    exit();
}

$post = file_get_contents($input['post']);
if ($post === false) {
    json_error('Post does not exist', 404);
    exit();
}
echo json_encode(array('status' => 'success', 'post' => $post));
