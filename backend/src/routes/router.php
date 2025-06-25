<?php

use Src\Controllers\AuthController;
use Src\Controllers\DashboardController;
use Src\Controllers\ExpenseCategoryController;
use Src\Controllers\ExpenseController;
use Src\Controllers\IncomeCategoryController;
use Src\Controllers\IncomeController;
use Src\Controllers\ProductCategoryController;
use Src\Controllers\ProductController;
use Src\Controllers\ProfileController;


require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/DashboardController.php';
require_once __DIR__ . '/../controllers/IncomeController.php';
require_once __DIR__ . '/../controllers/ExpenseController.php';
require_once __DIR__ . '/../controllers/ExpenseCategoryController.php';
require_once __DIR__ . '/../controllers/ProductCategoryController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/IncomeCategoryController.php';
require_once __DIR__ . '/../controllers/ProfileController.php';

$uri = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));

if (!isset($uri[0]) || $uri[0] !== 'api') {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}

array_shift($uri);
$resource = $uri[0] ?? null;
$id = $uri[1] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true) ?? [];


$headers = getallheaders();

switch ($resource) {
    //  auth routes
    case 'login':
        $ctrl = new AuthController();
        match ($method) {
            'POST' => $ctrl->login($input),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    case 'register':
        $ctrl = new AuthController();
        match ($method) {
            'POST' => $ctrl->register($input),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    case 'me':
        $ctrl = new AuthController();
        match ($method) {
            'GET' => $ctrl->me($headers),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    //  dashboard routes
    case 'dashboard':
        requireAuth();
        $ctrl = new DashboardController();
        match ($method) {
            'GET' => $ctrl->summary($auth_user["id"]),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    case 'alerts':
        requireAuth();
        $ctrl = new DashboardController();
        match ($method) {
            'GET' => $ctrl->alerts($auth_user["id"]),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    case 'trends':
        requireAuth();
        $ctrl = new DashboardController();
        match ($method) {
            'GET' => $ctrl->trends($auth_user["id"], $_GET),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    case 'budget-expense':
        requireAuth();
        $ctrl = new DashboardController();
        match ($method) {
            'GET' => $ctrl->budgetExpense($auth_user["id"], $_GET),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    case 'income-category':
        requireAuth();
        $ctrl = new DashboardController();
        match ($method) {
            'GET' => $ctrl->incomeCategory($auth_user["id"], $_GET),
            default => response(405, 'Method Not Allowed'),
        };
        break;

    //  income routes
    case 'incomes':
        requireAuth();
        $ctrl = new IncomeController();
        if ($method === 'GET' && $id) {
            $ctrl->show($auth_user['id'], $id); // get single income by id
        } elseif ($method === 'GET') {
            $ctrl->index($auth_user['id'], $_GET); // list all
        } elseif ($method === 'POST') {
            $ctrl->store($auth_user['id'], $input);
        } elseif ($method === 'PUT' && $id) {
            $ctrl->update($auth_user['id'], $id, $input);
        } elseif ($method === 'DELETE' && $id) {
            $ctrl->destroy($auth_user['id'], $id);
        } else {
            response(405, 'Method Not Allowed');
        }
        break;
    //  expense catgeory routes
    case 'income-categories':
        requireAuth();
        $ctrl = new IncomeCategoryController();
        match ($method) {
            'GET' => isset($id)
            ? $ctrl->show($auth_user['id'], $id)
            : $ctrl->index($auth_user['id'], $_GET),
            'POST' => $ctrl->store($auth_user['id'], $input),
            'PUT' => $ctrl->update($auth_user['id'], $id, $input),
            'DELETE' => $ctrl->destroy($auth_user['id'], $id),
            default => response(405, 'Method Not Allowed'),
        };
        break;

    //  expense catgeory routes
    case 'expense-categories':
        requireAuth();
        $ctrl = new ExpenseCategoryController();
        match ($method) {
            'GET' => isset($id)
            ? $ctrl->show($auth_user['id'], $id)
            : $ctrl->index($auth_user['id'], $_GET),
            'POST' => $ctrl->store($auth_user['id'], $input),
            'PUT' => $ctrl->update($auth_user['id'], $id, $input),
            'DELETE' => $ctrl->destroy($auth_user['id'], $id),
            default => response(405, 'Method Not Allowed'),
        };
        break;

    //  expense routes
    case 'expenses':
        requireAuth();
        $ctrl = new ExpenseController();
        if ($method === 'GET' && $id) {
            $ctrl->show($auth_user['id'], $id); // get single by id
        } elseif ($method === 'GET') {
            $ctrl->index($auth_user['id'], $_GET); // list all
        } elseif ($method === 'POST') {
            $ctrl->store($auth_user['id'], $input);
        } elseif ($method === 'PUT' && $id) {
            $ctrl->update($auth_user['id'], $id, $input);
        } elseif ($method === 'DELETE' && $id) {
            $ctrl->destroy($auth_user['id'], $id);
        } else {
            response(405, 'Method Not Allowed');
        }
        break;

    //  product catgeory routes
    case 'product-categories':
        requireAuth();
        $ctrl = new ProductCategoryController();
        match ($method) {
            'GET' => isset($id)
            ? $ctrl->show($auth_user['id'], $id)
            : $ctrl->index($auth_user['id']),
            'POST' => $ctrl->store($auth_user['id'], $input),
            'PUT' => $ctrl->update($auth_user['id'], $id, $input),
            'DELETE' => $ctrl->destroy($auth_user['id'], $id),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    //  product routes
    case 'products':
        requireAuth();
        $ctrl = new ProductController();
        match ($method) {
            'GET' => isset($id)
            ? $ctrl->show($auth_user['id'], $id)
            : $ctrl->index($auth_user['id'], $_GET),
            'POST' => $ctrl->store($auth_user['id'], $input),
            'PUT' => $ctrl->update($auth_user['id'], $id, $input),
            'DELETE' => $ctrl->destroy($auth_user['id'], $id),
            default => response(405, 'Method Not Allowed'),
        };
        break;


    // profile
    // profile image
    case 'update-profile':
        requireAuth();
        $ctrl = new ProfileController();
        match ($method) {
            'POST' => $ctrl->updateProfile($auth_user["id"], $input),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    // profile email
    case 'update-email':
        requireAuth();
        $ctrl = new ProfileController();
        match ($method) {
            'POST' => $ctrl->updateEmail($auth_user["id"], $input),
            default => response(405, 'Method Not Allowed'),
        };
        break;
    // profile password
    case 'update-password':
        requireAuth();
        $ctrl = new ProfileController();
        match ($method) {
            'POST' => $ctrl->updatePassword($auth_user["id"], $input),
            default => response(405, 'Method Not Allowed'),
        };
        break;


    default:
        response(404, "Not found");
}
