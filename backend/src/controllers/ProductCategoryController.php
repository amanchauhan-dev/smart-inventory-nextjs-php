<?php
namespace Src\Controllers;

use Src\Models\ProductCategory;
require_once __DIR__ . '/../models/ProductCategory.php';
require_once __DIR__ . '/../helpers/Response.php';

class ProductCategoryController
{
    private $categoryModel;

    public function __construct()
    {
        $this->categoryModel = new ProductCategory();
    }

    // GET /api/Product-categories
    public function index($userId)
    {
        $data = $this->categoryModel->all($userId);
        return response(200, 'Product categories fetched.', ['categories' => $data["data"], "count" => (int) $data["count"]]);
    }

    // GET /api/Product-categories/:id
    public function show($userId, $id)
    {
        $category = $this->categoryModel->find($id, $userId);
        if (!$category) {
            return response(404, 'Product category not found.');
        }
        return response(200, 'Product category fetched.', ['category' => $category]);
    }

    // POST /api/Product-categories
    public function store($userId, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $data['user_id'] = $userId;
        $category = $this->categoryModel->create($data);
        return response(201, 'Product category created.', ['category' => $category]);
    }

    // PUT /api/Product-categories/:id
    public function update($userId, $id, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $existing = $this->categoryModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Product category not found.');
        }
        $updated = $this->categoryModel->update($id, $userId, $data);
        return response(200, 'Product category updated.', ['category' => $updated]);
    }

    // DELETE /api/Product-categories/:id
    public function destroy($userId, $id)
    {
        $existing = $this->categoryModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Product category not found.');
        }
        $this->categoryModel->delete($id, $userId);
        return response(200, 'Product category deleted.');
    }
}
