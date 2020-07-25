<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
        $id = Auth::id();
        $user = User::find($id);
        if ($user) {
            $user->email = $request->email;
            if ($request->newpass)
                $user->password = Hash::make($request->newpass);
            return response()->json(['message' => 'Пользователь успешно изменён'], 200);
        }
        return response()->json(['message' => 'Упс, что-то пошло не так'], 404);
    }

    public function delete(Request $request)
    {

    }
}
