<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function show(Request $request)
    {
        $id = Auth::id();
        $user = User::find($id);

        if ($user) {
            return response()->json($user);
        }

        return response()->json(['message' => 'Пользователь не найден!'], 404);
    }

    public function update(Request $request)
    {

    }

    public function delete(Request $request)
    {

    }
}
