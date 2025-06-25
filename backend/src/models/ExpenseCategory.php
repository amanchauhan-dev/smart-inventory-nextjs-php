<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class ExpenseCategory
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // ✅ Get all categories for a user
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
        $countSql = "SELECT count(id) as count FROM expense_categories WHERE user_id = ?";

        $sql = "SELECT id, name, monthly_limit FROM expense_categories WHERE user_id = ? LIMIT {$limit} OFFSET {$offset}";

        // run count
        $stmt = $this->db->prepare(query: $countSql);
        $stmt->execute([$userId]);
        $count = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //run data
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ["data" => $data, "count" => $count[0]["count"]];
    }

    // ✅ Get a single category
    public function find($id, $userId)
    {
        $stmt = $this->db->prepare("SELECT id, name, monthly_limit FROM expense_categories WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Create a new category
    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO expense_categories (user_id, name, monthly_limit) VALUES (?, ?, ?)");
        $stmt->execute([$data['user_id'], $data['name'], $data['monthly_limit'] ?? 0]);
        return $this->find($this->db->lastInsertId(), $data['user_id']);
    }

    // ✅ Update a category
    public function update($id, $userId, $data)
    {
        $stmt = $this->db->prepare("UPDATE expense_categories SET name = ?, monthly_limit = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$data['name'], $data['monthly_limit'], $id, $userId]);
        return $this->find($id, $userId);
    }

    // ✅ Delete a category
    public function delete($id, $userId)
    {
        $stmt = $this->db->prepare("DELETE FROM expense_categories WHERE id = ? AND user_id = ?");
        return $stmt->execute([$id, $userId]);
    }
}
