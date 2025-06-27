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
    public function index($orgId)
    {
        $data = $this->categoryModel->all($orgId);
        return response(200, 'Product categories fetched.', ['categories' => $data["data"], "count" => (int) $data["count"]]);
    }

    // GET /api/Product-categories/:id
    public function show($orgId, $id)
    {
        $category = $this->categoryModel->find($id, $orgId);
        if (!$category) {
            return response(404, 'Product category not found.');
        }
        return response(200, 'Product category fetched.', ['category' => $category]);
    }

    // POST /api/Product-categories
    public function store($orgId, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $data['org_id'] = $orgId;
        $category = $this->categoryModel->create($data);
        return response(201, 'Product category created.', ['category' => $category]);
    }

    // PUT /api/Product-categories/:id
    public function update($orgId, $id, $data)
    {
        if (empty($data['name'])) {
            return response(400, 'Category name is required.');
        }

        $existing = $this->categoryModel->find($id, $orgId);
        if (!$existing) {
            return response(404, 'Product category not found.');
        }
        $updated = $this->categoryModel->update($id, $orgId, $data);
        return response(200, 'Product category updated.', ['category' => $updated]);
    }

    // DELETE /api/Product-categories/:id
    public function destroy($orgId, $id)
    {
        $existing = $this->categoryModel->find($id, $orgId);
        if (!$existing) {
            return response(404, 'Product category not found.');
        }
        $this->categoryModel->delete($id, $orgId);
        return response(200, 'Product category deleted.');
    }
}
