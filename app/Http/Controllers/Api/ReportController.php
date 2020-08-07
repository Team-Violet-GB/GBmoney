<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ReportHelpers;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReportSumByExpensesCollection;
use App\Http\Resources\ReportSumByIncomesCollection;
use App\Http\Resources\ReportSumByTagsCollection;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Class ReportController
 * @package App\Http\Controllers\Api
 */
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
            ->whereNotNull('transactions.income_id')
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->where('transactions.date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->where('transactions.date', '<=', $dateTo);
            })
            ->groupBy(['transactions.income_id', 'i.name']);

        return new ReportSumByIncomesCollection($query->get());
    }

    /**
     * @param Request $request
     * @return ReportSumByExpensesCollection
     * @throws ValidationException
     */
    public function sumByExpenses(Request $request)
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

        $query->selectRaw('transactions.expense_id, sum(transactions.amount) as amount, e.name')
            ->join('expenses as e', 'transactions.expense_id', '=', 'e.id')
            ->where('transactions.user_id', Auth::id())
            ->whereNotNull('transactions.expense_id')
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->where('transactions.date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->where('transactions.date', '<=', $dateTo);
            })
            ->groupBy(['transactions.expense_id', 'e.name']);

        return new ReportSumByExpensesCollection($query->get());
    }

    /**
     * @param Request $request
     * @return ReportSumByTagsCollection
     * @throws ValidationException
     */
    public function sumByTags(Request $request)
    {
        // Выполняем валидацию данных из запроса.
        $this->validate($request, [
            'expense_id' => 'required|int',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        // Получаем данные из запроса.
        $expense_id = request('expense_id');
        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $query = Transaction::query();

        $query->selectRaw('transactions.tag_id, sum(transactions.amount) as amount, t.name')
            ->leftJoin('tags as t', 'transactions.tag_id', '=', 't.id')
            ->where('transactions.user_id', Auth::id())
            ->where('transactions.expense_id', $expense_id)
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->where('transactions.date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->where('transactions.date', '<=', $dateTo);
            })
            ->groupBy(['transactions.tag_id', 't.name']);

        return new ReportSumByTagsCollection($query->get());
    }

    public function sumByPointsByMonths(Request $request)
    {
        // Выполняем валидацию данных из запроса.
        $this->validate($request, [
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'income_id' => 'nullable|int',
            'expense_id' => 'nullable|int',
            'type' => ['nullable', Rule::in([Transaction::TYPE_INCOME, Transaction::TYPE_EXPENSE])]
        ]);

        if (isset($request->type) && $request->type == Transaction::TYPE_INCOME) {
            $point_id = 'income_id';
            $point_table = 'incomes';
            $income_id = null;
            $expense_id = null;
        }

        if (isset($request->type) && $request->type == Transaction::TYPE_EXPENSE) {
            $point_id = 'expense_id';
            $point_table = 'expenses';
            $income_id = null;
            $expense_id = null;
        }

        if ($request->income_id) {
            $point_id = 'income_id';
            $point_table = 'incomes';
            $income_id = $request->income_id;
            $expense_id = null;
        }

        if ($request->expense_id) {
            $point_id = 'expense_id';
            $point_table = 'expenses';
            $income_id = null;
            $expense_id = $request->expense_id;
        }

        // Получаем массив месяцев (с начальной и конечно датой месяца) за выбранный период.
        $dateArr = ReportHelpers::getArrMonthsForPeriod($request->date_from, $request->date_to);

        // Получаем массив из сгруппированных по месяцам элементов с указанием суммы, id и названия поинта.
        $arr = ReportHelpers::getArrWithSumPointsByDate($dateArr, $point_table, $point_id, $income_id, $expense_id);

        return response()->json($arr);
    }
}
