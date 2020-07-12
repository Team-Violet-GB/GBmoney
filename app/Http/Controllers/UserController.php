<?php


namespace App\Http\Controllers;


class UserController
{
    public function getUser() {
        $userData = [
            'id'  => 1,
            'email' => 'this@is.email'
        ];
        return json_encode($userData);
    }
}
