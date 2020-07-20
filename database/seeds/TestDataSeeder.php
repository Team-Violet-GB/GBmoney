<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Предварительно очищаем таблицы.
        DB::statement('delete from transactions');
        DB::statement('delete from tags');
        DB::statement('delete from wallets');
        DB::statement('delete from expenses');
        DB::statement('delete from incomes');
        DB::statement('delete from users');
        DB::statement('delete from icons');

        // Добавляем сброс auto_increment.
        DB::statement('ALTER TABLE transactions AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE tags AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE wallets AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE expenses AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE incomes AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE icons AUTO_INCREMENT = 1');

        // Добавляем данные.
        $this->call(UserSeeder::class);
        $this->call(IconsTableSeeder::class);
        $this->call(IncomesSeeder::class);
        $this->call(ExpensesSeeder::class);
        $this->call(WalletsSeeder::class);
        $this->call(TagsSeeder::class);
        $this->call(TransactionsSeeder::class);
    }
}
