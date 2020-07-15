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
                'amount' => 20000,
                'description' => null,
                'icon_id' => 35,
            ],
            [
                'user_id' => 1,
                'name' => 'Депозит',
                'amount' => 1000,
                'description' => null,
                'icon_id' => 1,
            ],
            [
                'user_id' => 1,
                'name' => 'Кэшбэк',
                'amount' => 500,
                'description' => 'Маленькое такое описание',
                'icon_id' => 2,
            ],
            [
                'user_id' => 1,
                'name' => 'Подарки',
                'amount' => 5000,
                'description' => null,
                'icon_id' => 32,
            ]
        ];
    }
}
