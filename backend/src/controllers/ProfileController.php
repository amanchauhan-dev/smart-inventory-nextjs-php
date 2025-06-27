<?php
namespace Src\Controllers;

use Src\Models\User;
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/Response.php';

class ProfileController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    // GET /api/incomes
    public function show($userId)
    {
        $data = $this->userModel->find($userId);
        if (!$data) {
            return response(404, 'Profile not found.');
        }

        return response(200, 'Profile found.', ['profile' => $data["data"]]);
    }

    public function updateUsername($userId, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Name is required.');
        }
        $data = $this->userModel->updateName($userId, $data['name']);
        return response(200, 'Profile updated.', ['profile' => $data]);
    }
    public function updateProfile($userId, $data)
    {
        if (empty($data['profileURL'])) {
            return response(400, 'Profile URL is required.');
        }
        $data = $this->userModel->updateProfile($userId, $data['profileURL']);
        return response(200, 'Profile updated.', ['profile' => $data]);
    }
    public function updateEmail($userId, $data)
    {
        if (empty($data['email'])) {
            return response(400, 'Email is required.');
        }
        $data = $this->userModel->updateEmail($userId, $data['email']);
        return response(200, 'Profile updated.', ['profile' => $data]);
    }

    public function updatePassword($email, $data)
    {
        if (empty($data['currentPassword']) || empty($data['newPassword'])) {
            return response(400, 'Current and new passwords are required.');
        }
        $user = $this->userModel->verifyPassword($email, $data['currentPassword']);
        if (!$user) {
            return response(401, 'Invalid password.');
        }
        $data = $this->userModel->updatePassword($user["id"], $data['newPassword']);
        return response(200, 'Password Changed.', ['profile' => $data]);
    }
}
