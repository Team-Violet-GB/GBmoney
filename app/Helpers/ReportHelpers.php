<?php

namespace App\Helpers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * Class ReportHelpers
 * @package App\Helpers
 */
class ReportHelpers
{
    /**
     * Метод получает на вход начальную и конечную дату периода, и возвращает массив в котором заданный период
     * разбит по месяцам и передается дата первого и последнего дня месяца: startDayOfMonth и endDayOfMonth.
     *
     * @param string $date_from
     * @param string $date_to
     * @return mixed
     */
    public static function getArrMonthsForPeriod(string $date_from, string $date_to)
    {
        $dateFrom = Carbon::parse($date_from);
        $dateTo = Carbon::parse($date_to);

        $startDayOfMonth = $dateFrom->startOfMonth()->toDateString();
        $endDayOfMonth = $dateFrom->endOfMonth()->toDateString();

        $dateArr[] = [
            'start' => $startDayOfMonth,
            'end' => $endDayOfMonth,
        ];

        $nextMonth = $dateFrom;

        while ($nextMonth <= $dateTo) {
            $nextMonth = $nextMonth->addMonthNoOverflow();

            $startDayOfMonth = $nextMonth->startOfMonth()->toDateString();
            $endDayOfMonth = $nextMonth->endOfMonth()->toDateString();

            $dateArr[] = [
                'start' => $startDayOfMonth,
                'end' => $endDayOfMonth,
            ];
        }

        return $dateArr;
    }

    /**
     * Метод создает массив из сгруппированных по месяцам элементов, в каждом элементе содержится ID поинта (income_id),
     * общая сумма транзакций за данный месяц (amount) и название поинта (name).
     *
     * @param array $dateArr
     * @param string $point_table
     * @param string $point_id
     * @param int|null $income_id
     * @param int|null $expense_id
     * @return array
     */
    public static function getArrWithSumPointsByDate(array $dateArr, string $point_table, string $point_id, ?int $income_id, ?int $expense_id)
    {
        $result = [];

        foreach ($dateArr as $item) {
            // Даты начала и конца периода.
            $dateFrom = $item['start'];
            $dateTo = $item['end'];

            $query = Transaction::query();

            $query->selectRaw('transactions.' . $point_id . ', sum(transactions.amount) as amount, p.name')
                ->join('' . $point_table . ' as p', 'transactions.' . $point_id . '', '=', 'p.id')
                ->where('transactions.user_id', Auth::id())
                ->whereNotNull('transactions.' . $point_id . '')
                ->when($dateFrom, function ($query) use ($dateFrom) {
                    return $query->where('transactions.date', '>=', $dateFrom);
                })
                ->when($dateTo, function ($query) use ($dateTo) {
                    return $query->where('transactions.date', '<=', $dateTo);
                })
                ->when($income_id, function ($query) use ($income_id, $point_id) {
                    return $query->where('transactions.' . $point_id . '', '=', $income_id);
                })
                ->when($expense_id, function ($query) use ($expense_id, $point_id) {
                    return $query->where('transactions.' . $point_id . '', '=', $expense_id);
                })
                ->groupBy(['transactions.' . $point_id . '', 'p.name']);

            $result[$dateFrom] = $query->get();
        }

        return $result;
    }
}
