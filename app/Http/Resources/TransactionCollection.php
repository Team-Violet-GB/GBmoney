<?php

namespace App\Http\Resources;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TransactionCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        // Получаем массив дат для текущей страницы.
        $dates = array_column($this->collection->toArray(), 'date');

        // Получаем массив транзакций для каждого элемента входного массива пагинации.
        $transaction = Transaction::query()->whereIn('date', $dates)->orderByDesc('date')->get();

        return [
            'data' => $transaction->groupBy('date')
        ];
    }
}
