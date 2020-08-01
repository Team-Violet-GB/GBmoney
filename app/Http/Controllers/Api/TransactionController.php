<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionFormRequest;
use App\Http\Resources\Transaction as TransactionResource;
use App\Http\Resources\TransactionCollection;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return TransactionCollection
     * @throws ValidationException
     */
    public function index(Request $request)
    {
        // Выполняем валидацию данных из запроса.
        $this->validate($request, [
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'page' => 'nullable|int',
        ]);

        // Получаем данные из запроса.
        $dateFrom = request('date_from');
        $dateTo = request('date_to');

        $query = Transaction::query();

        $query->select('date')
            ->where('user_id', Auth::id())
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->where('date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->where('date', '<=', $dateTo);
            })
            ->groupBy(['date'])
            ->orderByDesc('date');

        return new TransactionCollection($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TransactionFormRequest $request
     * @return JsonResponse
     */
    public function store(TransactionFormRequest $request)
    {
        // Создаем новый объект транзакции.
        $transaction = new Transaction();

        // Заполняем модель поступившими из запроса значениями и сохраняем ее..
        $result = $transaction->fillTransaction($request);

        // В случае неудачного добавления транзакции возвращаем ответ об ошибке.
        if ($result !== true) {
            return response()->json([
                'message' => 'Ошибка выполнения запроса в базу данных',
                'errors' => $result
            ], 500);
        }

        return response()->json(['data' => $transaction]);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return TransactionResource
     */
    public function show($id)
    {
        $resource = Transaction::query()->where('user_id', Auth::id())->find($id);

        return new TransactionResource($resource);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TransactionFormRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(TransactionFormRequest $request, $id)
    {
        /**
         * Получаем объект транзакции по ID.
         * @var Transaction $transaction
         */
        $transaction = Transaction::query()->find($id);

        // Заполняем модель поступившими из запроса значениями и сохраняем ее..
        $result = $transaction->fillTransaction($request);

        // В случае неудачного добавления транзакции возвращаем ответ об ошибке.
        if ($result !== true) {
            return response()->json([
                'message' => 'Ошибка выполнения запроса в базу данных',
                'errors' => $result
            ], 500);
        }

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
        /**
         * Получаем объект транзакции по ID.
         * @var Transaction $transaction
         */
        $transaction = Transaction::query()->find($id);

        // Заполняем модель поступившими из запроса значениями и сохраняем ее..
        $result = $transaction->deleteTransaction();

        // В случае неудачного добавления транзакции возвращаем ответ об ошибке.
        if ($result !== true) {
            return response()->json([
                'message' => 'Ошибка выполнения запроса в базу данных',
                'errors' => $result
            ], 500);
        }

        return response()->json(['message' => 'ok'], 200);
    }
}
