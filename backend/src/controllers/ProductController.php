<?php
namespace Src\Controllers;

use Src\Models\Product;
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../helpers/Response.php';

class ProductController
{
    private $productModel;

    public function __construct()
    {
        $this->productModel = new Product();
    }

    // GET /api/Product
    public function index($userId, $query = [])
    {
        $data = $this->productModel->all($userId, $query);
        return response(200, 'Product fetched.', ['products' => $data['data'], "count" => (int) $data['count']]);
    }

    // GET /api/Product/:id
    public function show($userId, $id)
    {
        $product = $this->productModel->find($id, $userId);
        if (!$product) {
            return response(404, 'Product not found.');
        }
        return response(200, 'Product fetched.', ['product' => $product]);
    }

    // POST /api/Product
    public function store($userId, $data)
    {
        if (empty($data['name']) || empty($data['price']) || empty($data['category_id']) || empty($data['quantity'])) {
            return response(400, 'Name, price, category_id & quantity is required.');
        }

        $data['user_id'] = $userId;
        $category = $this->productModel->create($data);
        return response(201, 'Product created.', ['category' => $category]);
    }

    // PUT /api/Product/:id
    public function update($userId, $id, $data)
    {
        if (empty($data['name']) || empty($data['price']) || empty($data['category_id']) || empty($data['quantity'])) {
            return response(400, 'Name, price, category_id & quantity is required.');
        }

        $existing = $this->productModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Product not found.');
        }
        $updated = $this->productModel->update($id, $userId, $data);
        return response(200, 'Product updated.', ['category' => $updated]);
    }

    // DELETE /api/Product/:id
    public function destroy($userId, $id)
    {
        $existing = $this->productModel->find($id, $userId);
        if (!$existing) {
            return response(404, 'Product not found.');
        }
        $this->productModel->delete($id, $userId);
        return response(200, 'Product deleted.');
    }
}
