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
    public function index($orgId, $query = [])
    {
        $data = $this->categoryModel->all($orgId, $query);
        return response(200, 'Expense categories fetched.', ['categories' => $data["data"], "count" => (int) $data["count"]]);
    }

    // GET /api/expense-categories/:id
    public function show($orgId, $id)
    {
        $category = $this->categoryModel->find($id, $orgId);
        if (!$category) {
            return response(404, 'Expense category not found.');
        }
        return response(200, 'Expense category fetched.', ['category' => $category]);
    }

    // POST /api/expense-categories
    public function store($orgId, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name  is required.');
        }

        $data['org_id'] = $orgId;
        $category = $this->categoryModel->create($data);
        return response(201, 'Expense category created.', ['category' => $category]);
    }

    // PUT /api/expense-categories/:id
    public function update($orgId, $id, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $existing = $this->categoryModel->find($id, $orgId);
        if (!$existing) {
            return response(404, 'Expense category not found.');
        }
        $updated = $this->categoryModel->update($id, $orgId, $data);
        return response(200, 'Expense category updated.', ['category' => $updated]);
    }

    // DELETE /api/expense-categories/:id
    public function destroy($orgId, $id)
    {
        $existing = $this->categoryModel->find($id, $orgId);
        if (!$existing) {
            return response(404, 'Expense category not found.');
        }
        $this->categoryModel->delete($id, $orgId);
        return response(200, 'Expense category deleted.');
    }
}
