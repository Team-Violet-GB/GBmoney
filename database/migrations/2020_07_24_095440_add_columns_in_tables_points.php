<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsInTablesPoints extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->timestamps();
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->timestamps();
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->timestamps();
        });
        Schema::table('tags', function (Blueprint $table) {
            $table->timestamps();
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->dropTimestamps();
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropTimestamps();
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropTimestamps();
        });
        Schema::table('tags', function (Blueprint $table) {
            $table->dropTimestamps();
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
}
