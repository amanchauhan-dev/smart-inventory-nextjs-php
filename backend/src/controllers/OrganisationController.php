<?php


namespace Src\Og;

use Src\Models\Organisation;
use Src\Models\User;
require_once __DIR__ . '/../models/Organisation.php';
require_once __DIR__ . '/../helpers/Response.php';

class OrganisationController
{
    private $model;
    private $userModel;

    public function __construct()
    {
        $this->model = new Organisation();
        $this->userModel = new User();
    }

    // GET /api/organisation
    public function index($query = [])
    {
        $data = $this->model->all($query);
        return response(200, 'organisation fetched.', ['organisations' => $data['data'], "count" => (int) $data['count']]);
    }

    // GET /api/organisation/:id
    public function show($id)
    {
        $organisation = $this->model->find($id, );
        if (!$organisation) {
            return response(404, 'organisation not found.');
        }
        return response(200, 'organisation fetched.', ['organisation' => $organisation]);
    }

    // POST /api/organisation
    public function store($data)
    {
        if (empty($data['name']) || empty($data['email']) || empty($data['address']) || empty($data['username']) || empty($data['password'])) {
            return response(400, 'Name, email, address, username & password is required.');
        }
        $existing = $this->model->findByEmail($data['email']);

        if ($existing) {
            return response(409, 'Email already registered.');
        }

        $data = $this->model->create($data);

        $userData = [
            "name" => $data["username"],
            "email" => $data["email"],
            "password" => $data["password"],
            "role" => "superadmin",
            "designation" => "Owner",
            "org_id" => $data["id"],
        ];

        $userDetail = $this->userModel->create($userData);
        return response(201, 'organisation created.', ['organisation' => $data, "user" => $userDetail]);
    }
}
