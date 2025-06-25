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
        $sql = "SELECT id, name,profile, email, created_at FROM users LIMIT {$limit} OFFSET {$offset}";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function find($id)
    {
        $stmt = $this->db->prepare("SELECT id, name, email,profile, created_at FROM users WHERE id = ?");
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

        $stmt = $this->db->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $hashedPassword]);

        return $this->find($this->db->lastInsertId());
    }

    public function update($id, $data)
    {
        $stmt = $this->db->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['email'], $id]);

        return $this->find($id);
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
