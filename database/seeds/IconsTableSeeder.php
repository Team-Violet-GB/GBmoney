<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IconsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Предварительно очищаем таблицу для предотвращения удвоения данных.
        DB::statement('truncate table icons');
        // Вставляем данные в таблицу.
        DB::table('icons')->insert($this->getData());
    }

    /**
     * Возвращаем массив с названиями иконок.
     * @return string[][]
     */
    private function getData()
    {
        return [
            ["name" => "el-icon-phone-outline"],
            ["name" => "el-icon-star-off"],
            ["name" => "el-icon-goods"],
            ["name" => "el-icon-camera"],
            ["name" => "el-icon-s-order"],
            ["name" => "el-icon-s-platform"],
            ["name" => "el-icon-s-promotion"],
            ["name" => "el-icon-s-home"],
            ["name" => "el-icon-s-ticket"],
            ["name" => "el-icon-s-open"],
            ["name" => "el-icon-s-shop"],
            ["name" => "el-icon-s-marketing"],
            ["name" => "el-icon-s-comment"],
            ["name" => "el-icon-s-finance"],
            ["name" => "el-icon-s-custom"],
            ["name" => "el-icon-s-opportunity"],
            ["name" => "el-icon-date"],
            ["name" => "el-icon-edit"],
            ["name" => "el-icon-tickets"],
            ["name" => "el-icon-printer"],
            ["name" => "el-icon-paperclip"],
            ["name" => "el-icon-monitor"],
            ["name" => "el-icon-mobile"],
            ["name" => "el-icon-mouse"],
            ["name" => "el-icon-collection"],
            ["name" => "el-icon-notebook-1"],
            ["name" => "el-icon-school"],
            ["name" => "el-icon-table-lamp"],
            ["name" => "el-icon-house"],
            ["name" => "el-icon-shopping-cart-full"],
            ["name" => "el-icon-sell"],
            ["name" => "el-icon-present"],
            ["name" => "el-icon-box"],
            ["name" => "el-icon-bank-card"],
            ["name" => "el-icon-money"],
            ["name" => "el-icon-wallet"],
            ["name" => "el-icon-discount"],
            ["name" => "el-icon-bangzhu"],
            ["name" => "el-icon-first-aid-kit"],
            ["name" => "el-icon-discover"],
            ["name" => "el-icon-watch"],
            ["name" => "el-icon-service"],
            ["name" => "el-icon-mobile-phone"],
            ["name" => "el-icon-bicycle"],
            ["name" => "el-icon-basketball"],
            ["name" => "el-icon-food"],
            ["name" => "el-icon-chicken"],
            ["name" => "el-icon-knife-fork"],
            ["name" => "el-icon-coffee"],
            ["name" => "el-icon-ice-tea"],
        ];
    }
}
