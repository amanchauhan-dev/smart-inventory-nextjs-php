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

    public function updatePassword($userId, $data)
    {
        if (empty($data['password'])) {
            return response(400, 'Password is required.');
        }
        $data = $this->userModel->updatePassword($userId, $data['password']);
        return response(200, 'Profile updated.', ['profile' => $data]);
    }
}
