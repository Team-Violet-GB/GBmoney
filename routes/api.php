<?php

use App\Http\Resources\IconsCollection;
use App\Models\Icon;
use Illuminate\Http\Request;
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
# получение своих данных пользователем
Route::middleware('auth:api')->group(function () {
    Route::get('user/show', 'UserController@show');

    Route::group(['namespace' => 'Api'], function () {
        // Возвращаем коллекцию иконок.
        Route::get('get/icons', 'IconController');
    });
});
