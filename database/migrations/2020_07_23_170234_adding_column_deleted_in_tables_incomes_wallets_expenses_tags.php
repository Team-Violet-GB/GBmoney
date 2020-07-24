<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddingColumnDeletedInTablesIncomesWalletsExpensesTags extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->boolean('deleted')->default(0);
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->boolean('deleted')->default(0);
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->boolean('deleted')->default(0);
        });
        Schema::table('tags', function (Blueprint $table) {
            $table->boolean('deleted')->default(0);
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
            $table->dropColumn('deleted');
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('deleted');
        });
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('deleted');
        });
        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('deleted');
        });
    }
}
