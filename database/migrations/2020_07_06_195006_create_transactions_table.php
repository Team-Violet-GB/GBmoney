<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
            $table->boolean('type');
            $table->decimal('amount', 10,2);
            $table->dateTime('date');
            $table->string('comment')->nullable();
            $table->bigInteger('wallet_id_from')->unsigned()->nullable();
            $table->bigInteger('wallet_id_to')->unsigned()->nullable();
            $table->bigInteger('income_id')->unsigned()->nullable();
            $table->bigInteger('expense_id')->unsigned()->nullable();
            $table->bigInteger('tag_id')->unsigned()->nullable();

        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
            $table->foreign('wallet_id_from')
                ->references('id')
                ->on('wallets');
            $table->foreign('wallet_id_to')
                ->references('id')
                ->on('wallets');
            $table->foreign('income_id')
                ->references('id')
                ->on('incomes');
            $table->foreign('expense_id')
                ->references('id')
                ->on('expenses');
            $table->foreign('tag_id')
                ->references('id')
                ->on('tags');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transactions', function (Blueprint $table){
            $table->dropForeign(['user_id']);
            $table->dropForeign(['wallet_id_from']);
            $table->dropForeign(['wallet_id_to']);
            $table->dropForeign(['income_id']);
            $table->dropForeign(['expense_id']);
            $table->dropForeign(['tag_id']);
            });

        Schema::dropIfExists('transactions');
    }
}
