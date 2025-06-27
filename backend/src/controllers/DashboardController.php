<?php

namespace Src\Controllers;

use Src\Config\Database;
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../helpers/Response.php';

use PDO;

class DashboardController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }


    // summary method
    public function summary($orgId)
    {
        $month = date('m');
        $year = date('Y');
        $lastDate = date('j');
        // Total income
        $stmt = $this->db->prepare(
            "SELECT COALESCE(SUM(amount)) as total_income FROM incomes WHERE org_id = ? AND MONTH(date) = ? AND YEAR(date) = ? AND DAY(date) <= ?
                    GROUP BY DAY(date)"
        );
        $stmt->execute([$orgId, $month, $year, $lastDate]);
        $income = $stmt->fetch(PDO::FETCH_ASSOC)['total_income'] ?? 0;

        // Total expenses
        $stmt = $this->db->prepare(
            "SELECT COALESCE(SUM(amount)) as total_expenses FROM expenses WHERE org_id = ? AND MONTH(date) = ? AND YEAR(date) = ? AND DAY(date) <= ?
                    GROUP BY DAY(date)"
        );
        $stmt->execute([$orgId, $month, $year, $lastDate]);
        $expenses = $stmt->fetch(PDO::FETCH_ASSOC)['total_expenses'] ?? 0;


        // Calculate balance
        $balance = $income - $expenses;

        // Total products
        $stmt = $this->db->prepare("SELECT COALESCE(COUNT(id)) as total_products FROM products WHERE org_id = ?");
        $stmt->execute([$orgId]);
        $products = $stmt->fetch(PDO::FETCH_ASSOC)['total_products'] ?? 0;


        return response(200, 'Dashboard summary', [
            'total_income' => number_format((float) $income, 2, '.', ''),
            'total_expenses' => number_format((float) $expenses, 2, '.', ''),
            'balance' => number_format((float) $balance, 2, '.', ''),
            'products' => $products
        ]);
    }



    // get alerts and low stock method 

    public function alerts($orgId)
    {
        // 1. Budget Warnings
        $stmt = $this->db->prepare("
        SELECT c.name, c.monthly_limit,
            COALESCE(SUM(e.amount), 0) AS spent,
            c.id as id
        FROM expense_categories c
        LEFT JOIN expenses e ON e.category_id = c.id AND MONTH(e.date) = MONTH(CURRENT_DATE()) AND YEAR(e.date) = YEAR(CURRENT_DATE())
        WHERE c.org_id = ?
        GROUP BY c.id
        HAVING spent >= (c.monthly_limit * 0.9)
    ");
        $stmt->execute([$orgId]);
        $budgetWarnings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 2. Low Stock Products
        $stmt = $this->db->prepare("
        SELECT name, quantity, threshold, id
        FROM products
        WHERE org_id = ? AND quantity <= threshold
    ");
        $stmt->execute([$orgId]);
        $lowStockProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return response(200, 'Alerts fetched successfully.', [
            'budget_warnings' => $budgetWarnings,
            'low_stock_products' => $lowStockProducts
        ]);
    }
    // GET /api/dashboard/trends
    public function trends($orgId, $filter = [])
    {
        $cucrrent_month = date('m');

        $month = date('m');
        $year = date('Y');
        $lastDate = date('j');


        // get month and year from filter (query params)
        if (isset($filter['month']) && is_numeric($filter["month"]) && $filter["month"] > 0 && $filter["month"] <= 12) {
            $month = $filter['month'];
        }

        if (isset($filter['year']) && is_numeric($filter["year"]) && $filter["year"] > 0) {
            $year = $filter['year'];
        }

        // set last date of month
        if ($month == $cucrrent_month && $year == date('Y')) {
            $lastDate = date(format: 'j');
        } else {
            $lastDate = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        }

        // Get daily income till today
        $incomeStmt = $this->db->prepare("
        SELECT DAY(date) as day, SUM(amount) as total
        FROM incomes
        WHERE org_id = ? AND MONTH(date) = ? AND YEAR(date) = ? AND DAY(date) <= ?
        GROUP BY DAY(date)
    ");
        $incomeStmt->execute([$orgId, $month, $year, $lastDate]);
        $incomeData = $incomeStmt->fetchAll(PDO::FETCH_KEY_PAIR); // [day => total]

        // Get daily expense till today
        $expenseStmt = $this->db->prepare("
        SELECT DAY(date) as day, SUM(amount) as total
        FROM expenses
        WHERE org_id = ? AND MONTH(date) = ? AND YEAR(date) = ? AND DAY(date) <= ?
        GROUP BY DAY(date)
    ");
        $expenseStmt->execute([$orgId, $month, $year, $lastDate]);
        $expenseData = $expenseStmt->fetchAll(PDO::FETCH_KEY_PAIR); // [day => total]

        // Build day-wise array up to today
        $trendData = [];

        $toatlExpense = 0.0;
        $toatlIncome = 0.0;

        for ($day = 1; $day <= $lastDate; $day++) {
            $income = number_format((float) ($incomeData[$day] ?? 0), 2, '.', '');
            $expense = number_format((float) ($expenseData[$day] ?? 0), 2, '.', '');
            $trendData[] = [
                'day' => $day,
                'income' => $income,
                'expense' => $expense
            ];
            $toatlIncome += $income;
            $toatlExpense += $expense;
        }
        if ($toatlExpense == 0) {
            $toatlExpense = 1;
        }
        $trend = number_format((float) (($toatlIncome - $toatlExpense) * 100 / $toatlExpense), 2, '.', '');
        if ($toatlExpense == 1 && $toatlIncome == 0) {
            $trend = 0;
        }
        return response(200, 'Income vs Expense trends till today.', ['data' => $trendData, "trend" => $trend]);
    }


    // GET /api/dashboard/budget-expense
    public function budgetExpense($orgId, $filter = [])
    {
        $cucrrent_month = date('m');

        $month = date('m');
        $year = date('Y');
        $lastDate = date('j');


        // get month and year from filter (query params)
        if (isset($filter['month']) && is_numeric($filter["month"]) && $filter["month"] > 0 && $filter["month"] <= 12) {
            $month = $filter['month'];
        }

        if (isset($filter['year']) && is_numeric($filter["year"]) && $filter["year"] > 0) {
            $year = $filter['year'];
        }

        // set last date of month
        if ($month == $cucrrent_month && $year == date('Y')) {
            $lastDate = date(format: 'j');
        } else {
            $lastDate = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        }

        // Get daily income till today
        $stmt = $this->db->prepare("
        SELECT 
            ec.id, 
            ec.name, 
            ec.monthly_limit as budget,
            COALESCE(SUM(e.amount), 0) as spent
        FROM expense_categories ec
        LEFT JOIN expenses e ON 
            e.category_id = ec.id
            AND MONTH(e.date) = ?
            AND YEAR(e.date) = ?
        WHERE 
            ec.org_id = ?
        GROUP BY ec.id
    ");

        $stmt->execute([$month, $year, $orgId]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return response(200, "Budget - Expense trends till {$lastDate}", ['data' => $result,]);
    }


    // GET /api/dashboard/income-category
    public function incomeCategory($orgId, $filter = [])
    {
        $cucrrent_month = date('m');

        $month = date('m');
        $year = date('Y');
        $lastDate = date('j');


        // get month and year from filter (query params)
        if (isset($filter['month']) && is_numeric($filter["month"]) && $filter["month"] > 0 && $filter["month"] <= 12) {
            $month = $filter['month'];
        }

        if (isset($filter['year']) && is_numeric($filter["year"]) && $filter["year"] > 0) {
            $year = $filter['year'];
        }

        // set last date of month
        if ($month == $cucrrent_month && $year == date('Y')) {
            $lastDate = date(format: 'j');
        } else {
            $lastDate = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        }

        // Get daily income till today
        $stmt = $this->db->prepare("
        SELECT 
            ic.id, 
            ic.name as category, 
            COALESCE(SUM(i.amount), 0) as income
        FROM incomes_categories ic
        LEFT JOIN incomes i ON 
            i.category_id = ic.id
            AND MONTH(i.date) = ?
            AND YEAR(i.date) = ?
        WHERE 
            ic.org_id = ?
        GROUP BY ic.id
    ");

        $stmt->execute([$month, $year, $orgId]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return response(200, "Income - Category trends till {$lastDate}", ['data' => $result,]);
    }
}

