<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\TransactionCollection;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
            'data_from' => 'nullable|date',
            'data_to' => 'nullable|date|after:data_from',
            'page' => 'nullable|int',
        ]);

        // Получаем данные из запроса.
        $dataFrom = request('data_from');
        $dataTo = request('data_to');

        $query = Transaction::query();

        $query->where('user_id', Auth::id())
            ->when($dataFrom, function ($query) use ($dataFrom) {
                return $query->where('date', '>=', $dataFrom);
            })
            ->when($dataTo, function ($query) use ($dataTo) {
                return $query->where('date', '<=', $dataTo);
            });

        return new TransactionCollection($query->paginate(3));
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
}
