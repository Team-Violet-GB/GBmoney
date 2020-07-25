<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Предварительно очищаем таблицу для предотвращения удвоения данных.
//        DB::statement('delete from users');
        // Добавляем сброс auto_increment
//        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');
        // Вставляем данные в таблицу.
        DB::table('users')->insert($this->getDataUsers());
    }

    /**
     * Возвращаем массив с данными пользователя.
     * @return string[][]
     */
    private function getDataUsers()
    {
        return [
            [
                'email' => 'user@user.ru',
                'email_verified_at' => now(),
                'password' => Hash::make(123456),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'admin@admin.ru',
                'email_verified_at' => now(),
                'password' => Hash::make(123456),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
    }
}
