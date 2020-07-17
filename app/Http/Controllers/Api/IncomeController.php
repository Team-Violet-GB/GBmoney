<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IncomesCollection;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

/**
 * Class IncomeController
 * @package App\Http\Controllers\Api
 */
class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Метод возвращает список доходов авторизованного пользователя.
     * @return IncomesCollection
     */
    public function getIncomesWithIconName()
    {
        $collection = Income::query()->select('incomes.*', 'i.name as icon_name')
            ->join('icons as i', 'i.id', '=', 'incomes.icon_id')
            ->where('incomes.user_id', Auth::id())
            ->get();

        return new IncomesCollection($collection);
    }
}
