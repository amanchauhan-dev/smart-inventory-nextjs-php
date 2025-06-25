<?php
namespace Src\Controllers;

use Src\Models\ExpenseCategory;
require_once __DIR__ . '/../models/ExpenseCategory.php';
require_once __DIR__ . '/../helpers/Response.php';

class ExpenseCategoryController
{
    private $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new ExpenseCategory();
    }

    // GET /api/expense-categories
    public function index($userId, $query = [])
    {
        $data = $this->categoryModel->all($userId, $query);
        return response(200, 'Expense categories fetched.', ['categories' => $data["data"], "count" => (int) $data["count"]]);
    }

    // GET /api/expense-categories/:id
    public function show($userId, $id)
    {
        $category = $this->categoryModel->find($id, $userId);
        if (!$category) {
            return response(404, 'Expense category not found.');
        }
        return response(200, 'Expense category fetched.', ['category' => $category]);
    }

    // POST /api/expense-categories
    public function store($userId, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $data['user_id'] = $userId;
        $category = $this->categoryModel->create($data);
        return response(201, 'Expense category created.', ['category' => $category]);
    }

    // PUT /api/expense-categories/:id
    public function update($userId, $id, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $existing = $this->categoryModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Expense category not found.');
        }
        $updated = $this->categoryModel->update($id, $userId, $data);
        return response(200, 'Expense category updated.', ['category' => $updated]);
    }

    // DELETE /api/expense-categories/:id
    public function destroy($userId, $id)
    {
        $existing = $this->categoryModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Expense category not found.');
        }
        $this->categoryModel->delete($id, $userId);
        return response(200, 'Expense category deleted.');
    }
}
