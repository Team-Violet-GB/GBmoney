<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIncomesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->bigIncrements('id')->unsigned();
            $table->bigInteger('user_id')->unsigned();
            $table->string('name', 45);
            $table->decimal('amount', 10,2)->default(0);
            $table->string('description', 255)->nullable();
            $table->bigInteger('icon_id')->unsigned();
        });

        Schema::table('incomes', function (Blueprint $table){
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
            $table->foreign('icon_id')
                ->references('id')
                ->on('icons');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('incomes', function (Blueprint $table){
            $table->dropForeign(['user_id']);
            $table->dropForeign(['icon_id']);
        });

        Schema::dropIfExists('incomes');
    }
}
