<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\WalletsCollection;
use App\Models\Wallet;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * Class WalletController
 * @package App\Http\Controllers\Api
 */
class WalletController extends Controller
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
     * @api {get} /get/wallets
     *
     * @return WalletsCollection
     */
    public function getWalletsWithIconName()
    {
        $collection = Wallet::select('wallets.*', 'i.name as icon_name')->join('icons as i', 'i.id', '=',
            'wallets.icon_id')->get();

        return new WalletsCollection($collection);
    }
}
