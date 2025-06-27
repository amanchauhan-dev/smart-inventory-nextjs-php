<?php
namespace Src\Controllers;

use Src\Models\Organisation;
use Src\Models\User;
use Src\Helpers\JWT;

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Organisation.php';
require_once __DIR__ . '/../helpers/JWT.php';
require_once __DIR__ . '/../helpers/Response.php';

class AuthController
{
    private $userModel;
    private $model;

    public function __construct()
    {
        $this->userModel = new User();
        $this->model = new Organisation();
    }

    public function register($data)
    {
        if (empty($data['name']) || empty($data['email']) || empty($data['address']) || empty($data['username']) || empty($data['password'])) {
            return response(400, 'Name, email, address, username & password is required.');
        }
        $existing = $this->userModel->findByEmail($data['email']);

        if ($existing) {
            return response(409, 'Email already registered.');
        }

        $orgData = $this->model->create($data);


        $userData = [
            "name" => $data["username"],
            "email" => $data["email"],
            "password" => $data["password"],
            "role" => "superadmin",
            "designation" => "Owner",
            "org_id" => $orgData["id"],
        ];

        $userDetail = $this->userModel->create($userData);
        return response(201, 'organisation created.', ['organisation' => $orgData, "user" => $userDetail]);

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
            'email' => $user['email'],
            'role' => $user['role'],
            'org_id' => $user['org_id'],
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

    public function checkUnigeEmail($data)
    {
        if (empty($data["email"])) {
            return response(400, "Email required", []);
        }
        $user = $this->userModel->findByEmail($data["email"]);
        if (!$user) {
            return response(200, "Email doesn't used yet", ["success" => true]);
        }
        return response(200, "Email is in use", ["success" => false]);
    }

}
