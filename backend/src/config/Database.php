<?php
namespace Src\Config;

use PDO;
use PDOException;

class Database
{
    private static $conn;

    public static function connect()
    {
        if (!self::$conn) {
            try {
                $host = 'localhost:3307';
                $db = 'smart_inventory';
                $user = 'root';
                $pass = '';
                $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

                self::$conn = new PDO($dsn, $user, $pass);
                self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database Connection Failed', 'details' => $e->getMessage()]);
                exit;
            }
        }
        return self::$conn;
    }
}
