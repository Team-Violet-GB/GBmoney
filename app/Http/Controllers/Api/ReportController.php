<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportSumByIncomesCollection;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    /**
     * @param Request $request
     * @return ReportSumByIncomesCollection
     * @throws ValidationException
     */
    public function sumByIncomes(Request $request)
    {
        // Выполняем валидацию данных из запроса.
        $this->validate($request, [
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        // Получаем данные из запроса.
        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $query = Transaction::query();

        $query->selectRaw('transactions.income_id, sum(transactions.amount) as amount, i.name')
            ->Join('incomes as i', 'transactions.income_id', '=', 'i.id')
            ->where('transactions.user_id', Auth::id())
            ->whereNotNull('income_id')
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->where('date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->where('date', '<=', $dateTo);
            })
            ->groupBy(['income_id']);

        return new ReportSumByIncomesCollection($query->get());
    }
}
