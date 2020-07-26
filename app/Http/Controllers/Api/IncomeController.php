<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IncomeFormRequest;
use App\Http\Resources\IncomesCollection;
use App\Models\Income;
use Illuminate\Http\JsonResponse;
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
     * @return JsonResponse
     */
    public function index()
    {
        /** @var Income $incomes */
        $incomes = Income::query()
            ->where('user_id', Auth::id())
            ->where('incomes.deleted', false)
            ->get();

        return response()->json(['data' => collect($incomes)->keyBy('id')]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param IncomeFormRequest $request
     * @return JsonResponse
     */
    public function store(IncomeFormRequest $request)
    {
        // Создаем новый объект доходов.
        $income = new Income();

        // Заполняем объект данными из запроса.
        $income->user_id = Auth::id();
        $income->name = $request->name;
        $income->icon_id = $request->icon_id;

        // Сохраняем новый объект доходов.
        $income->save();

        return response()->json(['data' => $income], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        /** @var Income $incomes */
        $income = Income::query()->where('user_id', Auth::id())->find($id);

        return response()->json(['data' => $income]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param IncomeFormRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(IncomeFormRequest $request, $id)
    {
        /** @var Income $income */
        $income = Income::query()->find($id);

        // Заполняем объект данными из запроса.
        $income->name = $request->name;
        $income->icon_id = $request->icon_id;

        // Сохраняем измененный объект доходов.
        $income->save();

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
        /** @var Income $income */
        $income = Income::query()->find($id);

        // Удаляем объект.
        $income->deleted = true;

        // Сохраняем изменения.
        $income->save();

        return response()->json(['message' => 'ok'], 200);
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
            ->where('incomes.deleted', false)
            ->get();

        return new IncomesCollection($collection->keyBy('id'));
    }
}
