<?php
namespace Src\Controllers;

use Src\Models\User;
use Src\Helpers\JWT;

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/JWT.php';
require_once __DIR__ . '/../helpers/Response.php';

class AuthController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function register($data)
    {
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return response(400, 'Name, email & password fields are required.');
        }

        $existing = $this->userModel->findByEmail($data['email']);
        if ($existing) {
            return response(409, 'Email already registered.');
        }

        $user = $this->userModel->create($data);

        return response(201, 'User registered successfully.', ['user' => $user]);
    }

    public function login($data)
    {
        if (empty($data['email']) || empty($data['password'])) {
            return response(400, 'Email and password are required.');
        }

        $user = $this->userModel->verifyPassword($data['email'], $data['password']);
        if (!$user) {
            return response(401, 'Invalid email or password.');
        }

        $token = JWT::encode([
            'id' => $user['id'],
            'email' => $user['email']
        ]);

        return response(200, 'Login successful.', [
            'token' => $token,
            'user' => $user
        ]);
    }

    public function me($headers)
    {
        if (!isset($headers['Authorization'])) {
            return response(401, 'Authorization header missing.');
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $decoded = JWT::decode($token);

        if (!$decoded) {
            return response(401, 'Invalid or expired token.');
        }

        $user = $this->userModel->find($decoded['id']);
        return response(200, 'Authenticated', ['user' => $user]);
    }


}
