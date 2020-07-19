<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IncomesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Вставляем данные в таблицу.
        DB::table('incomes')->insert($this->getData());
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
                'name' => 'Зарплата',
                'amount' => 47524.68,
                'icon_id' => 35,
            ],
            [
                'user_id' => 1,
                'name' => 'Пенсия',
                'amount' => 12300.00,
                'icon_id' => 1,
            ],
            [
                'user_id' => 1,
                'name' => 'Кэшбэк',
                'amount' => 502.70,
                'icon_id' => 2,
            ],
            [
                'user_id' => 2,
                'name' => 'Зарплата',
                'amount' => 35000.00,
                'icon_id' => 35,
            ],
            [
                'user_id' => 2,
                'name' => 'Стипендия',
                'amount' => 8000.00,
                'icon_id' => 32,
            ],
            [
                'user_id' => 2,
                'name' => 'Прочие доходы',
                'amount' => 84122.48,
                'icon_id' => 32,
            ]
        ];
    }
}
