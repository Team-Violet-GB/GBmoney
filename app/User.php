<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public static function rulesUserUpdateDelete($password) {
        return [
            'email' => ['required', 'email', 'max:255',
                Rule::unique('users')->ignore(Auth::id())],
            'password' => ['required', 'alpha_dash', 'min:6'],
            'newpass' => ['nullable', 'alpha_dash', 'min:6'],
        ];
    }

    public static function attributeNames()
    {
        return [
            'email' => 'E-mail',
            'password' => 'Пароль',
            'newpass' => 'Новый пароль'
        ];
    }

}
