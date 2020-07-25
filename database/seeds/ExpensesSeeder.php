<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExpensesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Вставляем данные в таблицу.
        DB::table('expenses')->insert($this->getData());
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
                'name' => 'Бензин',
                'amount' => 5755.26,
                'max_limit' => 5000.00,
                'icon_id' => 33,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 1,
                'name' => 'Еда',
                'amount' => 15003.55,
                'max_limit' => 10000.00,
                'icon_id' => 47,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 1,
                'name' => 'Связь',
                'amount' => 620.00,
                'max_limit' => 1000.00,
                'icon_id' => 48,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 2,
                'name' => 'Продукты',
                'amount' => 4950.37,
                'max_limit' => 12000.00,
                'icon_id' => 47,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 2,
                'name' => 'Товары для дома',
                'amount' => 29500.80,
                'max_limit' => 5000.00,
                'icon_id' => 37,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ],
            [
                'user_id' => 2,
                'name' => 'Автомобиль',
                'amount' => 1001.01,
                'max_limit' => 5000.00,
                'icon_id' => 38,
                "updated_at" => "2020-07-24 10:14:48",
                "created_at" => "2020-07-24 10:14:48",
            ]
        ];
    }
}
