<?php

namespace App\Models;

use App\Http\Requests\TransactionFormRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Mockery\Exception;

/**
 * Class Transaction
 * @property-read int id
 * @property int user_id
 * @property int type
 * @property float amount
 * @property string date
 * @property string comment
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

    /**
     * Метод заполняет модель значениями поступившими из запроса в соответствии с типом операции.
     * Изменяет значения Кошельков, Доходов и Расходов в зависимости от типа операции.
     * В случае неудачного занесения транзакции в базу данных все изменения откатываются и возвращается ошибка.
     * В случае успеха возвращается true.
     *
     * @param TransactionFormRequest $request
     * @return bool|\Exception|Exception
     */
    public function fillTransaction(TransactionFormRequest $request)
    {
        try {
            // Открываем транзакцию
            DB::beginTransaction();

            // Заполняем общие свойства.
            $this->user_id = Auth::id();
            $this->type = $request->type;
            $this->amount = $request->amount;
            $this->date = $request->date ?? now()->toDateString();
            $this->comment = $request->comment;

            // Определяем значения внешних ключей в зависимости от типа операции (type).
            if ($this->type == Transaction::TYPE_INCOME) {
                $this->income_id = $request->from_id;
                $this->wallet_id_to = $request->to_id;
                $this->wallet_id_from = null;
                $this->expense_id = null;
                $this->tag_id = null;

                // Увеличиваем сумму дохода.
                $income = Income::query()->find($request->from_id);
                $income->increment('amount', $request->amount);

                // Увеличиваем сумму кошелька.
                $wallet = Wallet::query()->find($request->to_id);
                $wallet->increment('amount', $request->amount);
            }
            if ($this->type == Transaction::TYPE_TRANSFER) {
                $this->wallet_id_from = $request->from_id;
                $this->wallet_id_to = $request->to_id;
                $this->expense_id = null;
                $this->tag_id = null;
                $this->income_id = null;

                // Уменьшаем сумму кошелька списания.
                $walletFrom = Wallet::query()->find($request->from_id);
                $walletFrom->decrement('amount', $request->amount);

                // Увеличиваем сумму кошелька поступления.
                $walletTo = Wallet::query()->find($request->to_id);
                $walletTo->increment('amount', $request->amount);
            }
            if ($this->type == Transaction::TYPE_EXPENSE) {
                $this->wallet_id_from = $request->from_id;
                $this->expense_id = $request->to_id;
                $this->tag_id = $request->tag_id;
                $this->income_id = null;
                $this->wallet_id_to = null;

                // Уменьшаем сумму кошелька списания.
                $walletFrom = Wallet::query()->find($request->from_id);
                $walletFrom->decrement('amount', $request->amount);

                // Увеличиваем сумму расходов.
                $expense = Expense::query()->find($request->to_id);
                $expense->increment('amount', $request->amount);
            }

            $this->save();
        } catch (Exception $e) {
            // Откатываем изменения.
            DB::rollBack();

            return $e;
        }

        // Фиксируем изменения.
        DB::commit();

        return true;
    }
}
