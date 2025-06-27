<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class Organisation
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }


    // crud methods

    public function all($filters = [])
    {
        $offset = '0';
        $limit = '50';
        if (!empty($filters['limit']) && is_numeric($filters['limit'])) {
            $limit = $filters['limit'];
        }

        if (!empty($filters['offset']) && is_numeric($filters['offset'])) {
            $offset = $filters['offset'];
        }
        $sql = "SELECT * FROM organisations LIMIT {$limit} OFFSET {$offset}";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM organisations WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $stmt = $this->db->prepare("INSERT INTO organisations (name, address) VALUES (?, ?)");
        $stmt->execute([$data['name'], $data['address']]);

        return $this->find($this->db->lastInsertId());
    }

    public function update($id, $data)
    {
        $stmt = $this->db->prepare("UPDATE organisations SET name = ?, address = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['address'], $id]);

        return $this->find($id);
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM organisations WHERE id = ?");
        return $stmt->execute([$id]);
    }

}
