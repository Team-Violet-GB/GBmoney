<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\IncomesCollection;
use App\Models\Income;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * Class IncomeController
 * @package App\Http\Controllers\Api
 */
class IncomeController extends Controller
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * @api {get} /get/incomes
     *
     * @return IncomesCollection
     */
    public function getIncomesWithIconName()
    {
        $collection = Income::select('incomes.*', 'i.name as icon_name')->join('icons as i', 'i.id', '=',
            'incomes.icon_id')->get();

        return new IncomesCollection($collection);
    }
}
