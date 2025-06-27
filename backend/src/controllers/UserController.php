<?php
namespace Src\Controllers;

use Src\Models\User;
require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../helpers/Response.php';

class UserController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    // GET /api/user
    public function index($orgId, $query = [])
    {
        $data = $this->userModel->all($orgId, $query);
        return response(200, 'user fetched.', ['users' => $data['data'], "count" => (int) $data['count']]);
    }

    // GET /api/user/:id
    public function show($id)
    {
        $user = $this->userModel->find($id);
        if (!$user) {
            return response(404, 'user not found.');
        }
        return response(200, 'user fetched.', ['user' => $user]);
    }

    // POST /api/user
    public function store($ordId, $data)
    {
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return response(400, 'Name, email & password  is required.');
        }

        if (!empty(($data["role"])) && !($data['role'] === "staff" || $data['role'] === "admin" || $data['role'] === "superadmin")) {
            return response(400, 'Invalid role');
        }
        $existing = $this->userModel->findByEmail($data['email']);
        if ($existing) {
            return response(409, 'Email already registered.');
        }

        $data["org_id"] = $ordId;
        $data = $this->userModel->create($data);
        return response(201, 'User created.', ['user' => $data]);
    }

    public function update($id, $data)
    {
        if (empty($data['name']) || empty($data['email'])) {
            return response(400, 'Name, email & password  is required.');
        }

        if (!empty(($data["role"])) && !($data['role'] === "staff" || $data['role'] === "admin" || $data['role'] === "superadmin")) {
            return response(400, 'Invalid role');
        }

        $existing = $this->userModel->findByEmail($data['email']);
        if ($existing && $existing['id'] != $id) {
            return response(409, 'Email already registered.');
        }

        $this->userModel->update($id, $data);
        $data = $this->userModel->find($id);
        return response(201, 'User updated.', ["user" => $data]);
    }


    // DELETE /api/user/:id
    public function destroy($id)
    {
        $existing = $this->userModel->find($id);
        if (!$existing) {
            return response(404, 'user not found.');
        }
        $this->userModel->delete($id, );
        return response(200, 'User deleted.');
    }
}
