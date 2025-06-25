<?php
namespace Src\Controllers;

use Src\Models\Expense;
require_once __DIR__ . '/../models/Expense.php';
require_once __DIR__ . '/../helpers/Response.php';

class ExpenseController
{
    private $expenseModel;

    public function __construct()
    {
        $this->expenseModel = new Expense();
    }

    // GET /api/expenses
    public function index($userId, $query = [])
    {
        $data = $this->expenseModel->all($userId, $query);
        return response(200, 'Expense list fetched.', ['expenses' => $data["data"], "count" => $data["count"]]);
    }

    // GET /api/expenses/:id
    public function show($userId, $id)
    {
        $expense = $this->expenseModel->find($id, $userId);
        if (!$expense) {
            return response(404, 'Expense not found.');
        }
        return response(200, 'Expense fetched.', ['expense' => $expense]);
    }

    // POST /api/expenses
    public function store($userId, $data)
    {
        if (empty($data['amount']) || empty($data['date']) || empty($data['category_id'])) {
            return response(400, 'Amount, date, and category are required.');
        }

        $data['user_id'] = $userId;
        $expense = $this->expenseModel->create($data);
        return response(201, 'Expense created.', ['expense' => $expense]);
    }

    // PUT /api/expenses/:id
    public function update($userId, $id, $data)
    {
        if (empty($data['amount']) || empty($data['date']) || empty($data['category_id'])) {
            return response(400, 'Amount, date, and category are required.');
        }

        $existing = $this->expenseModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Expense not found.');
        }

        $updated = $this->expenseModel->update($id, $userId, $data);
        return response(200, 'Expense updated.', ['expense' => $updated]);
    }

    // DELETE /api/expenses/:id
    public function destroy($userId, $id)
    {
        $existing = $this->expenseModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Expense not found.');
        }

        $this->expenseModel->delete($id, $userId);
        return response(200, 'Expense deleted.');
    }
}
