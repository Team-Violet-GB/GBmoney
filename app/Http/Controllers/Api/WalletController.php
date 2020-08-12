<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WalletFormRequest;
use App\Http\Resources\WalletsCollection;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

/**
 * Class WalletController
 * @package App\Http\Controllers\Api
 */
class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        /** @var Wallet $wallets */
        $wallets = Wallet::query()
            ->where('user_id', Auth::id())
            ->get();

        return response()->json(['data' => collect($wallets)->keyBy('id')]);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param WalletFormRequest $request
     * @return JsonResponse
     */
    public function store(WalletFormRequest $request)
    {
        // Создаем новый кошелек.
        $wallet = new Wallet();

        // Заполняем объект данными из запроса.
        $wallet->user_id = Auth::id();
        $wallet->name = $request->name;
        $wallet->amount = $request->amount;
        $wallet->include = $request->include;
        $wallet->icon_id = $request->icon_id;

        // Сохраняем новый кошелек.
        $wallet->save();

        return response()->json(['data' => $wallet], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        /** @var Wallet $wallet */
        $wallet = Wallet::query()->where('user_id', Auth::id())->find($id);

        return response()->json(['data' => $wallet]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param WalletFormRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(WalletFormRequest $request, $id)
    {
        /** @var Wallet $wallet */
        $wallet = Wallet::query()->where('user_id', Auth::id())->find($id);

        // Заполняем объект данными из запроса.
        $wallet->name = $request->name;
        $wallet->amount = $request->amount;
        $wallet->include = $request->include;
        $wallet->icon_id = $request->icon_id;

        // Сохраняем измененный объект кошелька.
        $wallet->save();

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
        /** @var Wallet $wallet */
        $wallet = Wallet::query()->where('user_id', Auth::id())->find($id);

        // Удаляем объект.
        $wallet->deleted = true;

        // Сохраняем изменения.
        $wallet->save();

        return response()->json(['message' => 'ok'], 200);
    }

    /**
     * Метод возвращает список кошельков авторизованного пользователя.
     * @return WalletsCollection
     */
    public function getWalletsWithIconName()
    {
        $collection = Wallet::query()->select('wallets.*', 'i.name as icon_name')
            ->join('icons as i', 'i.id', '=', 'wallets.icon_id')
            ->where('wallets.user_id', Auth::id())
            ->get();

        return new WalletsCollection($collection->keyBy('id'));
    }
}
