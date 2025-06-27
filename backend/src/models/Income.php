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

    // ✅ Get all incomes for a org (optional filters: category, date range)
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
        $countSql = "SELECT count(id) as count
                FROM incomes
                WHERE org_id = :org_id";

        $sql = "SELECT i.id, i.amount, i.org_id, i.date, c.name as category, i.category_id, i.notes, i.created_at
                FROM incomes i
                LEFT JOIN incomes_categories c ON i.category_id = c.id
                WHERE i.org_id = :org_id";

        $params = ['org_id' => $orgId];

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
    public function find($id, $orgId)
    {
        $stmt = $this->db->prepare("SELECT i.id,i.org_id, i.amount, i.date, c.name as category, i.category_id, i.notes, i.   created_at
                FROM incomes i
                LEFT JOIN incomes_categories c ON i.category_id = c.id
                WHERE i.id=? AND i.org_id = ?");
        $stmt->execute([$id, $orgId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Create income
    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO incomes (org_id, amount, date, category_id, notes) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['org_id'],
            $data['amount'],
            $data['date'],
            $data['category_id'],
            $data['notes'] ?? null
        ]);

        return $this->find($this->db->lastInsertId(), $data['org_id']);
    }

    // ✅ Update income
    public function update($id, $orgId, $data, )
    {
        $stmt = $this->db->prepare("
            UPDATE incomes
            SET category_id = ?, amount = ?, date = ?, notes = ?
            WHERE id = ? AND org_id = ?
        ");
        $stmt->execute([
            $data['category_id'],
            $data['amount'],
            $data['date'],
            $data['notes'] ?? null,
            $id,
            $orgId,
        ]);

        return $this->find($id, $orgId);
    }

    // ✅ Delete income
    public function delete($id, $orgId)
    {
        $stmt = $this->db->prepare("DELETE FROM incomes WHERE id = ? AND org_id = ?");
        return $stmt->execute([$id, $orgId]);
    }
}
