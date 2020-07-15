<?php

use Illuminate\Http\Request;

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



Route::middleware('auth:api')->group(function() {
# получение своих данных пользователем
    Route::get('user/show', 'UserController@show');
    # Выход
    Route::get('logout','AuthController@logout');
});