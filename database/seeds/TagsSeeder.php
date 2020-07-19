<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Вставляем данные в таблицу.
        DB::table('tags')->insert($this->getData());
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
                'name' => 'Мясо',
                'expense_id' => 2,
            ],
            [
                'user_id' => 1,
                'name' => 'Фрукты',
                'expense_id' => 2,
            ],
            [
                'user_id' => 2,
                'name' => 'Мясо',
                'expense_id' => 4,
            ],
            [
                'user_id' => 2,
                'name' => 'Крупы',
                'expense_id' => 4,
            ],
            [
                'user_id' => 2,
                'name' => 'Овощи',
                'expense_id' => 4,
            ]
        ];
    }
}
