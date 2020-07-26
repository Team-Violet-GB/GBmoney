<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function show(Request $request)
    {
        $user = User::find(Auth::id());

        if ($user) {
            return response()->json($user);
        }

        return response()->json(['message' => 'Пользователь не найден!'], 404);
    }

    public function update(Request $request)
    {
        $user = User::find(Auth::id());
        if ($user) {
            if (!Hash::check($request->password, Auth::user()->getAuthPassword()))
                abort(403, 'Неверный пароль');
            $this->validate($request, User::rulesUserUpdateDelete($request->password), [], User::attributeNames());
            $user->email = $request->email;
            if ($request->newpass)
                $user->password = Hash::make($request->newpass);
            $user->save();
            return response()->json(['user' => $user]);
        }
        abort(404, 'Упс, что-то пошло не так');
    }

    public function destroy(Request $request)
    {
        $user = User::find(Auth::id());
        if ($user) {
            if (!Hash::check($request->password, Auth::user()->getAuthPassword()))
                abort(403, 'Неверный пароль');
            $this->validate($request, User::rulesUserUpdateDelete($request->password), [], User::attributeNames());
            $user->delete();
            return response()->json(['message' => 'Пользователь удалён'], 200);
        }
        abort(404, 'Упс, что-то пошло не так');

    }
}
