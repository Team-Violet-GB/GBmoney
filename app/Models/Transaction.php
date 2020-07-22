<?php

namespace App\Models;

use App\Http\Requests\TransactionFormRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Class Transaction
 * @property-read int id
 * @property int user_id
 * @property int type
 * @property int amount
 * @property int date
 * @property int time
 * @property int comment
 * @property int wallet_id_from
 * @property int wallet_id_to
 * @property int income_id
 * @property int expense_id
 * @property int tag_id
 * @package App\Models
 */
class Transaction extends Model
{
    const TYPE_INCOME = 1;
    const TYPE_TRANSFER = 2;
    const TYPE_EXPENSE = 3;

    public $timestamps = false;

    /**
     * Метод заполняет модель значениями поступившими из запроса в соответствии с типом операции.
     * @param TransactionFormRequest $request
     * @return $this
     */
    public function fillTransaction(TransactionFormRequest $request)
    {
        // Заполняем общие свойства.
        $this->user_id = Auth::id();
        $this->type = $request->type;
        $this->amount = $request->amount;
        $this->date = $request->date ?? now()->toDateString();
        $this->time = $request->time ?? now()->toTimeString();
        $this->comment = $request->comment;

        // Определяем значения внешних ключей в зависимости от типа операции (type).
        if ($this->type == Transaction::TYPE_INCOME) {
            $this->income_id = $request->from_id;
            $this->wallet_id_to = $request->to_id;
        }
        if ($this->type == Transaction::TYPE_TRANSFER) {
            $this->wallet_id_from = $request->from_id;
            $this->wallet_id_to = $request->to_id;
        }
        if ($this->type == Transaction::TYPE_EXPENSE) {
            $this->wallet_id_from = $request->from_id;
            $this->expense_id = $request->to_id;
            $this->tag_id = $request->tag_id;
        }

        return $this;
    }
}
