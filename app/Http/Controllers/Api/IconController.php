<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IconsCollection;
use App\Models\Icon;
use Illuminate\Http\Request;

/**
 * Class IconController
 * @package App\Http\Controllers\Api
 */
class IconController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @return IconsCollection
     */
    public function __invoke(Request $request)
    {
        return new IconsCollection(Icon::all());
    }
}
