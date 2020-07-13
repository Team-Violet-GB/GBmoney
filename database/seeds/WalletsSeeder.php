<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WalletsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Вставляем данные в таблицу.
        DB::table('wallets')->insert($this->getData());
    }

    /**
     * Возвращаем массив с данными для заполнения.
     * @return string[][]
     */
    private function getData()
    {
        return [
            [
                'user_id' => 1,
                'name' => 'Наличные',
                'amount' => 20000,
                'description' => null,
                'include' => 1,
                'icon_id' => 36,
            ],
            [
                'user_id' => 1,
                'name' => 'Карта Такая',
                'amount' => 15000,
                'description' => null,
                'include' => 1,
                'icon_id' => 34,
            ],
            [
                'user_id' => 1,
                'name' => 'Карта Сякая',
                'amount' => 100000,
                'description' => null,
                'include' => 0,
                'icon_id' => 34,
            ]
        ];
    }
}
