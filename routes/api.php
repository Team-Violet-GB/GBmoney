<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

# Регистрация
Route::post('register', 'AuthController@register');
# Вход
Route::post('login', 'AuthController@login');

Route::middleware('auth:api')->group(function () {

    # Выход
    Route::get('logout', 'AuthController@logout');

    Route::group(['namespace' => 'Api'], function () {
        // Получение коллекции иконок, кошельков, расходов, доходов.
        Route::get('get/icons', 'IconController');
        Route::get('get/wallets', 'WalletController@getWalletsWithIconName');
        Route::get('get/expenses', 'ExpenseController@getExpensesWithIconName');
        Route::get('get/incomes', 'IncomeController@getIncomesWithIconName');

        // Работа с user
        Route::apiResource('user', 'UserController')
            ->only('update', 'destroy');
        // Работа с транзакциями.
        Route::apiResource('transactions', 'TransactionController');
        // Работа с доходами.
        Route::apiResource('incomes', 'IncomeController');
        // Работа с расходами.
        Route::apiResource('expenses', 'ExpenseController');
        // Работа с тегами.
        Route::apiResource('tags', 'TagController');
    });
});
