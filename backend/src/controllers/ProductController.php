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
    public function index($orgId, $query = [])
    {
        $data = $this->productModel->all($orgId, $query);
        return response(200, 'Product fetched.', ['products' => $data['data'], "count" => (int) $data['count']]);
    }

    // GET /api/Product/:id
    public function show($orgId, $id)
    {
        $product = $this->productModel->find($id, $orgId);
        if (!$product) {
            return response(404, 'Product not found.');
        }
        return response(200, 'Product fetched.', ['product' => $product]);
    }

    // POST /api/Product
    public function store($orgId, $data)
    {
        if (empty($data['name']) || empty($data['price']) || empty($data['category_id']) || empty($data['quantity'])) {
            return response(400, 'Name, price, category_id & quantity is required.');
        }

        $data['org_id'] = $orgId;
        $data = $this->productModel->create($data);
        return response(201, 'Product created.', ['data' => $data]);
    }

    // PUT /api/Product/:id
    public function update($orgId, $id, $data)
    {
        if (empty($data['name']) || empty($data['price']) || empty($data['category_id']) || empty($data['quantity'])) {
            return response(400, 'Name, price, category_id & quantity is required.');
        }

        $existing = $this->productModel->find($id, $orgId);
        if (!$existing) {
            return response(404, 'Product not found.');
        }
        $updated = $this->productModel->update($id, $orgId, data: $data);
        return response(200, 'Product updated.', ['data' => $updated]);
    }

    // DELETE /api/Product/:id
    public function destroy($orgId, $id)
    {
        $existing = $this->productModel->find($id, $orgId);
        if (!$existing) {
            return response(404, 'Product not found.');
        }
        $this->productModel->delete($id, $orgId);
        return response(200, 'Product deleted.');
    }
}
