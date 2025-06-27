<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class ProductCategory
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // ✅ Get all product categories for a org
    public function all($orgId, $filters = [])
    {
        $offset = '0';
        $limit = '50';
        if (!empty($filters['limit']) && is_numeric($filters['limit'])) {
            $limit = $filters['limit'];
        }

        if (!empty($filters['offset']) && is_numeric($filters['offset'])) {
            $offset = $filters['offset'];
        }
        $countSql = "SELECT count(id) as count FROM product_categories WHERE org_id = ?";
        $sql = "SELECT id, name FROM product_categories WHERE org_id = ? LIMIT {$limit} OFFSET {$offset}";
        // run count
        $stmt = $this->db->prepare($countSql);
        $stmt->execute([$orgId]);
        $count = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // run data
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$orgId]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return [
            "count" => $count[0]["count"],
            "data" => $data
        ];
    }

    // ✅ Get a single product category
    public function find($id, $orgId)
    {
        $stmt = $this->db->prepare("SELECT id, name FROM product_categories WHERE id = ? AND org_id = ?");
        $stmt->execute([$id, $orgId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Create a new category
    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO product_categories (org_id, name) VALUES (?, ?)");
        $stmt->execute([$data['org_id'], $data['name']]);
        return $this->find($this->db->lastInsertId(), $data['org_id']);
    }

    // ✅ Update category name
    public function update($id, $orgId, $data)
    {
        $stmt = $this->db->prepare("UPDATE product_categories SET name = ? WHERE id = ? AND org_id = ?");
        $stmt->execute([$data['name'], $id, $orgId]);
        return $this->find($id, $orgId);
    }

    // ✅ Delete category
    public function delete($id, $orgId)
    {
        $stmt = $this->db->prepare("DELETE FROM product_categories WHERE id = ? AND org_id = ?");
        return $stmt->execute([$id, $orgId]);
    }
}
