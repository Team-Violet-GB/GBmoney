<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ReportSumIncomes;
use App\Http\Resources\ReportSumIncomesCollection;
use App\Http\Resources\TransactionCollection;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function sumByIncomes()
    {
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

        return new ReportSumIncomesCollection($query->get());
    }
}
