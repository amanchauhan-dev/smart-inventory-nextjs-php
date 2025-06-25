<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class Income
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // ✅ Get all incomes for a user (optional filters: category, date range)
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
        $countSql = "SELECT count(id) as count
                FROM incomes
                WHERE user_id = :user_id";

        $sql = "SELECT i.id, i.amount, i.date, c.name as category, i.category_id, i.notes, i.created_at
                FROM incomes i
                LEFT JOIN incomes_categories c ON i.category_id = c.id
                WHERE i.user_id = :user_id";

        $params = ['user_id' => $userId];

        if (!empty($filters['category_id']) && is_numeric($filters['category_id']) && $filters['category_id'] > 0) {
            $countSql .= " AND category_id = :category_id";
            $sql .= " AND category_id = :category_id";
            $params['category_id'] = $filters['category_id'];
        }

        if (!empty($filters['date_from'])) {
            $countSql .= " AND date >= :date_from";
            $sql .= " AND date >= :date_from";
            $params['date_from'] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $countSql .= " AND date <= :date_to";
            $sql .= " AND date <= :date_to";
            $params['date_to'] = $filters['date_to'];
        }

        $sql .= " ORDER BY date DESC";
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

    // ✅ Get a single income record
    public function find($id, $userId)
    {
        $stmt = $this->db->prepare("SELECT i.id, i.amount, i.date, c.name as category, i.category_id, i.notes, i.   created_at
                FROM incomes i
                LEFT JOIN incomes_categories c ON i.category_id = c.id
                WHERE i.id=? AND i.user_id = ?");
        $stmt->execute([$id, $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Create income
    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO incomes (user_id, amount, date, category_id, notes) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['user_id'],
            $data['amount'],
            $data['date'],
            $data['category_id'],
            $data['notes'] ?? null
        ]);

        return $this->find($this->db->lastInsertId(), $data['user_id']);
    }

    // ✅ Update income
    public function update($id, $userId, $data, )
    {
        $stmt = $this->db->prepare("
            UPDATE incomes
            SET category_id = ?, amount = ?, date = ?, notes = ?
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([
            $data['category_id'],
            $data['amount'],
            $data['date'],
            $data['notes'] ?? null,
            $id,
            $userId,
        ]);

        return $this->find($id, $userId);
    }

    // ✅ Delete income
    public function delete($id, $userId)
    {
        $stmt = $this->db->prepare("DELETE FROM incomes WHERE id = ? AND user_id = ?");
        return $stmt->execute([$id, $userId]);
    }
}
