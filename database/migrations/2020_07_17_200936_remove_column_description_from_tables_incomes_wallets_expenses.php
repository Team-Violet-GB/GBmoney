<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveColumnDescriptionFromTablesIncomesWalletsExpenses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('description');
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
            $table->string('description', 255)->nullable()->after('amount');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->string('description', 255)->nullable()->after('amount');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->string('description')->nullable()->after('amount');
        });
    }
}
