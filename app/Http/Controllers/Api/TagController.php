<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TagFormRequest;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $tags = Tag::query()->where('user_id', Auth::id())->get();

        return response()->json(['data' => collect($tags)->keyBy('id')]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param TagFormRequest $request
     * @return JsonResponse
     */
    public function store(TagFormRequest $request)
    {
        // Создаем новый объект тэгов.
        $tag = new Tag();

        // Заполняем объект данными из запроса.
        $tag->user_id = Auth::id();
        $tag->name = $request->name;
        $tag->expense_id = $request->expense_id;

        // Сохраняем новый объект тэгов.
        $tag->save();

        return response()->json(['data' => $tag], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id)
    {
        /** @var Tag $tag */
        $tag = Tag::query()->where('user_id', Auth::id())->find($id);

        return response()->json(['data' => $tag]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TagFormRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(TagFormRequest $request, $id)
    {
        /** @var Tag $tag */
        $tag = Tag::query()->find($id);;

        // Заполняем объект данными из запроса.
        $tag->name = $request->name;
        $tag->expense_id = $request->expense_id;

        // Сохраняем измененный объект тэгов.
        $tag->save();

        return response()->json(['data' => $tag], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        /** @var Tag $tag */
        $tag = Tag::query()->find($id);

        // Удаляем объект.
        $tag->deleted = true;

        // Сохраняем изменения.
        $tag->save();

        return response()->json(['message' => 'ok'], 200);
    }
}
