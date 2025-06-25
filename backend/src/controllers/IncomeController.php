<?php
namespace Src\Controllers;

use Src\Models\Income;
require_once __DIR__ . '/../models/Income.php';
require_once __DIR__ . '/../helpers/Response.php';

class IncomeController
{
    private $incomeModel;

    public function __construct()
    {
        $this->incomeModel = new Income();
    }

    // GET /api/incomes
    public function index($userId, $query = [])
    {
        $data = $this->incomeModel->all($userId, $query);
        return response(200, 'Income list fetched.', ['incomes' => $data["data"], "count" => (int) $data["count"]]);
    }
    // GET /api/incomes/id
    public function show($userId, $id)
    {
        $incomes = $this->incomeModel->find($id, $userId);
        return response(200, 'Income fetched.', ['income' => $incomes]);
    }

    // POST /api/incomes
    public function store($userId, $data)
    {
        if (empty($data['amount']) || empty($data['date']) || empty($data['category_id'])) {
            return response(400, 'Amount, category_id and date are required.');
        }

        $data['user_id'] = $userId;
        $income = $this->incomeModel->create($data);

        return response(201, 'Income created.', ['income' => $income]);
    }

    // PUT /api/incomes/:id
    public function update($userId, $id, $data)
    {
        if (empty($data['amount']) || empty($data['date']) || empty($data['category_id'])) {
            return response(400, 'Amount, date, and category are required.');
        }
        $existing = $this->incomeModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Income not found.');
        }
        $updated = $this->incomeModel->update($id, $userId, $data);
        return response(200, 'Income updated.', ['income' => $updated]);
    }

    // DELETE /api/incomes/:id
    public function destroy($userId, $id)
    {
        $existing = $this->incomeModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Income not found.');
        }

        $this->incomeModel->delete($id, $userId);
        return response(200, 'Income deleted.');
    }
}
