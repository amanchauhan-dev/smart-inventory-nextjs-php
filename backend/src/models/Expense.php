<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class Expense
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    // ✅ Get all expenses for a org (optional filters: category, date range)
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


        $countSql = "SELECT count(e.id) as count
                        FROM expenses e
                    JOIN expense_categories ec ON e.category_id = ec.id
                    WHERE e.org_id = :org_id";
        $sql = "SELECT e.id, e.amount, e.org_id, e.date, e.notes, e.created_at,
                       ec.name AS category,
                       ec.id AS category_id
                FROM expenses e
                JOIN expense_categories ec ON e.category_id = ec.id
                WHERE e.org_id = :org_id";

        $params = ['org_id' => $orgId];

        if (!empty($filters['category_id']) && is_numeric($filters['category_id']) && $filters['category_id'] > 0) {
            $countSql .= " AND e.category_id = :category_id";
            $sql .= " AND e.category_id = :category_id";
            $params['category_id'] = $filters['category_id'];
        }

        if (!empty($filters['date_from'])) {
            $countSql .= " AND e.date >= :date_from";
            $sql .= " AND e.date >= :date_from";
            $params['date_from'] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $countSql .= " AND e.date <= :date_to";
            $sql .= " AND e.date <= :date_to";
            $params['date_to'] = $filters['date_to'];
        }

        $sql .= " ORDER BY e.date DESC";
        $sql .= " LIMIT {$limit} OFFSET {$offset}";


        //  run count
        $stmt = $this->db->prepare($countSql);
        $stmt->execute($params);
        $count = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // run data
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return ["data" => $data, "count" => $count[0]["count"]];
    }

    // ✅ Get a single expense
    public function find($id, $orgId)
    {
        $stmt = $this->db->prepare("
            SELECT e.id, e.amount, e.date, e.org_id, e.notes, e.created_at,
                   ec.name AS category,
                    ec.id AS category_id
            FROM expenses e
            JOIN expense_categories ec ON e.category_id = ec.id
            WHERE e.id = ? AND e.org_id = ?
        ");
        $stmt->execute([$id, $orgId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ✅ Create new expense
    public function create($data)
    {
        $stmt = $this->db->prepare("
            INSERT INTO expenses (org_id, category_id, amount, date, notes)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['org_id'],
            $data['category_id'],
            $data['amount'],
            $data['date'],
            $data['notes'] ?? null,
        ]);

        return $this->find($this->db->lastInsertId(), $data['org_id']);
    }

    // ✅ Update existing expense
    public function update($id, $orgId, $data)
    {
        $stmt = $this->db->prepare("
            UPDATE expenses
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

    // ✅ Delete expense
    public function delete($id, $orgId)
    {
        $stmt = $this->db->prepare("DELETE FROM expenses WHERE id = ? AND org_id = ?");
        return $stmt->execute([$id, $orgId]);
    }
}
