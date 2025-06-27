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
                $host = 'sql309.infinityfree.com';
                $db = 'if0_39334812_smart_inventory';
                $user = 'if0_39334812';
                $pass = 'PjxdNnCbWRS47';
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
