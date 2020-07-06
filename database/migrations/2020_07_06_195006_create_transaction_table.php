<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transaction', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
            $table->tinyInteger('type');
            $table->timestamps('created_at');
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
            $table->text('comment');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transaction');
    }
}
