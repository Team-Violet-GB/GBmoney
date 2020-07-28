<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExpenseFormRequest;
use App\Http\Resources\ExpensesCollection;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class ExpenseController
 * @package App\Http\Controllers\Api
 */
class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        /** @var Expense $expenses */
        $expenses = Expense::query()
            ->where('user_id', Auth::id())
            ->where('expenses.deleted', false)
            ->get();

        return response()->json(['data' => collect($expenses)->keyBy('id')]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ExpenseFormRequest $request
     * @return JsonResponse
     */
    public function store(ExpenseFormRequest $request)
    {
        // Создаем новый объект расходов.
        $expense = new Expense();

        // Заполняем объект данными из запроса.
        $expense->user_id = Auth::id();
        $expense->name = $request->name;
        $expense->max_limit= $request->max_limit;
        $expense->icon_id = $request->icon_id;

        // Сохраняем новый объект расходов.
        $expense->save();

        return response()->json(['data' => $expense], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        /** @var Expense $expense */
        $expense = Expense::query()->where('user_id', Auth::id())->find($id);

        return response()->json(['data' => $expense]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ExpenseFormRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(ExpenseFormRequest $request, $id)
    {
        /** @var Expense $expense */
        $expense = Expense::query()->find($id);

        // Заполняем объект данными из запроса.
        $expense->name = $request->name;
        $expense->icon_id = $request->icon_id;
        $expense->max_limit= $request->max_limit;

        // Сохраняем измененный объект расходов.
        $expense->save();

        return response()->json(['message' => 'ok'], 200);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        /** @var Expense $expense */
        $expense = Expense::query()->find($id);

        // Удаляем объект.
        $expense->deleted = true;

        // Сохраняем изменения.
        $expense->save();

        return response()->json(['message' => 'ok'], 200);
    }

    /**
     * Метод возвращает список расходов авторизованного пользователя.
     * @return ExpensesCollection
     */
    public function getExpensesWithIconName()
    {
        $collection = Expense::query()->select('expenses.*', 'i.name as icon_name')
            ->join('icons as i', 'i.id', '=', 'expenses.icon_id')
            ->where('expenses.user_id', Auth::id())
            ->where('expenses.deleted', false)
            ->get();

        return new ExpensesCollection($collection->keyBy('id'));
    }
}
