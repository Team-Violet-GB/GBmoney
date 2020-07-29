<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PhpParser\Error;

class AuthController extends Controller
{
    protected function generateAccessToken($user)
    {
        $token = $user->createToken($user->email . '-' . now());

        return $token->accessToken;
    }

    public function register(Request $request)
    {
        $request->validate([

            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'min:6'],
        ]);

        $user = User::create([

            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['user' => $user]);
    }

    public function login(Request $request)
    {

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            $token = $user->createToken($user->email . '-' . now());

            return response()->json([
                'user' => $user,
                'token' => $token->accessToken
            ]);
        } else {
            return response()->json([
                'errors' => 'Неправильный логин или пароль'
            ], 403);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Пользователь вышел'
        ]);
    }

}
