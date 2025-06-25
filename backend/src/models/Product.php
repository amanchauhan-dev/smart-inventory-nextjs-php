<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class Product
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // ✅ Get all products for a user (with optional filters)
    public function all($userId, $filters = [])
    {
        $offset = '0';
        $limit = '50';
        if (!empty($filters['limit']) && is_numeric($filters['limit'])) {
            $limit = $filters['limit'];
        }

        if (!empty($filters['offset']) && is_numeric($filters['offset'])) {
            $offset = $filters['offset'];
        }
        $countSql = "SELECT count(p.id) as count
                FROM products p
                LEFT JOIN product_categories pc ON p.category_id = pc.id
                WHERE p.user_id = :user_id";

        $sql = "SELECT p.id, p.name, p.quantity, p.threshold, p.price,
                       p.supplier, p.notes, p.created_at, p.updated_at,
                       pc.name AS category,
                       pc.id AS category_id
                FROM products p
                LEFT JOIN product_categories pc ON p.category_id = pc.id
                WHERE p.user_id = :user_id";

        $params = ['user_id' => $userId];

        if (!empty($filters['category_id']) && is_numeric($filters['category_id']) && $filters['category_id'] > 0) {
            $countSql .= " AND p.category_id = :category_id";
            $sql .= " AND p.category_id = :category_id";
            $params['category_id'] = $filters['category_id'];
        }

        if (!empty($filters['low_stock']) && $filters['low_stock'] === 'true') {
            $countSql .= " AND p.quantity <= p.threshold";
            $sql .= " AND p.quantity <= p.threshold";
        }

        if (!empty($filters['search'])) {
            $countSql .= " AND (p.name LIKE :search OR p.price LIKE :search)";
            $sql .= " AND (p.name LIKE :search OR p.price LIKE :search)";
            $params['search'] = "%{$filters['search']}%";
        }

        $sql .= " ORDER BY p.updated_at DESC";
        $sql .= " LIMIT {$limit} OFFSET {$offset}";

        // run count
        $stmt = $this->db->prepare($countSql);
        $stmt->execute($params);
        $count = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // run data
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "count" => $count[0]["count"],
            "data" => $data
        ];
    }

    // ✅ Get a single product
    public function find($id, $userId)
    {
        $stmt = $this->db->prepare("
            SELECT p.id, p.name, p.quantity, p.threshold, p.price,
                p.supplier, p.notes, p.created_at, p.updated_at,
                pc.name AS category,
                pc.id AS category_id
            FROM products p
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            WHERE p.id = ? AND p.user_id = ?
        ");
        $stmt->execute([$id, $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Create a new product
    public function create($data)
    {
        $stmt = $this->db->prepare("
            INSERT INTO products (user_id, category_id, name, quantity, threshold, price, supplier, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['user_id'],
            $data['category_id'] ?? null,
            $data['name'],
            $data['quantity'],
            $data['threshold'] ?? 0,
            $data['price'],
            $data['supplier'] ?? null,
            $data['notes'] ?? null
        ]);

        return $this->find($this->db->lastInsertId(), $data['user_id']);
    }

    // ✅ Update a product
    public function update($id, $userId, $data)
    {
        $stmt = $this->db->prepare("
            UPDATE products
            SET category_id = ?, name = ?, quantity = ?, threshold = ?, price = ?, supplier = ?, notes = ?
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([
            $data['category_id'] ?? null,
            $data['name'],
            $data['quantity'],
            $data['threshold'] ?? 0,
            $data['price'],
            $data['supplier'] ?? null,
            $data['notes'] ?? null,
            $id,
            $userId
        ]);

        return $this->find($id, $userId);
    }

    // ✅ Delete a product
    public function delete($id, $userId)
    {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = ? AND user_id = ?");
        return $stmt->execute([$id, $userId]);
    }
}
