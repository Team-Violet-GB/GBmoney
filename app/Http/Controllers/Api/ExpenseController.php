<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ExpensesCollection;
use App\Models\Expense;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
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
            ->get();

        return new ExpensesCollection($collection);
    }
}
