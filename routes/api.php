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
# получение своих данных пользователем
Route::middleware('auth:api')->group(function() {

    Route::get('user/show', 'UserController@show');
});