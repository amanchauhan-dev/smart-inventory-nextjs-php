<?php
namespace Src\Models;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
use PDO;

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }


    // crud methods

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

        $countSql = "SELECT 
                       count(u.id) as count
                FROM users u 
                LEFT JOIN organisations o
                ON u.org_id = o.id
                WHERE u.org_id = :org_id AND u.role != 'superadmin'";

        $sql = "SELECT 
                        u.id,
                        u.name,
                        u.role,
                        u.designation,
                        u.profile,
                        u.email,
                        u.created_at,
                        u.org_id,
                        o.name as org_name,
                        o.address as org_address
                FROM users u 
                LEFT JOIN organisations o
                ON u.org_id = o.id
                WHERE u.org_id = :org_id AND u.role != 'superadmin'";

        $params = ['org_id' => $orgId];

        if (!empty($filters['search'])) {
            $countSql .= " AND (u.name LIKE :search OR u.email LIKE :search)";
            $sql .= " AND (u.name LIKE :search OR u.email LIKE :search)";
            $params['search'] = "%{$filters['search']}%";
        }
        if (!empty($filters['role']) && ($filters['role'] == 'staff' || $filters['role'] == 'admin')) {
            $countSql .= " AND u.role = :role";
            $sql .= " AND  u.role = :role";
            $params['role'] = $filters['role'];
        }

        $sql .= " ORDER BY u.created_at DESC";
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

    public function find($id)
    {
        $stmt = $this->db->prepare(
            "SELECT 
                        u.id,
                        u.name,
                        u.role,
                        u.designation,
                        u.profile,
                        u.email,
                        u.created_at,
                        u.org_id,
                        o.name as org_name,
                        o.address as org_address
                    FROM users u 
                    LEFT JOIN organisations o
                    ON u.org_id = o.id
                    WHERE u.id = ?"
        );
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByEmail($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, org_id, designation, role, profile) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['email'],
            $hashedPassword,
            $data['org_id'],
            $data["designation"] ?? null,
            $data["role"] ?? "staff",
            $data["profile"] ?? null,
        ]);

        return $this->find($this->db->lastInsertId());
    }

    public function update($id, $data)
    {

        $stmt = $this->db->prepare("UPDATE users SET name = ?, email = ?, designation = 
        ?, role = ?, profile = ? WHERE id = ?");
        $stmt->execute([
            $data['name'],
            $data['email'],
            $data["designation"] ?? null,
            $data["role"] ?? "staff",
            $data["profile"] ?? null,
            $id
        ]);

        return $this->find($this->db->lastInsertId());
    }


    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function verifyPassword($email, $password)
    {
        $user = $this->findByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']); // don't expose it
            return $user;
        }

        return false;
    }

    // extra methods
    public function updateName($id, $name)
    {
        $stmt = $this->db->prepare('UPDATE users SET name= ? WHERE id = ?');
        $stmt->execute([$name, $id]);
        return $this->find($id);
    }

    public function updateProfile($id, $url)
    {
        $stmt = $this->db->prepare('UPDATE users SET profile= ? WHERE id = ?');
        $stmt->execute([$url, $id]);
        return $this->find($id);
    }

    public function updateEmail($id, $email): mixed
    {
        $stmt = $this->db->prepare('UPDATE users SET email= ? WHERE id = ?');
        $stmt->execute([$email, $id]);
        return $this->find($id);
    }

    public function updatePassword($id, $password): mixed
    {
        $hashedPass = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare('UPDATE users SET password= ? WHERE id = ?');
        $stmt->execute([$hashedPass, $id]);
        return $this->find($id);
    }

}
