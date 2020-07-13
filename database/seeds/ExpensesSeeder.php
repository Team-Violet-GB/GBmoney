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
                'amount' => 20000,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 33,
            ],
            [
                'user_id' => 1,
                'name' => 'Еда',
                'amount' => 15000,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 47,
            ],
            [
                'user_id' => 1,
                'name' => 'Связь',
                'amount' => 5000,
                'description' => 'Нужно меньше болтать, поэтому ограничиваю расходы',
                'max_limit' => 5000,
                'icon_id' => 48,
            ],
            [
                'user_id' => 1,
                'name' => 'Развлечения',
                'amount' => 4950.37,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 46,
            ],
            [
                'user_id' => 1,
                'name' => 'Вещи',
                'amount' => 20000,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 37,
            ],
            [
                'user_id' => 1,
                'name' => 'Автомобиль',
                'amount' => 1000,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 38,
            ],
            [
                'user_id' => 1,
                'name' => 'Учеба',
                'amount' => 15000,
                'description' => null,
                'max_limit' => null,
                'icon_id' => 39,
            ],
            [
                'user_id' => 1,
                'name' => 'Дорога',
                'amount' => 500,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 40,
            ],
            [
                'user_id' => 1,
                'name' => 'Ребенок',
                'amount' => 300,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 41,
            ],
            [
                'user_id' => 1,
                'name' => 'Другое',
                'amount' => 3300,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 42,
            ],
            [
                'user_id' => 1,
                'name' => 'Здоровье',
                'amount' => 15000,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 43,
            ],
            [
                'user_id' => 1,
                'name' => 'Ипотека',
                'amount' => 4500,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 44,
            ],
            [
                'user_id' => 1,
                'name' => 'Квартира',
                'amount' => 6000,
                'description' => null,
                'max_limit' => 5000,
                'icon_id' => 45,
            ],
        ];
    }
}
