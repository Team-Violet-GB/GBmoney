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
                'amount' => 3700.00,
                'include' => 1,
                'icon_id' => 36,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 1,
                'name' => 'Карта Мир',
                'amount' => 39821.77,
                'include' => 1,
                'icon_id' => 34,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 1,
                'name' => 'Карта Сбербанк',
                'amount' => 235655.90,
                'include' => 1,
                'icon_id' => 34,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 2,
                'name' => 'Наличные',
                'amount' => 20.00,
                'include' => 1,
                'icon_id' => 36,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 2,
                'name' => 'Карта Alfa Bank',
                'amount' => 15360.21,
                'include' => 0,
                'icon_id' => 34,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 2,
                'name' => 'Карта Tinkoff',
                'amount' => 98200.00,
                'include' => 1,
                'icon_id' => 34,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ]
        ];
    }
}
