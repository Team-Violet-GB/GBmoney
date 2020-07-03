<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * Class SpaController отвечает за перенаправление всех запросов во Vue, все дальнейшие запросы обрабатывает Vue Router.
 * @package App\Http\Controllers
 */
class SpaController extends Controller
{
    public function index()
    {
        return view('spa');
    }
}
