<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class IncreasedLengthFieldAmountInTablesPoints extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->decimal('amount', 14, 2)->change();
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->decimal('amount', 14, 2)->change();
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->decimal('amount', 14, 2)->change();
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('amount', 14, 2)->change();
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
            $table->decimal('amount', 10, 2)->change();
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
        });
        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
        });
    }
}
